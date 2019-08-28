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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var payment_method_component_1 = require("./payment-method.component");
var suspend_payment_warning_service_1 = require("../../../shared/components/suspend-payment-warning/suspend-payment-warning.service");
var index_1 = require("../services/index");
var index_2 = require("../meal-purchases/model/index");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var multi_district_service_1 = require("../../../site/services/multi-district.service");
var index_3 = require("../../../shared/services/index");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
//import { setTimeout, clearInterval } from 'timers';
var autopay_fee_service_1 = require("../../account/services/autopay-fee.service");
var AutopayComponent = /** @class */ (function () {
    function AutopayComponent(router, formBuilder, paymentAutoPayService, utilityService, paymentutiltity, paymentMethodService, dialogService, viewContainerRef, paymentMethodComponent, suspendPaymentWarningService, multiDistrictSrvc, pageLoadingService, loginStoreSrvc, autopayFeeService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.paymentAutoPayService = paymentAutoPayService;
        this.utilityService = utilityService;
        this.paymentutiltity = paymentutiltity;
        this.paymentMethodService = paymentMethodService;
        this.dialogService = dialogService;
        this.viewContainerRef = viewContainerRef;
        this.paymentMethodComponent = paymentMethodComponent;
        this.suspendPaymentWarningService = suspendPaymentWarningService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.pageLoadingService = pageLoadingService;
        this.loginStoreSrvc = loginStoreSrvc;
        this.autopayFeeService = autopayFeeService;
        this.paymentSelector = false;
        this.studentIdx = 0;
        this.planIdx = 0;
        this.setupAutopay = false;
        this.isgettingAutoPay = false;
        this.getAutoPayErr = false;
        this.autopaysetup = new index_2.AutopaySetupModel();
        this.autoPayAddedCntr = 0;
        this.autoPayUpdatedCnter = 0;
        this.autoPayDeletedCnter = 0;
        this.formErrors = {
            'walletKey': '',
            'paymentAmount': '',
            'minBalance': ''
        };
        this.validationMessages = {
            'walletKey': {
                'required': 'Payments will be made using is required Field.'
            },
            'paymentAmount': {
                'required': 'Make an automatic payment of is required Field.',
                'pattern': 'Amount must be valid.'
            },
            'minBalance': {
                'required': 'When balance falls below is required.',
                'pattern': 'Amount must be valid.'
            }
        };
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        //since login is not required set the 
        this.loginResponse.status = '';
        this.loginResponse.incidentId = '';
        this.loginResponse.message = '';
        this.loginResponse.messageType = 'Success';
        this.loginResponse.messageTitle = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    }
    AutopayComponent.prototype.ngOnInit = function () {
        //  console.log('AutopayComponent')
        this.buildForm();
        this.getAutoPayDetails();
        this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
        this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
        this.getSuspendPayment();
        // console.log("Do we have a payment Amount: ", this.paymentAutoPayService.autopayDetails)
        this.autopayFeeService.subscribetoGetAutoPayFee(this.loginResponse);
        // console.log('feeRate', this.autopayFeeService.autopayRate);
        if (this.autopayFeeService.autopayRate) {
            this.autopayRate = this.autopayFeeService.autopayRate;
        }
        else {
            this.ratePlanCatch = false;
        }
        if (this.paymentAutoPayService.autopayDetails) {
            this.autoPayDetailsList = this.setAutoPayDeatialsList(this.paymentAutoPayService.autopayDetails);
            this.hasAutoPay = true;
        }
    };
    AutopayComponent.prototype.ngDoCheck = function () {
        var _this = this;
        //console.log('isgettingAutoPay', this.isgettingAutoPay);
        //console.log('hasAutoPAy', this.hasAutoPay);
        //console.log('isdeleting', this.isDeleting);
        this.multiDistrictSrvc.upDatePaymentMethod$.subscribe(function () {
            // console.log("We changed districts on Paqyments: ", this.multiDistrictSrvc.updateAutoPay);
            if (_this.multiDistrictSrvc.updateAutoPay === true && _this.multiDistrictSrvc.autoPayCounter < 2) {
                window.setTimeout(function () {
                    _this.buildForm();
                    _this.getAutoPayDetails();
                    _this.autoPayAmountList = _this.paymentutiltity.autoPayAmountList();
                    _this.autoPayMinBalList = _this.paymentutiltity.autoPayMinBalList();
                    _this.getSuspendPayment();
                    _this.multiDistrictSrvc.updateAutoPay = false;
                    _this.pageLoadingService.hide();
                    _this.multiDistrictSrvc.upDatePaymentMethod$.emit(false);
                }, 500);
                _this.multiDistrictSrvc.autoPayCounter++;
            }
        });
        //Listens for a new Auto Pay Being Added
        this.paymentAutoPayService.autoPayAdded$.subscribe(function () {
            if (_this.paymentAutoPayService.postResults === true && _this.autoPayAddedCntr < 2) {
                window.setTimeout(function () {
                    _this.buildForm();
                    _this.getAutoPayDetails();
                    _this.autoPayAmountList = _this.paymentutiltity.autoPayAmountList();
                    _this.autoPayMinBalList = _this.paymentutiltity.autoPayMinBalList();
                    _this.paymentAutoPayService.postResults = false;
                }, 500);
                _this.autoPayAddedCntr++;
            }
        });
        //Listens for a new Auto Pay Being Updated
        this.paymentAutoPayService.autoPayUpdated$.subscribe(function () {
            if (_this.paymentAutoPayService.updateResults === true && _this.autoPayUpdatedCnter < 2) {
                window.setTimeout(function () {
                    _this.buildForm();
                    _this.getAutoPayDetails();
                    _this.autoPayAmountList = _this.paymentutiltity.autoPayAmountList();
                    _this.autoPayMinBalList = _this.paymentutiltity.autoPayMinBalList();
                    _this.paymentAutoPayService.updateResults = false;
                }, 500);
                _this.autoPayUpdatedCnter++;
            }
        });
        // //Listens for a new Auto Pay Being Deleted
        this.paymentAutoPayService.autoPayDeleted$.subscribe(function () {
            if (_this.paymentAutoPayService.deleteResults === true && _this.autoPayDeletedCnter < 1) {
                window.setTimeout(function () {
                    _this.buildForm();
                    _this.getAutoPayDetails();
                    _this.autoPayAmountList = _this.paymentutiltity.autoPayAmountList();
                    _this.autoPayMinBalList = _this.paymentutiltity.autoPayMinBalList();
                    _this.paymentAutoPayService.deleteResults = false;
                    //console.log('does this just keep going?');
                }, 1000);
                _this.autoPayDeletedCnter++;
            }
        });
        if (this.autopayForm.controls.paymentAmount.touched) {
            this.calculateFee();
        }
        else {
        }
        if (this.ratePlanCatch === false) {
            if (this.autopayFeeService.autopayRate) {
                this.autopayRate = this.autopayFeeService.autopayRate;
                this.ratePlanCatch = true;
            }
        }
        //if (this.studentList.paymentAmount) {
        //  console.log('amount', this.studentList.paymentAmount);
        //}
    };
    AutopayComponent.prototype.calculateFee = function () {
        if (this.autopayForm.controls.paymentAmount.value < this.autopayRate.tippingPoint || this.autopayRate.tippingPoint < 0) {
            //console.log('paymentAmount', this.autopayForm.controls.paymentAmount.value);
            //console.log('autopayRate', this.autopayRate);
            if (this.autopayRate.consumerModel === 'Flat') {
                this.autopayFee = this.autopayRate.consumerRate;
            }
            else if (this.autopayRate.consumerModel === 'Percent') {
                this.autopayFee = this.autopayForm.controls.paymentAmount.value * (this.autopayRate.consumerRate / 100);
            }
            //console.log('autopayFee', this.autopayFee);
            this.showFee = true;
        }
        else {
            this.autopayFee = 0;
            this.showFee = true;
        }
    };
    AutopayComponent.prototype.paymentDisplay = function (studentIdx, planIdx) {
        var result;
        if (this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount) {
            result = this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount.toString();
            if (result == '0') {
                result = '*';
            }
            //console.log("paymentDisplay Results: ", result)
        }
        return result;
    };
    AutopayComponent.prototype.togglePaymentSelector = function () {
        this.paymentSelector = !this.paymentSelector;
    };
    AutopayComponent.prototype.updatePayment = function (value, studentIdx, planIdx) {
        this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount = value;
        this.togglePaymentSelector();
    };
    AutopayComponent.prototype.updatePaymentCustom = function (studentIdx, planIdx) {
        this.togglePaymentSelector();
    };
    AutopayComponent.prototype.buildForm = function () {
        var _this = this;
        this.autopayForm = this.formBuilder.group({
            'walletKey': ['', [forms_1.Validators.required]],
            'paymentAmount': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern)]],
            'minBalance': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern)]]
        });
        this.autopayForm.valueChanges
            .subscribe(function (data) { return _this.onValueChangedData(data); });
    };
    AutopayComponent.prototype.onValueChanged = function (form) {
        for (var field in this.formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            this.formErrors[field] = '';
            control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
        this.calculateFee();
    };
    AutopayComponent.prototype.showFormErrors = function () {
        for (var control in this.autopayForm.controls) {
            this.autopayForm.controls[control].markAsDirty();
            this.onValueChanged(this.autopayForm);
        }
    };
    AutopayComponent.prototype.onValueChangedData = function (data) {
        if (!this.autopayForm) {
            return;
        }
        this.onValueChanged(this.autopayForm);
    };
    AutopayComponent.prototype.setCommon = function () {
        this.autoPayAddedCntr = 0;
        // console.log("What are the AutoPayDetails: ", this.paymentAutoPayService.autopayDetails)
        // console.log("What is the: ", this.loginStoreSrvc.storeLoginResponse);
        // console.log("What are the AutoPayDetails: ", this.paymentAutoPayService.autopayDetails)
        // console.log("What is the: ", this.loginStoreSrvc.storeLoginResponse);
        if (this.loginStoreSrvc.storeLoginResponse) {
            for (var i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
                if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[0].districtKey) {
                    this.autopaysetup.studentName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].firstName + ' ' +
                        this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].lastName;
                    this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
                    this.autopaysetup.categoryName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryName;
                    this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
                }
            }
        }
        else {
            this.autopaysetup.studentName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].firstName + ' ' +
                this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].lastName;
            this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
            this.autopaysetup.categoryName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryName;
            this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
        }
    };
    AutopayComponent.prototype.filterPaymentMethods = function () {
        if (this.utilityService.isAchBlocked(this.loginResponse)) {
            this.paymentMethodsFiltered = this.paymentMethodService.paymentMethods.filter(function (a) {
                return a.accountType.toLocaleLowerCase() != 'checking' && a.accountType.toLocaleLowerCase() != 'savings';
            });
        }
        else {
            this.paymentMethodsFiltered = this.paymentMethodService.paymentMethods;
        }
    };
    AutopayComponent.prototype.setuppay = function (studentIdx, planIdx) {
        this.filterPaymentMethods();
        this.studentIdx = studentIdx;
        this.planIdx = planIdx;
        this.autopaysetup.isActive = true;
        this.setupAutopay = true;
        this.studentList = this.paymentAutoPayService.autopayDetails;
        //this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx];
        // console.log("The setupStudentList: ", this.studentList)
        //.students[this.studentIdx].settings[this.planIdx]
        // So the ddl will show the placeholder
        if (this.loginStoreSrvc.storeLoginResponse) {
            for (var i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
                if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[i].districtKey) {
                    // this.paymentAutoPayService.autopayDetails[i].students[this.studentIdx].settings[this.planIdx].paymentAmount = null;
                    this.studentList.paymentAmount = null;
                    // this.paymentAutoPayService.autopayDetails[i].students[this.studentIdx].settings[this.planIdx].accountMinBalance = null;
                    this.studentList.accountMinBalance = null;
                }
            }
        }
        else {
            this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount = null;
            this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance = null;
        }
        //Ensures form is marked clean when attempting multiple autopays
        if (this.autopayForm.pristine == false) {
            // this.autopayForm.controls[abcontrol]
            this.autopayForm.reset();
            this.autopayForm.markAsPristine();
            this.autopayForm.controls.markAsPristine;
        }
        else {
            //console.log("This form is Crystal Clear");
        }
    };
    AutopayComponent.prototype.editpay = function (studentIdx, planIdx) {
        // console.log("Does edit have the studentList: ", this.paymentAutoPayService.autopayDetails)
        console.log(studentIdx);
        console.log(planIdx);
        this.studentList = this.paymentAutoPayService.autopayDetails;
        // console.log("Does edit have the studentList: ", this.studentList)
        this.filterPaymentMethods();
        this.studentIdx = studentIdx;
        this.planIdx = planIdx;
        this.autopaysetup.isActive = true;
        this.editAutopay = true;
    };
    AutopayComponent.prototype.getAutoPayDetails = function () {
        var _this = this;
        // console.log("Calling getAutoPayDetails")
        this.isgettingAutoPay = true;
        // console.log("CurrentLoginResponse sent to getAutoPay: ", this.loginResponse)
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                // console.log("Do we have a result: ", this.paymentAutoPayService.autopayDetails)
                if (this.paymentAutoPayService.result) {
                    // console.log("Do we have Details: ", this.paymentAutoPayService.autopayDetails)
                    if (this.paymentAutoPayService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        this.getAutoPayErrMsg = this.paymentAutoPayService.loginResponse.message;
                        this.getAutoPayErr = true;
                        this.hasAutoPay = false;
                        this.isgettingAutoPay = false;
                        this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
                    }
                    else {
                        this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse);
                        //If multi-district use the current district autoPayDetails
                        if (this.loginStoreSrvc.storeLoginResponse) {
                            for (i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
                                if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[i].districtKey) {
                                    if (this.paymentAutoPayService.autopayDetails[i]) {
                                        this.hasAutoPay = this.paymentAutoPayService.autopayDetails[i].students.length > 0;
                                        // console.log("Can we get Students: ", this.paymentAutoPayService.autopayDetails[i].students)
                                        // console.log("this hasAutoPay: ", this.hasAutoPay)
                                    }
                                }
                            }
                        }
                        else {
                            if (this.paymentAutoPayService.autopayDetails[0]) {
                                this.hasAutoPay = this.paymentAutoPayService.autopayDetails[0].students.length > 0;
                                //console.log("this hasAutoPay: ", this.hasAutoPay)
                            }
                        }
                        //console.log("What is: ", this.paymentAutoPayService.autopayDetails)
                        this.autoPayDetailsList = this.paymentAutoPayService.autopayDetails;
                        //console.log("Can we get Students: ", this.autoPayDetailsList)
                        this.isDeleting = false;
                        this.hasAutoPay = true;
                        this.setupAutopay = false;
                        this.editAutopay = false;
                        //console.log('result', this.paymentAutoPayService.result);
                        //console.log("hasAutoPAy: ", this.hasAutoPay)
                        this.isgettingAutoPay = false;
                    }
                }
                else {
                    ++this.paymentAutoPayService.count;
                }
                return [2 /*return*/];
            });
        }); }, 1000);
    };
    AutopayComponent.prototype.setAutoPayDeatialsList = function (autopayDetails) {
        //console.log("calling setAutoPayDeatialsList with details: ", autopayDetails)
        // console.log("What is the loginResponse: ", this.loginResponse)
        var loginObj = this.loginResponse;
        //for(let )
        var formatedList = [];
        for (var i = 0; i < autopayDetails.length; i++) {
            if (autopayDetails[i].districtKey === loginObj.districtKey) {
                // console.log("Pushing thiese details: ", autopayDetails[i])
                formatedList = [autopayDetails[i]];
            }
        }
        //console.log("Did we get a formated List: ", formatedList)
        return formatedList;
    };
    //Add new autoPay
    AutopayComponent.prototype.setupstudentAutopay = function () {
        var _this = this;
        //console.log("Calling setupstudentAutopay: ", this.loginStoreSrvc.storeLoginResponse)
        //console.log("the studentList: ", this.studentList)
        //console.log("Saving with this obj: ", this.paymentAutoPayService.autopayDetails)
        if (this.loginStoreSrvc.storeLoginResponse) {
            for (var i = 0; i < this.studentList.students.length; i++) {
                if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
                    // console.log("Do we have a value: ", this.paymentAutoPayService.autopayDetails)
                    if (!this.studentList.accountMinBalance) {
                        this.autopayForm.get('minBalance').setErrors({ "required": true });
                    }
                    //this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount
                    if (!this.studentList.paymentAmount) {
                        this.autopayForm.get('paymentAmount').setErrors({ "required": true });
                    }
                }
            }
        }
        else {
            if (!this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance) {
                this.autopayForm.get('minBalance').setErrors({ "required": true });
            }
            if (!this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount) {
                this.autopayForm.get('paymentAmount').setErrors({ "required": true });
            }
        }
        // console.log("Is the form valid: ", this.autopayForm)
        if (this.autopayForm.valid) {
            this.isAdding = true;
            //this.setupAutopay = false;
            this.paymentAutoPayService.result = false;
            //Mapping
            this.setCommon();
            if (this.loginStoreSrvc.storeLoginResponse) {
                for (var i = 0; i < this.studentList.students.length; i++) {
                    if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
                        // console.log("do we have autopaysetup.accountBalanaceId: ", this.studentList.students[this.studentIdx].accountBalanceID)
                        this.autopaysetup.accountBalanaceId = this.studentList.students[this.studentIdx].accountBalanceID;
                        //  console.log("do we have autopaysetup.accountBalanaceId: ", this.autopaysetup.accountBalanaceId)
                        this.autopaysetup.walletKey = this.studentList.walletKey;
                        this.autopaysetup.accountMinBalance = this.studentList.accountMinBalance;
                        this.autopaysetup.paymentAmount = this.studentList.paymentAmount;
                        this.autopaysetup.categoryKey = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryKey;
                        this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
                        // console.log(this.autopaysetup.studentName);
                        this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
                    }
                }
            }
            else {
                // console.log("do we have autopaysetup.accountBalanaceId2: ", this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID)
                this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
                //  console.log("do we have autopaysetup.accountBalanaceId2: ", this.autopaysetup.accountBalanaceId)
                this.autopaysetup.walletKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletKey;
                this.autopaysetup.accountMinBalance = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance;
                this.autopaysetup.paymentAmount = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount;
                this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
                this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
                this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
            }
            //console.log("this.autopaysetup: ", this.autopaysetup);
            this.paymentAutoPayService.subscribeToSetupStudentAutoPay(this.autopaysetup, this.loginResponse);
            this.setUpInterval = setInterval(function () {
                if (_this.paymentAutoPayService.result === true) {
                    // subscription.unsubscribe();
                    if (_this.paymentAutoPayService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.failedtoAddMsg = _this.paymentAutoPayService.loginResponse.message;
                        _this.isAdding = false;
                        _this.failedtoAdd = true;
                        _this.utilityService.clearErrorMessage(_this.paymentAutoPayService.loginResponse);
                    }
                    else {
                        _this.loginStoreSrvc.loadLogin(_this.paymentAutoPayService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
                        var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                        //Client side -- set hasAutopay flag
                        //this.paymentMethodService.paymentMethods.forEach(a => {
                        //    if (a.walletKey == this.autopaysetup.walletKey) {
                        //        a.hasAutopay = true;
                        //    }
                        //});
                        //Call api -- to get updated hasAutopay flag
                        _this.paymentMethodComponent.getPaymentMethods();
                        _this.isAdding = false;
                        _this.setupAutopay = false;
                        //console.log('does this keep going');
                        _this.failedtoAdd = false;
                    }
                    clearInterval(_this.setUpInterval);
                }
                else {
                    ++_this.paymentAutoPayService.count;
                }
            }, 500);
            //});
        }
        else {
            //  console.log("does this form have errors: ", this.autopayForm);
            this.showFormErrors();
        }
    };
    //Edit autoPay
    AutopayComponent.prototype.updateAutopay = function () {
        var _this = this;
        if (this.autopayForm.valid) {
            this.autoPayAddedCntr = 0;
            this.isSaving = true;
            this.autoPayUpdatedCnter = 0;
            //Mapping
            this.setCommon();
            // console.log("Do we have studentList value: ", this.studentList)
            //this.paymentAutoPayService.autopayDetails.students
            if (this.loginStoreSrvc.storeLoginResponse) {
                for (var i = 0; i < this.studentList.students.length; i++) {
                    // console.log("Do update have paymentAutoPayService.autopayDetails: ", this.paymentAutoPayService.autopayDetails)
                    if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
                        this.autopaysetup.paymentAmount = this.studentList.paymentAmount;
                        this.autopaysetup.accountMinBalance = this.studentList.accountMinBalance;
                        this.autopaysetup.walletKey = this.studentList.walletKey;
                        this.autopaysetup.autoPaySettingsKey = this.studentList.students[this.studentIdx].settings[this.planIdx].autoPaySettingsKey;
                        this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
                        // console.log(this.autopaysetup.studentName);
                        this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
                        // console.log(this.autopaysetup.categoryName);
                    }
                }
            }
            else {
                this.autopaysetup.walletNickname = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletNickname;
                this.autopaysetup.paymentAmount = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount;
                this.autopaysetup.accountMinBalance = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance;
                this.autopaysetup.walletKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletKey;
                this.autopaysetup.autoPaySettingsKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].autoPaySettingsKey;
                this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
                this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
                //  console.log("do we have autopaysetup.walletNickname: ", this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletNickname)
                //  console.log("do we have autopaysetup.walletNickname2: ", this.autopaysetup.walletNickname)
            }
            this.paymentAutoPayService.subscribeToUpdatePaymentAutoPay(this.autopaysetup, this.loginResponse);
            window.setTimeout(function () {
                if (_this.paymentAutoPayService.result == true) {
                    if (_this.paymentAutoPayService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.failedtoSaveMsg = _this.paymentAutoPayService.loginResponse.message;
                        _this.isSaving = false;
                        _this.failedtoSave = true;
                        _this.utilityService.clearErrorMessage(_this.paymentAutoPayService.loginResponse);
                    }
                    else {
                        _this.loginStoreSrvc.loadLogin(_this.paymentAutoPayService.loginResponse);
                        //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
                        var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                        //Call api -- to get updated hasAutopay flag
                        _this.paymentMethodComponent.getPaymentMethods();
                        seconds.subscribe(function (x) {
                            if (x == app_settings_1.Constants.SpinnerDelay) {
                                _this.editAutopay = false;
                                _this.isSaving = false;
                                _this.failedtoSave = false;
                                _this.isgettingAutoPay = false;
                            }
                        });
                    }
                }
                else {
                    ++_this.paymentAutoPayService.count;
                }
            }, 1000);
            // });
        }
        else {
            this.showFormErrors();
        }
    };
    //Delete autoPay
    AutopayComponent.prototype.deleteAutopay = function (delautopayAccount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isDeleting = true;
                        this.failedtoDelete = false;
                        this.autoPayDeletedCnter = 0;
                        // console.log('does this just keep going?');
                        // let subscription = this.paymentAutoPayService.deleteAutopay(delautopayAccount, this.loginResponse)
                        // .subscribe(() => {
                        return [4 /*yield*/, this.paymentAutoPayService.subscribeToDeleteAutoPay(delautopayAccount, this.loginResponse)];
                    case 1:
                        // console.log('does this just keep going?');
                        // let subscription = this.paymentAutoPayService.deleteAutopay(delautopayAccount, this.loginResponse)
                        // .subscribe(() => {
                        _a.sent();
                        if (this.paymentAutoPayService.result === true) {
                            // subscription.unsubscribe();
                            if (this.paymentAutoPayService.loginResponse.messageType === app_settings_1.Constants.Error) {
                                this.failedtoDeleteMsg = this.paymentAutoPayService.loginResponse.message;
                                this.failedtoDelete = true;
                                this.isDeleting = false;
                                this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
                                ;
                            }
                            else {
                                this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse);
                                // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
                                //this.buildForm();
                                //this.getAutoPayDetails();
                                this.deleteInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            //this.autoPayDetailsList = this.paymentAutoPayService.autopayDetails;
                                            //  if (this.autoPayDetailsList) {
                                            return [4 /*yield*/, this.setAutoPayDeatialsList(this.paymentAutoPayService.autopayDetails)];
                                            case 1:
                                                //this.autoPayDetailsList = this.paymentAutoPayService.autopayDetails;
                                                //  if (this.autoPayDetailsList) {
                                                _a.sent();
                                                //    this.hasAutoPay = true;
                                                //this.failedtoDelete = false;
                                                //    console.log('does it get here')
                                                //    this.isgettingAutoPay = false;
                                                //this.isDeleting = false;
                                                //      this.getAutoPayDetails();
                                                //    this.setupAutopay = false;
                                                //    this.editAutopay = false;
                                                //    //Call api -- to get updated hasAutopay flag
                                                //    this.paymentMethodComponent.getPaymentMethods();
                                                //clearInterval(this.deleteInterval);
                                                console.log(this.paymentAutoPayService.autopayDetails);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, 5000);
                            }
                        }
                        else {
                            ++this.paymentAutoPayService.count;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AutopayComponent.prototype.cancelAddorEdit = function () {
        this.setupAutopay = false;
        this.editAutopay = false;
        this.autopaysetup.paymentAmount = 0;
        this.autopaysetup.accountMinBalance = 0;
        this.getAutoPayDetails();
    };
    AutopayComponent.prototype.showDeleteDialog = function (plan) {
        var _this = this;
        var dialogContent = '<p>Please confirm that you would like to delete the following Autopay:</p>';
        if (plan.walletNickname == '') {
            dialogContent += '<p><b>Account* ' + plan.accountTail + '</b></p>';
        }
        else {
            dialogContent += '<p><b>' + plan.walletNickname + '</b> (Account *' + plan.accountTail + ')</p>';
        }
        this.dialogService.open("Delete Autopay", dialogContent, 'Delete', null, this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                _this.deleteAutopay(plan.autoPaySettingsKey);
            }
            ;
        });
    };
    AutopayComponent.prototype.getSuspendPayment = function () {
        var warning = false;
        var warningMsg = '';
        if (this.loginResponse.isBlockPayments) {
            warningMsg += "Payments are disabled for this account.";
            warning = true;
        }
        else if (this.loginResponse.allPaymentsSuspended) {
            warningMsg += "All payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate +
                ". Autopay settings will not process during this time.";
            warning = true;
        }
        else if (this.loginResponse.mealPaymentsSuspended) {
            warningMsg += "Meal payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate +
                ". Autopay settings will not process during this time.";
            warning = true;
        }
        this.isSuspendPayment = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
    };
    AutopayComponent.prototype.parseWalletNickname = function (plan) {
        if (plan.walletNickname || (plan.walletNickname != '')) {
            return plan.walletNickname.toString();
        }
        else {
            return 'account ending in ' + plan.accountTail;
        }
    };
    AutopayComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'autopay',
            templateUrl: './autopay.component.html',
            styleUrls: ['./autopay.component.less'],
            providers: [payment_method_component_1.PaymentMethodComponent]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.PaymentAutoPayService,
            index_3.UtilityService,
            index_1.PaymentUtilityService,
            index_1.PaymentMethodService,
            simple_dialog_service_1.SimpleDialogService,
            core_1.ViewContainerRef,
            payment_method_component_1.PaymentMethodComponent,
            suspend_payment_warning_service_1.SuspendPaymentWarningService,
            multi_district_service_1.MultiDistrictService,
            page_loading_service_1.PageLoadingService,
            index_3.LoginStoreService,
            autopay_fee_service_1.AutopayFeeService])
    ], AutopayComponent);
    return AutopayComponent;
}());
exports.AutopayComponent = AutopayComponent;
//# sourceMappingURL=autopay.component.js.map