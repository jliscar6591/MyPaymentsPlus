import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { ActivitiesComponent } from './activities.component';
import { AuthGuardService } from '../../shared/services/index';
import { DashboardHomeComponent } from '../dashboard/dashboard-home.component';


const ActivitiesRoutes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardHomeComponent
      }
    ]
  }
];

export const ActivitiesRouting: ModuleWithProviders = RouterModule.forChild(ActivitiesRoutes);
