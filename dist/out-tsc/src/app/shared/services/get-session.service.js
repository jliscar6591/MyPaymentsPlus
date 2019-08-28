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
var GetSessionService = /** @class */ (function () {
    function GetSessionService(http, router) {
        this.http = http;
        this.router = router;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        //Authorized flag
        this.isAuthorized = false;
    }
    GetSessionService.prototype.getSession = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Failed to process request.';
        var newJwt;
        var Url = app_settings_1.Constants.WebApiUrl.Auth + '/Session'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.result = true;
        }, function (error) {
            loginResponse = new index_1.LoginResponseModel;
            if (error["status"]) {
                switch (error["status"]) {
                    case '500':
                        loginResponse.status = error["status"];
                        var errorObject = JSON.parse(error["_body"]);
                        loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject["incidentId"];
                    default:
                        loginResponse.message = failureMessage;
                }
            }
            else {
                loginResponse.message = failureMessage;
            }
            loginResponse.showCloseButton = true;
            loginResponse.messageType = app_settings_1.Constants.Error;
            loginResponse.messageTitle = 'Message: ';
            _this.result = true;
        }, function () {
            //Clear any errors that may exist.
            //Debug mock the cart count
            loginResponse.access_token = newJwt.jwt_refresh[0];
            loginResponse.message = "";
            loginResponse.messageType = app_settings_1.Constants.Success;
            loginResponse.showCloseButton = false;
            _this.isAuthorized = true;
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    GetSessionService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            router_1.Router])
    ], GetSessionService);
    return GetSessionService;
}());
exports.GetSessionService = GetSessionService;
//# sourceMappingURL=get-session.service.js.map