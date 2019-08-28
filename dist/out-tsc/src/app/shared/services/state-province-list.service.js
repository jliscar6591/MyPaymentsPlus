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
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var http_2 = require("@angular/common/http");
var utility_service_1 = require("../../shared/services/utility.service");
var login_store_service_1 = require("../../shared/services/login-store.service");
//Local
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var StateProvinceListService = /** @class */ (function () {
    function StateProvinceListService(http, httpC, loginStoreSvc, utilityService) {
        this.http = http;
        this.httpC = httpC;
        this.loginStoreSvc = loginStoreSvc;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    StateProvinceListService.prototype.getStateNew = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = '';
        this.loginResponse = loginResponse;
        return this.http.request("/assets/data/state-province.data.json")
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //  ,
        // tap(data => console.log("I think we got a Payment Methods: ", data))
        );
    };
    StateProvinceListService.prototype.subscribeToGetStateNew = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getStateNew(loginResponseObj)
            .subscribe(function (data) {
            _this.stateProvinceList = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
        }, function () {
            _this.result = true;
        });
    };
    StateProvinceListService.prototype.getState = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = '';
        this.loginResponse = loginResponse;
        this.http.request("/assets/data/state-province.data.json")
            .subscribe(function (data) { _this.stateProvinceList = data.json(); }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    StateProvinceListService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            login_store_service_1.LoginStoreService,
            utility_service_1.UtilityService])
    ], StateProvinceListService);
    return StateProvinceListService;
}());
exports.StateProvinceListService = StateProvinceListService;
//# sourceMappingURL=state-province-list.service.js.map