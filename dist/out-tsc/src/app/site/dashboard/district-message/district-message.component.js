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
var index_1 = require("../../services/index");
var mobile_district_message_component_1 = require("../district-message/mobile-district-message.component");
var index_2 = require("../../../shared/services/index");
var DistrictMessageComponent = /** @class */ (function () {
    function DistrictMessageComponent(router, toasterService, formBuilder, cookieService, validateCookie, mobileDistrictMessage, messageProcessorService, dashboardDistrictMessageService, loginStoreSrvc) {
        this.router = router;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.mobileDistrictMessage = mobileDistrictMessage;
        this.messageProcessorService = messageProcessorService;
        this.dashboardDistrictMessageService = dashboardDistrictMessageService;
        this.loginStoreSrvc = loginStoreSrvc;
        this.noShow = false;
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    }
    DistrictMessageComponent.prototype.ngOnInit = function () {
        this.mobile = (window.innerWidth < 960) ? true : false;
        this.getDistrictContent();
        this.getDistrictName();
    };
    DistrictMessageComponent.prototype.getDistrictContent = function () {
        var _this = this;
        var subscription = this.dashboardDistrictMessageService.getContent(this.loginResponse)
            .subscribe(function () {
            if (_this.dashboardDistrictMessageService.result == true) {
                subscription.unsubscribe();
                if (_this.dashboardDistrictMessageService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSrvc.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    //this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                }
                else {
                    _this.dashboardDistrictMessageService.districtContent;
                    _this.loginStoreSrvc.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    //	this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                }
            }
            else {
                ++_this.dashboardDistrictMessageService.count;
            }
        });
    };
    DistrictMessageComponent.prototype.getDistrictName = function () {
        var _this = this;
        var subscription = this.dashboardDistrictMessageService.getName(this.loginResponse)
            .subscribe(function () {
            if (_this.dashboardDistrictMessageService.result == true) {
                subscription.unsubscribe();
                if (_this.dashboardDistrictMessageService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSrvc.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    //this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                }
                else {
                    _this.dashboardDistrictMessageService.districtName;
                    _this.loginStoreSrvc.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    //	this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                }
            }
            else {
                ++_this.dashboardDistrictMessageService.count;
            }
        });
    };
    DistrictMessageComponent.prototype.closeDistrictMessage = function () {
        this.noShow = true;
    };
    DistrictMessageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'district-message',
            templateUrl: './district-message.component.html',
            styleUrls: ['../dashboard-home.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_2.ToasterService,
            forms_1.FormBuilder,
            index_2.CookieService,
            index_2.ValidateCookieService,
            mobile_district_message_component_1.MobileDistrictMessageComponent,
            index_2.MessageProcessorService,
            index_1.DashboardDistrictMessageService,
            index_2.LoginStoreService])
    ], DistrictMessageComponent);
    return DistrictMessageComponent;
}());
exports.DistrictMessageComponent = DistrictMessageComponent;
//# sourceMappingURL=district-message.component.js.map