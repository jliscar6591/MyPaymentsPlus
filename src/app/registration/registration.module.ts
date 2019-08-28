import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';

import { PopoverModule } from '../shared/components/popover/popover.module'
import { SimpleDialogModule } from '../shared/components/simple-dialog/simple-dialog.module'

import { RegistrationRouting } from './registration.routes';

import { SegmentationFormComponent } from './segmentation-form.component'
import { RegistrationFormComponent } from './registration-form.component'
import { RegistrationSetupComponent } from './registration-setup.component'
import { AddStudentFormComponent } from './add-student-form.component'
import { RegistrationBreadcrumbsComponent } from './breadcrumbs/registration-breadcrumbs.component'
import {
    UserDuplicationCheckService, UserCreateService,
    RegistrationBreadcrumbsService, SegmentationSaveService,
    StudentAddService, StudentListService, DistrictContentService
} from './services/index'
import { DistrictListService, StateProvinceListService, AuthGuardService, DistrictLoginDerivedService, ToasterModule,  } from '../shared/services/index';
import { PrivacyDialogComponent } from './privacy-dialog/privacy-dialog.component';
import { TermsDialogComponent } from './terms-dialog/terms-dialog.component'

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        RegistrationRouting,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonModule,
        ToasterModule,
        MatProgressSpinnerModule, 
        MatCheckboxModule,
        PopoverModule,
        MatSelectModule,
        SimpleDialogModule
    ],
    declarations: [
        RegistrationFormComponent,
        SegmentationFormComponent, 
        RegistrationSetupComponent,
        AddStudentFormComponent,
        RegistrationBreadcrumbsComponent,
        PrivacyDialogComponent,
        TermsDialogComponent
    ],
    providers: [
        DistrictListService,
        StateProvinceListService,
        UserDuplicationCheckService,
        AuthGuardService,
        UserCreateService,
        RegistrationBreadcrumbsService,
        SegmentationSaveService,
        DistrictLoginDerivedService,
        StudentAddService,
        StudentListService,
        DistrictContentService
    ]
})

export class RegistrationModule {

}
