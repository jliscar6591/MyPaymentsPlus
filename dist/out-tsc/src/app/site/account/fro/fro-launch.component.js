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
var app_settings_1 = require("../../../app.settings");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
var index_2 = require("../services/index");
//import { setTimeout } from 'timers';
var FroLaunchComponent = /** @class */ (function () {
    function FroLaunchComponent(router, validateCookie, cookieService, utilityService, froAppAvailabilityService, froAppStatusService, loginStoreService) {
        this.router = router;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.froAppAvailabilityService = froAppAvailabilityService;
        this.froAppStatusService = froAppStatusService;
        this.loginStoreService = loginStoreService;
        this.getFroAvailabilityErr = false;
        this.getFroAvailabilityErrMsg = '';
        this.getFroStatusErr = false;
        this.getFroStatusErrMsg = '';
        this.loginResponse = this.loginStoreService.cookieStateItem;
    }
    FroLaunchComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.loginResponse = this.validateCookie.validateCookie();
        this.getFroStatus();
        this.getFroAppAvailability();
        setTimeout(function () { _this.isBlackedOut = _this.setBlackout(); }, 1000);
        //this.fakeContent = `<h1>Free and reduced stub</h1>`
    };
    //Get fro availability
    FroLaunchComponent.prototype.getFroAppAvailability = function () {
        var _this = this;
        this.isFroAvailabilityGetting = true;
        this.froAppAvailabilityService.result = false;
        var subscription = this.froAppAvailabilityService.getAppAvailability(this.loginResponse)
            .subscribe(function () {
            if (_this.froAppAvailabilityService.result == true) {
                subscription.unsubscribe();
                if (_this.froAppAvailabilityService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getFroAvailabilityErr = true;
                    _this.getFroAvailabilityErrMsg = _this.froAppAvailabilityService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.froAppAvailabilityService.loginResponse);
                }
                else {
                    _this.loginStoreService.loadLogin(_this.froAppAvailabilityService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.froAppAvailabilityService.loginResponse);
                }
                _this.froAppAvailability = _this.froAppAvailabilityService.froAppAvailability;
                var seconds = Observable_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                seconds.subscribe(function (x) {
                    if (x == app_settings_1.Constants.SpinnerDelay) {
                        _this.isFroAvailabilityGetting = false;
                    }
                });
            }
            else {
                ++_this.froAppAvailabilityService.count;
            }
        });
    };
    //Get status
    FroLaunchComponent.prototype.getFroStatus = function () {
        var _this = this;
        this.isFroStatusGetting = true;
        this.froAppStatusService.result = false;
        var subscription = this.froAppStatusService.getStatus(this.loginResponse)
            .subscribe(function () {
            if (_this.froAppStatusService.result == true) {
                subscription.unsubscribe();
                if (_this.froAppStatusService.loginResponse.messageType &&
                    _this.froAppStatusService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getFroStatusErr = true;
                    _this.getFroStatusErrMsg = _this.froAppStatusService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.froAppStatusService.loginResponse);
                }
                else {
                    _this.loginStoreService.loadLogin(_this.froAppStatusService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.froAppStatusService.loginResponse);
                }
                var seconds = Observable_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                if (_this.froAppStatusService.froAppStatus && _this.froAppStatusService.froAppStatus.length > 0) {
                    _this.isFroStatus = true;
                }
                seconds.subscribe(function (x) {
                    if (x == app_settings_1.Constants.SpinnerDelay) {
                        _this.isFroStatusGetting = false;
                    }
                });
            }
            else {
                ++_this.froAppStatusService.count;
            }
        });
    };
    //Navigate to start new fro app
    FroLaunchComponent.prototype.startNewFroApp = function (msg) {
        window.location.href = app_settings_1.Constants.FroAppStartUrl.FroAppStartUrl + '/' + this.loginResponse.districtKey + '/' + this.froAppAvailabilityService.froAppAvailability.userId;
    };
    //Stub for action that can be taken on status
    //Continue making app entries
    FroLaunchComponent.prototype.continueApp = function (msg) {
        console.log(msg);
    };
    //How the eligibility was determined
    FroLaunchComponent.prototype.eligibilityDetermination = function (msg) {
        console.log(msg);
    };
    //Download the application
    FroLaunchComponent.prototype.downloadApplication = function (msg) {
        console.log(msg);
    };
    /*If today is > Jul 1st && today is < this.froAppAvailability.appBlackoutEnds
        return true
        The Start App button should be hidden;
        Show banner
   */
    FroLaunchComponent.prototype.setBlackout = function () {
        var todaysDte = this.getToday();
        var currYear = this.getCurrentYear();
        var froObj = this.froAppAvailabilityService.froAppAvailability;
        var beginBlackOutDte = froObj.appBlackoutBegins;
        var endBlackoutDte = froObj.appBlackoutEnds;
        if (todaysDte >= beginBlackOutDte && todaysDte < endBlackoutDte) {
            this.isBlackedOut = true;
            // console.log("Its a blackOut, where's Red and Meth ", this.isBlackedOut);
            return true;
        }
        else {
            this.isBlackedOut = false;
            // console.log("Today is a Good Day, tell Ice Cube: ", this.isBlackedOut);
            return false;
        }
    };
    FroLaunchComponent.prototype.getToday = function () {
        var d = new Date();
        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        var yyyy = d.getFullYear();
        var today = mm + "/" + dd + "/" + yyyy;
        return today;
    };
    FroLaunchComponent.prototype.getCurrentYear = function () {
        var d = new Date();
        var yyyy = d.getFullYear();
        this.appBeginYear = yyyy;
        // console.log("What is the app Begin Year: ", this.appBeginYear);
        return this.appBeginYear;
    };
    FroLaunchComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'fro-launch.component.html',
            styleUrls: ['fro-launch.component.less']
        })
        //@Component({
        //    template: '<h1>{{froAppAvailabilityService.froAppAvailability.froAppBlackoutEnds}}</h1>',  
        //    styleUrls: ['fro-launch.component.less']
        //})
        ,
        __metadata("design:paramtypes", [router_1.Router,
            index_1.ValidateCookieService,
            index_1.CookieService,
            index_1.UtilityService,
            index_2.FroAppAvailabilityService,
            index_2.FroAppStatusService,
            index_1.LoginStoreService])
    ], FroLaunchComponent);
    return FroLaunchComponent;
}());
exports.FroLaunchComponent = FroLaunchComponent;
//# sourceMappingURL=fro-launch.component.js.map