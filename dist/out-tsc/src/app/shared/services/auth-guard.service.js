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
var router_1 = require("@angular/router");
require("rxjs/add/observable/interval");
var http_1 = require("@angular/common/http");
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../login/model/index");
var login_store_service_1 = require("../../shared/services/login-store.service");
var token_service_1 = require("../../shared/services/token.service");
var current_token_service_1 = require("../../shared/services/current-token.service");
exports.browserRefresh = false;
var AuthGuardService = /** @class */ (function () {
    function AuthGuardService(router, loginStoreSrvc, httpC, tokenService, currentTokenService) {
        this.router = router;
        this.loginStoreSrvc = loginStoreSrvc;
        this.httpC = httpC;
        this.tokenService = tokenService;
        this.currentTokenService = currentTokenService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    AuthGuardService.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    AuthGuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        //  console.log("Calling Can Activate: ", route)
        var grantAccess = true;
        // let nonCookie: any = this.loginStoreSrvc.cookieStateItem;
        // console.log("Do we have the nonCookie: ", this.loginStoreSrvc.cookieStateItem)
        if (this.loginStoreSrvc.cookieStateItem) {
            // if (this.cookieService.get(Constants.AuthCookieName)) {
            //The cookie should have a fresh access token when coming from initial registration
            this.loginResponse = this.loginStoreSrvc.cookieStateItem;
            //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
            //console.log("What is the Response from the Non-cookie: ", this.loginResponse);
            //Testing
            //this.loginResponse.access_token = 'MessedUpToken'
            if (this.loginResponse.access_token) {
                // let subscription = this.getSession(this.loginResponse)
                this.subscribeToGetSession(this.loginResponse);
                // .subscribe(() => {
                if (this.result == true) {
                    // subscription.unsubscribe();
                    if (this.loginResponse.messageType === app_settings_1.Constants.Error) {
                        //Override specific error message from service
                        this.loginResponse.message = 'Your session has timed out. Please sign in.';
                        //The cookie is read by the home page and an error is 
                        //in loginResponse.message is shown
                        //   this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                        this.loginStoreSrvc.loadLogin(this.loginResponse);
                        grantAccess = false;
                        //Navigate to login
                        var link = ['/welcome'];
                        this.router.navigate(link);
                    }
                    else {
                        grantAccess = true;
                        this.loginStoreSrvc.loadLogin(this.loginResponse);
                        //this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                    }
                }
                else {
                    ++this.count;
                }
                // });
            }
            else {
                //No cookie no response model so we make one
                this.loginResponse.messageType = app_settings_1.Constants.Error;
                this.loginResponse.message = 'Your session has timed out. Please sign in.';
                //  this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                this.loginStoreSrvc.loadLogin(this.loginResponse);
                grantAccess = false;
                var link = ['/welcome'];
                this.router.navigate(link);
            }
        }
        else {
            this.loginResponse = new index_1.LoginResponseModel;
            this.loginResponse.messageType = app_settings_1.Constants.Error;
            this.loginResponse.message = 'Your session has timed out. Please sign in.';
            this.subscription = this.router.events.subscribe(function (event) {
                if (event instanceof router_1.NavigationStart) {
                    exports.browserRefresh = !_this.router.navigated;
                }
                if (exports.browserRefresh == true) {
                    var data = sessionStorage.getItem(app_settings_1.Constants.AuthCookieName);
                    var retrievedCookie = JSON.parse(data);
                    // console.log("Did we turn it back to JSON: ", retrievedCookie)
                    _this.loginStoreSrvc.loadLogin(retrievedCookie);
                    _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                    // console.log("Do we  have a store-cookie: ", this.loginResponse)
                    grantAccess = true;
                    exports.browserRefresh = false;
                    _this.loginStoreSrvc.didBrowserRefresh = true;
                    _this.subscription.unsubscribe();
                    var link = ['/dashboard'];
                    _this.router.navigate(link);
                }
                else {
                    grantAccess = false;
                    var link = ['/welcome'];
                    _this.router.navigate(link);
                }
            });
        }
        return grantAccess;
    };
    AuthGuardService.prototype.getSessionNew = function (loginResponse) {
        //console.log("Calling getSessionNew: ", loginResponse)
        //console.log("GetSessoin nonCookie: ", this.loginStoreSrvc.cookieStateItem)
        //let successMessage: string = '';
        //let failureMessage: string = 'Failed to process request.';
        //let newJwt: any;
        var token = loginResponse.access_token;
        // console.log("What is the token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/Session'; // URL to web API
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(
        //tap(data => console.log("I think we got Session: ", data))
        );
    };
    AuthGuardService.prototype.subscribeToGetSession = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Failed to process request.';
        this.getSessionNew(loginResponse)
            .subscribe(function (data) {
            _this.result = true;
        }, function (error) {
            loginResponse = new index_1.LoginResponseModel;
            if (error["status"]) {
                switch (error["status"]) {
                    case '500':
                        loginResponse.status = error["status"];
                        var errorObject = JSON.parse(error["_body"]);
                        loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject["incidentId"];
                    default:
                        loginResponse.message = failureMessage;
                }
            }
            else {
                loginResponse.message = failureMessage;
            }
            loginResponse.showCloseButton = true;
            loginResponse.messageType = app_settings_1.Constants.Error;
            loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        }, function () {
            //Clear any errors that may exist.
            //Debug mock the cart count
            loginResponse.message = "";
            loginResponse.messageType = app_settings_1.Constants.Success;
            loginResponse.showCloseButton = false;
            _this.result = true;
        });
    };
    AuthGuardService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router,
            login_store_service_1.LoginStoreService,
            http_1.HttpClient,
            token_service_1.TokenService,
            current_token_service_1.CurrentTokenService])
    ], AuthGuardService);
    return AuthGuardService;
}());
exports.AuthGuardService = AuthGuardService;
//# sourceMappingURL=auth-guard.service.js.map