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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../meal-purchases/model/index");
var index_2 = require("../services/index");
var index_3 = require("../pipes/index");
require("rxjs/add/observable/interval");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var multi_district_service_1 = require("../../../site/services/multi-district.service");
var index_4 = require("../../../shared/services/index");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var PaymentMethodComponent = /** @class */ (function () {
    function PaymentMethodComponent(router, 
    // private toasterService: ToasterService,
    formBuilder, stateProvinceListService, paymentMethodService, paymentAddService, creditcardValidationService, expiredCard, paymentutiltity, creditcardformatpipe, 
    // private messageProcessorService: MessageProcessorService,
    utilityService, dialogService, viewContainerRef, paymentAutoPayService, multiDistrictSrvc, pageLoadingService, loginSrvcStore) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.stateProvinceListService = stateProvinceListService;
        this.paymentMethodService = paymentMethodService;
        this.paymentAddService = paymentAddService;
        this.creditcardValidationService = creditcardValidationService;
        this.expiredCard = expiredCard;
        this.paymentutiltity = paymentutiltity;
        this.creditcardformatpipe = creditcardformatpipe;
        this.utilityService = utilityService;
        this.dialogService = dialogService;
        this.viewContainerRef = viewContainerRef;
        this.paymentAutoPayService = paymentAutoPayService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.pageLoadingService = pageLoadingService;
        this.loginSrvcStore = loginSrvcStore;
        this.persistDefaultCheckBox = false;
        this.isUpdateDefaultPaymentSaving = false;
        this.updateDefaultPaymentError = false;
        this.updateDefaultPaymentErrorMsg = '';
        this.isUpdatePaymentSaving = false;
        this.isAddPaymentSaving = false;
        this.acctEndingIn = '';
        this.addPayment = false;
        this.hasWallets = true;
        // private isBank: boolean = true;
        // private isCard: boolean;
        this.isBank = true;
        this.paymentAddDetail = new index_1.PaymentMethodInputModel();
        this.paymentMethodDetail = new index_1.PaymentMethodModel();
        //= this.validateCookie.validateCookie();
        this.creditCard = new index_1.CreditCard();
        this.ach = new index_1.Ach();
        this.accountHoderName = "";
        this.walletNickname = "";
        this.addAccountType = "checking";
        this.isgettingPayments = false;
        this.getWalletsErr = false;
        this.showEditPayments = true;
        this.isDeleting = false;
        this.isSaving = false;
        this.failedtoSave = false;
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
    PaymentMethodComponent.prototype.ngOnInit = function () {
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
    };
    PaymentMethodComponent.prototype.ngDoCheck = function () {
        var _this = this;
        this.multiDistrictSrvc.upDatePaymentMethod$.subscribe(function () {
            if (_this.multiDistrictSrvc.shouldUpdate === true) {
                //console.log("We changed districts on Paqyments: ", this.multiDistrictSrvc.shouldUpdate);
                _this.loginResponse = _this.loginSrvcStore.cookieStateItem;
                // console.log("Do we have the new LOginREsponse B4 getPayMeth? ", this.loginResponse);
                _this.getPaymentMethods();
                _this.multiDistrictSrvc.shouldUpdate = false;
            }
        });
    };
    PaymentMethodComponent.prototype.createForm = function () {
        var _this = this;
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
            .subscribe(function (data) { return _this.onValueChangedData(data); });
    };
    PaymentMethodComponent.prototype.onValueChangedData = function (data) {
        if (!this.paymentMethodForm) {
            return;
        }
        this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
    };
    PaymentMethodComponent.prototype.onDataChanged = function (data) {
        if (!this.editPaymentMethodForm) {
            return;
        }
        this.utilityService.onValueChanged(this.editPaymentMethodForm, this.formErrors, this.validationMessages);
    };
    PaymentMethodComponent.prototype.showFormErrors = function () {
        for (var control in this.paymentMethodForm.controls) {
            this.paymentMethodForm.controls[control].markAsDirty();
            this.utilityService.onValueChanged(this.paymentMethodForm, this.formErrors, this.validationMessages);
        }
    };
    PaymentMethodComponent.prototype.setPayOption = function (elementValue) {
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
        this.setValidation();
    };
    //Dynamically set validation
    PaymentMethodComponent.prototype.setValidation = function () {
        //Can not figure how to clear validation once it has been applied
        //so when there is a extraneous validation a control is disabled
        this.clearValidators(this.paymentMethodForm);
        // console.log("setValidation - Is this a card: ", this.isCard )
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
            if (this.addPayment) {
                // console.log("This is not a Card: ", this.addPayment)
                this.paymentMethodForm.controls['creditcardaccount'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.CreditCardPattern), forms_1.Validators.maxLength(16)]);
                this.paymentMethodForm.controls['cardcode'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.CardCodePattern), forms_1.Validators.maxLength(4)]);
                this.paymentMethodForm.controls['cardcode'].updateValueAndValidity({ "onlySelf": true });
                this.paymentMethodForm.controls['name'].setValidators([forms_1.Validators.required]);
                this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
            }
        }
        if (this.isBank) {
            // console.log("This is bank: ", this.isBank)
            if (this.addPayment) {
                this.paymentMethodForm.controls['name'].setValidators([forms_1.Validators.required]);
                this.paymentMethodForm.controls['name'].updateValueAndValidity({ "onlySelf": true });
                this.paymentMethodForm.controls['account'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.BankAccountPattern)]);
                this.paymentMethodForm.controls['account'].updateValueAndValidity({ "onlySelf": true });
                this.paymentMethodForm.controls['routing'].setValidators([forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.RoutingPattern)]);
                this.paymentMethodForm.controls['routing'].updateValueAndValidity({ "onlySelf": true });
            }
        }
    };
    PaymentMethodComponent.prototype.clearValidators = function (form) {
        for (var control in this.paymentMethodForm.controls) {
            this.paymentMethodForm.controls[control].clearValidators();
            this.paymentMethodForm.controls[control].updateValueAndValidity({ "onlySelf": true });
        }
    };
    PaymentMethodComponent.prototype.showDeleteDialog = function (payment) {
        var _this = this;
        var dialogContent = '<div>';
        if (payment.accountType &&
            payment.accountType.toLowerCase() != 'checking' &&
            payment.accountType.toLowerCase() != 'savings') {
            dialogContent +=
                '<img src="../../../../assets/images/cards/' +
                    payment.accountType.toLowerCase() + '.jpg" class="single-cardtype"/>';
        }
        var dialogContent = '<div class="payment-content" >';
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
            dialogContent += "<br/><div class=\"note note-warning\">\n                              <span class=\"note-title display-inline-block\"><b>Warning: </b></span>\n                              Associated autopay settings will be deleted.</div>";
        }
        this.dialogService.open("Delete Payment Method", dialogContent, 'Delete', null, this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                _this.deleteWallet(payment.walletKey);
            }
            ;
        });
    };
    PaymentMethodComponent.prototype.showAddPayment = function () {
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
        }
        else {
            this.persistDefaultCheckBox = true;
        }
        if (this.utilityService.isAchBlocked(this.loginResponse)) {
            this.setPayOption('card');
        }
    };
    PaymentMethodComponent.prototype.showEditPayment = function (payment) {
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
    };
    PaymentMethodComponent.prototype.deleteWallet = function (delwalletKey) {
        var _this = this;
        this.isDeleting = true;
        this.failedtoDelete = false;
        this.paymentAddService.subscribeToDeletePaymentMethod(delwalletKey, this.loginResponse);
        this.deleteInterval = setInterval(function () {
            if (_this.paymentAddService.result == true) {
                if (_this.paymentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.failedtoDeleteMsg = _this.paymentAddService.loginResponse.message;
                    _this.failedtoDelete = true;
                    _this.isDeleting = false;
                    _this.utilityService.clearErrorMessage(_this.paymentAddService.loginResponse);
                    clearInterval(_this.deleteInterval);
                }
                else {
                    _this.loginSrvcStore.loadLogin(_this.paymentAddService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAddService.loginResponse);
                    _this.failedtoDelete = false;
                    _this.isDeleting = false;
                    _this.getPaymentMethods();
                    _this.paymentAutoPayService.subscribetoGetAutoPayDetails(_this.loginResponse);
                    clearInterval(_this.deleteInterval);
                }
            }
            else {
                ++_this.paymentAddService.count;
            }
        });
    };
    PaymentMethodComponent.prototype.getState = function () {
        var _this = this;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginSrvcStore.loadLogin(_this.stateProvinceListService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
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
    PaymentMethodComponent.prototype.validateExpirationDate = function () {
        if (this.isCard) {
            var expiryMonthVal = void 0;
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
        }
        else {
            // console.log("Not A Card")
            return true;
        }
    };
    PaymentMethodComponent.prototype.cancelPaymentMethod = function () {
        this.addPayment = false;
        if (this.editPayment) {
            this.editPayment = false;
            this.getPaymentMethods();
        }
    };
    PaymentMethodComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this.persistDefaultCheckBox = true;
        this.isgettingPayments = true;
        this.paymentMethodService.result = false;
        this.hasWallets = false;
        this.loginResponse = this.loginSrvcStore.cookieStateItem;
        this.paymentMethodInterval = window.setInterval(function () {
            // console.log("do we have a result: ", this.paymentMethodService.paymentMethods)
            if (_this.paymentMethodService.paymentMethods) {
                if (_this.paymentMethodService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getWalletsErrMsg = _this.paymentMethodService.loginResponse.message;
                    _this.getWalletsErr = true;
                    _this.utilityService.clearErrorMessage(_this.paymentMethodService.loginResponse);
                }
                else {
                    _this.loginSrvcStore.loadLogin(_this.paymentMethodService.loginResponse);
                    _this.hasWallets = (_this.paymentMethodService.paymentMethods.length > 0) ? true : false;
                    //  console.log("hasWallets: ", this.hasWallets);
                    _this.isgettingPayments = false;
                    _this.paymentMethods = _this.paymentMethodService.paymentMethods;
                    // console.log('what is this after i add', this.paymentMethods);
                    clearInterval(_this.paymentMethodInterval);
                }
            }
            else {
                ++_this.paymentMethodService.count;
            }
        }, 500);
        if (this.isgettingPayments === true && this.paymentMethodService.result) {
            // console.log("this.isgettingPayments: ", this.isgettingPayments)
            // console.log("this.paymentMethodService.result: ", this.paymentMethodService.result)
            this.addPayment = false;
            this.editPayment = false;
            this.hasWallets = (this.paymentMethodService.paymentMethods.length > 0) ? true : false;
            this.isgettingPayments = false;
        }
        else {
            //  console.log("still getting students: ", this.isgettingPayments);
            window.setTimeout(function () {
                if (_this.isgettingPayments === true && _this.paymentMethodService.result) {
                    //console.log("We got them Pay Meths: ", this.paymentMethodService.result)
                    _this.addPayment = false;
                    _this.editPayment = false;
                    _this.hasWallets = (_this.paymentMethodService.paymentMethods.length > 0) ? true : false;
                    // console.log("Do we have wallets: ", this.hasWallets)
                    _this.isgettingPayments = (_this.paymentMethodService.paymentMethods.length < 0) ? true : false;
                    _this.pageLoadingService.hide();
                }
                else {
                    // console.log("still don't have any: ", this.paymentMethodService.result);
                }
            }, 100);
        }
    };
    //When add is requested perform necessary mapping
    //to add card, checking and savings
    PaymentMethodComponent.prototype.addPaymentPreProcess = function () {
        // console.log("Adding a PaymentPreProcess: ", this.isBank)
        if (!this.paymentMethodForm.controls['isprimary'].value) {
            this.paymentAddDetail.isDefault = false;
        }
        else {
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
            var cardType = this.paymentMethodService.getCardType(this.creditCard.cardNumber);
            //this.getCardType();
            if (cardType != app_settings_1.Constants.Error) {
                this.creditCard.cardType = cardType;
            }
            else {
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
            var name = this.paymentMethodDetail.accountHolderName.split(" ");
            name[0] ? this.paymentAddDetail.firstName = name[0] : '';
            if (name[2]) {
                name[1] ? this.paymentAddDetail.lastName = name[1] + ' ' + name[2] : '';
            }
            else {
                name[1] ? this.paymentAddDetail.lastName = name[1] : '';
            }
        }
        this.paymentAddDetail.nickname = this.paymentMethodDetail.walletNickname;
        this.paymentAddDetail.state = this.paymentMethodDetail.billingState;
        this.paymentAddDetail.street = this.paymentMethodDetail.billingAddress;
        this.paymentAddDetail.street2 = this.paymentMethodDetail.billingAddress2;
        this.paymentAddDetail.zip = this.paymentMethodDetail.billingZip;
    };
    PaymentMethodComponent.prototype.addPaymentMethod = function () {
        var _this = this;
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
        var validExpDate = this.validateExpirationDate();
        //console.log("validExpDate: ", validExpDate)
        //console.log("Is the form valid: ", this.paymentMethodForm)
        if (!this.isCard && !this.paymentMethodForm.errors && this.paymentMethodForm.value.cardcode == '') {
            this.paymentMethodForm.value.cardcode = null;
            //console.log("Is the form valid: ", this.paymentMethodForm)
        }
        if (validExpDate && this.paymentMethodForm.valid) {
            this.isAddPaymentSaving = true;
            this.addPaymentPreProcess();
            this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse);
            this.updatePayMethIntervl =
                // window.setTimeout(() => {
                window.setInterval(function () {
                    //  console.log("paymentAddService reuslt: ", this.paymentAddService.result)
                    if (_this.paymentAddService.result) {
                        // console.log("Cleared Interval")
                        if (_this.paymentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.failedtoAddMsg = _this.paymentAddService.loginResponse.message;
                            _this.isAddPaymentSaving = false;
                            _this.failedtoAdd = true;
                            _this.utilityService.clearErrorMessage(_this.paymentAddService.loginResponse);
                        }
                        else {
                            _this.loginSrvcStore.loadLogin(_this.paymentMethodService.loginResponse);
                            _this.isAddPaymentSaving = false;
                            _this.addPayment = false;
                            _this.persistDefaultCheckBox = false;
                            // console.log("About to call getPaymentMethods")
                            _this.getPaymentMethods();
                            clearInterval(_this.updatePayMethIntervl);
                        }
                        _this.isAddPaymentSaving = _this.paymentAddService.result;
                    }
                    else {
                        ++_this.paymentAddService.count;
                    }
                }, 500);
            // });
        }
        else {
            if (this.isBank && this.paymentMethodForm.value.account !== '') {
                //  console.log("This is Checking Calling AddPayment")
                this.addPaymentPreProcess();
                this.paymentAddService.subscribeToAddPaymentMethods(this.paymentAddDetail, this.loginResponse);
                window.setTimeout(function () {
                    if (_this.paymentAddService.result) {
                        if (_this.paymentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            // console.log("error: ", this.paymentAddService.loginResponse.messageType)
                            _this.failedtoAddMsg = _this.paymentAddService.loginResponse.message;
                            _this.isAddPaymentSaving = false;
                            _this.failedtoAdd = true;
                            _this.utilityService.clearErrorMessage(_this.paymentAddService.loginResponse);
                        }
                        else {
                            _this.loginSrvcStore.loadLogin(_this.paymentMethodService.loginResponse);
                            // console.log("Noerror: ", this.paymentAddService.loginResponse.messageType)
                            _this.isAddPaymentSaving = false;
                            _this.addPayment = false;
                            _this.persistDefaultCheckBox = false;
                            _this.getPaymentMethods();
                        }
                        _this.isAddPaymentSaving = _this.paymentAddService.result;
                        //  console.log("this.isAddPaymentSaving: ", this.isAddPaymentSaving)
                    }
                    else {
                        ++_this.paymentAddService.count;
                    }
                }, 500);
            }
            else {
                this.showFormErrors();
            }
        }
    };
    PaymentMethodComponent.prototype.updatePaymentMethod = function () {
        var _this = this;
        if (this.validateExpirationDate() && this.paymentMethodForm.valid) {
            this.paymentMethodService.result = false;
            this.isUpdatePaymentSaving = true;
            this.paymentMethodService.subscribeToUpdatePaymentMethodNew(this.paymentMethodDetail, this.loginResponse);
            window.setTimeout(function () {
                //  console.log("paymentMethodService.result: ", this.paymentMethodService.result)
                if (_this.paymentMethodService.result === true) {
                    if (_this.paymentMethodService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.failedtoSaveMsg = _this.paymentMethodService.loginResponse.message;
                        _this.isSaving = false;
                        _this.failedtoSave = true;
                        _this.editPayment = true;
                        _this.utilityService.clearErrorMessage(_this.paymentAddService.loginResponse);
                    }
                    else {
                        _this.loginSrvcStore.loadLogin(_this.paymentMethodService.loginResponse);
                        //Built in delay
                        _this.isUpdatePaymentSaving = false;
                        _this.editPayment = false;
                        _this.persistDefaultCheckBox = false;
                        _this.getPaymentMethods();
                    }
                }
                else {
                    ++_this.paymentMethodService.count;
                }
            }, 2000);
        }
        else {
            this.showFormErrors();
        }
    };
    //Use regular expressions to discern the card type
    //based on the card number format
    PaymentMethodComponent.prototype.getCardType = function (cardNumber) {
        //  console.log("do we knowe the Card #: ", cardNumber)
        var carNumPrefix = cardNumber.substr(0, 1);
        // console.log("What is the carNumPrefix: ", carNumPrefix)
        if (carNumPrefix == '4') {
            return 'Visa';
        }
        else if ((carNumPrefix == '2') || (carNumPrefix == '5')) {
            return 'MasterCard';
        }
        else if ((carNumPrefix == '6')) {
            // console.log("should be Discover Card")
            return 'Discover';
        }
        else if ((carNumPrefix == '3')) {
            return this.setCardType(cardNumber);
        }
        else {
            return app_settings_1.Constants.Error;
        }
    };
    //We have Four different Card Types that use 3 as a prefix.
    //We have to look at the two digit prefix to determine the correct Card type
    PaymentMethodComponent.prototype.setCardType = function (cardNumber) {
        var tempPrefix = cardNumber.substr(0, 2);
        // console.log("What is the 2-digit Prefix: ", tempPrefix)
        if (tempPrefix == '30') {
            return 'CarteBlanche';
        }
        else if (tempPrefix == '35') {
            return 'JCB';
        }
        else if ((tempPrefix == '36') || (tempPrefix == '38')) {
            return 'DinersClub';
        }
        else if ((tempPrefix == '34') || (tempPrefix == '37')) {
            return 'AmEx';
        }
        else {
            return app_settings_1.Constants.Error;
        }
    };
    //From the validation aspect there are three types of accounts.
    //card, checking and savings.
    //This method is used to map the AccountType so
    //the correct validation can be implemented. 
    PaymentMethodComponent.prototype.getAccountType = function (paymentMethodDetail) {
        // console.log("Do we have an account type: ", paymentMethodDetail.accountType);
        this.isCard = false;
        this.isBank = false;
        switch (paymentMethodDetail.accountType.toLowerCase()) {
            case app_settings_1.Constants.CreditCard.visa:
                this.isCard = true;
                break;
            case app_settings_1.Constants.CreditCard.mastercard:
                this.isCard = true;
                break;
            case app_settings_1.Constants.CreditCard.discover:
                this.isCard = true;
                break;
            case app_settings_1.Constants.BankAccount.checking:
                this.isBank = true;
                break;
            case app_settings_1.Constants.BankAccount.savings:
                this.isBank = true;
                break;
        }
    };
    PaymentMethodComponent.prototype.maskcard = function (cardnumber) {
        return this.creditcardformatpipe.transform(cardnumber, 0);
    };
    PaymentMethodComponent.prototype.setDefaultPayment = function (walletKey, i) {
        var _this = this;
        this.paymentMethodService.resultSetDefaultPayment = false;
        this.isDeleting = true;
        var subscription = this.paymentMethodService.setDefaultWallet(walletKey, this.loginResponse)
            .subscribe(function () {
            if (_this.paymentMethodService.result == true) {
                subscription.unsubscribe();
                if (_this.paymentMethodService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.failedtoDeleteMsg = _this.paymentMethodService.loginResponse.message;
                    _this.isDeleting = false;
                    _this.failedtoDelete = true;
                    _this.utilityService.clearErrorMessage(_this.paymentMethodService.loginResponse);
                }
                else {
                    // this.cookieService.putObject(Constants.AuthCookieName, this.paymentMethodService.loginResponse);
                    _this.loginSrvcStore.loadLogin(_this.paymentMethodService.loginResponse);
                    //Built in delay
                    _this.isDeleting = false;
                }
            }
            else {
                ++_this.paymentMethodService.count;
            }
        });
    };
    PaymentMethodComponent.prototype.ariaPayment = function (isDefault) {
        if (isDefault) {
            return "This is the default payment method";
        }
        else {
            return "This is a payment method radio button";
        }
    };
    PaymentMethodComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'payment-method',
            templateUrl: 'payment-method.component.html',
            styleUrls: ['./payment-method.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_4.StateProvinceListService,
            index_2.PaymentMethodService,
            index_2.PaymentAddService,
            index_2.CreditcardValidationService,
            index_2.ExpiredCard,
            index_2.PaymentUtilityService,
            index_3.CreditCardFormatPipe,
            index_4.UtilityService,
            simple_dialog_service_1.SimpleDialogService,
            core_1.ViewContainerRef,
            index_2.PaymentAutoPayService,
            multi_district_service_1.MultiDistrictService,
            page_loading_service_1.PageLoadingService,
            index_4.LoginStoreService])
    ], PaymentMethodComponent);
    return PaymentMethodComponent;
}());
exports.PaymentMethodComponent = PaymentMethodComponent;
//# sourceMappingURL=payment-method.component.js.map