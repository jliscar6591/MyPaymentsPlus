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
var index_1 = require("./services/index");
var index_2 = require("../../shared/services/index");
var AccountHomeComponent = /** @class */ (function () {
    //= this.validateCookie.validateCookie();
    function AccountHomeComponent(profileUserprofileService, router, 
    // private validateCookie: ValidateCookieService,
    loginStoreSvc) {
        this.profileUserprofileService = profileUserprofileService;
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
        this.sidenavState = true;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    AccountHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
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
    AccountHomeComponent.prototype.getAutopaySettingLabel = function () {
        var label = '';
        if (this.loginResponse.isAutoPayEnabled && !this.loginResponse.isDisableMealPaymentsDistrict) {
            label = 'Payment Methods & Autopay';
        }
        else {
            label = 'Payment Methods';
        }
        return label;
    };
    AccountHomeComponent.prototype.ngOnDestroy = function () {
        this.routerSubscription.unsubscribe();
    };
    AccountHomeComponent.prototype.onResize = function (event) {
        this.mobile = (window.innerWidth < 800) ? true : false;
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AccountHomeComponent.prototype, "onResize", null);
    AccountHomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: './account-home.component.html',
            styleUrls: ['./account-home.component.less'],
            host: { 'class': 'sidenav-layout-container' }
        }),
        __metadata("design:paramtypes", [index_1.ProfileUserprofileService,
            router_1.Router,
            index_2.LoginStoreService])
    ], AccountHomeComponent);
    return AccountHomeComponent;
}());
exports.AccountHomeComponent = AccountHomeComponent;
//# sourceMappingURL=account-home.component.js.map