"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var index_1 = require("../shared/services/index");
var popover_module_1 = require("../shared/components/popover/popover.module");
var login_routes_1 = require("./login.routes");
var login_home_component_1 = require("./login-home/login-home.component");
var login_component_1 = require("./login-home/login.component");
var change_password_component_1 = require("./reset-password/change-password.component");
var reset_password_component_1 = require("./reset-password/reset-password.component");
var request_password_change_component_1 = require("./reset-password/request-password-change.component");
var angular2_recaptcha_1 = require("angular2-recaptcha");
var equal_validator_directive_1 = require("../shared/directives/equal-validator.directive");
var index_2 = require("../site/account/services/index");
var page_loading_module_1 = require("../shared/components/page-loading/page-loading.module");
var index_3 = require("../shared/services/index");
var ngx_clipboard_1 = require("ngx-clipboard");
var LoginModule = /** @class */ (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                login_routes_1.LoginRouting,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatToolbarModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatButtonModule,
                material_1.MatIconModule,
                index_1.ToasterModule,
                angular2_recaptcha_1.ReCaptchaModule,
                popover_module_1.PopoverModule,
                page_loading_module_1.PageLoadingModule,
                ngx_clipboard_1.ClipboardModule
            ],
            declarations: [
                login_home_component_1.LoginHomeComponent,
                login_component_1.LoginComponent,
                change_password_component_1.ChangePasswordComponent,
                reset_password_component_1.ResetPasswordComponent,
                request_password_change_component_1.RequestPasswordChangeComponent,
                equal_validator_directive_1.EqualValidatorDirective
            ],
            providers: [
                index_1.ValidateCookieService,
                index_2.UserContextService,
                login_component_1.LoginComponent,
                index_3.AuthenticationService,
            ]
        })
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map