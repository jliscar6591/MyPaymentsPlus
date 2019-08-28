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
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var popover_module_1 = require("../shared/components/popover/popover.module");
var simple_dialog_module_1 = require("../shared/components/simple-dialog/simple-dialog.module");
var registration_routes_1 = require("./registration.routes");
var segmentation_form_component_1 = require("./segmentation-form.component");
var registration_form_component_1 = require("./registration-form.component");
var registration_setup_component_1 = require("./registration-setup.component");
var add_student_form_component_1 = require("./add-student-form.component");
var registration_breadcrumbs_component_1 = require("./breadcrumbs/registration-breadcrumbs.component");
var index_1 = require("./services/index");
var index_2 = require("../shared/services/index");
var privacy_dialog_component_1 = require("./privacy-dialog/privacy-dialog.component");
var terms_dialog_component_1 = require("./terms-dialog/terms-dialog.component");
var RegistrationModule = /** @class */ (function () {
    function RegistrationModule() {
    }
    RegistrationModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                router_1.RouterModule,
                registration_routes_1.RegistrationRouting,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatToolbarModule,
                material_1.MatButtonModule,
                index_2.ToasterModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatCheckboxModule,
                popover_module_1.PopoverModule,
                material_1.MatSelectModule,
                simple_dialog_module_1.SimpleDialogModule
            ],
            declarations: [
                registration_form_component_1.RegistrationFormComponent,
                segmentation_form_component_1.SegmentationFormComponent,
                registration_setup_component_1.RegistrationSetupComponent,
                add_student_form_component_1.AddStudentFormComponent,
                registration_breadcrumbs_component_1.RegistrationBreadcrumbsComponent,
                privacy_dialog_component_1.PrivacyDialogComponent,
                terms_dialog_component_1.TermsDialogComponent
            ],
            providers: [
                index_2.DistrictListService,
                index_2.StateProvinceListService,
                index_1.UserDuplicationCheckService,
                index_2.AuthGuardService,
                index_1.UserCreateService,
                index_1.RegistrationBreadcrumbsService,
                index_1.SegmentationSaveService,
                index_2.DistrictLoginDerivedService,
                index_1.StudentAddService,
                index_1.StudentListService,
                index_1.DistrictContentService
            ]
        })
    ], RegistrationModule);
    return RegistrationModule;
}());
exports.RegistrationModule = RegistrationModule;
//# sourceMappingURL=registration.module.js.map