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
var index_1 = require("../../../shared/services/index");
var index_2 = require("../../services/index");
var services_1 = require("app/registration/services");
var index_3 = require("../services/index");
var index_4 = require("../services/index");
var index_5 = require("../services/index");
var AccountMobileComponent = /** @class */ (function () {
    function AccountMobileComponent(
    //  private profileUserprofileService: ProfileUserprofileService,
    router, 
    // private validateCookie: ValidateCookieService,
    studentBalanceAlertService, transfersService, loginStoreSvc, studentListService, paymentMethodService, paymentAutoPayService) {
        this.router = router;
        this.studentBalanceAlertService = studentBalanceAlertService;
        this.transfersService = transfersService;
        this.loginStoreSvc = loginStoreSvc;
        this.studentListService = studentListService;
        this.paymentMethodService = paymentMethodService;
        this.paymentAutoPayService = paymentAutoPayService;
        this.sidenavState = true;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    AccountMobileComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.log('AccountHomeComponent')
        //If the pages is refreshed we need to check the transfer status again
        if (!this.transfersService.xferStatusCode) {
            this.transfersService.subcribeTogetTransferFeeStatus(this.loginResponse);
        }
        this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        this.studentBalanceAlertService.subscribeToGetStudentBlanaceAlertsNew(this.loginResponse);
        this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);
        this.paymentAutoPayService.subscribetoGetAutoPayDetails(this.loginResponse);
        this.showXferHistory = this.setShowXferHistory(this.transfersService.xferStatusCode);
        this.mobile = (window.innerWidth < 800) ? true : false;
        this.routerSubscription = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                if (_this.mobile) {
                    _this.sidenavState = (event.url !== '/account') ? false : true;
                }
                else {
                    _this.sidenavState = true;
                }
            }
        });
    };
    AccountMobileComponent.prototype.setShowXferHistory = function (statusCode) {
        var _this = this;
        if (statusCode) {
            if (statusCode.status == 1 || statusCode.status == undefined) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            window.setTimeout(function () {
                if (_this.transfersService.xferStatusCode == 1 || _this.transfersService.xferStatusCode == undefined) {
                    return false;
                }
                else {
                    return true;
                }
            }, 2000);
        }
    };
    AccountMobileComponent.prototype.getAutopaySettingLabel = function () {
        var label = '';
        if (this.loginResponse.isAutoPayEnabled && !this.loginResponse.isDisableMealPaymentsDistrict) {
            label = 'Payment Methods & Autopay';
        }
        else {
            label = 'Payment Methods';
        }
        return label;
    };
    AccountMobileComponent.prototype.ngOnDestroy = function () {
        this.routerSubscription.unsubscribe();
    };
    AccountMobileComponent.prototype.onResize = function (event) {
        this.mobile = (window.innerWidth < 800) ? true : false;
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AccountMobileComponent.prototype, "onResize", null);
    AccountMobileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-account-mobile',
            templateUrl: './account-mobile.component.html',
            styleUrls: ['./account-mobile.component.less'],
            host: { 'class': 'sidenav-layout-container' }
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_3.StudentBalanceAlertService,
            index_2.TransfersService,
            index_1.LoginStoreService,
            services_1.StudentListService,
            index_4.PaymentMethodService,
            index_5.PaymentAutoPayService])
    ], AccountMobileComponent);
    return AccountMobileComponent;
}());
exports.AccountMobileComponent = AccountMobileComponent;
//# sourceMappingURL=account-mobile.component.js.map