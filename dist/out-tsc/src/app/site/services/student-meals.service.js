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
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var suspend_payment_warning_service_1 = require("../../shared/components/suspend-payment-warning/suspend-payment-warning.service");
var store_1 = require("@ngrx/store");
var MealStoreActions = require("../../shared/store/actions/mealStore.actions");
var StudentMealsService = /** @class */ (function () {
    function StudentMealsService(http, utilityService, httpC, currTokenServ, cookieService, suspendPaymentWarningService, tokenService, validateCookieService, store, state, loginStoreSvc) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.cookieService = cookieService;
        this.suspendPaymentWarningService = suspendPaymentWarningService;
        this.tokenService = tokenService;
        this.validateCookieService = validateCookieService;
        this.store = store;
        this.state = state;
        this.loginStoreSvc = loginStoreSvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.weGotStudents = new core_1.EventEmitter();
        this.needGetStudents = new core_1.EventEmitter();
        this.listReady = false;
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    StudentMealsService.prototype.getStudentMealsNew = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        // console.log("Login Response B4 TokenService: ", this.loginResponse)
        var token = this.loginResponse.access_token;
        // console.log("What is the token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        // console.log("CurrentToken After tokenService: ", this.currentToken);
        var successMessage = '';
        var failureMessage = 'Get Student Meals Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/CafeteriaAccounts'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        // console.log("Url: ", Url);
        // console.log("Options: ", options);
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        //  tap(data => console.log("I think we got students: ", data))
        );
    };
    StudentMealsService.prototype.subscribeToGetMeals = function (loginResponse) {
        var _this = this;
        //  console.log("subscribeToGetMeals:  ", this.loginStoreSvc.cookieStateItem)
        var newMealsList;
        var loginResponseObj;
        this.isStudentsGetting = true;
        var accountsWCrtAmtList = [];
        if (this.loginStoreSvc.cookieStateItem) {
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
        }
        else {
            this.loginResponse = loginResponse;
        }
        // console.log("B4 getStudentMealsNew: ", this.loginResponse)
        this.getStudentMealsNew(this.loginResponse)
            .subscribe(function (data) {
            _this.studentMeals = data;
            _this.result = true;
        }, function (error) {
            console.log("Error: No Meals: ", _this.studentMeals);
            _this.result = false;
        }, function () {
            // console.log("The result: ", this.result)
            if (_this.result == false) {
                _this.isStudentsGetting = false;
                _this.getStudentErr = true;
                _this.getStudentErrMsg = _this.loginResponse.message;
            }
            else {
                _this.weGotStudents.emit(true);
                _this.needGetStudents.emit(true);
                _this.studentMeals = _this.formatStudentMeals(_this.studentMeals);
                _this.listReady = true;
                _this.isStudents = _this.studentMeals.length > 0;
                //  console.log("Creating a cookie: ", this.loginResponse)
                _this.loginStoreSvc.loadLogin(_this.loginResponse);
                var tempMeals = _this.studentMeals;
                // console.log("Student Meals Refreshing Store: ", tempMeals)
                _this.store.dispatch(new MealStoreActions.ClearMeals());
                _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
            }
        });
        return this.studentMeals;
    };
    StudentMealsService.prototype.getSuspendPayment = function () {
        var issupended;
        var warning = false;
        var warningMsg = '';
        if (this.loginResponse.isBlockPayments) {
            warningMsg += "Payments are disabled for this account.";
            warning = true;
        }
        else if (this.loginResponse.allPaymentsSuspended) {
            warningMsg += "All payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate + '.';
            warning = true;
        }
        else if (this.loginResponse.mealPaymentsSuspended) {
            warningMsg += "Meal payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate + '.';
            warning = true;
        }
        else if (this.loginResponse.isDisableMealPaymentsDistrict) {
            warningMsg += 'Meal payments are disabled at your district.';
            warning = true;
        }
        issupended = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
        return issupended;
    };
    StudentMealsService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    //Converts list to an array
    StudentMealsService.prototype.formatStudentMeals = function (studentMeals) {
        var studentMealsList = [];
        var accountBal;
        for (var i = 0; i < studentMeals.length; i++) {
            var testKey = Object.keys(studentMeals[0]);
            var b = Object.keys(studentMeals).map(function (e) { return { accounts: studentMeals[e] }; });
            studentMealsList.push(b[i].accounts);
        }
        return studentMealsList;
    };
    StudentMealsService.prototype.setStudentMeals = function (studentlist) {
        this.studentMeals = studentlist;
    };
    StudentMealsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.CookieService,
            suspend_payment_warning_service_1.SuspendPaymentWarningService,
            index_1.TokenService,
            index_1.ValidateCookieService,
            store_1.Store,
            store_1.State,
            index_1.LoginStoreService])
    ], StudentMealsService);
    return StudentMealsService;
}());
exports.StudentMealsService = StudentMealsService;
//# sourceMappingURL=student-meals.service.js.map