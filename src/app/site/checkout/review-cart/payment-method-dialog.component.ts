import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ExpiredCard, PaymentAddService, PaymentUtilityService, CreditcardValidationService, PaymentMethodService } from "../../account/services/index";
import { PaymentMethodModel, PaymentMethodInputModel, CreditCard, Ach } from "../../account/meal-purchases/model/index";

import { CreditCardFormatPipe } from "../../account/pipes/index";
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import {
  StateProvinceListService,
   ToasterService,
  Toast,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'payment-method-dialog',
  templateUrl: './payment-method-dialog.component.html',
  styleUrls: ['./payment-method-dialog.component.less']
})
export class PaymentMethodDialogComponent implements OnInit {
  public loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
  private creditCard: CreditCard = new CreditCard();
  private ach: Ach = new Ach();

  public paymentMethodForm: FormGroup;
  private isBank: boolean;
  private isCard: boolean;
  public failedToSave: boolean;
  private failedToSaveMsg: string
  //Fill the month and year selectors
  private creditCardYear: string[];
  private creditCardMonth: string[];
  public paymentAddDetail: PaymentMethodInputModel = new PaymentMethodInputModel();
  public accountHolderName: string;
  public addAccountType: string = 'checking';

  private isAddPaymentSaving: boolean;
  public primaryActionDescription: string;
  constructor(public dialogRef: MatDialogRef<PaymentMethodDialogComponent>,
    private formBuilder: FormBuilder,
    private stateProvinceListService: StateProvinceListService,
    private creditcardValidationService: CreditcardValidationService,
    private paymentAddService: PaymentAddService,
    private expiredCard: ExpiredCard,
    private paymentutiltity: PaymentUtilityService,
    private creditcardformatpipe: CreditCardFormatPipe,
    private messageProcessorService: MessageProcessorService,
    public utilityService: UtilityService,
    private loginStoreSvc: LoginStoreService,
    private paymentMethodSvc: PaymentMethodService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
   this.accountHolderName = this.loginResponse.firstName + ' ' + this.loginResponse.lastName;
  }

  ngOnInit() {
    //Fill the month and year selectors
    this.creditCardMonth = this.paymentutiltity.monthNumber();
    this.creditCardYear = this.paymentutiltity.yearNumber();

    this.getState();
    this.buildForm();
    if (this.utilityService.isAchBlocked(this.loginResponse)) {
      this.setPayOption('card');

    } else {
      this.setPayOption(this.addAccountType);
    }
  }

  buildForm() {
    this.paymentMethodForm = this.formBuilder.group({
      'type': [''],
      'name': ['', Validators.compose([Validators.required])],
      'nickname': [''],
      'account': [''],
      'routing': [''],
      'address_line1': [''],
      'address_line2': [''],
      'city': [''],
      'state': [''],
      'zip': [''],
      'default': [''],
      'creditcardaccount': [''],
      'expmonth': [''],
      'expyear': [''],
      'cardcode': [''],
      'isprimary': [''],
      'saveMethod': [true]
    });
    this.paymentMethodForm.valueChanges
      .subscribe(data => this.onValueChangedData(data));
  }

  onValueChangedData(data?: any) {
    if (!this.paymentMethodForm) { return; }
    this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
  }

  formErrors = {
    'name': '',
    'nickname': '',
    'account': '',
    'routing': '',
    'creditcardaccount': '',
    'cardcode': '',
    'expmonth': '',
    'expyear': '',
    'zip': '',
    'address_line1': '',
    'city': '',
    'state': ''
  };

  validationMessages = {
    'name': {
      'required': 'Account Holder Name is required.'
    },
    'nickname': {
      'required': 'Nickname is required.'
    },
    'account': {
      'required': 'Account Number is required.',
      'pattern': 'Bank Account must be between 5 and 17 digits.'
    },
    'routing': {
      'required': 'Routing Number is required.',
      'pattern': 'Bank Routing Number must be 9 digits.'
    },
    'creditcardaccount': {
      'required': 'Credit Card Number is required.',
      'pattern': 'Credit card Number must be valid.',
      'maxlength': 'Maximum length for Credit Card Number is 16 digits.',
      'notValid': 'Credit Card Number must be valid.'
    },
    'cardcode': {
      'required': 'CVV is required.',
      'pattern': 'CVV must be valid.',
      'maxlength': 'Maximum length for CVV is 4 digits.'
    },
    'expmonth': {
      'required': 'Expiration Month is required.'
    },
    'expyear': {
      'required': 'Expiration Year is required.'
    },
    'zip': {
      'required': 'Zip code is required.',
      'pattern': 'Zip code must be valid.'
    },
    'address_line1': {
      'required': 'Address Line 1 is required.'
    },
    'city': {
      'required': 'City is required.'
    },
    'state': {
      'required': 'State is required.'
    }
  };

  setPayOption(elementValue: string) {
    this.addAccountType = elementValue;
    if (elementValue == 'card') {
      this.isBank = false;
      this.isCard = true;
    } else if (elementValue == 'checking' || 'savings') {
      this.isBank = true;
      this.isCard = false;
    }

    this.paymentMethodForm.reset({ "onlySelf": true, "emitEvent": false });
    this.paymentMethodForm.controls['name'].setValue(this.loginResponse.firstName + ' ' + this.loginResponse.lastName);
    this.setValidation();
  }

  //Dynamically set validation
  setValidation() {
    //Can not figure how to clear validation once it has been applied
    //so when there is a extraneous validation a control is disabled
    this.clearValidators(this.paymentMethodForm);

    if (this.isCard) {

      this.paymentMethodForm.controls['expmonth'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['expmonth'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['expyear'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['expyear'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['address_line1'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['address_line1'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['city'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['city'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['state'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['state'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['zip'].setValidators([Validators.required, Validators.pattern(Constants.ZipcodePattern)]);
      this.paymentMethodForm.controls['zip'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['creditcardaccount'].setValidators([Validators.required, Validators.pattern(Constants.CreditCardPattern), Validators.maxLength(16)]);
      this.paymentMethodForm.controls['creditcardaccount'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['cardcode'].setValidators([Validators.required, Validators.pattern(Constants.CardCodePattern), Validators.maxLength(4)]);
      this.paymentMethodForm.controls['cardcode'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['name'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
    }
    if (this.isBank) {
      this.paymentMethodForm.controls['name'].setValidators([Validators.required]);
      this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['account'].setValidators([Validators.required, Validators.pattern(Constants.BankAccountPattern)]);
      this.paymentMethodForm.controls['account'].updateValueAndValidity({ "onlySelf": true });

      this.paymentMethodForm.controls['routing'].setValidators([Validators.required, Validators.pattern(Constants.RoutingPattern)]);
      this.paymentMethodForm.controls['routing'].updateValueAndValidity({ "onlySelf": true });
    }
  }

  clearValidators(form: FormGroup) {
    for (const control in this.paymentMethodForm.controls) {
      this.paymentMethodForm.controls[control].clearValidators();
      this.paymentMethodForm.controls[control].updateValueAndValidity({ "onlySelf": true });
    }
  }

  getState() {
    let subscription = this.stateProvinceListService.getState(this.loginResponse)
      .subscribe(() => {
        if (this.stateProvinceListService.result == true) {
          subscription.unsubscribe();
          if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSvc.loadLogin(this.stateProvinceListService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
            this.utilityService.clearErrorMessage(this.stateProvinceListService.loginResponse);
          } else {
            //processing the successful response                      
            //enable the state selector.
            this.paymentMethodForm.controls['state'].enable();
          }
        } else {
          ++this.stateProvinceListService.count;
        }
      });
  }

  //Validate card expiration is greater than the current date
  validateExpirationDate(): boolean {
    if (this.isCard) {
      let expiryMonthVal: any;

      if (this.creditCard.expiryMonth && this.creditCard.expiryYear) {
        expiryMonthVal = this.expiredCard.cardExpireValidator(this.creditCard.expiryMonth, this.creditCard.expiryYear);
        if (expiryMonthVal) {
          this.failedToSaveMsg = "goodness";
          return true;
        }
        else {
          this.failedToSaveMsg = "Invalid expiration date.";
          this.failedToSave = true;
          return false;
        }
      }
    } else {
      return true;
    }
  }

  //When add is requested perform necessary mapping
  //to add card, checking and savings
  addPaymentPreProcess() {
    console.log("Calling addPaymentPreProcess")
    //Set this as the default payment method
    this.paymentAddDetail.isDefault = true;

    //Checking and savings
    if (this.isBank) {
      this.paymentAddDetail.creditCard = null;
      this.paymentAddDetail.ach = this.ach;
      //This is set with the account type radio buttons
      //Possible values are checking and savings when isBank 
      this.ach.accountType = this.addAccountType;
    }
    //Creditcard
    if (this.isCard) {
     // console.log("this card: ", this.isCard)
      this.paymentAddDetail.ach = null;
      console.log("What is the card NUmber: ", this.creditCard.cardNumber)
      //When is card the specific card type visa, mastercard and discover
      //is determined by matching the numbering format to known patterns
      var cardType: string = this.paymentMethodSvc.getCardType(this.creditCard.cardNumber);
     // console.log("What is the CardType: ", cardType)
   
      if (cardType != Constants.Error) {
        this.creditCard.cardType = cardType
      } else {
        //Bad credit card number or unsupported card
        console.log("Bad credit card number or unsupported card: ", cardType)
      }

      this.paymentAddDetail.creditCard = this.creditCard;
    }
    //Common

    //Split account-holder name
    if (this.accountHolderName) {
      var name: string[] = this.accountHolderName.split(" ");
     // console.log("accountHolderName: ", this.accountHolderName)
      name[0] ? this.paymentAddDetail.firstName = name[0] : '';
      if (name[2]) {
        name[1] ? this.paymentAddDetail.lastName = name[1] + ' ' + name[2] : '';

      } else {
        name[1] ? this.paymentAddDetail.lastName = name[1] : '';
      }
    //  console.log("The last Name: ", this.paymentAddDetail.lastName)
    }


    if (this.paymentAddDetail.street2 == undefined) {
      this.paymentAddDetail.street2 = " ";
    }

  }

  addPaymentMethod() {
    console.log("Calling addPaymentMethod")
    if (this.paymentMethodForm.valid && this.validateExpirationDate()) {
      this.addPaymentPreProcess()
      //set the payment to match this new one
      if (this.paymentAddDetail.saveMethod) {
        //Save the payment and when done repopulate the payment method list
        this.isAddPaymentSaving = true;
        this.failedToSave = false;
       // this.paymentAddService.result = false;

        if (this.isCard) {
          if (!this.creditcardValidationService.checkCreditCard(this.creditCard.cardNumber, this.paymentMethodSvc.getCardType(this.creditCard.cardNumber))) {
            this.validationMessages.creditcardaccount.notValid = this.creditcardValidationService.ccErrors[this.creditcardValidationService.ccErrorNo];
            this.paymentMethodForm.get('creditcardaccount').setErrors({ "notValid": true });
          }
        }
      
        this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse)
        setTimeout(() => {
          if (this.paymentAddService.result) {
         // console.log("Did we get a result: ", this.paymentAddService.result)
            if (this.paymentAddService.loginResponse.messageType === Constants.Error) {
              this.failedToSaveMsg += this.paymentAddService.loginResponse.message;
              this.isAddPaymentSaving = false;
              this.failedToSave = true;
              this.utilityService.clearErrorMessage(this.paymentAddService.loginResponse);
            } else {
              this.loginStoreSvc.loadLogin(this.paymentAddService.loginResponse);
          
             // console.log("Spinner should stop modal should close")
                    this.isAddPaymentSaving = false;
                    this.paymentAddDetail.saveMethod = true;
                    this.paymentAddService.result = false;
                    this.dialogRef.close({
                      action: 'Save the new method',
                      methodValues: this.paymentAddDetail
                   //);
                 // }
                });
            }

          } else {
            ++this.paymentAddService.count;
          }
        }, 3000)
            
         // });


      } else {
        //Populate the payment method list with unsaved new method for one time use
        this.paymentAddDetail.saveMethod = false;
        this.paymentAddService.result = false;
         this.dialogRef.close({
          action: 'One time use',
          methodValues: this.paymentAddDetail
        });
      }
    } else {
      this.showFormErrors();
    }
  }

  cancelAdd() {
    this.dialogRef.close({
      action: 'cancel'
    });
  }

  showFormErrors() {
    for (const control in this.paymentMethodForm.controls) {
      this.paymentMethodForm.controls[control].markAsDirty();
      this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
    }
  }

}
