import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatSidenavModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';

import { AccordionModule } from '../../shared/components/accordion/accordion.module';
import { SupplementalRouting } from './supplemental.routes';

import { SupplementalComponent } from './supplemental.component'
import { SupplementalAboutComponent } from './supplemental-about.component'
import { SupplementalPrivacyComponent } from './supplemental-privacy.component'
import { SupplementalSupportComponent } from './supplemental-support.component'
import { SupplementalTermsComponent } from './supplemental-terms.component'
import { SupplementalEmailComponent } from './supplemental-email.component'
import { SupportRequestService, ToasterModule } from '../../shared/services/index'


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SupplementalRouting,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        AccordionModule,
        MatProgressSpinnerModule,
        ToasterModule,
        MatSelectModule
    ],
    declarations: [
        SupplementalComponent,
        SupplementalAboutComponent,
        SupplementalPrivacyComponent,
        SupplementalSupportComponent,
        SupplementalTermsComponent,
        SupplementalEmailComponent
    ],
    providers: [SupportRequestService]
})

export class SupplementalModule {

}
