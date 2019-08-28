"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var page_not_found_component_1 = require("./shared/components/page-not-found/page-not-found.component");
//Local
var login_home_component_1 = require("./login/login-home/login-home.component");
var registration_form_component_1 = require("./registration/registration-form.component");
var site_guard_service_1 = require("./site-guard.service");
var routes = [
    {
        path: '',
        canActivateChild: [site_guard_service_1.SiteGuard],
        children: [
            {
                path: 'home',
                component: login_home_component_1.LoginHomeComponent
            },
            {
                path: 'register',
                component: registration_form_component_1.RegistrationFormComponent
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'notfound',
                component: page_not_found_component_1.PageNotFoundComponent
            },
            {
                path: '**',
                redirectTo: '/welcome'
            }
        ]
    }
];
exports.appRoutingProviders = [];
// - Updated Export
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routes.js.map