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
var http_2 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var utility_service_1 = require("../../shared/services/utility.service");
var login_store_service_1 = require("../../shared/services/login-store.service");
var ChangePasswordService = /** @class */ (function () {
    function ChangePasswordService(http, httpC, loginStoreService, utilityService) {
        this.http = http;
        this.httpC = httpC;
        this.loginStoreService = loginStoreService;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    ChangePasswordService.prototype.changePassword = function (changePutDetail, loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Failed to reset your password';
        var newJwt;
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/reset'; // URL to web API
        var body = JSON.stringify(changePutDetail);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.put(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
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
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.showCloseButton = false;
            // this.loginStoreService.loadLogin(this.loginResponse);
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    ChangePasswordService.prototype.changePasswordNew = function (changePutDetail) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Failed to reset your password';
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/reset'; // URL to web API
        var body = JSON.stringify(changePutDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON'
        });
        var options = { headers: headers };
        // console.log("Da Url: ", Url)
        //console.log("Da body: ", body)
        //console.log("Da options: ", options)
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        //  tap(data => console.log("I think pasword was Changed: ", data))
        );
    };
    ChangePasswordService.prototype.subscribeToChangeNewPasswordNew = function (changePutDetail, loginResponse) {
        var _this = this;
        var failureMessage = 'Failed to reset your password';
        var newJwt;
        this.loginResponse = loginResponse;
        if (changePutDetail) {
            this.changePasswordNew(changePutDetail)
                .subscribe(function (data) {
                //newJwt = data.headers.toJSON();
                // console.log("Did we get headers: ", data)
            }, function (error) {
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
                _this.result = false;
            }, function () {
                //processing the successful response
                //  this.loginResponse.access_token = newJwt.jwt_refresh[0];
                _this.loginResponse.showCloseButton = false;
                _this.result = true;
            });
        }
    };
    ChangePasswordService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    ChangePasswordService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            login_store_service_1.LoginStoreService,
            utility_service_1.UtilityService])
    ], ChangePasswordService);
    return ChangePasswordService;
}());
exports.ChangePasswordService = ChangePasswordService;
//# sourceMappingURL=change-password.service.js.map