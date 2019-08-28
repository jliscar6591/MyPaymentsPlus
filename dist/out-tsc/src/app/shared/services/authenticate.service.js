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
var utility_service_1 = require("../../shared/services/utility.service");
var login_store_service_1 = require("../../shared/services/login-store.service");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../login/model/index");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http, httpC, utilityService, loginStoreService) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        this.loginStoreService = loginStoreService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.loginResponse = new index_1.LoginResponseModel();
    }
    AuthenticationService.prototype.authenticateNew = function (loginDetail) {
        var _this = this;
        this.result = false;
        var loginUrl = app_settings_1.Constants.WebApiUrl.Auth + '/login'; // URL to web API
        var body = JSON.stringify(loginDetail);
        var headers = new http_2.HttpHeaders({ 'Content-Type': 'application/JSON' });
        var count = 0;
        var options = { headers: headers };
        var failureMessage = 'Login Failed';
        //console.log("The loginUrl: ", loginUrl)
        //console.log("Da Body: ", body)
        //console.log("Da Header: ", options)
        return this.httpC.post(loginUrl, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        // tap(data => console.log("I think we got a Login Object: ", data))
        );
    };
    AuthenticationService.prototype.subscribeToAuthenticate = function (loginDetail, loginResponse) {
        var _this = this;
        this.authenticateNew(loginDetail)
            .subscribe(function (data) {
            _this.loginResponse = data;
            //console.log("What is the data loginResponse: ", this.loginResponse)
            _this.result = true;
        }, function (error) {
            _this.loginResponse = loginResponse;
            if (error["status"]) {
                //console.log("Do we have a login Error: ", error["status"]);
                if (error["status"] != '500') {
                    _this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
                }
                else {
                    _this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
                }
            }
            else {
                _this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
            }
            _this.loginResponse.showCloseButton = true;
            _this.loginResponse.closeHtml = '<button>Close</button>';
            _this.loginResponse.messageType = app_settings_1.Constants.Error;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        }, function () {
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.message = '';
            _this.loginResponse.externalNavRequest = loginResponse.externalNavRequest;
            _this.loginResponse.cartItemCount = 0;
            // console.log("Did we get a LoginResponse: ", this.loginResponse)
        });
    };
    AuthenticationService.prototype.refreshAccessToken = function (newToken, currToken, currLoginResp) {
        this.loginResponse = currLoginResp;
        //  console.log("What is the refreshAccessToken - this.loginResp: ", this.loginResponse)
        //   console.log("Do we have a cookieStateItem: ", this.loginStoreService.cookieStateItem)
        if (this.loginResponse.cartItemCount > 0) {
            //  console.log("I got ONE: ", this.loginResponse.cartItemCount)
        }
        else {
            //console.log("WE GOT Nuttin: ", this.loginResponse.cartItemCount)
        }
        if (newToken) {
            if (currToken == newToken) {
                this.loginResponse.access_token = currToken;
            }
            else {
                this.loginResponse.access_token = newToken;
            }
        }
        this.loginStoreService.loadLogin(this.loginResponse);
        //this.loginStoreService.loadLogin(this.loginResponse);
    };
    AuthenticationService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    AuthenticationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            utility_service_1.UtilityService,
            login_store_service_1.LoginStoreService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authenticate.service.js.map