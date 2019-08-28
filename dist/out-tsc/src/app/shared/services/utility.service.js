"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var app_settings_1 = require("../../app.settings");
var UtilityService = /** @class */ (function () {
    function UtilityService() {
        this.posCommError = false;
    }
    UtilityService.prototype.clearErrorMessage = function (serviceResponse) {
        serviceResponse.message = '';
        serviceResponse.messageType = '';
        serviceResponse.messageTitle = '';
        serviceResponse.message = '';
        serviceResponse.status = '';
        serviceResponse.showCloseButton = false;
        serviceResponse.closeHtml = '';
    };
    UtilityService.prototype.onValueChanged = function (form, formErrors, validationMessages) {
        for (var field in formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            formErrors[field] = '';
            control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = validationMessages[field];
                for (var key in control.errors) {
                    formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    UtilityService.prototype.processApiErr = function (error, loginResponse, failureMessage) {
        console.log("Did we get an Error: ", error);
        console.log("Our LoginResponse: ", loginResponse);
        if (error["status"]) {
            switch (error["status"]) {
                case 412:
                    loginResponse.status = '412';
                    loginResponse.message = 'Unable to get purchase history at this time.';
                    break;
                case 406:
                    //not acceptable
                    loginResponse.status = '406';
                    loginResponse.message = error["statusText"];
                    var errorObj = error;
                    //JSON.parse(JSON.stringify(error["_body"]).replace(/"\s+|\s+"/g, '"'));
                    if (errorObj.length > 0) {
                        if (errorObj[0].hasOwnProperty('message')) {
                            loginResponse.message = failureMessage + '. ' + errorObj[0].message;
                        }
                    }
                    break;
                case 402:
                    loginResponse.status = '402';
                    loginResponse.message = error["statusText"];
                    var errorObj = JSON.parse(error["_body"]);
                    if (errorObj.hasOwnProperty('cartResults')) {
                        loginResponse.message = failureMessage + '. ' + errorObj.cartResults[0].error;
                    }
                    break;
                case 409:
                    loginResponse.status = '409';
                    loginResponse.message = failureMessage + '. ' + error["statusText"];
                    break;
                case 424:
                    loginResponse.status = '424';
                    loginResponse.message = error["statusText"];
                    var errorObj = JSON.parse(error["_body"]);
                    if (errorObj.hasOwnProperty('cartResults')) {
                        loginResponse.message = failureMessage + '. ' + errorObj.cartResults[0].error;
                    }
                    break;
                case 500:
                    loginResponse.status = error["status"];
                    var errorObject = JSON.parse(error["_body"]);
                    if (errorObject.incidentId) {
                        loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject.incidentId;
                    }
                    else {
                        loginResponse.message = failureMessage + '.  Http status code ' + "500";
                    }
                    break;
                case 400:
                    loginResponse.status = error["status"];
                    loginResponse.message = failureMessage + ".  Please Add All Required Information.";
                    break;
                // for development Only
                //case 200:
                //  loginResponse.status = error["status"];
                //  loginResponse.message = failureMessage + ".  There was an error communicating with the POS system. Please refresh to ensure data is up to date.";
                //  this.posCommError = true;
                //  console.log("Error Login Response: ", loginResponse)
                //  break;
                // case 206: - commenting out for development Only
                case 206:
                    loginResponse.status = error["status"];
                    loginResponse.message = failureMessage + ".  There was an error communicating with the POS system. ";
                    this.posCommError = true;
                    console.log("Error Login Response: ", loginResponse);
                    break;
                default:
                    loginResponse.message = failureMessage + '.  Http status code ' + error["status"];
                    break;
            }
        }
        else {
            loginResponse.message = failureMessage;
        }
        loginResponse.showCloseButton = true;
        loginResponse.messageType = app_settings_1.Constants.Error;
        loginResponse.messageTitle = 'Message: ';
    };
    UtilityService.prototype.isAch = function (walletKey, paymentMethods) {
        var isAch = false;
        paymentMethods.forEach(function (a) {
            if (a.walletKey == walletKey) {
                if (a.accountType.toLocaleLowerCase() == 'savings' || a.accountType.toLocaleLowerCase() == 'checking') {
                    isAch = true;
                }
            }
        });
        return isAch;
    };
    UtilityService.prototype.isAchBlocked = function (loginResponse) {
        var isAchBlocked = false;
        //normalize flags
        var userAllowAch = !loginResponse.isBlockACH;
        var districtAllowAch = loginResponse.isAchAllowed;
        isAchBlocked = !(userAllowAch && districtAllowAch);
        return isAchBlocked;
    };
    UtilityService.prototype.handleError = function (error, failureMessage, loginResponse) {
        this.processApiErr(error, loginResponse, failureMessage);
        console.log(loginResponse.message);
        return rxjs_1.Observable.throwError(loginResponse.message);
    };
    UtilityService.prototype.checkLoginResponse = function (loginResponse, defaultLoginResponse) {
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = defaultLoginResponse;
        }
        return loginResponseObj;
    };
    UtilityService = __decorate([
        core_1.Injectable()
    ], UtilityService);
    return UtilityService;
}());
exports.UtilityService = UtilityService;
//# sourceMappingURL=utility.service.js.map