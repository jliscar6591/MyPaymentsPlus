import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule   } from '@angular/router';

import { SupplementalComponent } from './supplemental.component'
import { SupplementalAboutComponent } from './supplemental-about.component'
import { SupplementalPrivacyComponent } from './supplemental-privacy.component'
import { SupplementalSupportComponent } from './supplemental-support.component'
import { SupplementalTermsComponent } from './supplemental-terms.component'
import { SupplementalEmailComponent } from './supplemental-email.component'


const SupplementalRoutes: Routes = [
    {
        path: '',
        component: SupplementalComponent, 
        children: [
            {
                path: 'about',
                component: SupplementalAboutComponent
            },
            {
                path: 'privacy-policy',
                component: SupplementalPrivacyComponent
            },
            {
                path: 'terms',
                component: SupplementalTermsComponent
            },
            {
                path: 'support',
                component: SupplementalSupportComponent
            }
        ]
    },
    {
        path: 'contact-offline',
        component: SupplementalEmailComponent
    },
    {
        path: '',
        redirectTo: '/support',
        pathMatch: 'full'
    }
];

export const SupplementalRouting: ModuleWithProviders = RouterModule.forChild(SupplementalRoutes);
