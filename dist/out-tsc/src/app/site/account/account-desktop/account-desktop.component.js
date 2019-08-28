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
var index_1 = require("../services/index");
var index_2 = require("../../../shared/services/index");
var index_3 = require("../../services/index");
var services_1 = require("app/registration/services");
var index_4 = require("../services/index");
var index_5 = require("../services/index");
var AccountDesktopComponent = /** @class */ (function () {
    function AccountDesktopComponent(profileUserprofileService, router, studentBalanceAlertService, 
    // private validateCookie: ValidateCookieService,
    transfersService, loginStoreSvc, studentListService, paymentMethodService, paymentAutoPayService) {
        this.profileUserprofileService = profileUserprofileService;
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
    AccountDesktopComponent.prototype.ngOnInit = function () {
        var _this = this;
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
        // console.log('transfer status', this.profileUserprofileService);
    };
    AccountDesktopComponent.prototype.setShowXferHistory = function (statusCode) {
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
            this.xferHistoryInterval = window.setInterval(function () {
                if (_this.transfersService.xferStatusCode == 1 || _this.transfersService.xferStatusCode == undefined) {
                    return false;
                }
                else {
                    return true;
                }
            }, 500);
        }
    };
    AccountDesktopComponent.prototype.getAutopaySettingLabel = function () {
        var label = '';
        if (this.loginResponse.isAutoPayEnabled && !this.loginResponse.isDisableMealPaymentsDistrict) {
            label = 'Payment Methods & Autopay';
        }
        else {
            label = 'Payment Methods';
        }
        return label;
    };
    AccountDesktopComponent.prototype.ngOnDestroy = function () {
        this.routerSubscription.unsubscribe();
    };
    AccountDesktopComponent.prototype.onResize = function (event) {
        this.mobile = (window.innerWidth < 800) ? true : false;
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AccountDesktopComponent.prototype, "onResize", null);
    AccountDesktopComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-account-desktop',
            templateUrl: './account-desktop.component.html',
            styleUrls: ['./account-desktop.component.less'],
            host: { 'class': 'sidenav-layout-container' }
        }),
        __metadata("design:paramtypes", [index_1.ProfileUserprofileService,
            router_1.Router,
            index_4.StudentBalanceAlertService,
            index_3.TransfersService,
            index_2.LoginStoreService,
            services_1.StudentListService,
            index_5.PaymentMethodService,
            index_1.PaymentAutoPayService])
    ], AccountDesktopComponent);
    return AccountDesktopComponent;
}());
exports.AccountDesktopComponent = AccountDesktopComponent;
//# sourceMappingURL=account-desktop.component.js.map