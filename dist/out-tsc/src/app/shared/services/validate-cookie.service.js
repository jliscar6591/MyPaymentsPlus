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
//local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../login/model/index");
var ngx_cookie_1 = require("ngx-cookie");
var ValidateCookieService = /** @class */ (function () {
    function ValidateCookieService(cookieService) {
        this.cookieService = cookieService;
    }
    ValidateCookieService.prototype.validateCookie = function () {
        if (this.cookieService.get(app_settings_1.Constants.AuthCookieName)) {
            // let tempResponse: any = this.cookieService.get(Constants.AuthCookieName);
            // return tempResponse ;
            return JSON.parse(this.cookieService.get(app_settings_1.Constants.AuthCookieName));
        }
        else {
            //If the user does not have a cookie, return an empty LoginResponse
            //Allows the user to access parts of the site that don't require a login
            //EX. Using the Support link to the support page from the Login Screen 
            var emptyLoginResponse = new index_1.LoginResponseModel();
            return emptyLoginResponse;
        }
    };
    ValidateCookieService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ngx_cookie_1.CookieService])
    ], ValidateCookieService);
    return ValidateCookieService;
}());
exports.ValidateCookieService = ValidateCookieService;
//# sourceMappingURL=validate-cookie.service.js.map