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
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var FormsService = /** @class */ (function () {
    function FormsService(utilityService, httpC, currTokenServ, loginStoreSvc, cookieService) {
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.loginStoreSvc = loginStoreSvc;
        this.cookieService = cookieService;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    FormsService.prototype.getForm = function (loginResponse, formId, studentKey) {
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
        var failureMessage = 'Get Form Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/Form/' + formId + '/' + studentKey;
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        //tap(data => console.log("form response: ", data))
        );
    };
    ;
    FormsService.prototype.subscribeToGetForm = function (loginResponse, formId, studentKey) {
        var _this = this;
        this.newForms = [];
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getForm(loginResponseObj, formId, studentKey)
            .subscribe(function (data) {
            _this.form = data;
            _this.result = true;
        }, function (error) {
            //  console.log("Error: No Fees: ", this.feesList)
            _this.result = false;
        }, function () {
            if (_this.result == false) {
            }
            else {
            }
            _this.newForms.push(_this.form);
            _this.result = true;
        });
        return this.form;
    };
    FormsService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    FormsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [index_1.UtilityService,
            http_1.HttpClient,
            index_1.CurrentTokenService,
            index_1.LoginStoreService,
            index_1.CookieService])
    ], FormsService);
    return FormsService;
}());
exports.FormsService = FormsService;
//# sourceMappingURL=forms.service.js.map