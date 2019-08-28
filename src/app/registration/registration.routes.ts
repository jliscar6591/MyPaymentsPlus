import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule   } from '@angular/router';

import { RegistrationFormComponent } from './registration-form.component';
import { SegmentationFormComponent } from './segmentation-form.component';
import { RegistrationSetupComponent } from './registration-setup.component';
import { AddStudentFormComponent } from './add-student-form.component';
import { AuthGuardService } from '../shared/services/index';


const RegistrationRoutes: Routes = [
    {
        path: 'register',
        component: RegistrationFormComponent
    },
    {
        path: 'setup',
        component: RegistrationSetupComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'relationship',
                pathMatch: 'full'
            },
            {
                path: 'relationship',
                component: SegmentationFormComponent
            },
            {
                path: 'add-student',
                component: AddStudentFormComponent
            },
        ]
    },
    {
        path: '',
        redirectTo: '/register',
        pathMatch: 'full'
    }
];

export const RegistrationRouting: ModuleWithProviders = RouterModule.forChild(RegistrationRoutes);
