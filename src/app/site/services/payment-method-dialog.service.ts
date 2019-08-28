import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { PaymentMethodDialogComponent } from '../checkout/review-cart/payment-method-dialog.component';

@Injectable()
export class PaymentMethodDialogService {

    constructor(private dialog: MatDialog) { }

    public open(viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MatDialogRef<PaymentMethodDialogComponent>;
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
        
        config.viewContainerRef = viewContainerRef;
        
      dialogRef = this.dialog.open(PaymentMethodDialogComponent,  config);

        return dialogRef.afterClosed();     
    }
}
