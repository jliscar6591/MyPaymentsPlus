import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';

import { SuspendPaymentWarningComponent } from './suspend-payment-warning.component';
import { SuspendPaymentWarningService } from './suspend-payment-warning.service';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        SuspendPaymentWarningComponent
    ],
    providers: [
        SuspendPaymentWarningService
    ],
    exports: [
        SuspendPaymentWarningComponent
    ],
    entryComponents: [
        SuspendPaymentWarningComponent
    ]
})

export class SuspendPaymentWarningModule {

}
