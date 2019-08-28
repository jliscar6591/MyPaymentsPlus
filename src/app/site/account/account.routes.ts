import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountHomeComponent } from './account-home.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodAutopayComponent } from './payment-method/payment-method-autopay.component';
import { AlertsComponent } from './alerts/alerts.component';
//import { ManageStudentsComponent } from './manage-students/manage-students.component';
//import { MealPurchasesComponent } from './meal-purchases/meal-purchases.component';
//import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from '../../shared/services/index';
//import {FroLaunchComponent } from './fro/fro-launch.component'

const AccountRoutes: Routes = [
  {
    path: '',
    component: AccountHomeComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
          path: 'payment-method',
          component: PaymentMethodAutopayComponent
      },
      //{
      //    path: 'alerts',
      //    component: AlertsComponent
      //},
      //{
      //    path: 'manage-students',
      //    component: ManageStudentsComponent
      //},
      //{
      //    path: 'meal-purchases',
      //    component: MealPurchasesComponent
      //},
      //{
      //    path: 'payment-history',
      //    component: PaymentHistoryComponent
      //},
      //{
      //    path: 'fro-launch',
      //    component: FroLaunchComponent
      //}

    ]
  },
  {
    canActivate: [AuthGuardService],
    path: 'account',
    redirectTo: '/account/profile',
    pathMatch: 'full'
  }
];

//export const AccountRouting: ModuleWithProviders = RouterModule.forChild(AccountRoutes);
@NgModule({
  imports: [
    RouterModule.forChild(AccountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRouting { }
