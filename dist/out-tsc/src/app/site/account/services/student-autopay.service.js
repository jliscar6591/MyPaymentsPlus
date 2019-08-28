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
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var PaymentAutoPayService = /** @class */ (function () {
    function PaymentAutoPayService(http, utilityService, httpC, currTokenServ, tokenService, loginStoreSrvc) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSrvc = loginStoreSrvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.autoPayAdded$ = new core_1.EventEmitter();
        this.postResults = false;
        this.updateResults = false;
        this.autoPayUpdated$ = new core_1.EventEmitter();
        this.deleteResults = false;
        this.autoPayDeleted$ = new core_1.EventEmitter();
    }
    PaymentAutoPayService.prototype.getAutoPayDetails = function (loginResponse) {
        var _this = this;
        this.result = false;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = 'Success';
        var failureMessage = 'Failed to get Auto Pay Details';
        //  this.loginResponse = loginResponse;
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/autopay'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            _this.autopayDetails = data.json();
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
    PaymentAutoPayService.prototype.getAutoPayDetailsNew = function (loginResponse) {
        var _this = this;
        var failureMessage = 'Failed to get Auto Pay Details';
        this.loginResponse = loginResponse;
        var token = '';
        token = this.loginResponse.access_token;
        // console.log("What is the getPaymentMethodsNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.result = false;
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/autopay'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //   ,
        //  tap(data => console.log("Called By subscribetoGetAutoPayDetails: ", data))
        );
    };
    PaymentAutoPayService.prototype.subscribetoGetAutoPayDetails = function (loginResponse) {
        var _this = this;
        // console.log("Calling subscribetoGetAutoPayDetails");
        var failureMessage = 'Failed to get deriveDefaults';
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        // console.log("What is the loginResponseObj: ", loginResponseObj)
        this.getAutoPayDetailsNew(loginResponseObj)
            .subscribe(function (data) {
            var tempList = data;
            _this.autopayDetails = tempList;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response  
            // console.log("Do we have the currentLoginRespopnse: ", this.loginStoreSrvc.storeLoginResponse);
            if (_this.loginStoreSrvc.storeLoginResponse) {
                for (var i = 0; i < _this.autopayDetails.length; i++) {
                    if (_this.loginStoreSrvc.storeLoginResponse.districtKey == _this.autopayDetails[i].districtKey) {
                        var currDistrictDetails = _this.autopayDetails[i];
                        _this.autopayDetails = currDistrictDetails;
                        // console.log("Do we have the correct Details: ", this.autopayDetails)
                    }
                }
            }
            _this.result = true;
        });
    };
    PaymentAutoPayService.prototype.setupStudentAutopay = function (autopayAddDetail, loginResponse) {
        var _this = this;
        this.result = false;
        var newJwt;
        var successMessage = 'Successfully added Autopay';
        var failureMessage = 'Failed to add Autopay';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/AutoPay'; // URL to web API
        var body = JSON.stringify(autopayAddDetail);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.post(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.getAutoPayDetails(_this.loginResponse);
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    PaymentAutoPayService.prototype.setupStudentAutopayNew = function (autopayAddDetail, loginResponse) {
        var _this = this;
        this.result = false;
        var successMessage = 'Successfully added Autopay';
        var failureMessage = 'Failed to add Autopay';
        this.loginResponse = loginResponse;
        var token = '';
        token = this.loginResponse.access_token;
        // console.log("What is the getPaymentMethodsNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/autopay'; // URL to web API
        var body = JSON.stringify(autopayAddDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //Used for debugging
        //console.log("The Url: ", Url)
        //console.log("Da Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        // tap(data => console.log(successMessage + ": ", data))
        );
    };
    PaymentAutoPayService.prototype.subscribeToSetupStudentAutoPay = function (autopayAddDetail, loginResponse) {
        var _this = this;
        var failureMessage = 'Failed to add Autopay';
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.setupStudentAutopayNew(autopayAddDetail, loginResponseObj)
            .subscribe(function (data) {
            // newJwt = data.headers.toJSON();
            _this.result = true;
            _this.postResults = _this.result;
            //(!data) ? true : false;
            _this.result;
            //
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            //this.loginResponse.access_token = newJwt.jwt_refresh[0];
            //this.getAutoPayDetails(this.loginResponse);
            _this.subscribetoGetAutoPayDetails(loginResponseObj);
            _this.result = true;
            _this.autoPayAdded$.emit(_this.postResults);
        });
    };
    PaymentAutoPayService.prototype.updateAutopayNew = function (autopayAddDetail, loginResponse) {
        var _this = this;
        this.result = false;
        var successMessage = 'Successfully updated Payment method';
        var failureMessage = 'Failed to update payment account';
        this.loginResponse = loginResponse;
        var token = '';
        token = this.loginResponse.access_token;
        // console.log("What is the updateAutopayNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        // console.log("updateAutopayNew currToken: ", this.currentToken)
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/AutoPay'; // URL to web API
        var body = JSON.stringify(autopayAddDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.patch(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //  ,
        // tap(data => console.log(successMessage + ": ", data))
        );
    };
    PaymentAutoPayService.prototype.subscribeToUpdatePaymentAutoPay = function (autopayAddDetail, loginResponse) {
        var _this = this;
        // this.updateResults = false;
        var loginResponseObj;
        var failureMessage = 'Failed to update payment account';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.updateAutopayNew(autopayAddDetail, loginResponseObj)
            .subscribe(function (data) {
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = (error) ? false : true;
        }, function () {
            //processing the successful response
            _this.subscribetoGetAutoPayDetails(loginResponseObj);
            _this.result = true;
            _this.updateResults = _this.result;
            //Tells the autoPayComponent to Refresh itsself with the updated data
            _this.autoPayUpdated$.emit(_this.updateResults);
        });
    };
    PaymentAutoPayService.prototype.deleteAutopay = function (autoPaySettingsKey, loginResponse) {
        var _this = this;
        this.result = false;
        var newJwt;
        var successMessage = 'success';
        var failureMessage = 'Unable to delete the autopay.';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/AutoPay/' + autoPaySettingsKey; // URL to web API                 
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.delete(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.getAutoPayDetails(_this.loginResponse);
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    PaymentAutoPayService.prototype.deleteAutoPayNew = function (autoPaySettingsKey, loginResponse) {
        var _this = this;
        this.result = false;
        var successMessage = 'Successfully updated Payment method';
        var failureMessage = 'Failed to update payment account';
        this.loginResponse = loginResponse;
        // console.log("Access Toek: ", this.loginResponse.access_token)
        var token = '';
        token = this.loginResponse.access_token;
        // console.log("What is the updateAutopayNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        // console.log("updateAutopayNew currToken: ", this.currentToken)
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/AutoPay/' + autoPaySettingsKey; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.delete(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        // tap(data => console.log(successMessage + ": ", data))
        );
    };
    PaymentAutoPayService.prototype.subscribeToDeleteAutoPay = function (autoPaySettingsKey, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Failed to update payment account';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.deleteAutoPayNew(autoPaySettingsKey, loginResponseObj)
            .subscribe(function (data) {
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.subscribetoGetAutoPayDetails(loginResponseObj);
            _this.result = true;
            _this.deleteResults = _this.result;
            _this.autoPayDeleted$.emit(_this.deleteResults);
        });
    };
    PaymentAutoPayService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], PaymentAutoPayService);
    return PaymentAutoPayService;
}());
exports.PaymentAutoPayService = PaymentAutoPayService;
//# sourceMappingURL=student-autopay.service.js.map