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
var progress_spinner_1 = require("@angular/material/progress-spinner");
var select_1 = require("@angular/material/select");
var input_1 = require("@angular/material/input");
var card_1 = require("@angular/material/card");
var icon_1 = require("@angular/material/icon");
var button_1 = require("@angular/material/button");
var toolbar_1 = require("@angular/material/toolbar");
var list_1 = require("@angular/material/list");
var checkbox_1 = require("@angular/material/checkbox");
var sidenav_1 = require("@angular/material/sidenav");
var tabs_1 = require("@angular/material/tabs");
var autocomplete_1 = require("@angular/material/autocomplete");
var popover_module_1 = require("../shared/components/popover/popover.module");
var account_module_1 = require("./account/account.module");
var dashboard_module_1 = require("./dashboard/dashboard.module");
var checkout_module_1 = require("./checkout/checkout.module");
var site_routes_1 = require("./site.routes");
var site_home_component_1 = require("./site-home.component");
var page_loading_module_1 = require("../shared/components/page-loading/page-loading.module");
var purchase_banner_service_1 = require("../shared/components/purchase-banner/purchase-banner.service");
var index_1 = require("../site/services/index");
var index_2 = require("../shared/services/index");
var activities_module_1 = require("app/site/activities/activities.module");
var material_1 = require("@angular/material");
var badge_1 = require("@angular/material/badge");
var auto_enroll_activities_service_1 = require("./services/auto-enroll-activities.service");
var auto_enroll_dialog_component_1 = require("./dashboard/auto-enroll-dialog/auto-enroll-dialog.component");
var chips_1 = require("@angular/material/chips");
var meals_add_bottom_sheet_component_1 = require("./dashboard/meals/meals-add-bottom-sheet.component");
var expansion_1 = require("@angular/material/expansion");
var radio_1 = require("@angular/material/radio");
var exams_component_1 = require("./exams/exams.component");
var orientation_dialog_component_1 = require("./dashboard/orientation-dialog/orientation-dialog.component");
var menu_1 = require("@angular/material/menu");
var SiteModule = /** @class */ (function () {
    function SiteModule() {
    }
    SiteModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                site_routes_1.SiteRouting,
                card_1.MatCardModule,
                input_1.MatInputModule,
                toolbar_1.MatToolbarModule,
                progress_spinner_1.MatProgressSpinnerModule,
                button_1.MatButtonModule,
                sidenav_1.MatSidenavModule,
                tabs_1.MatTabsModule,
                list_1.MatListModule,
                select_1.MatSelectModule,
                icon_1.MatIconModule,
                autocomplete_1.MatAutocompleteModule,
                index_2.ToasterModule,
                popover_module_1.PopoverModule,
                chips_1.MatChipsModule,
                account_module_1.AccountModule,
                expansion_1.MatExpansionModule,
                radio_1.MatRadioModule,
                dashboard_module_1.DashboardModule,
                checkout_module_1.CheckoutModule,
                page_loading_module_1.PageLoadingModule,
                activities_module_1.ActivitiesModule,
                material_1.MatDialogModule,
                badge_1.MatBadgeModule,
                checkbox_1.MatCheckboxModule,
                menu_1.MatMenuModule
            ],
            declarations: [
                site_home_component_1.SiteHomeComponent,
                auto_enroll_dialog_component_1.AutoEnrollDialogComponent,
                exams_component_1.ExamsComponent
            ],
            providers: [
                index_2.ValidateCookieService,
                index_2.AuthGuardService,
                purchase_banner_service_1.PurchaseBannerService,
                index_1.ValidCartCountService,
                index_1.MultiDistrictService,
                auto_enroll_activities_service_1.AutoEnrollActivitiesService
            ],
            entryComponents: [
                auto_enroll_dialog_component_1.AutoEnrollDialogComponent,
                meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent,
                orientation_dialog_component_1.OrientationDialogComponent
            ]
        })
    ], SiteModule);
    return SiteModule;
}());
exports.SiteModule = SiteModule;
//# sourceMappingURL=site.module.js.map