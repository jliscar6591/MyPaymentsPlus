"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var view_cart_component_1 = require("./view-cart/view-cart.component");
var review_cart_component_1 = require("./review-cart/review-cart.component");
var CheckoutRoutes = [
    {
        path: '',
        component: view_cart_component_1.ViewCartComponent
    },
    {
        path: 'review',
        component: review_cart_component_1.ReviewCartComponent
    }
];
exports.CheckoutRouting = router_1.RouterModule.forChild(CheckoutRoutes);
//# sourceMappingURL=checkout.routes.js.map