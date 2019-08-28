import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule   } from '@angular/router';

import { LoginHomeComponent } from './login-home/login-home.component'
import { LoginComponent } from './login-home/login.component'
import { ChangePasswordComponent } from './reset-password/change-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { RequestPasswordChangeComponent } from './reset-password/request-password-change.component'

const LoginRoutes: Routes = [
    {
        path: 'welcome',
        component: LoginHomeComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        children: [
            {
                path: '',
                component: RequestPasswordChangeComponent,
                pathMatch: 'full'
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            }, 
        ]
    },
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    }
];


export const LoginRouting: ModuleWithProviders = RouterModule.forChild(LoginRoutes);
