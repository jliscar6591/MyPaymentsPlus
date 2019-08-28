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
var ProfileUserprofileService = /** @class */ (function () {
    function ProfileUserprofileService(http, httpC, utilityService, tokenService, currTokenServ) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        this.tokenService = tokenService;
        this.currTokenServ = currTokenServ;
        //Contains district list
        this.profileUserprofileGetModel = {
            "firstName": "",
            "lastName": "",
            "email": "",
            "districtName": "",
            "emailUpdates": false,
            "isParent": false,
            "isStudent": false,
            "isStaff": false,
            "isGuest": false
        };
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    ProfileUserprofileService.prototype.getUserprofileNew = function (loginResponse, failureMessage) {
        var _this = this;
        // let failureMessage: string = 'Get User Profile Failed';
        this.loginResponse = loginResponse;
        // console.log("the login Response: ", this.loginResponse);
        var token = this.loginResponse.access_token;
        // console.log("What is the getPaymentMethodsNew token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/UserProfile'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        //tap(data => console.log("I think we got a Profile: ", data))
        );
    };
    ProfileUserprofileService.prototype.subscribeToGetUserProfile = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        var failureMessage = 'Get User Profile Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getProfileUser$ = this.getUserprofileNew(loginResponseObj, failureMessage)
            .subscribe(function (data) {
            _this.profileUserprofileGetModel = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.result = true;
            _this.gotProfile$ = new rxjs_1.Observable(function (observer) {
                observer.next(true);
                observer.complete();
            });
            _this.gotProfile$.pipe(operators_1.first(function (data) { return data == true; }));
            // this.getProfileUser$.unsubscribe();
        });
    };
    ProfileUserprofileService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.UtilityService,
            index_1.TokenService,
            index_1.CurrentTokenService])
    ], ProfileUserprofileService);
    return ProfileUserprofileService;
}());
exports.ProfileUserprofileService = ProfileUserprofileService;
//# sourceMappingURL=profile-user-profile.service.js.map