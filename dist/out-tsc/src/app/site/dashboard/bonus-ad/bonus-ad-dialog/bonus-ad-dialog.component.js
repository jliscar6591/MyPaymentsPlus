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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var index_1 = require("../../../services/index");
var bonus_schedule_service_1 = require("../../../services/bonus-schedule.service");
var app_settings_1 = require("../../../../app.settings");
var index_2 = require("../../../../shared/services/index");
var BonusAdDialogComponent = /** @class */ (function () {
    function BonusAdDialogComponent(thisDialogRef, data, cookieService, validateCookie, messageProcessorService, dashboardDistrictMessageService, districtLoginDerivedService, bonusScheduleService, loginSrvcStore) {
        this.thisDialogRef = thisDialogRef;
        this.data = data;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.dashboardDistrictMessageService = dashboardDistrictMessageService;
        this.districtLoginDerivedService = districtLoginDerivedService;
        this.bonusScheduleService = bonusScheduleService;
        this.loginSrvcStore = loginSrvcStore;
        this.loginResponse = this.loginSrvcStore.cookieStateItem;
    }
    BonusAdDialogComponent.prototype.ngOnInit = function () {
        this.getDistrictName();
        this.getBonusSchedule();
    };
    BonusAdDialogComponent.prototype.onCloseConfirm = function () {
        this.thisDialogRef.close('Confirm');
    };
    BonusAdDialogComponent.prototype.getDistrictName = function () {
        var _this = this;
        var subscription = this.dashboardDistrictMessageService.getName(this.loginResponse)
            .subscribe(function () {
            if (_this.dashboardDistrictMessageService.result == true) {
                subscription.unsubscribe();
                if (_this.dashboardDistrictMessageService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginSrvcStore.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                }
                else {
                    _this.dashboardDistrictMessageService.districtName;
                    _this.loginSrvcStore.loadLogin(_this.dashboardDistrictMessageService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
                }
            }
            else {
                ++_this.dashboardDistrictMessageService.count;
            }
        });
    };
    BonusAdDialogComponent.prototype.getBonusSchedule = function () {
        var _this = this;
        var subscription = this.bonusScheduleService.getBonusSchedule(this.loginResponse)
            .subscribe(function () {
            if (_this.bonusScheduleService.result == true) {
                subscription.unsubscribe();
                if (_this.bonusScheduleService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginSrvcStore.loadLogin(_this.bonusScheduleService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.bonusScheduleService.loginResponse);
                }
                else {
                    _this.BonusSchedule = _this.bonusScheduleService.mealbonusSchedule;
                    _this.loginSrvcStore.loadLogin(_this.bonusScheduleService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.bonusScheduleService.loginResponse)
                }
            }
            else {
                ++_this.bonusScheduleService.count;
            }
        });
    };
    BonusAdDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-bonus-ad-dialog',
            templateUrl: './bonus-ad-dialog.component.html',
            styleUrls: ['./bonus-ad-dialog.component.less']
        }),
        __param(1, core_1.Inject(material_2.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, String, index_2.CookieService,
            index_2.ValidateCookieService,
            index_2.MessageProcessorService,
            index_1.DashboardDistrictMessageService,
            index_2.DistrictLoginDerivedService,
            bonus_schedule_service_1.BonusScheduleService,
            index_2.LoginStoreService])
    ], BonusAdDialogComponent);
    return BonusAdDialogComponent;
}());
exports.BonusAdDialogComponent = BonusAdDialogComponent;
//# sourceMappingURL=bonus-ad-dialog.component.js.map