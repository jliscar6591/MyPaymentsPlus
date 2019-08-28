import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteHomeComponent } from './site-home.component'
import { ProfileComponent } from './account/profile/profile.component'
import { DashboardHomeComponent } from './dashboard/dashboard-home.component';
import { AccountHomeComponent } from './account/account-home.component';
import { AuthGuardService } from '../shared/services/index';
import { PaymentMethodAutopayComponent } from './account/payment-method/payment-method-autopay.component';
import { AlertsComponent } from './account/alerts/alerts.component';
import { ManageStudentsComponent } from './account/manage-students/manage-students.component';
import { MealPurchasesComponent } from './account/meal-purchases/meal-purchases.component';
import { PaymentHistoryComponent } from './account/payment-history/payment-history.component';
import { FroLaunchComponent } from './account/fro/fro-launch.component';
import { ViewCartComponent } from './checkout/view-cart/view-cart.component';
import { ReviewCartComponent } from './checkout/review-cart/review-cart.component';
import { TransferFeeComponent } from './dashboard/transfer/transfer-fee.component';
import { MakeTransferComponent } from './dashboard/transfer/make-transfer.component';
import { TransferConfirmationComponent } from './dashboard/transfer/transfer-confirmation.component';
import { TransferHistoryComponent } from './account/transfer-history/transfer-history.component';
import { ActivitiesComponent } from './activities/activities.component';
import { FeesComponent } from './dashboard/fees/fees.component';
import { MealsComponent } from './dashboard/meals/meals.component';
import { NutrisliceComponent } from './dashboard/nutrislice/nutrislice.component';
import { FeedbackComponent } from './dashboard/feedback/feedback.component';
import { OrientationsComponent } from './dashboard/orientations/orientations.component';
import { ExamsComponent } from './exams/exams.component';

const SiteRoutes: Routes = [
  {
    path: '',
    component: SiteHomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardHomeComponent
      },
      {
        path: 'activities',
        component: ActivitiesComponent
      },
      {
        path: 'orientations',
        component: OrientationsComponent
      },
      {
        path: 'exams',
        component: ExamsComponent
      },
      {
        path: 'fees',
        component: FeesComponent
      },
      {
        path: 'meals',
        component: MealsComponent
      },
      {
        path: 'nutrislice',
        component: NutrisliceComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'account',
        component: AccountHomeComponent,
        canActivateChild: [AuthGuardService],
        children: [
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: '',
            component: ProfileComponent
          },
          {
            path: 'payment-method',
            component: PaymentMethodAutopayComponent
          },
          {
            path: 'alerts',
            component: AlertsComponent
          },
          {
            path: 'manage-students',
            component: ManageStudentsComponent
          },
          {
            path: 'meal-purchases',
            component: MealPurchasesComponent
          },
          {
            path: 'payment-history',
            component: PaymentHistoryComponent
          },
          {
            path: 'fro-launch',
            component: FroLaunchComponent
          },
          {
            path: 'transfer-history',
            component: TransferHistoryComponent
          }
        ]
      },
      {
        path: 'checkout',
        component: ViewCartComponent
      },
      {
        path: 'review',
        component: ReviewCartComponent
      },
      {
        path: 'transfer-fee',
        component: TransferFeeComponent
      },
      {
        path: 'make-transfer',
        component: MakeTransferComponent
      },
      {
        path: 'transfer-confirmation',
        component: TransferConfirmationComponent
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
@NgModule({
  imports: [
    RouterModule.forChild(SiteRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SiteRouting { }



