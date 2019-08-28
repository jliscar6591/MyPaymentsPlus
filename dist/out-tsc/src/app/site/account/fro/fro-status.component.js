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
var index_1 = require("../../services/index");
var app_settings_1 = require("../../../app.settings");
var index_2 = require("../../../shared/services/index");
var FroStatusComponent = /** @class */ (function () {
    function FroStatusComponent(router, addCartItemService, validateCookie, cookieService, utilityService, loginStoreSvc) {
        this.router = router;
        this.addCartItemService = addCartItemService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.loginStoreSvc = loginStoreSvc;
        //Stubs for action that can be taken on status
        this.continue = new core_1.EventEmitter();
        this.determination = new core_1.EventEmitter();
        this.download = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ;
    //= this.validateCookie.validateCookie();
    FroStatusComponent.prototype.displayStatus = function (status) {
        switch (status.toLowerCase()) {
            case app_settings_1.Constants.FroAppStatus.inProcess.value:
                return app_settings_1.Constants.FroAppStatus.inProcess.display;
            case app_settings_1.Constants.FroAppStatus.pending.value:
                return app_settings_1.Constants.FroAppStatus.pending.display;
            case app_settings_1.Constants.FroAppStatus.processed.value:
                return app_settings_1.Constants.FroAppStatus.processed.display;
            default:
                return status;
        }
    };
    //Stubs for action that can be taken on status
    FroStatusComponent.prototype.continueApp = function () {
        //this.model.status.toLowerCase
        this.continue.emit({
            "action": "Continue making app entries"
        });
    };
    FroStatusComponent.prototype.eligibilityDetermination = function () {
        this.determination.emit({
            "action": "How the eligibility was determined"
        });
    };
    FroStatusComponent.prototype.downloadApplication = function () {
        this.download.emit({
            "action": "Download the application"
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FroStatusComponent.prototype, "model", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FroStatusComponent.prototype, "continue", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FroStatusComponent.prototype, "determination", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FroStatusComponent.prototype, "download", void 0);
    FroStatusComponent = __decorate([
        core_1.Component({
            selector: 'fro-status-selector',
            templateUrl: 'fro-status.component.html',
            styleUrls: ['fro-launch.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.AddCartItemService,
            index_2.ValidateCookieService,
            index_2.CookieService,
            index_2.UtilityService,
            index_2.LoginStoreService])
    ], FroStatusComponent);
    return FroStatusComponent;
}());
exports.FroStatusComponent = FroStatusComponent;
//# sourceMappingURL=fro-status.component.js.map