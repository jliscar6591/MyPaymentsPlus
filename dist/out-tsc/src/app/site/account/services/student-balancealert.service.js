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
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var http_2 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var StudentBalanceAlertService = /** @class */ (function () {
    function StudentBalanceAlertService(http, httpC, loginStoreSrvc, utilityService) {
        this.http = http;
        this.httpC = httpC;
        this.loginStoreSrvc = loginStoreSrvc;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to get Balance Alerts of the students.
    StudentBalanceAlertService.prototype.getStudentBalnaceAlertsNew = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = 'Successful';
        var failureMessage = 'Failed to get Student Balance Alerts';
        this.loginResponse = loginResponse;
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        // tap(data => console.log("I think we got students: ", data))
        );
    };
    StudentBalanceAlertService.prototype.subscribeToGetStudentBlanaceAlertsNew = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'No Students to Manage';
        if (this.loginStoreSrvc.cookieStateItem) {
            loginResponseObj = this.loginStoreSrvc.cookieStateItem;
        }
        else {
            loginResponseObj = loginResponse;
        }
        this.getStudentBalnaceAlertsNew(loginResponseObj)
            .subscribe(function (data) {
            _this.studentBalanceAlerts = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.result = true;
        });
    };
    StudentBalanceAlertService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    StudentBalanceAlertService.prototype.getStudentBalanceAlerts = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = 'Successful';
        var failureMessage = 'Failed to get Student Balance Alerts';
        this.loginResponse = loginResponse;
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            _this.studentBalanceAlerts = data.json();
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to save Balance Alerts of the students.
    StudentBalanceAlertService.prototype.saveStudentBalanceAlerts = function (studentAlertInputs, loginResponse) {
        var _this = this;
        var newJwt;
        var successMessage = 'Successfully Updated Student Alert Level';
        var failureMessage = 'Failed to Update Student Alert Level';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration'; // URL to web API
        var body = JSON.stringify(studentAlertInputs);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.put(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.getStudentBalanceAlerts(_this.loginResponse);
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    StudentBalanceAlertService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.LoginStoreService,
            index_1.UtilityService])
    ], StudentBalanceAlertService);
    return StudentBalanceAlertService;
}());
exports.StudentBalanceAlertService = StudentBalanceAlertService;
//# sourceMappingURL=student-balancealert.service.js.map