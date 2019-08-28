import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { ViewCartComponent } from './view-cart/view-cart.component';
import { ReviewCartComponent } from './review-cart/review-cart.component';

const CheckoutRoutes: Routes = [
    {
        path: '',
        component: ViewCartComponent
    }, 
    {
        path: 'review',
        component: ReviewCartComponent
    }
];

export const CheckoutRouting: ModuleWithProviders = RouterModule.forChild(CheckoutRoutes);
