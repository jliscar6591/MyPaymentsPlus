import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatDialogModule,
  MatRadioModule,
  MatCheckboxModule
} from '@angular/material';
import {
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { CheckoutRouting } from './checkout.routes';
import { UtilityService } from '../../shared/services/index';
import { CartCheckoutService, CartCheckoutItemsService, AddCartItemService } from '../services/index';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { CartItemComponent } from './cart/cart-item.component';
import { CartComponent } from './cart/cart.component';
import { ReviewCartComponent } from './review-cart/review-cart.component';
import { PaymentMethodDialogComponent } from './review-cart/payment-method-dialog.component';
import { PaymentMethodDialogService } from '../services/payment-method-dialog.service';
import { PageLoadingModule } from '../../shared/components/page-loading/page-loading.module';
import { ReceiptModule } from '../../shared/components/receipt/receipt.module';
import { FormsDialogComponent } from '../activities/forms/forms-dialog/forms-dialog.component';
import { FormsService } from '../services/forms.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckoutRouting,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    PageLoadingModule,
    ReceiptModule,
    MatSnackBarModule
  ],
  declarations: [
    ViewCartComponent,
    CartItemComponent,
    CartComponent,
    ReviewCartComponent,
    PaymentMethodDialogComponent,
  ],
  providers: [
    CartCheckoutService,
    CartCheckoutItemsService,
    AddCartItemService,
    UtilityService,
    PaymentMethodDialogService,
    FormsService,
  ],
  entryComponents: [
    PaymentMethodDialogComponent,
    CartItemComponent,
    FormsDialogComponent
  ]
})

export class CheckoutModule {

}
