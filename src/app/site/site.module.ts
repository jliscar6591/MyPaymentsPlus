import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PopoverModule } from '../shared/components/popover/popover.module';
import { AccountModule } from './account/account.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CheckoutModule } from './checkout/checkout.module';
import { SiteRouting } from './site.routes';
import { SiteHomeComponent } from './site-home.component';
import { PageLoadingModule } from '../shared/components/page-loading/page-loading.module';
import { PurchaseBannerService } from '../shared/components/purchase-banner/purchase-banner.service';
import { ValidCartCountService, MultiDistrictService } from '../site/services/index';
import {
  DistrictListService, StateProvinceListService, AuthGuardService, DistrictLoginDerivedService,
  ToasterModule, ValidateCookieService
} from '../shared/services/index';
import { ActivitiesModule } from 'app/site/activities/activities.module';
import { MatDialogModule } from '@angular/material';
import { MatBadgeModule } from '@angular/material/badge';
import { AutoEnrollActivitiesService } from './services/auto-enroll-activities.service';
import { AutoEnrollDialogComponent } from './dashboard/auto-enroll-dialog/auto-enroll-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MealsAddBottomSheetComponent } from './dashboard/meals/meals-add-bottom-sheet.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { ExamsComponent } from './exams/exams.component';
import { OrientationDialogComponent } from './dashboard/orientation-dialog/orientation-dialog.component';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SiteRouting,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    ToasterModule,
    PopoverModule,
    MatChipsModule,
    AccountModule,
    MatExpansionModule,
    MatRadioModule,
    DashboardModule,
    CheckoutModule,
    PageLoadingModule,
    ActivitiesModule,
    MatDialogModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  declarations: [
    SiteHomeComponent,
    AutoEnrollDialogComponent,
    ExamsComponent
  ],
  providers: [
    ValidateCookieService,
    AuthGuardService,
    PurchaseBannerService,
    ValidCartCountService,
    MultiDistrictService,
    AutoEnrollActivitiesService
  ],
  entryComponents: [
    AutoEnrollDialogComponent,
    MealsAddBottomSheetComponent,
    OrientationDialogComponent
  ]
})

export class SiteModule {

}
