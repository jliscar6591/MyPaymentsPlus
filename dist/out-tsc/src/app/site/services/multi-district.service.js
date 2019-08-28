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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/map");
var operators_1 = require("rxjs/operators");
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var MultiDistrictService = /** @class */ (function () {
    function MultiDistrictService(http, httpC, currTokenServ, utilityService) {
        this.http = http;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.utilityService = utilityService;
        this.result = false;
        this.destroy$ = new Subject_1.Subject();
        this.upDatePaymentMethod$ = new core_1.EventEmitter();
        this.shouldUpdate = false;
        this.updateAutoPay = false;
        this.autoPayCounter = 0;
        this.didSwitchDistrict = new core_1.EventEmitter();
        this.multiDistrictRefreshCntr = 0;
    }
    MultiDistrictService.prototype.refreshDistrict = function (districtObj, loginResponse) {
        this.getNewDistrictData();
    };
    MultiDistrictService.prototype.getNewDistrictData = function () {
        console.log("Calling Get New District");
        return this.newDistrictSelected = true;
    };
    MultiDistrictService.prototype.getDistricts = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var successMessage = '';
        var failureMessage = 'Failed to get Available Districts';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        // tap(data => console.log("I think we got students: ", data))
        );
    };
    MultiDistrictService.prototype.subscribeToGetDistricts = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        // console.log("What is destroy$: ", this.destroy$)
        if (this.destroy$.closed == false) {
            this.getDistricts(loginResponseObj)
                .takeUntil(this.destroy$)
                .subscribe(function (data) {
                _this.userData = data;
                _this.result = true;
            }, function (error) {
                console.log("Error: No Districts Found");
                _this.result = false;
            }, function () {
                if (_this.result == true) {
                    // console.log("What do you want to do with this Context: ", this.userData.availableDistricts);
                    // this.districtItem = this.userData.availableDistricts;
                    _this.districList = _this.userData.availableDistricts;
                    _this.isMultiDistrict(_this.districList);
                    _this.originalToken = _this.loginResponse.access_token;
                    // console.log("Do we have the original token here: ", this.originalToken);
                    _this.destroy$.next(true);
                    _this.destroy$.unsubscribe();
                }
            });
        }
        //this.districList = [];
        return this.districList;
    };
    MultiDistrictService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    MultiDistrictService.prototype.isMultiDistrict = function (districtList) {
        //console.log("What is the districtObjLength: ", districtList.length);
        if (districtList.length > 1) {
            this.multiDistrictFlag = true;
        }
        else {
            //console.log("I amNOT multiddistrict");
            this.multiDistrictFlag = false;
            //For Development only
            //this.multiDistrictFlag = true;
        }
        return this.multiDistrictFlag;
    };
    /*This service will be used to notify components when there has been a userContext change
    * Which will require the component to update itsself with the new selected district values
    * */
    MultiDistrictService.prototype.paymentMethodsUpdate = function () {
        //console.log("Payment Methods Need Updatin")
        this.shouldUpdate = true;
        this.updateAutoPay = true;
        this.upDatePaymentMethod$.emit(this.shouldUpdate);
    };
    MultiDistrictService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.UtilityService])
    ], MultiDistrictService);
    return MultiDistrictService;
}());
exports.MultiDistrictService = MultiDistrictService;
//# sourceMappingURL=multi-district.service.js.map