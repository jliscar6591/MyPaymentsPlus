import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardRouting } from './dashboard.routes';
import { DashboardHomeComponent } from './dashboard-home.component';
import { MealsComponent } from './meals/meals.component';
import { MealsEmptyComponent } from './meals/meals-empty.component';
import { MealsListComponent } from './meals/meals-list.component';
import { MealsListAddToCartComponent } from './meals/meals-list-add-to-cart.component';
import { MealsListAddToCartMobileComponent } from './meals/meals-list-add-to-cart-mobile.component';
import { DistrictMessageComponent } from './district-message/district-message.component';
import { MobileDistrictMessageComponent } from './district-message/mobile-district-message.component';
import { PurchaseBannerComponent } from '../../shared/components/purchase-banner/purchase-banner.component';
import { ReceiptModule } from '../../shared/components/receipt/receipt.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackDialogComponent } from './feedback/feedback-dialog.component';
import { FeedbackDialogService } from '../services/feedback-dialog.service';
import { SuspendPaymentWarningModule } from '../../shared/components/suspend-payment-warning/suspend-payment-warning.module';
import { SimpleDialogModule } from '../../shared/components/simple-dialog/simple-dialog.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatGridListModule } from '@angular/material';
import { UtilityService } from '../../shared/services/index';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import {
  StudentMealsService,
  StudentMealsServiceRemote,
  AddCartItemService,
  DashboardDistrictMessageService,
  FeedbackService,
  TransfersService,
  FeesService,
  BonusScheduleService
} from '../services/index';
import { TransferFeeComponent } from './transfer/transfer-fee.component';
import { MakeTransferComponent } from './transfer/make-transfer.component';
//import { FormatmoneyPipe } from './pipes/formatmoney.pipe';
import { TransferConfirmationComponent } from './transfer/transfer-confirmation.component';
import { BonusAdComponent } from './bonus-ad/bonus-ad.component';
import { BonusAdDialogComponent } from './bonus-ad/bonus-ad-dialog/bonus-ad-dialog.component';
import { FeesComponent } from './fees/fees.component';
import { FeesListComponent } from './fees/fees-list.component';
import { FeesDetailsComponent } from './fees/fees-details.component';
import { FeesListEmptyComponent } from './fees/fees-list-empty.component';
import { FeesDialogComponent } from './fees/fees-dialog.component';
import { NutrisliceComponent } from './nutrislice/nutrislice.component';
import { NutrisliceItemsDialogComponent } from './nutrislice/nutrislice-items-dialog/nutrislice-items-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageLoadingModule } from '../../shared/components/page-loading/page-loading.module';
import { AutoEnrollFormsComponent } from './auto-enroll-dialog/auto-enroll-forms.component';
import { ActivitiesModule } from '../activities/activities.module';
import { FormsDialogComponent } from '../activities/forms/forms-dialog/forms-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AutoEnrollBottomSheetComponent } from './auto-enroll-dialog/auto-enroll-bottom-sheet/auto-enroll-bottom-sheet.component';
import { MealsAddBottomSheetComponent } from './meals/meals-add-bottom-sheet.component';
import { MatDividerModule } from '@angular/material/divider';
import { OrientationsComponent } from './orientations/orientations.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { OrientationDialogComponent } from './orientation-dialog/orientation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRouting,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    FormsModule,
    SuspendPaymentWarningModule,
    SimpleDialogModule,
    ReceiptModule,
    FlexLayoutModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    PageLoadingModule,
    MatTabsModule,
    MatSidenavModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatGridListModule,
    MatDividerModule,
    MatToolbarModule,
    MatBadgeModule,
    NgxBarcodeModule
  ],
  declarations: [
    DashboardHomeComponent,
    MealsComponent,
    MealsEmptyComponent,
    MealsListComponent,
    DistrictMessageComponent,
    MobileDistrictMessageComponent,
    MealsListAddToCartComponent,
    MealsListAddToCartMobileComponent,
    PurchaseBannerComponent,
    FeedbackComponent,
    FeedbackDialogComponent,
    TransferFeeComponent,
    MakeTransferComponent,
    //FormatmoneyPipe,
    TransferConfirmationComponent,
    BonusAdComponent,
    BonusAdDialogComponent,
    FeesComponent,
    FeesListComponent,
    FeesDetailsComponent,
    FeesListEmptyComponent,
    FeesDialogComponent,
    BonusAdDialogComponent,
    NutrisliceComponent,
    NutrisliceItemsDialogComponent,
    MobileDistrictMessageComponent,
    AutoEnrollFormsComponent,
    AutoEnrollBottomSheetComponent,
    MealsAddBottomSheetComponent,
    OrientationsComponent,
    OrientationDialogComponent
  ],
  providers: [
    MobileDistrictMessageComponent,
    StudentMealsService,
    StudentMealsServiceRemote,
    UtilityService,
    AddCartItemService,
    DashboardDistrictMessageService,
    FeedbackDialogService,
    FeedbackService,
    FormsModule,
    TransfersService,
    CurrencyPipe,
    BonusScheduleService,
    FeesService,
    MealsComponent
  ],
  entryComponents: [
    FeedbackDialogComponent,
    FeesDialogComponent,
    NutrisliceItemsDialogComponent,
    AutoEnrollFormsComponent,
    AutoEnrollBottomSheetComponent,
    MealsAddBottomSheetComponent
  ]
})

export class DashboardModule { }
