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
var UserContextService = /** @class */ (function () {
    function UserContextService(cookieService, utilityService, http, HttpC, currTokenServ, tokenService, loginStoreSrvc) {
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.http = http;
        this.HttpC = HttpC;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSrvc = loginStoreSrvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.newTokenResults = false;
        this.gotNewUserContext$ = new core_1.EventEmitter();
    }
    //Get the default district  and state for the current logged in user
    UserContextService.prototype.deriveDefaults = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Failed to get deriveDefaults';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            _this.defaultData = data.json();
            newJwt = data.headers.toJSON();
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            loginResponse.access_token = newJwt.jwt_refresh[0];
            //test
            //loginResponse.isBlockACH = true;
            //this.defaultData.isFroEnabled = false;
            //
            loginResponse.allPaymentsResumeDate = _this.defaultData.allPaymentsResumeDate; //add
            loginResponse.allPaymentsSuspended = _this.defaultData.allPaymentsSuspended; //add
            loginResponse.cartItemCount = _this.defaultData.cartItemCount;
            loginResponse.districtKey = _this.defaultData.districtKey;
            loginResponse.districtName = _this.defaultData.districtName; //add
            loginResponse.expires_in = _this.defaultData.expires_in; //add
            loginResponse.firstName = _this.defaultData.firstName; //add
            loginResponse.incidentId = _this.defaultData.incidentId; //add
            loginResponse.isAchAllowed = _this.defaultData.isAchAllowed;
            loginResponse.isAlertsAllowedDistrict = _this.defaultData.isAlertsAllowedDistrict;
            loginResponse.isAutoPayEnabled = _this.defaultData.isAutoPayEnabled;
            loginResponse.isBlockACH = _this.defaultData.isBlockACH;
            loginResponse.isBlockPayments = _this.defaultData.isBlockPayments;
            loginResponse.isDisableMealPaymentsDistrict = _this.defaultData.isDisableMealPaymentsDistrict;
            loginResponse.isNewExperience = _this.defaultData.isNewExperience;
            loginResponse.lastName = _this.defaultData.lastName;
            loginResponse.mealPaymentsResumeDate = _this.defaultData.mealPaymentsResumeDate; //add
            loginResponse.mealPaymentsSuspended = _this.defaultData.mealPaymentsSuspended; //add
            loginResponse.requiresRelationship = _this.defaultData.requiresRelationship; //add
            loginResponse.requiresStudent = _this.defaultData.requiresStudent; //add
            loginResponse.state = _this.defaultData.state;
            loginResponse.isFroEnabled = _this.defaultData.isFroEnabled;
            loginResponse.isOldExperienceAllowed = _this.defaultData.isOldExperienceAllowed;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    UserContextService.prototype.deriveDefaultsNew = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Failed to get deriveDefaults';
        var token = loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        // console.log("The URL: ", Url)
        //  console.log("the options: ", options)
        return this.HttpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); })
        // ,
        //  tap(data => console.log("Called By subscribeToGetDeriveDefaults: ", data))
        );
    };
    UserContextService.prototype.subscribeToGetDeriveDefaultsNew = function (loginResponse) {
        var _this = this;
        //console.log("subscribeToGetDeriveDefaultsNew")
        var failureMessage = 'Failed to get deriveDefaults';
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.deriveDefaultsNew(loginResponseObj)
            .subscribe(function (data) {
            _this.defaultData = data;
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response      
            loginResponse.allPaymentsResumeDate = _this.defaultData.allPaymentsResumeDate; //add
            loginResponse.allPaymentsSuspended = _this.defaultData.allPaymentsSuspended; //add
            //console.log('cartitemCount', this.defaultData.cartItemCount);
            loginResponse.cartItemCount = _this.defaultData.cartItemCount;
            loginResponse.districtKey = _this.defaultData.districtKey;
            loginResponse.districtName = _this.defaultData.districtName; //add
            loginResponse.expires_in = _this.defaultData.expires_in; //add
            loginResponse.firstName = _this.defaultData.firstName; //add
            loginResponse.incidentId = _this.defaultData.incidentId; //add
            loginResponse.isAchAllowed = _this.defaultData.isAchAllowed;
            loginResponse.isAlertsAllowedDistrict = _this.defaultData.isAlertsAllowedDistrict;
            loginResponse.isAutoPayEnabled = _this.defaultData.isAutoPayEnabled;
            loginResponse.isBlockACH = _this.defaultData.isBlockACH;
            loginResponse.isBlockPayments = _this.defaultData.isBlockPayments;
            loginResponse.isDisableMealPaymentsDistrict = _this.defaultData.isDisableMealPaymentsDistrict;
            loginResponse.isNewExperience = _this.defaultData.isNewExperience;
            loginResponse.lastName = _this.defaultData.lastName;
            loginResponse.mealPaymentsResumeDate = _this.defaultData.mealPaymentsResumeDate; //add
            loginResponse.mealPaymentsSuspended = _this.defaultData.mealPaymentsSuspended; //add
            loginResponse.requiresRelationship = _this.defaultData.requiresRelationship; //add
            loginResponse.requiresStudent = _this.defaultData.requiresStudent; //add
            loginResponse.state = _this.defaultData.state;
            loginResponse.isFroEnabled = _this.defaultData.isFroEnabled;
            loginResponse.isOldExperienceAllowed = _this.defaultData.isOldExperienceAllowed;
        });
    };
    UserContextService.prototype.postNewUserContext = function (districtKey, loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Failed to get deriveDefaults';
        var token = loginResponse.access_token;
        // console.log("postNewUserContext loginResponse: ", this.loginResponse)
        this.currentToken = this.tokenService.getCurrentToken(token);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/UserContext/' + districtKey;
        var body = [{}];
        // JSON.stringify(cartItemDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //Used to inspect whats being sent to the api call while troubleshooting
        //console.log("The Url: ", Url);
        //console.log("Da Body: ", body)
        //console.log("Options: ", options)
        return this.HttpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, _this.loginResponse, failureMessage); })
        //  ,
        //  tap((data:any)=> console.log("We got New UserContext: ", data))
        );
    };
    UserContextService.prototype.subscribeToPostNewUserContext = function (districtObj, loginResponse) {
        var _this = this;
        // console.log("calling subscribeToPostNewUserContext: ", districtObj)
        var districtKey = districtObj[0].districtKey;
        // console.log("What is the loginResponse: ", loginResponse)
        var failureMessage = 'Failed to get New User Credentials';
        var loginModelObj;
        this.postNewUserContext(districtKey, loginResponse)
            .subscribe(function (data) {
            // this.newLoginResponse = data;
            loginModelObj = data.apiUserContext;
            // console.log("did we get a loginModelObj: ", loginModelObj)
            _this.newToken = data.jwt;
            _this.newTokenResults = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.newTokenResults = true;
        }, function () {
            loginResponse.access_token = _this.newToken;
            loginResponse.allPaymentsResumeDate = loginModelObj.allPaymentsResumeDate; //add
            loginResponse.allPaymentsSuspended = loginModelObj.allPaymentsSuspended; //add
            loginResponse.cartItemCount = loginModelObj.cartItemCount;
            loginResponse.districtKey = loginModelObj.districtKey;
            loginResponse.districtName = loginModelObj.districtName; //add
            loginResponse.expires_in = loginModelObj.expires_in; //add
            loginResponse.firstName = loginModelObj.firstName; //add
            loginResponse.incidentId = loginModelObj.incidentId; //add
            loginResponse.isAchAllowed = loginModelObj.isAchAllowed;
            loginResponse.isAlertsAllowedDistrict = loginModelObj.isAlertsAllowedDistrict;
            loginResponse.isAutoPayEnabled = loginModelObj.isAutoPayEnabled;
            loginResponse.isBlockACH = loginModelObj.isBlockACH;
            loginResponse.isBlockPayments = loginModelObj.isBlockPayments;
            loginResponse.isDisableMealPaymentsDistrict = loginModelObj.isDisableMealPaymentsDistrict;
            loginResponse.isNewExperience = loginModelObj.isNewExperience;
            loginResponse.lastName = loginModelObj.lastName;
            loginResponse.mealPaymentsResumeDate = loginModelObj.mealPaymentsResumeDate; //add
            loginResponse.mealPaymentsSuspended = loginModelObj.mealPaymentsSuspended; //add
            loginResponse.requiresRelationship = loginModelObj.requiresRelationship; //add
            loginResponse.requiresStudent = loginModelObj.requiresStudent; //add
            loginResponse.state = loginModelObj.state;
            loginResponse.isFroEnabled = loginModelObj.isFroEnabled;
            loginResponse.isOldExperienceAllowed = loginModelObj.isOldExperienceAllowed;
            _this.newLoginResponse = loginResponse;
            // console.log("We got a New LoginResponse: ", this.newLoginResponse)
            //console.log("What is the New UserContext LoginResponse: ", this.loginResponse);
            //console.log("Do we have default Data: ", this.defaultData);
            var testDefaultData = _this.defaultData;
            if (testDefaultData) {
                //  console.log("The testDefaultDate: ", testDefaultData)
                testDefaultData.districtKey = _this.newLoginResponse.districtKey;
                testDefaultData.districtName = _this.newLoginResponse.districtName;
                _this.loginStoreSrvc.createLoginObj(testDefaultData, _this.newLoginResponse);
            }
            // console.log("Creating a cookie: ", this.newLoginResponse)
            _this.loginStoreSrvc.loadLogin(_this.newLoginResponse);
            _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
            _this.callUserCntxtCnt = 0;
            //Tells app we got a new token now call api's using the new Token
            _this.gotNewUserContext$.emit(_this.newTokenResults);
        });
    };
    UserContextService.prototype.handleError = function (error, failureMessage) {
        //console.log("R we handling an error: ", error)
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        // console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    UserContextService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.CookieService,
            index_1.UtilityService,
            http_1.Http,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], UserContextService);
    return UserContextService;
}());
exports.UserContextService = UserContextService;
//# sourceMappingURL=user-context.service.js.map