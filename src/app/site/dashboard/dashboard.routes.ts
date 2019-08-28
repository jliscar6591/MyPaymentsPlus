import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { DashboardHomeComponent } from './dashboard-home.component';
import { AuthGuardService } from '../../shared/services/index';
import { TransferFeeComponent } from './transfer/transfer-fee.component';
import { MakeTransferComponent } from './transfer/make-transfer.component';
import { TransferConfirmationComponent } from './transfer/transfer-confirmation.component';


const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardHomeComponent,
        canActivateChild: [AuthGuardService],
        children: [
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
        ]
    }
];

export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(DashboardRoutes);
