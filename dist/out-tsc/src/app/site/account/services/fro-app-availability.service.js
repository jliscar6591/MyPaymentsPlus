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
var FroAppAvailabilityService = /** @class */ (function () {
    function FroAppAvailabilityService(cookieService, router, utilityService, http) {
        this.cookieService = cookieService;
        this.router = router;
        this.utilityService = utilityService;
        this.http = http;
        this.froAppAvailability = {
            "appBlackoutBegins": "", "appBlackoutEnds": "", "buttonDates": "", "isAppAvailable": false, "userId": ""
        };
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    //Get the default district  and state for the current logged in user
    FroAppAvailabilityService.prototype.getAppAvailability = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var newJwt;
        var token = loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Failed to get get availibility';
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/FroAvailability'; // URL to web API
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(Url, options)
            .subscribe(function (data) {
            _this.froAppAvailability = data.json();
            newJwt = data.headers.toJSON();
            _this.result = true;
            //console.log(this.froAppAvailability)
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.result = true;
            console.log(error);
        }, function () {
            //processing the successful response
            loginResponse.access_token = newJwt.jwt_refresh[0];
            //console.log(this.froAppAvailability)
        });
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    FroAppAvailabilityService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.CookieService,
            router_1.Router,
            index_2.UtilityService,
            http_1.Http])
    ], FroAppAvailabilityService);
    return FroAppAvailabilityService;
}());
exports.FroAppAvailabilityService = FroAppAvailabilityService;
//# sourceMappingURL=fro-app-availability.service.js.map