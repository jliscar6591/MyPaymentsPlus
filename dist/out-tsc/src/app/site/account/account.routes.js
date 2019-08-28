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
var account_home_component_1 = require("./account-home.component");
var payment_method_autopay_component_1 = require("./payment-method/payment-method-autopay.component");
//import { ManageStudentsComponent } from './manage-students/manage-students.component';
//import { MealPurchasesComponent } from './meal-purchases/meal-purchases.component';
//import { PaymentHistoryComponent } from './payment-history/payment-history.component';
var profile_component_1 = require("./profile/profile.component");
var index_1 = require("../../shared/services/index");
//import {FroLaunchComponent } from './fro/fro-launch.component'
var AccountRoutes = [
    {
        path: '',
        component: account_home_component_1.AccountHomeComponent,
        canActivateChild: [index_1.AuthGuardService],
        children: [
            {
                path: 'profile',
                component: profile_component_1.ProfileComponent
            },
            {
                path: 'payment-method',
                component: payment_method_autopay_component_1.PaymentMethodAutopayComponent
            },
        ]
    },
    {
        canActivate: [index_1.AuthGuardService],
        path: 'account',
        redirectTo: '/account/profile',
        pathMatch: 'full'
    }
];
//export const AccountRouting: ModuleWithProviders = RouterModule.forChild(AccountRoutes);
var AccountRouting = /** @class */ (function () {
    function AccountRouting() {
    }
    AccountRouting = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild(AccountRoutes)
            ],
            exports: [
                router_1.RouterModule
            ]
        })
    ], AccountRouting);
    return AccountRouting;
}());
exports.AccountRouting = AccountRouting;
//# sourceMappingURL=account.routes.js.map