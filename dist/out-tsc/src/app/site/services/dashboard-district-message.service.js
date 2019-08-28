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
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var DashboardDistrictMessageService = /** @class */ (function () {
    function DashboardDistrictMessageService(http, utilityService) {
        this.http = http;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    DashboardDistrictMessageService.prototype.getContent = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Failed to get district message.';
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/DistrictMessage'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.districtContent = data.json().content;
            _this.districtKey = data.json().districtKey;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response				
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    DashboardDistrictMessageService.prototype.getName = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Failed to get district content.';
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/District'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.districtName = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response				
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    DashboardDistrictMessageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService])
    ], DashboardDistrictMessageService);
    return DashboardDistrictMessageService;
}());
exports.DashboardDistrictMessageService = DashboardDistrictMessageService;
//# sourceMappingURL=dashboard-district-message.service.js.map