"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var activities_component_1 = require("./activities.component");
var index_1 = require("../../shared/services/index");
var dashboard_home_component_1 = require("../dashboard/dashboard-home.component");
var ActivitiesRoutes = [
    {
        path: '',
        component: activities_component_1.ActivitiesComponent,
        canActivateChild: [index_1.AuthGuardService],
        children: [
            {
                path: 'dashboard',
                component: dashboard_home_component_1.DashboardHomeComponent
            }
        ]
    }
];
exports.ActivitiesRouting = router_1.RouterModule.forChild(ActivitiesRoutes);
//# sourceMappingURL=activities.routes.js.map