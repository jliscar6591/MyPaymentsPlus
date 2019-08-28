import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material';
//Local
import { ReceiptComponent } from '../../../shared/components/receipt/receipt.component';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import { PageLoadingModule } from '../../../shared/components/page-loading/page-loading.module';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    PageLoadingModule,
    MatCardModule
  ],
  declarations: [
    ReceiptComponent
  ],
  exports: [
    ReceiptComponent
  ],
  providers: [
    ReceiptService
  ],
  entryComponents: [
    ReceiptComponent
  ]
})
export class ReceiptModule { }
