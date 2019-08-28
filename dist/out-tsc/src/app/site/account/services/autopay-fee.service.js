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
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var AutopayFeeService = /** @class */ (function () {
    function AutopayFeeService(http, utilityService, httpC, currTokenServ, tokenService, loginStoreSrvc) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSrvc = loginStoreSrvc;
        //True when http call returns
        this.result = false;
    }
    AutopayFeeService.prototype.getAutoPayFee = function (loginResponse) {
        var _this = this;
        var failureMessage = 'Failed to get Auto Pay Details';
        this.loginResponse = loginResponse;
        var token = '';
        token = this.loginResponse.access_token;
        // console.log("What is the getPaymentMethodsNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.result = false;
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/RatePlan'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        //tap(data => console.log("Called By subscribetoGetAutoPayfee: ", data))
        );
    };
    AutopayFeeService.prototype.subscribetoGetAutoPayFee = function (loginResponse) {
        var _this = this;
        var failureMessage = 'Failed to get fee';
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getAutoPayFee(loginResponseObj)
            .subscribe(function (data) {
            _this.autopayRate = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
            _this.result = true;
        }, function () {
            //console.log('is this being called for auto pay rate');
        });
    };
    AutopayFeeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], AutopayFeeService);
    return AutopayFeeService;
}());
exports.AutopayFeeService = AutopayFeeService;
//# sourceMappingURL=autopay-fee.service.js.map