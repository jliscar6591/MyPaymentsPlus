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
var accordion_module_1 = require("../../shared/components/accordion/accordion.module");
var supplemental_routes_1 = require("./supplemental.routes");
var supplemental_component_1 = require("./supplemental.component");
var supplemental_about_component_1 = require("./supplemental-about.component");
var supplemental_privacy_component_1 = require("./supplemental-privacy.component");
var supplemental_support_component_1 = require("./supplemental-support.component");
var supplemental_terms_component_1 = require("./supplemental-terms.component");
var supplemental_email_component_1 = require("./supplemental-email.component");
var index_1 = require("../../shared/services/index");
var SupplementalModule = /** @class */ (function () {
    function SupplementalModule() {
    }
    SupplementalModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                supplemental_routes_1.SupplementalRouting,
                material_1.MatCardModule,
                material_1.MatInputModule,
                material_1.MatToolbarModule,
                material_1.MatButtonModule,
                material_1.MatSidenavModule,
                accordion_module_1.AccordionModule,
                material_1.MatProgressSpinnerModule,
                index_1.ToasterModule,
                material_1.MatSelectModule
            ],
            declarations: [
                supplemental_component_1.SupplementalComponent,
                supplemental_about_component_1.SupplementalAboutComponent,
                supplemental_privacy_component_1.SupplementalPrivacyComponent,
                supplemental_support_component_1.SupplementalSupportComponent,
                supplemental_terms_component_1.SupplementalTermsComponent,
                supplemental_email_component_1.SupplementalEmailComponent
            ],
            providers: [index_1.SupportRequestService]
        })
    ], SupplementalModule);
    return SupplementalModule;
}());
exports.SupplementalModule = SupplementalModule;
//# sourceMappingURL=supplemental.module.js.map