import { NgModule } from '@angular/core';
import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AutopayComponent } from './autopay.component';
import { Constants } from '../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { PaymentMethodModel, PaymentMethodInputModel, CreditCard, Ach } from "../meal-purchases/model/index";
import { PaymentAutoPayService, PaymentMethodService, ExpiredCard, PaymentAddService, PaymentUtilityService, CreditcardValidationService } from "../services/index";
import { CreditCardFormatPipe } from "../pipes/index";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';

import { CdkTableModule } from '@angular/cdk/table';
import { MultiDistrictService } from '../../../site/services/multi-district.service';
import {
  StateProvinceListService,
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { setTimeout } from 'timers';


@Component({
  moduleId: module.id,
  selector: 'payment-method',
  templateUrl: 'payment-method.component.html',
  styleUrls: ['./payment-method.component.less']
})

export class PaymentMethodComponent {
  private persistDefaultCheckBox: boolean = false;

  private isUpdateDefaultPaymentSaving: boolean = false;
  private updateDefaultPaymentError: boolean = false;
  private updateDefaultPaymentErrorMsg: string = ''

  private isUpdatePaymentSaving: boolean = false;
  private isAddPaymentSaving: boolean = false;
  private acctEndingIn: string = '';

  private paymentMethodForm: FormGroup;
  private editPaymentMethodForm: FormGroup;
  public addPayment: boolean = false;
  private hasWallets: boolean = true;
  private delwalletAccount: string;
  private delwalletKey: string;
  public failedtoDelete: boolean;
  // private isBank: boolean = true;
  // private isCard: boolean;
  public isBank: boolean = true;
  public isCard: boolean;
  private paymentAddDetail: PaymentMethodInputModel = new PaymentMethodInputModel();
  private paymentMethodDetail: PaymentMethodModel = new PaymentMethodModel();
  private loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  private creditCard: CreditCard = new CreditCard();
  private ach: Ach = new Ach();
  private failedtoAdd: boolean;
  private accountHoderName: string = "";
  private walletNickname: string = "";
  private addAccountType: string = "checking";
  public isgettingPayments: boolean = false;
  public getWalletsErr: boolean = false;
  private getWalletsErrMsg: string;
  private showEditPayments: boolean = true;
  public failedtoDeleteMsg: string;
  private failedtoAddMsg: string;
  public isDeleting: boolean = false;
  private isSaving: boolean = false;
  private failedtoSave: boolean = false;
  private failedtoSaveMsg: string;
  public editPayment: boolean;
  private creditCardYear: string[];
  private creditCardMonth: string[];
  private creditcardformat: CreditCardFormatPipe;
  private autopayComponent: AutopayComponent;
  public updatePayMethIntervl: any;
  public paymentMethodInterval: any;
  public paymentMethods: any;
  public deleteInterval: any;

  constructor(private router: Router,
    // private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private stateProvinceListService: StateProvinceListService,
    public paymentMethodService: PaymentMethodService,
    private paymentAddService: PaymentAddService,
    private creditcardValidationService: CreditcardValidationService,
    private expiredCard: ExpiredCard,
    private paymentutiltity: PaymentUtilityService,
    private creditcardformatpipe: CreditCardFormatPipe,
    // private messageProcessorService: MessageProcessorService,
    private utilityService: UtilityService,
    private dialogService: SimpleDialogService,
    private viewContainerRef: ViewContainerRef,
    private paymentAutoPayService: PaymentAutoPayService,
    private multiDistrictSrvc: MultiDistrictService,
    private pageLoadingService: PageLoadingService,
    private loginSrvcStore: LoginStoreService

  ) {
    this.loginResponse = this.loginSrvcStore.cookieStateItem;
    //since login is not required set the 
    this.loginResponse.status = '';
    this.loginResponse.incidentId = '';
    this.loginResponse.message = '';
    this.loginResponse.messageType = 'Success';
    this.loginResponse.messageTitle = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  ngOnInit() {
    //Autopay


    // console.log(this.paymentMethodService.paymentMethods);
    this.getState();
    //Fill the month and year selectors
    this.creditCardMonth = this.paymentutiltity.monthNumber();
    this.creditCardYear = this.paymentutiltity.yearNumber();
    this.createForm();
    this.isgettingPayments = true;
    if (this.paymentMethodService.paymentMethods) {
      this.paymentMethods = this.paymentMethodService.paymentMethods;
      this.addPayment = false;
      this.editPayment = false;
      this.hasWallets = (this.paymentMethodService.paymentMethods.length > 0) ? true : false;
      // console.log("Do we have wallets: ", this.hasWallets)
      this.isgettingPayments = false;
      this.pageLoadingService.hide();
    }
  }

  ngDoCheck() {
    this.multiDistrictSrvc.upDatePaymentMethod$.subscribe(() => {
      if (this.multiDistrictSrvc.shouldUpdate === true) {
        //console.log("We changed districts on Paqyments: ", this.multiDistrictSrvc.shouldUpdate);
        this.loginResponse = this.loginSrvcStore.cookieStateItem;
        // console.log("Do we have the new LOginREsponse B4 getPayMeth? ", this.loginResponse);
        this.getPaymentMethods();
        this.multiDistrictSrvc.shouldUpdate = false;
      }


    })
  }

  createForm() {
    this.paymentMethodForm = this.formBuilder.group({
      'type': [''],
      'name': [''],
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
      'isprimary': ['']
    });
    this.paymentMethodForm.valueChanges
      .subscribe(data => this.onValueChangedData(data));
  }

  onValueChangedData(data?: any) {
    if (!this.paymentMethodForm) { return; }
    this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
  }

  onDataChanged(data?: any) {
    if (!this.editPaymentMethodForm) { return; }
    this.utilityService.onValueChanged(this.editPaymentMethodForm, this.formErrors, this.validationMessages);
  }

  showFormErrors() {
    for (const control in this.paymentMethodForm.controls) {
      this.paymentMethodForm.controls[control].markAsDirty();
      this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
    }
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
      'required': 'Account Holder Name is required Field.'
    },
    'nickname': {
      'required': 'Nick Name is required Field.'
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
      'pattern': 'Credit card number is invalid',
      'maxlength': 'Maximum length for Credit Card Number is 16 digits.',
      'notValid': 'fubared'
    },
    'cardcode': {
      'required': 'Card code is required.',
      'pattern': 'Card code must be valid.',
      'maxlength': 'Maximum length for CVV is 4 digits.'
    },
    'expmonth': {
      'required': 'Expiration Month is required.'
    },
    'expyear': {
      'required': 'Expiration year is required.'
    },
    'zip': {
      'required': 'zip code is required.',
      'pattern': 'zip code must be valid.'
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
    this.setValidation();
  }

  //Dynamically set validation
  setValidation() {
    //Can not figure how to clear validation once it has been applied
    //so when there is a extraneous validation a control is disabled
    this.clearValidators(this.paymentMethodForm);

    // console.log("setValidation - Is this a card: ", this.isCard )
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

      if (this.addPayment) {
        // console.log("This is not a Card: ", this.addPayment)
        this.paymentMethodForm.controls['creditcardaccount'].setValidators([Validators.required, Validators.pattern(Constants.CreditCardPattern), Validators.maxLength(16)]);
        this.paymentMethodForm.controls['cardcode'].setValidators([Validators.required, Validators.pattern(Constants.CardCodePattern), Validators.maxLength(4)]);
        this.paymentMethodForm.controls['cardcode'].updateValueAndValidity({ "onlySelf": true });

        this.paymentMethodForm.controls['name'].setValidators([Validators.required]);
        this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
      }
    }
    if (this.isBank) {
      // console.log("This is bank: ", this.isBank)
      if (this.addPayment) {
        this.paymentMethodForm.controls['name'].setValidators([Validators.required]);
        this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });

        this.paymentMethodForm.controls['account'].setValidators([Validators.required, Validators.pattern(Constants.BankAccountPattern)]);
        this.paymentMethodForm.controls['account'].updateValueAndValidity({ "onlySelf": true });

        this.paymentMethodForm.controls['routing'].setValidators([Validators.required, Validators.pattern(Constants.RoutingPattern)]);
        this.paymentMethodForm.controls['routing'].updateValueAndValidity({ "onlySelf": true });
      }
    }
  }

  clearValidators(form: FormGroup) {
    for (const control in this.paymentMethodForm.controls) {
      this.paymentMethodForm.controls[control].clearValidators();
      this.paymentMethodForm.controls[control].updateValueAndValidity({ "onlySelf": true });
    }
  }

  showDeleteDialog(payment: PaymentMethodModel) {
    var dialogContent = '<div>'
    if (payment.accountType &&
      payment.accountType.toLowerCase() != 'checking' &&
      payment.accountType.toLowerCase() != 'savings') {
      dialogContent +=
        '<img src="../../../../assets/images/cards/' +
        payment.accountType.toLowerCase() + '.jpg" class="single-cardtype"/>';
    }

    var dialogContent = '<div class="payment-content" >'
    if (payment.accountType &&
      payment.accountType.toLowerCase() != 'checking' &&
      payment.accountType.toLowerCase() != 'savings') {
      dialogContent +=
        '<span><img src="../../../../assets/images/cards/' +
        payment.accountType.toLowerCase() + '.jpg" class="single-cardtype"/> *' +
        payment.accountTail + '</span>';
    }
    if (payment.accountType && payment.accountType.toLowerCase() == 'checking') {
      dialogContent += '<span><b>Checking  </b> *' + payment.accountTail + '</span>';
    }
    if (payment.accountType && payment.accountType.toLowerCase() == 'savings') {
      dialogContent += '<span><b>Savings  </b> *' + payment.accountTail + '</span>';
    }

    dialogContent += '<div>' + payment.walletNickname + '</div>';
    dialogContent += '</div></div>';

    if (payment.hasAutopay) {
      dialogContent += `<br/><div class="note note-warning">
                              <span class="note-title display-inline-block"><b>Warning: </b></span>
                              Associated autopay settings will be deleted.</div>`;
    }
    this.dialogService.open("Delete Payment Method", dialogContent, 'Delete', null, this.viewContainerRef)
      .subscribe(result => {
        if (result) {
          this.deleteWallet(payment.walletKey);
        };
      });
  }

  showAddPayment() {
    //default to bank
    this.paymentMethodForm.markAsPristine();
    this.isBank = true;
    //Initialize
    this.failedtoSaveMsg = '';
    this.failedtoSave = false;
    this.addPayment = true;
    this.editPayment = false;
    this.isCard = false;

    this.creditCard = {
      cardCode: '',
      cardNumber: '',
      cardType: '',
      expiryMonth: '',
      expiryYear: ''
    };

    this.ach = {
      account: '',
      accountType: '',
      routing: ''
    };

    this.setValidation();
    //Set the first payment method to the primary payment method
    if (this.paymentMethodService.paymentMethods.length === 0) {
      this.paymentMethodDetail.isDefault = true;
      this.persistDefaultCheckBox = false;

    } else {
      this.persistDefaultCheckBox = true;
    }

    if (this.utilityService.isAchBlocked(this.loginResponse)) {
      this.setPayOption('card');
    }

  }

  showEditPayment(payment: PaymentMethodModel) {
    //Initialize
    this.paymentMethodForm.markAsPristine();
    this.failedtoSaveMsg = '';
    this.failedtoSave = false;
    this.editPayment = true;

    //Get reference that can be bound in the HTML markup
    this.paymentMethodDetail = payment;

    //Prep text for identifying label
    this.acctEndingIn = 'Account Ending In: ' + this.paymentMethodDetail.accountTail;

    //Set the account type
    this.getAccountType(payment);

    //Set validation rules
    this.setValidation();
    //Persist checkbox when underlaying bound object value is changed
    this.persistDefaultCheckBox = (this.paymentMethodService.paymentMethods.length > 1 && !this.paymentMethodDetail.isDefault);
  }

  deleteWallet(delwalletKey: string) {
    this.isDeleting = true;
    this.failedtoDelete = false;
    this.paymentAddService.subscribeToDeletePaymentMethod(delwalletKey, this.loginResponse)
    this.deleteInterval = setInterval(() => {
      if (this.paymentAddService.result == true) {
        if (this.paymentAddService.loginResponse.messageType === Constants.Error) {
          this.failedtoDeleteMsg = this.paymentAddService.loginResponse.message;
          this.failedtoDelete = true;
          this.isDeleting = false;
          this.utilityService.clearErrorMessage(this.paymentAddService.loginResponse);
          clearInterval(this.deleteInterval);
        } else {
          this.loginSrvcStore.loadLogin(this.paymentAddService.loginResponse);
          // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAddService.loginResponse);
          this.failedtoDelete = false;
          this.isDeleting = false;
          this.getPaymentMethods();
          this.paymentAutoPayService.subscribetoGetAutoPayDetails(this.loginResponse);
          clearInterval(this.deleteInterval);
        }
      } else {
        ++this.paymentAddService.count;
      }
    })

}

getState() {
  let subscription = this.stateProvinceListService.getState(this.loginResponse)
    .subscribe(() => {
      if (this.stateProvinceListService.result == true) {
        subscription.unsubscribe();
        if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
          this.loginSrvcStore.loadLogin(this.stateProvinceListService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
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

    if (this.paymentMethodDetail.expiryMonth && this.paymentMethodDetail.expiryYear) {
      expiryMonthVal =
        this.expiredCard.cardExpireValidator(this.paymentMethodDetail.expiryMonth, this.paymentMethodDetail.expiryYear);
      if (expiryMonthVal) {
        return true;
      }
      else {
        this.failedtoSaveMsg = "Invalid expiration date.";
        this.failedtoSave = true;
        return false;
      }
    }
  } else {
    // console.log("Not A Card")
    return true;
  }
}

cancelPaymentMethod() {
  this.addPayment = false;
  if (this.editPayment) {
    this.editPayment = false;
    this.getPaymentMethods();
  }
}

getPaymentMethods() {
  this.persistDefaultCheckBox = true;
  this.isgettingPayments = true;
  this.paymentMethodService.result = false;

  this.hasWallets = false;
  this.loginResponse = this.loginSrvcStore.cookieStateItem;
  this.paymentMethodInterval = window.setInterval(() => {
    // console.log("do we have a result: ", this.paymentMethodService.paymentMethods)
    if (this.paymentMethodService.paymentMethods) {
      if (this.paymentMethodService.loginResponse.messageType === Constants.Error) {
        this.getWalletsErrMsg = this.paymentMethodService.loginResponse.message;
        this.getWalletsErr = true;
        this.utilityService.clearErrorMessage(this.paymentMethodService.loginResponse);
      } else {
        this.loginSrvcStore.loadLogin(this.paymentMethodService.loginResponse);
        this.hasWallets = (this.paymentMethodService.paymentMethods.length > 0) ? true : false;
        //  console.log("hasWallets: ", this.hasWallets);
        this.isgettingPayments = false;
        this.paymentMethods = this.paymentMethodService.paymentMethods;
        // console.log('what is this after i add', this.paymentMethods);
        clearInterval(this.paymentMethodInterval);
      }
    } else {
      ++this.paymentMethodService.count;
    }
  }, 500)

  if (this.isgettingPayments === true && this.paymentMethodService.result) {
    // console.log("this.isgettingPayments: ", this.isgettingPayments)
    // console.log("this.paymentMethodService.result: ", this.paymentMethodService.result)
    this.addPayment = false;
    this.editPayment = false;
    this.hasWallets = (this.paymentMethodService.paymentMethods.length > 0) ? true : false;
    this.isgettingPayments = false;
  } else {
    //  console.log("still getting students: ", this.isgettingPayments);
    window.setTimeout(() => {
      if (this.isgettingPayments === true && this.paymentMethodService.result) {
        //console.log("We got them Pay Meths: ", this.paymentMethodService.result)
        this.addPayment = false;
        this.editPayment = false;
        this.hasWallets = (this.paymentMethodService.paymentMethods.length > 0) ? true : false;
        // console.log("Do we have wallets: ", this.hasWallets)
        this.isgettingPayments = (this.paymentMethodService.paymentMethods.length < 0) ? true : false;
        this.pageLoadingService.hide();

      } else {
        // console.log("still don't have any: ", this.paymentMethodService.result);
      }
    }, 100)
  }

}

//When add is requested perform necessary mapping
//to add card, checking and savings
addPaymentPreProcess() {
  // console.log("Adding a PaymentPreProcess: ", this.isBank)
  if (!this.paymentMethodForm.controls['isprimary'].value) {
    this.paymentAddDetail.isDefault = false;
  } else {
    this.paymentAddDetail.isDefault = this.paymentMethodDetail.isDefault;
  }
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
    this.paymentAddDetail.ach = null;
    //When is card the specific card type visa, mastercard and discover
    //is determined by matching the numbering format to known patterns
    var cardType: string = this.paymentMethodService.getCardType(this.creditCard.cardNumber);
    //this.getCardType();
    if (cardType != Constants.Error) {
      this.creditCard.cardType = cardType
    } else {
      //Bad credit card number or unsupported card
    }
    this.creditCard.expiryMonth = this.paymentMethodDetail.expiryMonth;
    this.creditCard.expiryYear = this.paymentMethodDetail.expiryYear;

    this.paymentAddDetail.creditCard = this.creditCard;
  }
  //Common
  this.paymentAddDetail.city = this.paymentMethodDetail.billingCity;

  //Split account-holder name
  if (this.paymentMethodDetail.accountHolderName) {
    var name: string[] = this.paymentMethodDetail.accountHolderName.split(" ");
    name[0] ? this.paymentAddDetail.firstName = name[0] : '';
    if (name[2]) {
      name[1] ? this.paymentAddDetail.lastName = name[1] + ' ' + name[2] : '';

    } else {
      name[1] ? this.paymentAddDetail.lastName = name[1] : '';
    }

  }

  this.paymentAddDetail.nickname = this.paymentMethodDetail.walletNickname;
  this.paymentAddDetail.state = this.paymentMethodDetail.billingState;
  this.paymentAddDetail.street = this.paymentMethodDetail.billingAddress;
  this.paymentAddDetail.street2 = this.paymentMethodDetail.billingAddress2;
  this.paymentAddDetail.zip = this.paymentMethodDetail.billingZip;


}

addPaymentMethod() {
  // console.log("addPaymentMethod")
  this.failedtoAdd = false;
  this.paymentAddService.result = false;


  if (this.isCard) {
    //console.log("Can we add this card: ", this.isCard)
    if (!this.creditcardValidationService.checkCreditCard(this.creditCard.cardNumber, this.paymentMethodService.getCardType(this.creditCard.cardNumber))) {
      this.validationMessages.creditcardaccount.notValid = this.creditcardValidationService.ccErrors[this.creditcardValidationService.ccErrorNo];
      this.paymentMethodForm.get('creditcardaccount').setErrors({ "notValid": true });
    }
  }
  let validExpDate: boolean = this.validateExpirationDate();
  //console.log("validExpDate: ", validExpDate)
  //console.log("Is the form valid: ", this.paymentMethodForm)
  if (!this.isCard && !this.paymentMethodForm.errors && this.paymentMethodForm.value.cardcode == '') {
    this.paymentMethodForm.value.cardcode = null;
    //console.log("Is the form valid: ", this.paymentMethodForm)
  }
  if (validExpDate && this.paymentMethodForm.valid) {
    this.isAddPaymentSaving = true;
    this.addPaymentPreProcess();
    this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse)
    this.updatePayMethIntervl =
      // window.setTimeout(() => {
      window.setInterval(() => {
        //  console.log("paymentAddService reuslt: ", this.paymentAddService.result)
        if (this.paymentAddService.result) {
  
          // console.log("Cleared Interval")
          if (this.paymentAddService.loginResponse.messageType === Constants.Error) {
            this.failedtoAddMsg = this.paymentAddService.loginResponse.message;
            this.isAddPaymentSaving = false;
            this.failedtoAdd = true;
            this.utilityService.clearErrorMessage(this.paymentAddService.loginResponse);
          } else {
            this.loginSrvcStore.loadLogin(this.paymentMethodService.loginResponse);
            this.isAddPaymentSaving = false;
            this.addPayment = false;
            this.persistDefaultCheckBox = false;
            // console.log("About to call getPaymentMethods")
            this.getPaymentMethods();
            clearInterval(this.updatePayMethIntervl);
          }

          this.isAddPaymentSaving = this.paymentAddService.result;
        } else {
          ++this.paymentAddService.count;
        }
      }, 500)

    // });
  } else {
    if (this.isBank && this.paymentMethodForm.value.account !== '') {
      //  console.log("This is Checking Calling AddPayment")
      this.addPaymentPreProcess();
      this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse)
      window.setTimeout(() => {
        if (this.paymentAddService.result) {
          if (this.paymentAddService.loginResponse.messageType === Constants.Error) {
            // console.log("error: ", this.paymentAddService.loginResponse.messageType)
            this.failedtoAddMsg = this.paymentAddService.loginResponse.message;
            this.isAddPaymentSaving = false;
            this.failedtoAdd = true;
            this.utilityService.clearErrorMessage(this.paymentAddService.loginResponse);
          } else {
            this.loginSrvcStore.loadLogin(this.paymentMethodService.loginResponse);


            // console.log("Noerror: ", this.paymentAddService.loginResponse.messageType)
            this.isAddPaymentSaving = false;
            this.addPayment = false;
            this.persistDefaultCheckBox = false;
            this.getPaymentMethods();
          }

          this.isAddPaymentSaving = this.paymentAddService.result;
          //  console.log("this.isAddPaymentSaving: ", this.isAddPaymentSaving)

        } else {
          ++this.paymentAddService.count;
        }
      }, 500)
    } else {
      this.showFormErrors();
    }

  }

}

updatePaymentMethod() {
  if (this.validateExpirationDate() && this.paymentMethodForm.valid) {
    this.paymentMethodService.result = false;
    this.isUpdatePaymentSaving = true;
    this.paymentMethodService.subscribeToUpdatePaymentMethodNew(this.paymentMethodDetail, this.loginResponse);
    window.setTimeout(() => {
      //  console.log("paymentMethodService.result: ", this.paymentMethodService.result)
      if (this.paymentMethodService.result === true) {
        if (this.paymentMethodService.loginResponse.messageType === Constants.Error) {
          this.failedtoSaveMsg = this.paymentMethodService.loginResponse.message;
          this.isSaving = false;
          this.failedtoSave = true;
          this.editPayment = true;
          this.utilityService.clearErrorMessage(this.paymentAddService.loginResponse);
        } else {
          this.loginSrvcStore.loadLogin(this.paymentMethodService.loginResponse);
          //Built in delay
          this.isUpdatePaymentSaving = false;
          this.editPayment = false;
          this.persistDefaultCheckBox = false;
          this.getPaymentMethods();
        }

      } else {
        ++this.paymentMethodService.count;
      }

    }, 2000);
  } else {
    this.showFormErrors();
  }

}

//Use regular expressions to discern the card type
//based on the card number format
getCardType(cardNumber: string) {
  //  console.log("do we knowe the Card #: ", cardNumber)
  let carNumPrefix = cardNumber.substr(0, 1);
  // console.log("What is the carNumPrefix: ", carNumPrefix)
  if (carNumPrefix == '4') {
    return 'Visa';
  } else if ((carNumPrefix == '2') || (carNumPrefix == '5')) {
    return 'MasterCard';
  } else if ((carNumPrefix == '6')) {
    // console.log("should be Discover Card")
    return 'Discover';
  } else if ((carNumPrefix == '3')) {
    return this.setCardType(cardNumber)
  } else {
    return Constants.Error;
  }
}

  //We have Four different Card Types that use 3 as a prefix.
  //We have to look at the two digit prefix to determine the correct Card type
  private setCardType(cardNumber: string) {
  let tempPrefix = cardNumber.substr(0, 2);
  // console.log("What is the 2-digit Prefix: ", tempPrefix)
  if (tempPrefix == '30') {
    return 'CarteBlanche';
  } else if (tempPrefix == '35') {
    return 'JCB';
  } else if ((tempPrefix == '36') || (tempPrefix == '38')) {
    return 'DinersClub';
  } else if ((tempPrefix == '34') || (tempPrefix == '37')) {
    return 'AmEx';
  } else {
    return Constants.Error;
  }
}

//From the validation aspect there are three types of accounts.
//card, checking and savings.
//This method is used to map the AccountType so
//the correct validation can be implemented. 
getAccountType(paymentMethodDetail: PaymentMethodModel) {
  // console.log("Do we have an account type: ", paymentMethodDetail.accountType);
  this.isCard = false;
  this.isBank = false;
  switch (paymentMethodDetail.accountType.toLowerCase()) {
    case Constants.CreditCard.visa:
      this.isCard = true;
      break;
    case Constants.CreditCard.mastercard:
      this.isCard = true;
      break;
    case Constants.CreditCard.discover:
      this.isCard = true;
      break;
    case Constants.BankAccount.checking:
      this.isBank = true;
      break;
    case Constants.BankAccount.savings:
      this.isBank = true;
      break;
  }
}

maskcard(cardnumber: string): string {
  return this.creditcardformatpipe.transform(cardnumber, 0);
}

setDefaultPayment(walletKey: string, i: number) {
  this.paymentMethodService.resultSetDefaultPayment = false;
  this.isDeleting = true;
  let subscription = this.paymentMethodService.setDefaultWallet(walletKey, this.loginResponse)
    .subscribe(() => {
      if (this.paymentMethodService.result == true) {
        subscription.unsubscribe();
        if (this.paymentMethodService.loginResponse.messageType === Constants.Error) {
          this.failedtoDeleteMsg = this.paymentMethodService.loginResponse.message;
          this.isDeleting = false;
          this.failedtoDelete = true;
          this.utilityService.clearErrorMessage(this.paymentMethodService.loginResponse);
        } else {
          // this.cookieService.putObject(Constants.AuthCookieName, this.paymentMethodService.loginResponse);
          this.loginSrvcStore.loadLogin(this.paymentMethodService.loginResponse);
          //Built in delay
          this.isDeleting = false;
        }

      } else {
        ++this.paymentMethodService.count;
      }
    });

}

ariaPayment(isDefault: boolean): string {
  if (isDefault) {
    return "This is the default payment method";

  } else {
    return "This is a payment method radio button";
  }
}
}
