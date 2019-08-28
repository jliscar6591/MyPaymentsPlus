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
var PaymentMethodService = /** @class */ (function () {
    function PaymentMethodService(http, httpC, utilityService, tokenService, currTokenServ) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        this.tokenService = tokenService;
        this.currTokenServ = currTokenServ;
        //True when http call returns
        this.result = false;
        this.resultSetDefaultPayment = false;
        //Used to count retry 
        this.count = 0;
    }
    PaymentMethodService.prototype.getPaymentMethodsNew = function (loginResponse) {
        var _this = this;
        // console.log("Calling getPaymentMethodsNew: ", loginResponse)
        var failureMessage = 'Get Payment Methods Failed';
        this.loginResponse = loginResponse;
        // console.log("the login Response: ", this.loginResponse);
        var token = this.loginResponse.access_token;
        // console.log("What is the getPaymentMethodsNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        //For Testing
        //this.loginResponse.districtKey = "0d3b28a7-425c-487e-97da-1bc8cbeb0c28";
        // this.loginResponse.districtName = "Gwinnett County Public Schools (Test)";
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Wallet + '/WalletDetailSummary'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //console.log("The Url: ", Url)
        //console.log("The headers: ", headers)
        // console.log("The options")
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //  ,
        // tap(data => console.log("I think we got a Payment Methods: ", data))
        );
    };
    PaymentMethodService.prototype.subscribeToGetPaymentMethods = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        // console.log("What is the loginResponse for getPaymentMethods: ", loginResponseObj);
        this.getPaymentMethods$ = this.getPaymentMethodsNew(loginResponseObj)
            .subscribe(function (data) {
            _this.paymentMethods = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
        }, function () {
            //  console.log("What R these paymentMethods: ", this.paymentMethods)
            _this.result = true;
        });
    };
    PaymentMethodService.prototype.updatePaymentMethodNew = function (updatepayment, loginResponse) {
        var _this = this;
        var successMessage = 'Successfully updated Payment method';
        var failureMessage = 'Failed to update payment account';
        this.loginResponse = loginResponse;
        // console.log("the login Response: ", this.loginResponse);
        var token = this.loginResponse.access_token;
        // console.log("What is the getRemoteStudentMeals token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Wallet + '/Wallet'; // URL to web API
        var body = JSON.stringify(updatepayment);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        this.loginResponse = loginResponse;
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        //  tap(data => console.log("I think we got a Payment Methods: ", data))
        );
    };
    PaymentMethodService.prototype.subscribeToUpdatePaymentMethodNew = function (updatepayment, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        // console.log('PaymentMethodsNew LOgin Resposne: ', loginResponse)
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.updatePaymentMethodNew(updatepayment, loginResponseObj)
            .subscribe(function (data) {
            // console.log("Response from Wallet: ", data);
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            _this.result = true;
        });
    };
    PaymentMethodService.prototype.setDefaultWallet = function (walletKey, loginResponse) {
        var _this = this;
        this.resultSetDefaultPayment = false;
        var newJwt;
        var successMessage = 'Successfully set default wallet';
        var failureMessage = 'Failed to set default wallet';
        var Url = app_settings_1.Constants.WebApiUrl.Wallet + '/wallet/default/'; // URL to web API
        var body = JSON.stringify({ value: walletKey });
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.loginResponse = loginResponse;
        this.http.patch(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.resultSetDefaultPayment = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.resultSetDefaultPayment = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    //Use regular expressions to discern the card type
    //based on the card number format
    PaymentMethodService.prototype.getCardType = function (cardNumber) {
        //  console.log("do we knowe the Card #: ", cardNumber)
        var carNumPrefix = cardNumber.substr(0, 1);
        // console.log("What is the carNumPrefix: ", carNumPrefix)
        if (carNumPrefix == '4') {
            return 'Visa';
        }
        else if ((carNumPrefix == '2') || (carNumPrefix == '5')) {
            return 'MasterCard';
        }
        else if ((carNumPrefix == '6')) {
            // console.log("should be Discover Card")
            return 'Discover';
        }
        else if ((carNumPrefix == '3')) {
            return this.setCardType(cardNumber);
        }
        else {
            return app_settings_1.Constants.Error;
        }
    };
    //We have Four different Card Types that use 3 as a prefix.
    //We have to look at the two digit prefix to determine the correct Card type
    PaymentMethodService.prototype.setCardType = function (cardNumber) {
        var tempPrefix = cardNumber.substr(0, 2);
        // console.log("What is the 2-digit Prefix: ", tempPrefix)
        if (tempPrefix == '30') {
            return 'CarteBlanche';
        }
        else if (tempPrefix == '35') {
            return 'JCB';
        }
        else if ((tempPrefix == '36') || (tempPrefix == '38')) {
            return 'DinersClub';
        }
        else if ((tempPrefix == '34') || (tempPrefix == '37')) {
            return 'AmEx';
        }
        else {
            return app_settings_1.Constants.Error;
        }
    };
    PaymentMethodService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.UtilityService,
            index_1.TokenService,
            index_1.CurrentTokenService])
    ], PaymentMethodService);
    return PaymentMethodService;
}());
exports.PaymentMethodService = PaymentMethodService;
//# sourceMappingURL=payment-method.service.js.map