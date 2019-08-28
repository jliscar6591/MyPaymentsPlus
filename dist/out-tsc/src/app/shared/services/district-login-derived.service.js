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
var router_1 = require("@angular/router");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../login/model/index");
var ngx_cookie_1 = require("ngx-cookie");
var login_store_service_1 = require("../../shared/services/login-store.service");
var DistrictLoginDerivedService = /** @class */ (function () {
    function DistrictLoginDerivedService(cookieService, router, http, loginStoreService) {
        this.cookieService = cookieService;
        this.router = router;
        this.http = http;
        this.loginStoreService = loginStoreService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    //Get the district for the current logged in user
    DistrictLoginDerivedService.prototype.deriveDistrict = function () {
        var _this = this;
        var schoolDistrict = '';
        // this.cookieService.get(Constants.AuthCookieName)
        if (this.loginStoreService.cookieStateItem) {
            //The cookie should have a fresh access token when coming from initial registration
            this.loginResponse = this.loginStoreService.cookieStateItem;
            //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
            if (this.loginResponse.access_token) {
                var subscription_1 = this.getDerivedDistrict(this.loginResponse.access_token)
                    .subscribe(function () {
                    if (_this.result == true) {
                        subscription_1.unsubscribe();
                        if (_this.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.loginStoreService.loadLogin(_this.loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                            //Navigate to login
                            var link = ['/home'];
                            _this.router.navigate(link);
                        }
                        else {
                            //schoolDistrict = this.districtName;
                            // console.log("Creating a cookie: ", this.loginResponse)
                            _this.loginStoreService.loadLogin(_this.loginResponse);
                            //   this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                        }
                    }
                    else {
                        ++_this.count;
                    }
                });
            }
            else {
                //No cookie no response model so we make one
                this.loginResponse.messageType = app_settings_1.Constants.Error;
                this.loginResponse.message = 'Your session has timed out. Please sign in.';
                //console.log("Creating a cookie: ", this.loginResponse)
                this.loginStoreService.loadLogin(this.loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                //Navigate to login
                var link = ['/home'];
                this.router.navigate(link);
            }
        }
        else {
            this.loginResponse = new index_1.LoginResponseModel;
            this.loginResponse.messageType = app_settings_1.Constants.Error;
            this.loginResponse.message = 'Your session has timed out. Please sign in.';
            // console.log("Creating a cookie: ", this.loginResponse)
            this.loginStoreService.loadLogin(this.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            //Navigate to login
            var link = ['/home'];
            this.router.navigate(link);
        }
    };
    DistrictLoginDerivedService.prototype.getDerivedDistrict = function (token) {
        var _this = this;
        //Get session
        var newJwt;
        this.loginResponse = new index_1.LoginResponseModel;
        var successMessage = '';
        var failureMessage = 'Failed to process request.';
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/District'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            _this.districtName = data.json();
            newJwt = data.headers.toJSON();
        }, function (error) {
            if (error["status"]) {
                switch (error["status"]) {
                    case '500':
                        _this.loginResponse.status = error["status"];
                        var errorObject = JSON.parse(error["_body"]);
                        _this.loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject["incidentId"];
                    default:
                        _this.loginResponse.message = failureMessage;
                }
            }
            else {
                _this.loginResponse.message = failureMessage;
            }
            _this.loginResponse.access_token = token;
            _this.loginResponse.showCloseButton = true;
            _this.loginResponse.messageType = app_settings_1.Constants.Error;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        }, function () {
            //processing the successful response
            //  this.loginResponse.access_token = newJwt.jwt_refresh[0];               
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    DistrictLoginDerivedService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ngx_cookie_1.CookieService,
            router_1.Router,
            http_1.Http,
            login_store_service_1.LoginStoreService])
    ], DistrictLoginDerivedService);
    return DistrictLoginDerivedService;
}());
exports.DistrictLoginDerivedService = DistrictLoginDerivedService;
//# sourceMappingURL=district-login-derived.service.js.map