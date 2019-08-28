"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var dashboard_home_component_1 = require("./dashboard-home.component");
var index_1 = require("../../shared/services/index");
var transfer_fee_component_1 = require("./transfer/transfer-fee.component");
var make_transfer_component_1 = require("./transfer/make-transfer.component");
var transfer_confirmation_component_1 = require("./transfer/transfer-confirmation.component");
var DashboardRoutes = [
    {
        path: '',
        component: dashboard_home_component_1.DashboardHomeComponent,
        canActivateChild: [index_1.AuthGuardService],
        children: [
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
        ]
    }
];
exports.DashboardRouting = router_1.RouterModule.forChild(DashboardRoutes);
//# sourceMappingURL=dashboard.routes.js.map