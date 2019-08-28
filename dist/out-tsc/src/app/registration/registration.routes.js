"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var registration_form_component_1 = require("./registration-form.component");
var segmentation_form_component_1 = require("./segmentation-form.component");
var registration_setup_component_1 = require("./registration-setup.component");
var add_student_form_component_1 = require("./add-student-form.component");
var index_1 = require("../shared/services/index");
var RegistrationRoutes = [
    {
        path: 'register',
        component: registration_form_component_1.RegistrationFormComponent
    },
    {
        path: 'setup',
        component: registration_setup_component_1.RegistrationSetupComponent,
        canActivateChild: [index_1.AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'relationship',
                pathMatch: 'full'
            },
            {
                path: 'relationship',
                component: segmentation_form_component_1.SegmentationFormComponent
            },
            {
                path: 'add-student',
                component: add_student_form_component_1.AddStudentFormComponent
            },
        ]
    },
    {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full'
    }
];
exports.RegistrationRouting = router_1.RouterModule.forChild(RegistrationRoutes);
//# sourceMappingURL=registration.routes.js.map