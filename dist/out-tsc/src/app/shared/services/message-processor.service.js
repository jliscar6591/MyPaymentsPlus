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
var ngx_cookie_1 = require("ngx-cookie");
var validate_cookie_service_1 = require("./validate-cookie.service");
var login_store_service_1 = require("../../shared/services/login-store.service");
//Third party
var angular2_toaster_1 = require("angular2-toaster/angular2-toaster");
var MessageProcessorService = /** @class */ (function () {
    function MessageProcessorService(cookieService, toasterService, validateCookieService, loginStoreService) {
        this.cookieService = cookieService;
        this.toasterService = toasterService;
        this.validateCookieService = validateCookieService;
        this.loginStoreService = loginStoreService;
        this.toasterconfig = new angular2_toaster_1.ToasterConfig({ tapToDismiss: true, limit: 1 });
        this.toasterService = toasterService;
    }
    MessageProcessorService.prototype.messageHandler = function () {
        var _this = this;
        var loginResponse;
        //this.validateCookieService.validateCookie();
        if (this.loginStoreService.cookieStateItem) {
            loginResponse = this.loginStoreService.cookieStateItem;
            //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
            //When there is message report it.
            if (loginResponse.message && loginResponse.message != '') {
                if (loginResponse.showCloseButton) {
                    var toast = {
                        type: loginResponse.messageType,
                        title: loginResponse.messageTitle,
                        body: loginResponse.message,
                        showCloseButton: loginResponse.showCloseButton,
                        closeHtml: loginResponse.closeHtml,
                        timeout: 0,
                        onHideCallback: function () {
                            loginResponse.message = '';
                            loginResponse.messageTitle = '';
                            loginResponse.messageType = '';
                            _this.loginStoreService.loadLogin(loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);
                        }
                    };
                }
                else {
                    var toast = {
                        type: loginResponse.messageType,
                        title: loginResponse.messageTitle,
                        body: loginResponse.message,
                        showCloseButton: false,
                        closeHtml: loginResponse.closeHtml,
                        timeout: 5000,
                        onHideCallback: function () {
                            loginResponse.message = '';
                            loginResponse.messageTitle = '';
                            loginResponse.messageType = '';
                            _this.loginStoreService.loadLogin(loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);
                        }
                    };
                }
                this.toasterService.pop(toast);
                //Clear error message
                loginResponse.message = '';
                loginResponse.messageType = '';
                loginResponse.messageTitle = '';
                loginResponse.message = '';
                loginResponse.showCloseButton = false;
                loginResponse.closeHtml = '';
                this.loginStoreService.loadLogin(loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);
            }
        }
    };
    MessageProcessorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ngx_cookie_1.CookieService,
            angular2_toaster_1.ToasterService,
            validate_cookie_service_1.ValidateCookieService,
            login_store_service_1.LoginStoreService])
    ], MessageProcessorService);
    return MessageProcessorService;
}());
exports.MessageProcessorService = MessageProcessorService;
//# sourceMappingURL=message-processor.service.js.map