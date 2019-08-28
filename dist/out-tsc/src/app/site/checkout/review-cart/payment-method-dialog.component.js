"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var index_1 = require("../../account/services/index");
var index_2 = require("../../account/meal-purchases/model/index");
var index_3 = require("../../account/pipes/index");
var app_settings_1 = require("../../../app.settings");
var index_4 = require("../../../shared/services/index");
require("rxjs/add/observable/interval");
var PaymentMethodDialogComponent = /** @class */ (function () {
    function PaymentMethodDialogComponent(dialogRef, formBuilder, stateProvinceListService, creditcardValidationService, paymentAddService, expiredCard, paymentutiltity, creditcardformatpipe, messageProcessorService, utilityService, loginStoreSvc, paymentMethodSvc) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.stateProvinceListService = stateProvinceListService;
        this.creditcardValidationService = creditcardValidationService;
        this.paymentAddService = paymentAddService;
        this.expiredCard = expiredCard;
        this.paymentutiltity = paymentutiltity;
        this.creditcardformatpipe = creditcardformatpipe;
        this.messageProcessorService = messageProcessorService;
        this.utilityService = utilityService;
        this.loginStoreSvc = loginStoreSvc;
        this.paymentMethodSvc = paymentMethodSvc;
        //= this.validateCookie.validateCookie();
        this.creditCard = new index_2.CreditCard();
        this.ach = new index_2.Ach();
        this.paymentAddDetail = new index_2.PaymentMethodInputModel();
        this.addAccountType = 'checking';
        this.formErrors = {
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
        this.validationMessages = {
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
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.accountHolderName = this.loginResponse.firstName + ' ' + this.loginResponse.lastName;
    }
    PaymentMethodDialogComponent.prototype.ngOnInit = function () {
        //Fill the month and year selectors
        this.creditCardMonth = this.paymentutiltity.monthNumber();
        this.creditCardYear = this.paymentutiltity.yearNumber();
        this.getState();
        this.buildForm();
        if (this.utilityService.isAchBlocked(this.loginResponse)) {
            this.setPayOption('card');
        }
        else {
            this.setPayOption(this.addAccountType);
        }
    };
    PaymentMethodDialogComponent.prototype.buildForm = function () {
        var _this = this;
        this.paymentMethodForm = this.formBuilder.group({
            'type': [''],
            'name': ['', forms_1.Validators.compose([forms_1.Validators.required])],
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
            .subscribe(function (data) { return _this.onValueChangedData(data); });
    };
    PaymentMethodDialogComponent.prototype.onValueChangedData = function (data) {
        if (!this.paymentMethodForm) {
            return;
        }
        this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
    };
    PaymentMethodDialogComponent.prototype.setPayOption = function (elementValue) {
        this.addAccountType = elementValue;
        if (elementValue == 'card') {
            this.isBank = false;
            this.isCard = true;
        }
        else if (elementValue == 'checking' || 'savings') {
            this.isBank = true;
            this.isCard = false;
        }
        this.paymentMethodForm.reset({ "onlySelf": true, "emitEvent": false });
        this.paymentMethodForm.controls['name'].setValue(this.loginResponse.firstName + ' ' + this.loginResponse.lastName);
        this.setValidation();
    };
    //Dynamically set validation
    PaymentMethodDialogComponent.prototype.setValidation = function () {
        //Can not figure how to clear validation once it has been applied
        //so when there is a extraneous validation a control is disabled
        this.clearValidators(this.paymentMethodForm);
        if (this.isCard) {
            this.paymentMethodForm.controls['expmonth'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['expmonth'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['expyear'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['expyear'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['address_line1'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['address_line1'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['city'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['city'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['state'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['state'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['zip'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.ZipcodePattern)]);
            this.paymentMethodForm.controls['zip'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['creditcardaccount'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.CreditCardPattern), forms_1.Validators.maxLength(16)]);
            this.paymentMethodForm.controls['creditcardaccount'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['cardcode'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.CardCodePattern), forms_1.Validators.maxLength(4)]);
            this.paymentMethodForm.controls['cardcode'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['name'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
        }
        if (this.isBank) {
            this.paymentMethodForm.controls['name'].setValidators([forms_1.Validators.required]);
            this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['account'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.BankAccountPattern)]);
            this.paymentMethodForm.controls['account'].updateValueAndValidity({ "onlySelf": true });
            this.paymentMethodForm.controls['routing'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.RoutingPattern)]);
            this.paymentMethodForm.controls['routing'].updateValueAndValidity({ "onlySelf": true });
        }
    };
    PaymentMethodDialogComponent.prototype.clearValidators = function (form) {
        for (var control in this.paymentMethodForm.controls) {
            this.paymentMethodForm.controls[control].clearValidators();
            this.paymentMethodForm.controls[control].updateValueAndValidity({ "onlySelf": true });
        }
    };
    PaymentMethodDialogComponent.prototype.getState = function () {
        var _this = this;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSvc.loadLogin(_this.stateProvinceListService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
                    _this.utilityService.clearErrorMessage(_this.stateProvinceListService.loginResponse);
                }
                else {
                    //processing the successful response                      
                    //enable the state selector.
                    _this.paymentMethodForm.controls['state'].enable();
                }
            }
            else {
                ++_this.stateProvinceListService.count;
            }
        });
    };
    //Validate card expiration is greater than the current date
    PaymentMethodDialogComponent.prototype.validateExpirationDate = function () {
        if (this.isCard) {
            var expiryMonthVal = void 0;
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
        }
        else {
            return true;
        }
    };
    //When add is requested perform necessary mapping
    //to add card, checking and savings
    PaymentMethodDialogComponent.prototype.addPaymentPreProcess = function () {
        console.log("Calling addPaymentPreProcess");
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
            console.log("What is the card NUmber: ", this.creditCard.cardNumber);
            //When is card the specific card type visa, mastercard and discover
            //is determined by matching the numbering format to known patterns
            var cardType = this.paymentMethodSvc.getCardType(this.creditCard.cardNumber);
            // console.log("What is the CardType: ", cardType)
            if (cardType != app_settings_1.Constants.Error) {
                this.creditCard.cardType = cardType;
            }
            else {
                //Bad credit card number or unsupported card
                console.log("Bad credit card number or unsupported card: ", cardType);
            }
            this.paymentAddDetail.creditCard = this.creditCard;
        }
        //Common
        //Split account-holder name
        if (this.accountHolderName) {
            var name = this.accountHolderName.split(" ");
            // console.log("accountHolderName: ", this.accountHolderName)
            name[0] ? this.paymentAddDetail.firstName = name[0] : '';
            if (name[2]) {
                name[1] ? this.paymentAddDetail.lastName = name[1] + ' ' + name[2] : '';
            }
            else {
                name[1] ? this.paymentAddDetail.lastName = name[1] : '';
            }
            //  console.log("The last Name: ", this.paymentAddDetail.lastName)
        }
        if (this.paymentAddDetail.street2 == undefined) {
            this.paymentAddDetail.street2 = " ";
        }
    };
    PaymentMethodDialogComponent.prototype.addPaymentMethod = function () {
        var _this = this;
        console.log("Calling addPaymentMethod");
        if (this.paymentMethodForm.valid && this.validateExpirationDate()) {
            this.addPaymentPreProcess();
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
                this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse);
                setTimeout(function () {
                    if (_this.paymentAddService.result) {
                        // console.log("Did we get a result: ", this.paymentAddService.result)
                        if (_this.paymentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.failedToSaveMsg += _this.paymentAddService.loginResponse.message;
                            _this.isAddPaymentSaving = false;
                            _this.failedToSave = true;
                            _this.utilityService.clearErrorMessage(_this.paymentAddService.loginResponse);
                        }
                        else {
                            _this.loginStoreSvc.loadLogin(_this.paymentAddService.loginResponse);
                            // console.log("Spinner should stop modal should close")
                            _this.isAddPaymentSaving = false;
                            _this.paymentAddDetail.saveMethod = true;
                            _this.paymentAddService.result = false;
                            _this.dialogRef.close({
                                action: 'Save the new method',
                                methodValues: _this.paymentAddDetail
                                //);
                                // }
                            });
                        }
                    }
                    else {
                        ++_this.paymentAddService.count;
                    }
                }, 3000);
                // });
            }
            else {
                //Populate the payment method list with unsaved new method for one time use
                this.paymentAddDetail.saveMethod = false;
                this.paymentAddService.result = false;
                this.dialogRef.close({
                    action: 'One time use',
                    methodValues: this.paymentAddDetail
                });
            }
        }
        else {
            this.showFormErrors();
        }
    };
    PaymentMethodDialogComponent.prototype.cancelAdd = function () {
        this.dialogRef.close({
            action: 'cancel'
        });
    };
    PaymentMethodDialogComponent.prototype.showFormErrors = function () {
        for (var control in this.paymentMethodForm.controls) {
            this.paymentMethodForm.controls[control].markAsDirty();
            this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
        }
    };
    PaymentMethodDialogComponent = __decorate([
        core_1.Component({
            selector: 'payment-method-dialog',
            templateUrl: './payment-method-dialog.component.html',
            styleUrls: ['./payment-method-dialog.component.less']
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef,
            forms_1.FormBuilder,
            index_4.StateProvinceListService,
            index_1.CreditcardValidationService,
            index_1.PaymentAddService,
            index_1.ExpiredCard,
            index_1.PaymentUtilityService,
            index_3.CreditCardFormatPipe,
            index_4.MessageProcessorService,
            index_4.UtilityService,
            index_4.LoginStoreService,
            index_1.PaymentMethodService])
    ], PaymentMethodDialogComponent);
    return PaymentMethodDialogComponent;
}());
exports.PaymentMethodDialogComponent = PaymentMethodDialogComponent;
//# sourceMappingURL=payment-method-dialog.component.js.map