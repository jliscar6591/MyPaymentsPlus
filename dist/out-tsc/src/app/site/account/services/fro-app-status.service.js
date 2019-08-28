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
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var index_2 = require("../../../shared/services/index");
var FroAppStatusService = /** @class */ (function () {
    function FroAppStatusService(cookieService, router, utilityService, http) {
        this.cookieService = cookieService;
        this.router = router;
        this.utilityService = utilityService;
        this.http = http;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    //Get the default district  and state for the current logged in user
    FroAppStatusService.prototype.getStatus = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var newJwt;
        var token = loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Failed to get get status';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/FroStatus'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            //this.http.get('src/app/mock/fro-app-status.json')
            .subscribe(function (data) {
            _this.froAppStatus = data.json();
            newJwt = data.headers.toJSON();
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            loginResponse.access_token = newJwt.jwt_refresh[0];
            //console.log(this.froAppStatus)
        });
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    FroAppStatusService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.CookieService,
            router_1.Router,
            index_2.UtilityService,
            http_1.Http])
    ], FroAppStatusService);
    return FroAppStatusService;
}());
exports.FroAppStatusService = FroAppStatusService;
//# sourceMappingURL=fro-app-status.service.js.map