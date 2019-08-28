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
var RequestPassordChangeService = /** @class */ (function () {
    function RequestPassordChangeService(http, httpC, utilityService) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    RequestPassordChangeService.prototype.requestPasswordChange = function (requestDetail, loginResponse) {
        var _this = this;
        var message = '';
        this.result = false;
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/reset'; // URL to web API
        var body = JSON.stringify(requestDetail);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.post(Url, body, options)
            .subscribe(function (data) {
            //processing the successful response
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = message;
            _this.result = true;
        }, function (error) {
            //Initially it was thought that these various states would need a different message
            //If we are sure that this is not the case this can be simplified by eliminating
            //the blocks of logic.
            if (error["status"]) {
                if (error["status"] != '500') {
                    _this.loginResponse.message = message;
                }
                else {
                    _this.loginResponse.message = message;
                }
            }
            else {
                _this.loginResponse.message = message;
            }
            _this.loginResponse.showCloseButton = true;
            _this.loginResponse.messageType = app_settings_1.Constants.Error;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    RequestPassordChangeService.prototype.requestPasswordChangeNew = function (requestDetail) {
        var _this = this;
        var failureMessage = "Error. Password was Not Changed";
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/reset'; // URL to web API
        var body = JSON.stringify(requestDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON'
        });
        var options = { headers: headers };
        //console.log("Da Url: ", Url)
        //console.log("Da body: ", body)
        // console.log("Da options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        //  tap(data => console.log("I think pasword was Changed: ", data))
        );
    };
    RequestPassordChangeService.prototype.subscribeToRequestPasswordChange = function (requestDetail, loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var message = '';
        this.result = false;
        // console.log("do we have a LoignResponse Model: ", this.loginResponse)
        if (requestDetail) {
            this.requestPasswordChangeNew(requestDetail)
                .subscribe(function (data) {
                //processing the successful response
                _this.loginResponse.messageType = app_settings_1.Constants.Success;
                _this.loginResponse.messageTitle = 'Message: ';
                _this.loginResponse.message = message;
                _this.result = true;
                // console.log("Did we set the message: ", this.loginResponse.message)
            }, function (error) {
                //Initially it was thought that these various states would need a different message
                //If we are sure that this is not the case this can be simplified by eliminating
                //the blocks of logic.
                if (error["status"]) {
                    if (error["status"] != '500') {
                        _this.loginResponse.message = message;
                    }
                    else {
                        _this.loginResponse.message = message;
                    }
                }
                else {
                    _this.loginResponse.message = message;
                }
                _this.loginResponse.showCloseButton = true;
                _this.loginResponse.messageType = app_settings_1.Constants.Error;
                _this.loginResponse.messageTitle = 'Message: ';
                _this.result = true;
            }, function () {
                _this.result = true;
            });
        }
    };
    RequestPassordChangeService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    RequestPassordChangeService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            utility_service_1.UtilityService])
    ], RequestPassordChangeService);
    return RequestPassordChangeService;
}());
exports.RequestPassordChangeService = RequestPassordChangeService;
//# sourceMappingURL=request-password-change.service.js.map