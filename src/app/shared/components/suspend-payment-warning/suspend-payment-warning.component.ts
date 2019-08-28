import { Component, Input } from '@angular/core';
import { SuspendPaymentWarningService } from './suspend-payment-warning.service';

@Component({
    selector: 'suspend-payment-warning',
    templateUrl: './suspend-payment-warning.component.html',
    styleUrls: ['./suspend-payment-warning.component.less']
})

export class SuspendPaymentWarningComponent {
    constructor(
        public suspendPaymentWarningService: SuspendPaymentWarningService
    ) { }
}
