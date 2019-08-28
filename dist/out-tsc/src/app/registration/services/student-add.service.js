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
var StudentAddService = /** @class */ (function () {
    function StudentAddService(http, httpC, utilityService, currTokenServ, cookieService, tokenService, loginStoreSrvc) {
        this.http = http;
        this.httpC = httpC;
        this.utilityService = utilityService;
        this.currTokenServ = currTokenServ;
        this.cookieService = cookieService;
        this.tokenService = tokenService;
        this.loginStoreSrvc = loginStoreSrvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.isDeleted = false;
        this.addStudentResult = false;
        this.studentAdded$ = new core_1.EventEmitter();
    }
    StudentAddService.prototype.addStudentNew = function (studentAddDetail, loginResponse) {
        var _this = this;
        // console.log("What is LoginResponse: ", loginResponse)
        var successMessage = '';
        var failureMessage = 'Failed to add student';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/user'; // URL to web API
        var body = JSON.stringify(studentAddDetail).replace(/"\s+|\s+"/g, '"');
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        // tap(data => console.log("I think We Added a student: ", data)),
        );
    };
    StudentAddService.prototype.subscribeToAddStudentNew = function (studentAddDetail, loginResponse) {
        var _this = this;
        var loginResponseObj = loginResponse;
        var failureMessage = 'Failed To Add Student';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.addStudentNew(studentAddDetail, loginResponseObj)
            .subscribe(function (data) {
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = false;
        }, function () {
            //processing the successful response
            _this.result = true;
            _this.addStudentResult = _this.result;
            _this.studentAdded$.emit(_this.addStudentResult);
        });
    };
    StudentAddService.prototype.deleteStudentNew = function (accountBalanceId, loginResponse) {
        var _this = this;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        this.currentToken = token;
        var successMessage = '';
        var failureMessage = 'Failed To Remove Student';
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
            this.currentToken.trim();
        }
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/student/' + accountBalanceId; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //  console.log("What is the url: ", Url);
        //console.log("Jwt: ", this.currentToken);
        // console.log("What are the headers: ", options);
        return this.httpC.delete(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        // tap(data => console.log("I think We Deleted students: ", data)),
        );
    };
    StudentAddService.prototype.subscribeToDeleteStudent = function (accountBalanceId, loginResponse) {
        var _this = this;
        //console.log("What is isDelted: ", this.isDeleted);
        var loginResponseObj;
        if (this.loginStoreSrvc.cookieStateItem) {
            loginResponseObj = this.loginStoreSrvc.cookieStateItem;
        }
        else {
            loginResponseObj = loginResponse;
        }
        var resp;
        var failureMessage = 'Failed To Remove Student';
        this.deleteStudentNew(accountBalanceId, loginResponseObj)
            .subscribe(function (data) {
            resp = data;
        }, function (error) {
            console.log(" " + failureMessage + ":", resp);
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = false;
        }, function () {
            _this.result = true;
            _this.isDeleted = (_this.result) ? true : false;
            _this.loginStoreSrvc.loadLogin(_this.loginResponse);
        });
    };
    StudentAddService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    StudentAddService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            http_2.HttpClient,
            index_1.UtilityService,
            index_1.CurrentTokenService,
            index_1.CookieService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], StudentAddService);
    return StudentAddService;
}());
exports.StudentAddService = StudentAddService;
//# sourceMappingURL=student-add.service.js.map