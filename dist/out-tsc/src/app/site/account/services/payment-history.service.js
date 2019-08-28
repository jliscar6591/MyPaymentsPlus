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
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var PaymentHistoryService = /** @class */ (function () {
    function PaymentHistoryService(http, utilityService, httpC, currTokenServ, cookieService, tokenService) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.cookieService = cookieService;
        this.tokenService = tokenService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    PaymentHistoryService.prototype.getPaymentHistory = function (userPaymentSearchModel, loginResponse) {
        //console.log("What is the LoginResponse- getPaymentHistory: ", loginResponse )
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Get Payment History Failed';
        this.loginResponse = loginResponse;
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/PaymentHistory '; // URL to web API
        var body = JSON.stringify(userPaymentSearchModel);
        //Fake //////////////////////////////////////////////////////////////////////////
        //let Url = '/app/mock/user-payments.json';
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        //Fake //////////////////////////////////////////////////////////////////////////
        //this.http.request(Url)
        this.http.post(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.userPaymentModel = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            //Fake filter JSON includes AccountBalanceId ////////////////////////////
            //studentMealPurchaseSearchModel.student.studentMealPurchases =
            //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
            //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
            //Comment out for fake //////////////////////////////////////////////////
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    PaymentHistoryService.prototype.getPaymentHistoryNew = function (userPaymentSearchModel, loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Get Payment History Failed';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/PaymentHistory '; // URL to web API
        var body = JSON.stringify(userPaymentSearchModel);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        //console.log("URL: ", Url)
        // console.log("Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        //,
        //  tap(data => console.log("Did we get Payment History: ", data))
        );
    };
    PaymentHistoryService.prototype.subscribeTogetPaymentHistory = function (userPaymentSearchModel, loginResponse) {
        var _this = this;
        // console.log("Subscribing to Get Payment History: ", userPaymentSearchModel)
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Get Payment History Failed';
        this.subscription$ = this.getPaymentHistoryNew(userPaymentSearchModel, loginResponse)
            .subscribe(function (data) {
            _this.userPaymentModel = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            //Fake filter JSON includes AccountBalanceId ////////////////////////////
            //studentMealPurchaseSearchModel.student.studentMealPurchases =
            //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
            //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
            //Comment out for fake //////////////////////////////////////////////////
            _this.result = true;
            //console.log("We got a userPaymentModel: ", this.userPaymentModel);
        });
    };
    PaymentHistoryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.CookieService,
            index_1.TokenService])
    ], PaymentHistoryService);
    return PaymentHistoryService;
}());
exports.PaymentHistoryService = PaymentHistoryService;
//# sourceMappingURL=payment-history.service.js.map