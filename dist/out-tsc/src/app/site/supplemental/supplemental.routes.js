"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var supplemental_component_1 = require("./supplemental.component");
var supplemental_about_component_1 = require("./supplemental-about.component");
var supplemental_privacy_component_1 = require("./supplemental-privacy.component");
var supplemental_support_component_1 = require("./supplemental-support.component");
var supplemental_terms_component_1 = require("./supplemental-terms.component");
var supplemental_email_component_1 = require("./supplemental-email.component");
var SupplementalRoutes = [
    {
        path: '',
        component: supplemental_component_1.SupplementalComponent,
        children: [
            {
                path: 'about',
                component: supplemental_about_component_1.SupplementalAboutComponent
            },
            {
                path: 'privacy-policy',
                component: supplemental_privacy_component_1.SupplementalPrivacyComponent
            },
            {
                path: 'terms',
                component: supplemental_terms_component_1.SupplementalTermsComponent
            },
            {
                path: 'support',
                component: supplemental_support_component_1.SupplementalSupportComponent
            }
        ]
    },
    {
        path: 'contact-offline',
        component: supplemental_email_component_1.SupplementalEmailComponent
    },
    {
        path: '',
        redirectTo: '/support',
        pathMatch: 'full'
    }
];
exports.SupplementalRouting = router_1.RouterModule.forChild(SupplementalRoutes);
//# sourceMappingURL=supplemental.routes.js.map