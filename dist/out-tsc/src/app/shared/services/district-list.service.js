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
var app_settings_1 = require("../../app.settings");
var DistrictListService = /** @class */ (function () {
    function DistrictListService(http, httpC, loginStoreSvc, utilityService) {
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
    DistrictListService.prototype.getDistrictNew = function (districtViewModel, loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = '';
        var token = loginResponse.access_token;
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/DistrictList/' + districtViewModel.stateId; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); }), operators_1.tap(function (data) { return _this.districtList = data; }));
    };
    DistrictListService.prototype.subscribeToGetDistrictNew = function (districtViewModel, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Updating District Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getDistrictNew(districtViewModel, loginResponseObj)
            .subscribe(function (data) {
            _this.districtList = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
        }, function () {
            console.log(_this.districtList);
            _this.result = true;
        });
    };
    DistrictListService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    DistrictListService.prototype.getDistrict = function (districtViewModel, loginResponse) {
        var _this = this;
        // console.log(districtViewModel)
        //  console.log(loginResponse)
        var successMessage = '';
        var failureMessage = '';
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/DistrictList/' + districtViewModel.stateId; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.get(Url, options)
            .subscribe(function (data) { _this.districtList = data.json(); }, function (error) {
            if (error["status"]) {
                _this.loginResponse.status = error["status"];
                if (error["status"] != '500') {
                    _this.loginResponse.message = failureMessage;
                }
                else {
                    _this.loginResponse.message = failureMessage;
                }
            }
            else {
                _this.loginResponse.message = failureMessage;
            }
            _this.loginResponse.showCloseButton = true;
            _this.loginResponse.messageType = app_settings_1.Constants.Error;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    DistrictListService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            login_store_service_1.LoginStoreService,
            utility_service_1.UtilityService])
    ], DistrictListService);
    return DistrictListService;
}());
exports.DistrictListService = DistrictListService;
//# sourceMappingURL=district-list.service.js.map