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
var index_1 = require("../../../shared/services/index");
var StudentMealPurchasesService = /** @class */ (function () {
    function StudentMealPurchasesService(http, utilityService, httpC, currTokenService, tokenService) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenService = currTokenService;
        this.tokenService = tokenService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.gotMealPurchases = new core_1.EventEmitter();
    }
    StudentMealPurchasesService.prototype.getStudentMealPurchasesNew = function (studentMealPurchaseSearchModel, loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Get Student Meal Purchases Failed';
        var token = loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenService.setCurrentToken(this.currentToken, this.loginResponse);
        // console.log("what is the studentMealPurchaseSearchModel: ", studentMealPurchaseSearchModel.student.accountBalanceId)
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/PurchaseHistory'; // URL to web API
        var body = {
            "startDate": studentMealPurchaseSearchModel.startDate.toString(),
            "endDate": studentMealPurchaseSearchModel.endDate.toString(),
            "accountBalanceId": studentMealPurchaseSearchModel.student.accountBalanceId
        };
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //console.log("The URL: ", Url)
        //console.log("Da Body: ", body)
        //console.log("Headers: ", headers);
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.utilityService.handleError(error, failureMessage, _this.loginResponse); }), operators_1.tap(function (data) { return _this.studentMealPurchaseModel = data; }));
    };
    StudentMealPurchasesService.prototype.subscribeToGetStudentMealPurchases = function (studentMealPurchaseSearchModel, loginResponse) {
        var _this = this;
        //console.log("Calling subscribeToGetStudentMealPurchases: ", studentMealPurchaseSearchModel)
        var loginResponseObj;
        var failureMessage = 'Get Student Meal Purchases Failed';
        //Ensures that we have a loginResponse . If an empty[] loginResponse is passsed then the current global one is used
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getStudentMeals$ =
            this.getStudentMealPurchasesNew(studentMealPurchaseSearchModel, loginResponseObj)
                .subscribe(function (data) {
                studentMealPurchaseSearchModel.student = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = true;
            }, function () {
                /// console.log("processing the successful response");
                //Fake filter JSON includes AccountBalanceId
                //studentMealPurchaseSearchModel.student.studentMealPurchases =
                //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
                //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
                //Comment out for fake
                _this.result = true;
                _this.gotMealPurchases.emit(_this.result);
                //this.getStudentMeals$.unsubscribe();
            });
    };
    StudentMealPurchasesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService])
    ], StudentMealPurchasesService);
    return StudentMealPurchasesService;
}());
exports.StudentMealPurchasesService = StudentMealPurchasesService;
//# sourceMappingURL=student-meal-purchases.service .js.map