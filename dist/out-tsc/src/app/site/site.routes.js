"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var site_home_component_1 = require("./site-home.component");
var profile_component_1 = require("./account/profile/profile.component");
var dashboard_home_component_1 = require("./dashboard/dashboard-home.component");
var account_home_component_1 = require("./account/account-home.component");
var index_1 = require("../shared/services/index");
var payment_method_autopay_component_1 = require("./account/payment-method/payment-method-autopay.component");
var alerts_component_1 = require("./account/alerts/alerts.component");
var manage_students_component_1 = require("./account/manage-students/manage-students.component");
var meal_purchases_component_1 = require("./account/meal-purchases/meal-purchases.component");
var payment_history_component_1 = require("./account/payment-history/payment-history.component");
var fro_launch_component_1 = require("./account/fro/fro-launch.component");
var view_cart_component_1 = require("./checkout/view-cart/view-cart.component");
var review_cart_component_1 = require("./checkout/review-cart/review-cart.component");
var transfer_fee_component_1 = require("./dashboard/transfer/transfer-fee.component");
var make_transfer_component_1 = require("./dashboard/transfer/make-transfer.component");
var transfer_confirmation_component_1 = require("./dashboard/transfer/transfer-confirmation.component");
var transfer_history_component_1 = require("./account/transfer-history/transfer-history.component");
var activities_component_1 = require("./activities/activities.component");
var fees_component_1 = require("./dashboard/fees/fees.component");
var meals_component_1 = require("./dashboard/meals/meals.component");
var nutrislice_component_1 = require("./dashboard/nutrislice/nutrislice.component");
var feedback_component_1 = require("./dashboard/feedback/feedback.component");
var orientations_component_1 = require("./dashboard/orientations/orientations.component");
var exams_component_1 = require("./exams/exams.component");
var SiteRoutes = [
    {
        path: '',
        component: site_home_component_1.SiteHomeComponent,
        canActivate: [index_1.AuthGuardService],
        children: [
            {
                path: 'dashboard',
                component: dashboard_home_component_1.DashboardHomeComponent
            },
            {
                path: 'activities',
                component: activities_component_1.ActivitiesComponent
            },
            {
                path: 'orientations',
                component: orientations_component_1.OrientationsComponent
            },
            {
                path: 'exams',
                component: exams_component_1.ExamsComponent
            },
            {
                path: 'fees',
                component: fees_component_1.FeesComponent
            },
            {
                path: 'meals',
                component: meals_component_1.MealsComponent
            },
            {
                path: 'nutrislice',
                component: nutrislice_component_1.NutrisliceComponent
            },
            {
                path: 'feedback',
                component: feedback_component_1.FeedbackComponent
            },
            {
                path: 'account',
                component: account_home_component_1.AccountHomeComponent,
                canActivateChild: [index_1.AuthGuardService],
                children: [
                    {
                        path: 'profile',
                        component: profile_component_1.ProfileComponent
                    },
                    {
                        path: '',
                        component: profile_component_1.ProfileComponent
                    },
                    {
                        path: 'payment-method',
                        component: payment_method_autopay_component_1.PaymentMethodAutopayComponent
                    },
                    {
                        path: 'alerts',
                        component: alerts_component_1.AlertsComponent
                    },
                    {
                        path: 'manage-students',
                        component: manage_students_component_1.ManageStudentsComponent
                    },
                    {
                        path: 'meal-purchases',
                        component: meal_purchases_component_1.MealPurchasesComponent
                    },
                    {
                        path: 'payment-history',
                        component: payment_history_component_1.PaymentHistoryComponent
                    },
                    {
                        path: 'fro-launch',
                        component: fro_launch_component_1.FroLaunchComponent
                    },
                    {
                        path: 'transfer-history',
                        component: transfer_history_component_1.TransferHistoryComponent
                    }
                ]
            },
            {
                path: 'checkout',
                component: view_cart_component_1.ViewCartComponent
            },
            {
                path: 'review',
                component: review_cart_component_1.ReviewCartComponent
            },
            {
                path: 'transfer-fee',
                component: transfer_fee_component_1.TransferFeeComponent
            },
            {
                path: 'make-transfer',
                component: make_transfer_component_1.MakeTransferComponent
            },
            {
                path: 'transfer-confirmation',
                component: transfer_confirmation_component_1.TransferConfirmationComponent
            }
            //{
            //  path: 'checkout',
            //  loadChildren: './checkout/checkout.module#CheckoutModule',
            //  data: { title: 'Checkout' }
            //}
        ]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];
//export const SiteRouting: ModuleWithProviders = RouterModule.forChild(SiteRoutes);
var SiteRouting = /** @class */ (function () {
    function SiteRouting() {
    }
    SiteRouting = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild(SiteRoutes)
            ],
            exports: [
                router_1.RouterModule
            ]
        })
    ], SiteRouting);
    return SiteRouting;
}());
exports.SiteRouting = SiteRouting;
//# sourceMappingURL=site.routes.js.map