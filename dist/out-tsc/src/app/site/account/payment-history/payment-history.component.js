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
require("rxjs/add/observable/interval");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../services/index");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var index_2 = require("../../../shared/services/index");
var multi_district_service_1 = require("../../services/multi-district.service");
var user_context_service_1 = require("../services/user-context.service");
//import { clearInterval, setInterval } from 'timers';
var PaymentHistoryComponent = /** @class */ (function () {
    function PaymentHistoryComponent(router, formBuilder, validateCookie, cookieService, utilityService, dateRangeSelectorService, paymentHistoryService, receiptService, multiDistrictSvc, userContextSvc, loginStoreService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.dateRangeSelectorService = dateRangeSelectorService;
        this.paymentHistoryService = paymentHistoryService;
        this.receiptService = receiptService;
        this.multiDistrictSvc = multiDistrictSvc;
        this.userContextSvc = userContextSvc;
        this.loginStoreService = loginStoreService;
        this.userPaymentSearchModel = {
            endDate: '',
            startDate: ''
        };
        this.isHistory = false;
        this.isHistoryGetting = false;
        this.isCustom = false;
        this.getHistoryErr = false;
        this.getHistoryErrMsg = '';
        this.showReceipt = this.receiptService.displayHistoryReceipt();
        this.showSpinner = false;
        this.isMultiDistrict = false;
        this.activityPeriodSelection = 7;
        this.p = 1;
    }
    PaymentHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Session (must be first in the init section /
        this.loginResponse = this.loginStoreService.cookieStateItem;
        //this.validateCookie.validateCookie();
        //Date selector form
        this.activityPeriodForm = this.formBuilder.group({
            'activityPeriodSelector': new forms_1.FormControl(new Date())
        });
        //type in date range form
        this.dateRangeForm = this.formBuilder.group({
            'startDate': new forms_1.FormControl(new Date()),
            'endDate': new forms_1.FormControl(new Date())
        });
        //Load date range selector ////
        this.getDateRangeList();
        this.isHistoryGetting = true;
        //Load payment history /
        this.setPeriod(this.userPaymentSearchModel);
        this.paymentHistoryService.subscribeTogetPaymentHistory(this.userPaymentSearchModel, this.loginResponse);
        this.loadPaymentHistoryInterval = setInterval(function () {
            if (_this.paymentHistoryService.result == true) {
                _this.loginStoreService.loadLogin(_this.paymentHistoryService.loginResponse);
                //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentHistoryService.loginResponse);
                _this.isHistory = _this.paymentHistoryService.userPaymentModel != null &&
                    _this.paymentHistoryService.userPaymentModel.length > 0;
                _this.isHistoryGetting = false;
                // console.log("We got a userPaymentModel: ", this.paymentHistoryService.userPaymentModel);
                _this.userPaymentModel = _this.paymentHistoryService.userPaymentModel;
                clearInterval(_this.loadPaymentHistoryInterval);
            }
        }, 200);
        // console.log(this.dateRangeSelectorService);
    };
    PaymentHistoryComponent.prototype.ngDoCheck = function () {
    };
    //Date range list //
    PaymentHistoryComponent.prototype.getDateRangeList = function () {
        var _this = this;
        var subscription = this.dateRangeSelectorService.getDateRangeSelections(this.loginResponse)
            .subscribe(function () {
            if (_this.dateRangeSelectorService.result == true) {
                subscription.unsubscribe();
                if (_this.dateRangeSelectorService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.dateRangeSelectorService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.dateRangeSelectorService.loginResponse);
                }
                else {
                    //enable the state selector.
                    _this.activityPeriodForm.controls['activityPeriodSelector'].enable();
                }
            }
            else {
                ++_this.dateRangeSelectorService.count;
            }
        });
    };
    PaymentHistoryComponent.prototype.getPaymentHistory = function (userPaymentSearchModel) {
        var _this = this;
        //Search model values ////
        this.isHistoryGetting = true;
        this.paymentHistoryService.result = false;
        //  let subscription = this.paymentHistoryService.getPaymentHistory(userPaymentSearchModel, this.loginResponse)
        var failureMessage = 'Get Payment History Failed';
        this.paymentHistoryService.subscribeTogetPaymentHistory(this.userPaymentSearchModel, this.loginResponse);
        //.subscribe(
        //  data => {
        //    this.paymentHistoryService.userPaymentModel = data
        //  },
        //  error => {
        //    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        //    this.paymentHistoryService.result = true;
        //  },
        //  () => {
        //    //processing the successful response
        //    //Fake filter JSON includes AccountBalanceId ////////////////////////////
        //    //studentMealPurchaseSearchModel.student.studentMealPurchases =
        //    //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
        //    //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
        //    //Comment out for fake //////////////////////////////////////////////////
        //    this.paymentHistoryService.result = true;
        //  });
        // .subscribe(() => {
        this.paymentHistoryInterval = setInterval(function () {
            // console.log("did we get a result: ", this.paymentHistoryService.userPaymentModel)
            if (_this.paymentHistoryService.userPaymentModel) {
                // subscription.unsubscribe();
                if (_this.paymentHistoryService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getHistoryErr = true;
                    _this.getHistoryErrMsg = _this.paymentHistoryService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.paymentHistoryService.loginResponse);
                    _this.isHistory = false;
                }
                else {
                    _this.userPaymentModel = _this.paymentHistoryService.userPaymentModel;
                    _this.loginStoreService.loadLogin(_this.paymentHistoryService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentHistoryService.loginResponse);
                    _this.isHistory = _this.paymentHistoryService.userPaymentModel != null &&
                        _this.paymentHistoryService.userPaymentModel.length > 0;
                    _this.isHistoryGetting = false;
                }
                clearInterval(_this.paymentHistoryInterval);
            }
            else {
                ++_this.paymentHistoryService.count;
            }
        }, 200);
        // console.log('user payment model', this.userPaymentModel);
    };
    //New date range for search //
    PaymentHistoryComponent.prototype.newSearch = function () {
        if (this.activityPeriodSelection === 0) {
            this.isCustom = true;
        }
        else {
            this.isCustom = false;
            this.setPeriod(this.userPaymentSearchModel);
            this.getPaymentHistory(this.userPaymentSearchModel);
        }
    };
    PaymentHistoryComponent.prototype.dateSearch = function () {
        this.datePickerSet(this.userPaymentSearchModel);
        this.getPaymentHistory(this.userPaymentSearchModel);
    };
    //Process the date selector into start and end date ///
    //Based on last n days //
    PaymentHistoryComponent.prototype.setPeriod = function (searchCriteria) {
        var startDate = new Date();
        var today = new Date();
        var date = new Date();
        startDate.setDate(today.getDate() - this.activityPeriodSelection);
        searchCriteria.endDate = today.toISOString();
        searchCriteria.startDate = startDate.toISOString();
        searchCriteria.date = date.toISOString();
        return;
    };
    PaymentHistoryComponent.prototype.datePickerSet = function (searchCriteria) {
        var startDate = new Date();
        var endDate = new Date();
        searchCriteria.startDate = this.startDate;
        searchCriteria.endDate = this.endDate;
        return;
    };
    PaymentHistoryComponent.prototype.openReceipt = function (confirmNumber) {
        var _this = this;
        // console.log('confirmNumber', confirmNumber);
        this.subscriptionR = this.receiptService.subscribeToGetHistoryReceipt(confirmNumber, this.loginResponse);
        this.openReceiptInterval = setInterval(function () {
            if (_this.receiptService.receiptDetail) {
                _this.receiptChange(_this.receiptService.displayHistoryReceipt());
                clearInterval(_this.openReceiptInterval);
            }
        }, 200);
    };
    PaymentHistoryComponent.prototype.receiptChange = function (event) {
        // console.log("Called ReceiptChange")
        var _this = this;
        if (this.subscriptionR) {
            //console.log("Unsubscribing")
            //Unsubscribe to make sure subscription is current every time called
            this.subscriptionR.unsubscribe();
        }
        this.showSpinner = true;
        setTimeout(function () {
            _this.showReceipt = event;
            _this.showSpinner = false;
        }, 500);
        return this.showReceipt;
    };
    PaymentHistoryComponent.prototype.ngOnDestroy = function () {
        this.receiptChange(this.receiptService.displayHistoryReceipt());
        if (this.subscriptionR) {
            this.subscriptionR.unsubscribe();
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PaymentHistoryComponent.prototype, "displayHistoryReceipt", void 0);
    PaymentHistoryComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'payment-history.component.html',
            styleUrls: ['payment-history.component.less']
        })
        //List the payments that have been made by the user using MPP 
        //according to the selected date range.
        ,
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_2.ValidateCookieService,
            index_2.CookieService,
            index_2.UtilityService,
            index_2.DateRangeSelectorService,
            index_1.PaymentHistoryService,
            receipt_service_1.ReceiptService,
            multi_district_service_1.MultiDistrictService,
            user_context_service_1.UserContextService,
            index_2.LoginStoreService])
    ], PaymentHistoryComponent);
    return PaymentHistoryComponent;
}());
exports.PaymentHistoryComponent = PaymentHistoryComponent;
//# sourceMappingURL=payment-history.component.js.map