import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';

//import { CdkTableModule } from '@angular/cdk/table';
import { AccordionModule } from '../../shared/components/accordion/accordion.module';
import { ReceiptModule } from '../../shared/components/receipt/receipt.module';

import { PopoverModule } from '../../shared/components/popover/popover.module';
import { SimpleDialogModule } from '../../shared/components/simple-dialog/simple-dialog.module';
import { StudentListService } from '../../registration/services/index'
import { AlertLevelComponent } from './alerts/alert-level.component';
import { AccountRouting } from './account.routes';
import { AccountHomeComponent } from './account-home.component'
import { ProfileComponent } from './profile/profile.component'

import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { AutopayComponent } from './payment-method/autopay.component';
import { PaymentMethodAutopayComponent } from './payment-method/payment-method-autopay.component';

import { AlertsComponent } from './alerts/alerts.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { MealPurchasesComponent } from './meal-purchases/meal-purchases.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { FroLaunchComponent } from './fro/fro-launch.component';
import { FroStartComponent } from './fro/fro-start.component'
import { MatDividerModule } from '@angular/material/divider';
import { FroStatusComponent } from './fro/fro-status.component'
import { CreditCardFormatPipe } from "./pipes/index";
import {
  UserContextService,
  StudentBalanceAlertService,
  ProfileUserprofileService,
  ProfileProfileCoreService,
  ProfileRelationshipService,
  ProfileEmailPreferenceService,
  AuthNewPasswordService,
  PaymentMethodService,
  PaymentAddService,
  ExpiredCard,
  StudentMealPurchasesService,
  PaymentUtilityService,
  PaymentAutoPayService,
  PaymentHistoryService,
  CreditcardValidationService,
  FroAppAvailabilityService,
  FroAppStatusService
} from './services/index';
import {
  UtilityService,
  DateRangeSelectorService
} from '../../shared/services/index';
import { SuspendPaymentWarningModule } from '../../shared/components/suspend-payment-warning/suspend-payment-warning.module';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { AccountDesktopComponent } from './account-desktop/account-desktop.component';
import { AccountMobileComponent } from './account-mobile/account-mobile.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccountRouting,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSlideToggleModule,
    NgxPaginationModule,
    SuspendPaymentWarningModule,
    PopoverModule,
    SimpleDialogModule,
    AccordionModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ReceiptModule,
    MatDividerModule
  ],
  declarations: [
    AccountHomeComponent,
    ProfileComponent,
    AlertsComponent,
    ManageStudentsComponent,
    MealPurchasesComponent,
    PaymentHistoryComponent,
    FroLaunchComponent,
    FroStartComponent,
    FroStatusComponent,
    PaymentMethodComponent,
    AutopayComponent,
    PaymentMethodAutopayComponent,
    AlertLevelComponent,
    CreditCardFormatPipe,
    TransferHistoryComponent,
    AccountDesktopComponent,
    AccountMobileComponent
  ],

  providers: [
    UniqueSelectionDispatcher,
    UserContextService,
    ProfileUserprofileService,
    ProfileProfileCoreService,
    ProfileRelationshipService,
    ProfileEmailPreferenceService,
    AuthNewPasswordService,
    StudentBalanceAlertService,
    PaymentMethodService,
    ExpiredCard,
    PaymentUtilityService,
    PaymentAddService,
    UtilityService,
    StudentListService,
    StudentMealPurchasesService,
    PaymentAutoPayService,
    DateRangeSelectorService,
    PaymentHistoryService,
    CreditcardValidationService,
    CreditCardFormatPipe,
    FroAppAvailabilityService,
    FroAppStatusService,
  ]
})

export class AccountModule {

}
