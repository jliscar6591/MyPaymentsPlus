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
var button_1 = require("@angular/material/button");
var toolbar_1 = require("@angular/material/toolbar");
var checkbox_1 = require("@angular/material/checkbox");
var sidenav_1 = require("@angular/material/sidenav");
var radio_1 = require("@angular/material/radio");
var dialog_1 = require("@angular/material/dialog");
var table_1 = require("@angular/material/table");
var tabs_1 = require("@angular/material/tabs");
var menu_1 = require("@angular/material/menu");
var autocomplete_1 = require("@angular/material/autocomplete");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var collections_1 = require("@angular/cdk/collections");
var flex_layout_1 = require("@angular/flex-layout");
var ngx_pagination_1 = require("ngx-pagination");
var datepicker_1 = require("@angular/material/datepicker");
//import { CdkTableModule } from '@angular/cdk/table';
var accordion_module_1 = require("../../shared/components/accordion/accordion.module");
var receipt_module_1 = require("../../shared/components/receipt/receipt.module");
var popover_module_1 = require("../../shared/components/popover/popover.module");
var simple_dialog_module_1 = require("../../shared/components/simple-dialog/simple-dialog.module");
var index_1 = require("../../registration/services/index");
var alert_level_component_1 = require("./alerts/alert-level.component");
var account_routes_1 = require("./account.routes");
var account_home_component_1 = require("./account-home.component");
var profile_component_1 = require("./profile/profile.component");
var payment_method_component_1 = require("./payment-method/payment-method.component");
var autopay_component_1 = require("./payment-method/autopay.component");
var payment_method_autopay_component_1 = require("./payment-method/payment-method-autopay.component");
var alerts_component_1 = require("./alerts/alerts.component");
var manage_students_component_1 = require("./manage-students/manage-students.component");
var meal_purchases_component_1 = require("./meal-purchases/meal-purchases.component");
var payment_history_component_1 = require("./payment-history/payment-history.component");
var fro_launch_component_1 = require("./fro/fro-launch.component");
var fro_start_component_1 = require("./fro/fro-start.component");
var fro_status_component_1 = require("./fro/fro-status.component");
var index_2 = require("./pipes/index");
var index_3 = require("./services/index");
var index_4 = require("../../shared/services/index");
var suspend_payment_warning_module_1 = require("../../shared/components/suspend-payment-warning/suspend-payment-warning.module");
var transfer_history_component_1 = require("./transfer-history/transfer-history.component");
var account_desktop_component_1 = require("./account-desktop/account-desktop.component");
var account_mobile_component_1 = require("./account-mobile/account-mobile.component");
var icon_1 = require("@angular/material/icon");
var AccountModule = /** @class */ (function () {
    function AccountModule() {
    }
    AccountModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                account_routes_1.AccountRouting,
                card_1.MatCardModule,
                input_1.MatInputModule,
                toolbar_1.MatToolbarModule,
                progress_spinner_1.MatProgressSpinnerModule,
                button_1.MatButtonModule,
                sidenav_1.MatSidenavModule,
                checkbox_1.MatCheckboxModule,
                dialog_1.MatDialogModule,
                radio_1.MatRadioModule,
                tabs_1.MatTabsModule,
                icon_1.MatIconModule,
                menu_1.MatMenuModule,
                select_1.MatSelectModule,
                autocomplete_1.MatAutocompleteModule,
                table_1.MatTableModule,
                slide_toggle_1.MatSlideToggleModule,
                ngx_pagination_1.NgxPaginationModule,
                suspend_payment_warning_module_1.SuspendPaymentWarningModule,
                popover_module_1.PopoverModule,
                simple_dialog_module_1.SimpleDialogModule,
                accordion_module_1.AccordionModule,
                datepicker_1.MatDatepickerModule,
                flex_layout_1.FlexLayoutModule,
                receipt_module_1.ReceiptModule
            ],
            declarations: [
                account_home_component_1.AccountHomeComponent,
                profile_component_1.ProfileComponent,
                alerts_component_1.AlertsComponent,
                manage_students_component_1.ManageStudentsComponent,
                meal_purchases_component_1.MealPurchasesComponent,
                payment_history_component_1.PaymentHistoryComponent,
                fro_launch_component_1.FroLaunchComponent,
                fro_start_component_1.FroStartComponent,
                fro_status_component_1.FroStatusComponent,
                payment_method_component_1.PaymentMethodComponent,
                autopay_component_1.AutopayComponent,
                payment_method_autopay_component_1.PaymentMethodAutopayComponent,
                alert_level_component_1.AlertLevelComponent,
                index_2.CreditCardFormatPipe,
                transfer_history_component_1.TransferHistoryComponent,
                account_desktop_component_1.AccountDesktopComponent,
                account_mobile_component_1.AccountMobileComponent
            ],
            providers: [
                collections_1.UniqueSelectionDispatcher,
                index_3.UserContextService,
                index_3.ProfileUserprofileService,
                index_3.ProfileProfileCoreService,
                index_3.ProfileRelationshipService,
                index_3.ProfileEmailPreferenceService,
                index_3.AuthNewPasswordService,
                index_3.StudentBalanceAlertService,
                index_3.PaymentMethodService,
                index_3.ExpiredCard,
                index_3.PaymentUtilityService,
                index_3.PaymentAddService,
                index_4.UtilityService,
                index_1.StudentListService,
                index_3.StudentMealPurchasesService,
                index_3.PaymentAutoPayService,
                index_4.DateRangeSelectorService,
                index_3.PaymentHistoryService,
                index_3.CreditcardValidationService,
                index_2.CreditCardFormatPipe,
                index_3.FroAppAvailabilityService,
                index_3.FroAppStatusService,
            ]
        })
    ], AccountModule);
    return AccountModule;
}());
exports.AccountModule = AccountModule;
//# sourceMappingURL=account.module.js.map