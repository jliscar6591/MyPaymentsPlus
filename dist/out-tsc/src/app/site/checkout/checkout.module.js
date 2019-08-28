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
var checkout_routes_1 = require("./checkout.routes");
var index_1 = require("../../shared/services/index");
var index_2 = require("../services/index");
var view_cart_component_1 = require("./view-cart/view-cart.component");
var cart_item_component_1 = require("./cart/cart-item.component");
var cart_component_1 = require("./cart/cart.component");
var review_cart_component_1 = require("./review-cart/review-cart.component");
var payment_method_dialog_component_1 = require("./review-cart/payment-method-dialog.component");
var payment_method_dialog_service_1 = require("../services/payment-method-dialog.service");
var page_loading_module_1 = require("../../shared/components/page-loading/page-loading.module");
var receipt_module_1 = require("../../shared/components/receipt/receipt.module");
var forms_dialog_component_1 = require("../activities/forms/forms-dialog/forms-dialog.component");
var forms_service_1 = require("../services/forms.service");
var snack_bar_1 = require("@angular/material/snack-bar");
var CheckoutModule = /** @class */ (function () {
    function CheckoutModule() {
    }
    CheckoutModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                checkout_routes_1.CheckoutRouting,
                material_1.MatCardModule,
                material_1.MatSelectModule,
                material_1.MatInputModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatButtonModule,
                material_1.MatRadioModule,
                material_1.MatDialogModule,
                material_1.MatIconModule,
                material_1.MatCheckboxModule,
                page_loading_module_1.PageLoadingModule,
                receipt_module_1.ReceiptModule,
                snack_bar_1.MatSnackBarModule
            ],
            declarations: [
                view_cart_component_1.ViewCartComponent,
                cart_item_component_1.CartItemComponent,
                cart_component_1.CartComponent,
                review_cart_component_1.ReviewCartComponent,
                payment_method_dialog_component_1.PaymentMethodDialogComponent,
            ],
            providers: [
                index_2.CartCheckoutService,
                index_2.CartCheckoutItemsService,
                index_2.AddCartItemService,
                index_1.UtilityService,
                payment_method_dialog_service_1.PaymentMethodDialogService,
                forms_service_1.FormsService,
            ],
            entryComponents: [
                payment_method_dialog_component_1.PaymentMethodDialogComponent,
                cart_item_component_1.CartItemComponent,
                forms_dialog_component_1.FormsDialogComponent
            ]
        })
    ], CheckoutModule);
    return CheckoutModule;
}());
exports.CheckoutModule = CheckoutModule;
//# sourceMappingURL=checkout.module.js.map