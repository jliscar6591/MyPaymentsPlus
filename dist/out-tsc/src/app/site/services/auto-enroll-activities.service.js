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
require("rxjs/add/observable/interval");
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var AutoEnrollActivitiesService = /** @class */ (function () {
    function AutoEnrollActivitiesService(utilityService, httpC, currTokenServ, tokenService, loginStoreSvc) {
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSvc = loginStoreSvc;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    AutoEnrollActivitiesService.prototype.getAutoEnrollActivities = function () {
        var token = this.loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/CartAutoLoad';
        var body = '';
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        return this.httpC.post(Url, body, options)
            .pipe(
        //tap(data => this.cartCount = data)
        );
    };
    AutoEnrollActivitiesService.prototype.subscribeToGetAutoEnrollActivities = function () {
        var _this = this;
        this.getAutoEnrollActivities()
            .subscribe(function (data) {
            _this.cartCount = data;
            _this.result = true;
        }, function () {
            //console.log('cartCount', this.cartCount);
        });
        return this.cartCount;
    };
    AutoEnrollActivitiesService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [index_1.UtilityService,
            http_1.HttpClient,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], AutoEnrollActivitiesService);
    return AutoEnrollActivitiesService;
}());
exports.AutoEnrollActivitiesService = AutoEnrollActivitiesService;
//# sourceMappingURL=auto-enroll-activities.service.js.map