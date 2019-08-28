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
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var store_1 = require("@ngrx/store");
var MealStoreActions = require("../../shared/store/actions/mealStore.actions");
var StudentMealsServiceRemote = /** @class */ (function () {
    function StudentMealsServiceRemote(utilityService, httpC, currTokenServ, tokenService, loginStoreSvc, store) {
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.weGotStudents = new core_1.EventEmitter();
        this.listReady = false;
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    StudentMealsServiceRemote.prototype.getRemoteStudentMeals = function (loginResponse) {
        //console.log("Calling Student Remote: ", loginResponse);
        //console.log("Calling Student Remote Access: ", loginResponse.access_token);
        //console.log("Do we have a loginStore val: ", this.loginStoreSvc.cookieStateItem)
        var _this = this;
        var token;
        //  let tempLoginResponse: LoginResponseModel;
        if (this.loginStoreSvc.cookieStateItem) {
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
            token = this.loginResponse.access_token;
        }
        else {
            this.loginResponse = loginResponse;
            token = this.loginResponse.access_token;
        }
        // console.log("getRemoteStudentMeals After access_Token added: ", this.loginResponse)
        //  console.log("What is the getRemoteStudentMeals token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        //  console.log("CurrentToken After getRemoteStudentMeals tokenService: ", this.currentToken);
        var failureMessage = 'Get Student Meals Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        //console.log("Login Response before APICall: ", this.loginResponse)
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/CafeteriaAccounts/GetRemote'; // URL to web API
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        //console.log("Url: ", Url);
        //console.log("Options: ", options);
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); }), operators_1.tap(function (data) { return _this.studentMeals = data; }));
    };
    StudentMealsServiceRemote.prototype.subscribeToGetMeals = function (loginResponse) {
        var _this = this;
        //console.log("subscribeToGetMeals: ", loginResponse)
        this.isStudentsRemoteGetting = true;
        if (this.loginStoreSvc.cookieStateItem) {
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
        }
        else {
            this.loginResponse = loginResponse;
            //this.loginResponse;
        }
        // console.log("What is the getMeals loginResponseObj: ", this.loginResponse)
        this.studentMealsSub$ =
            this.getRemoteStudentMeals(this.loginResponse)
                .subscribe(function (data) {
                //  console.log("Returned Data: ", data)
                _this.studentMeals = data;
                _this.result = true;
            }, function (error) {
                console.log("Error: No Meals: ", _this.studentMeals);
                _this.result = false;
            }, function () {
                if (_this.utilityService.posCommError) {
                    //  console.log("We got a commError: ", this.loginResponse)
                    _this.getMealsErr = _this.utilityService.posCommError;
                    //  console.log("What is getMealsErr: ", this.getMealsErr)
                }
                //console.log("Did we get Meals: ", this.studentMeals);
                if (_this.result == false) {
                    _this.isStudentsRemoteGetting = false;
                }
                else {
                    _this.weGotStudents.emit(true);
                    //console.log("WeGotStudents: ", this.studentMeals);
                    _this.isStudentsRemoteGetting = _this.studentMeals.length > 0;
                    _this.loginStoreSvc.loadLogin(_this.loginResponse);
                    var tempMeals = _this.studentMeals;
                    //  console.log("What is tempMeals: ", tempMeals)
                    _this.store.dispatch(new MealStoreActions.ClearMeals());
                    _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
                    // console.log("Calling this.formCompleted ")
                    _this.formCompleted = new rxjs_1.Observable(function (observer) {
                        observer.next(true);
                        observer.complete();
                    });
                    _this.formCompleted.pipe(operators_1.first(function (data) { return data == true; }));
                }
                _this.studentMealsSub$.unsubscribe();
            });
        return this.studentMeals;
    };
    StudentMealsServiceRemote.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    StudentMealsServiceRemote = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.UtilityService,
            http_1.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService,
            store_1.Store])
    ], StudentMealsServiceRemote);
    return StudentMealsServiceRemote;
}());
exports.StudentMealsServiceRemote = StudentMealsServiceRemote;
//# sourceMappingURL=student-meals.service-remote.js.map