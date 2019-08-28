"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var login_home_component_1 = require("./login-home/login-home.component");
var change_password_component_1 = require("./reset-password/change-password.component");
var reset_password_component_1 = require("./reset-password/reset-password.component");
var request_password_change_component_1 = require("./reset-password/request-password-change.component");
var LoginRoutes = [
    {
        path: 'welcome',
        component: login_home_component_1.LoginHomeComponent
    },
    {
        path: 'reset-password',
        component: reset_password_component_1.ResetPasswordComponent,
        children: [
            {
                path: '',
                component: request_password_change_component_1.RequestPasswordChangeComponent,
                pathMatch: 'full'
            },
            {
                path: 'change-password',
                component: change_password_component_1.ChangePasswordComponent
            },
        ]
    },
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    }
];
exports.LoginRouting = router_1.RouterModule.forChild(LoginRoutes);
//# sourceMappingURL=login.routes.js.map