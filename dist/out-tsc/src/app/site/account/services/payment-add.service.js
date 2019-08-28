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
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../../app.settings");
var payment_method_service_1 = require("./payment-method.service");
var index_1 = require("../../../shared/services/index");
var PaymentAddService = /** @class */ (function () {
    function PaymentAddService(http, httpC, utilityService, tokenService, currTokenServ, paymentMethodService) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        this.tokenService = tokenService;
        this.currTokenServ = currTokenServ;
        this.paymentMethodService = paymentMethodService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    PaymentAddService.prototype.addPaymentMethodNew = function (paymentAddDetail, loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        // console.log("the addPaymentMethodNew login Response: ", this.loginResponse);
        var token = loginResponse.access_token;
        var failureMessage = 'Failed to add payment account';
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Wallet + '/Wallet'; // URL to web API
        var body = JSON.stringify(paymentAddDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //  ,
        // tap(data => console.log("I think we added a Payment Methods: ", data))
        );
    };
    PaymentAddService.prototype.subscribeToAddPaymentMethods = function (paymentAddDetail, loginResponse) {
        var _this = this;
        //console.log("Calling subscribeToAddPaymentMethods: ", paymentAddDetail)
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        loginResponseObj = this.utilityService.checkLoginResponse(loginResponse, this.loginResponse);
        this.addPaymentMethod$ = this.addPaymentMethodNew(paymentAddDetail, loginResponseObj)
            .subscribe(function (data) {
            //newJwt = data.headers.toJSON();
            //console.log("we got data:   ", data)
            _this.result = (data) ? true : false;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            _this.paymentMethodService.subscribeToGetPaymentMethods(_this.loginResponse);
            //processing the successful response
            // this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
            //console.log("the result: ", this.result)
        });
    };
    PaymentAddService.prototype.deletePaymentMethod = function (walletKey, loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        // console.log("the addPaymentMethodNew login Response: ", this.loginResponse);
        var token = loginResponse.access_token;
        var successMessage = 'success';
        var failureMessage = 'Unable to delete the payment method.';
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Wallet + '/Wallet/' + walletKey; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.delete(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //  ,
        // tap(data => console.log("I think we deleted a Payment Methods: ", data))
        );
    };
    PaymentAddService.prototype.subscribeToDeletePaymentMethod = function (walletKey, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        loginResponseObj = this.utilityService.checkLoginResponse(loginResponse, this.loginResponse);
        this.subscription =
            this.deletePaymentMethod(walletKey, loginResponse)
                .subscribe(function (data) {
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = true;
            }, function () {
                //console.log("What is the available Status: ", this.availableStatus);
                _this.result = true;
                _this.paymentMethodService.subscribeToGetPaymentMethods(_this.loginResponse);
                _this.result = true;
            });
    };
    PaymentAddService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.UtilityService,
            index_1.TokenService,
            index_1.CurrentTokenService,
            payment_method_service_1.PaymentMethodService])
    ], PaymentAddService);
    return PaymentAddService;
}());
exports.PaymentAddService = PaymentAddService;
//# sourceMappingURL=payment-add.service.js.map