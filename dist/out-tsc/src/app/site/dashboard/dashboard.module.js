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
var list_1 = require("@angular/material/list");
var checkbox_1 = require("@angular/material/checkbox");
var dashboard_routes_1 = require("./dashboard.routes");
var dashboard_home_component_1 = require("./dashboard-home.component");
var meals_component_1 = require("./meals/meals.component");
var meals_empty_component_1 = require("./meals/meals-empty.component");
var meals_list_component_1 = require("./meals/meals-list.component");
var meals_list_add_to_cart_component_1 = require("./meals/meals-list-add-to-cart.component");
var meals_list_add_to_cart_mobile_component_1 = require("./meals/meals-list-add-to-cart-mobile.component");
var district_message_component_1 = require("./district-message/district-message.component");
var mobile_district_message_component_1 = require("./district-message/mobile-district-message.component");
var purchase_banner_component_1 = require("../../shared/components/purchase-banner/purchase-banner.component");
var receipt_module_1 = require("../../shared/components/receipt/receipt.module");
var feedback_component_1 = require("./feedback/feedback.component");
var feedback_dialog_component_1 = require("./feedback/feedback-dialog.component");
var feedback_dialog_service_1 = require("../services/feedback-dialog.service");
var suspend_payment_warning_module_1 = require("../../shared/components/suspend-payment-warning/suspend-payment-warning.module");
var simple_dialog_module_1 = require("../../shared/components/simple-dialog/simple-dialog.module");
var flex_layout_1 = require("@angular/flex-layout");
var chips_1 = require("@angular/material/chips");
var forms_2 = require("@angular/forms");
var material_1 = require("@angular/material");
var index_1 = require("../../shared/services/index");
var toolbar_1 = require("@angular/material/toolbar");
var badge_1 = require("@angular/material/badge");
var index_2 = require("../services/index");
var transfer_fee_component_1 = require("./transfer/transfer-fee.component");
var make_transfer_component_1 = require("./transfer/make-transfer.component");
//import { FormatmoneyPipe } from './pipes/formatmoney.pipe';
var transfer_confirmation_component_1 = require("./transfer/transfer-confirmation.component");
var bonus_ad_component_1 = require("./bonus-ad/bonus-ad.component");
var bonus_ad_dialog_component_1 = require("./bonus-ad/bonus-ad-dialog/bonus-ad-dialog.component");
var fees_component_1 = require("./fees/fees.component");
var fees_list_component_1 = require("./fees/fees-list.component");
var fees_details_component_1 = require("./fees/fees-details.component");
var fees_list_empty_component_1 = require("./fees/fees-list-empty.component");
var fees_dialog_component_1 = require("./fees/fees-dialog.component");
var nutrislice_component_1 = require("./nutrislice/nutrislice.component");
var nutrislice_items_dialog_component_1 = require("./nutrislice/nutrislice-items-dialog/nutrislice-items-dialog.component");
var tooltip_1 = require("@angular/material/tooltip");
var expansion_1 = require("@angular/material/expansion");
var page_loading_module_1 = require("../../shared/components/page-loading/page-loading.module");
var auto_enroll_forms_component_1 = require("./auto-enroll-dialog/auto-enroll-forms.component");
var tabs_1 = require("@angular/material/tabs");
var radio_1 = require("@angular/material/radio");
var sidenav_1 = require("@angular/material/sidenav");
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
var auto_enroll_bottom_sheet_component_1 = require("./auto-enroll-dialog/auto-enroll-bottom-sheet/auto-enroll-bottom-sheet.component");
var meals_add_bottom_sheet_component_1 = require("./meals/meals-add-bottom-sheet.component");
var divider_1 = require("@angular/material/divider");
var orientations_component_1 = require("./orientations/orientations.component");
var ngx_barcode_1 = require("ngx-barcode");
var orientation_dialog_component_1 = require("./orientation-dialog/orientation-dialog.component");
var DashboardModule = /** @class */ (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                dashboard_routes_1.DashboardRouting,
                card_1.MatCardModule,
                select_1.MatSelectModule,
                input_1.MatInputModule,
                progress_spinner_1.MatProgressSpinnerModule,
                material_1.MatDialogModule,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                list_1.MatListModule,
                checkbox_1.MatCheckboxModule,
                forms_2.FormsModule,
                suspend_payment_warning_module_1.SuspendPaymentWarningModule,
                simple_dialog_module_1.SimpleDialogModule,
                receipt_module_1.ReceiptModule,
                flex_layout_1.FlexLayoutModule,
                chips_1.MatChipsModule,
                tooltip_1.MatTooltipModule,
                expansion_1.MatExpansionModule,
                page_loading_module_1.PageLoadingModule,
                tabs_1.MatTabsModule,
                sidenav_1.MatSidenavModule,
                radio_1.MatRadioModule,
                bottom_sheet_1.MatBottomSheetModule,
                material_1.MatGridListModule,
                divider_1.MatDividerModule,
                toolbar_1.MatToolbarModule,
                badge_1.MatBadgeModule,
                ngx_barcode_1.NgxBarcodeModule
            ],
            declarations: [
                dashboard_home_component_1.DashboardHomeComponent,
                meals_component_1.MealsComponent,
                meals_empty_component_1.MealsEmptyComponent,
                meals_list_component_1.MealsListComponent,
                district_message_component_1.DistrictMessageComponent,
                mobile_district_message_component_1.MobileDistrictMessageComponent,
                meals_list_add_to_cart_component_1.MealsListAddToCartComponent,
                meals_list_add_to_cart_mobile_component_1.MealsListAddToCartMobileComponent,
                purchase_banner_component_1.PurchaseBannerComponent,
                feedback_component_1.FeedbackComponent,
                feedback_dialog_component_1.FeedbackDialogComponent,
                transfer_fee_component_1.TransferFeeComponent,
                make_transfer_component_1.MakeTransferComponent,
                //FormatmoneyPipe,
                transfer_confirmation_component_1.TransferConfirmationComponent,
                bonus_ad_component_1.BonusAdComponent,
                bonus_ad_dialog_component_1.BonusAdDialogComponent,
                fees_component_1.FeesComponent,
                fees_list_component_1.FeesListComponent,
                fees_details_component_1.FeesDetailsComponent,
                fees_list_empty_component_1.FeesListEmptyComponent,
                fees_dialog_component_1.FeesDialogComponent,
                bonus_ad_dialog_component_1.BonusAdDialogComponent,
                nutrislice_component_1.NutrisliceComponent,
                nutrislice_items_dialog_component_1.NutrisliceItemsDialogComponent,
                mobile_district_message_component_1.MobileDistrictMessageComponent,
                auto_enroll_forms_component_1.AutoEnrollFormsComponent,
                auto_enroll_bottom_sheet_component_1.AutoEnrollBottomSheetComponent,
                meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent,
                orientations_component_1.OrientationsComponent,
                orientation_dialog_component_1.OrientationDialogComponent
            ],
            providers: [
                mobile_district_message_component_1.MobileDistrictMessageComponent,
                index_2.StudentMealsService,
                index_2.StudentMealsServiceRemote,
                index_1.UtilityService,
                index_2.AddCartItemService,
                index_2.DashboardDistrictMessageService,
                feedback_dialog_service_1.FeedbackDialogService,
                index_2.FeedbackService,
                forms_2.FormsModule,
                index_2.TransfersService,
                common_1.CurrencyPipe,
                index_2.BonusScheduleService,
                index_2.FeesService,
                meals_component_1.MealsComponent
            ],
            entryComponents: [
                feedback_dialog_component_1.FeedbackDialogComponent,
                fees_dialog_component_1.FeesDialogComponent,
                nutrislice_items_dialog_component_1.NutrisliceItemsDialogComponent,
                auto_enroll_forms_component_1.AutoEnrollFormsComponent,
                auto_enroll_bottom_sheet_component_1.AutoEnrollBottomSheetComponent,
                meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent
            ]
        })
    ], DashboardModule);
    return DashboardModule;
}());
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map