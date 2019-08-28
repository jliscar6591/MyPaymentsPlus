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
var StudentListService = /** @class */ (function () {
    function StudentListService(http, utilityService, httpC, currTokenServ, cookieService, tokenService, loginStoreSrvc) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.cookieService = cookieService;
        this.tokenService = tokenService;
        this.loginStoreSrvc = loginStoreSrvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.gotStudentList = new core_1.EventEmitter();
    }
    StudentListService.prototype.getStudentsNew = function (loginResponse) {
        var _this = this;
        // console.log("Calling getStudentsNew: ", loginResponse)
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = '';
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/Student'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        // tap(data => console.log("I think we got students: ", data))
        );
    };
    StudentListService.prototype.subscribeToGetStudentsNew = function (loginResponse) {
        var _this = this;
        //  console.log("Does subscribeToGetStudentsNew Have: ", this.loginStoreSrvc.cookieStateItem);
        var loginResponseObj;
        var failureMessage = 'No Students to Manage';
        if (this.loginStoreSrvc.cookieStateItem) {
            loginResponseObj = this.loginStoreSrvc.cookieStateItem;
        }
        else {
            loginResponseObj = loginResponse;
        }
        this.getStudentsNew(loginResponseObj)
            .subscribe(function (data) {
            _this.students = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            _this.result = true;
            _this.gotStudentList.emit(_this.result);
        });
    };
    StudentListService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    StudentListService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.CookieService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], StudentListService);
    return StudentListService;
}());
exports.StudentListService = StudentListService;
//# sourceMappingURL=student-list.service.js.map