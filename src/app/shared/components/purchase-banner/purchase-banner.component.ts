import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseBannerService } from './purchase-banner.service';

@Component({
    selector: 'purchase-banner',
    templateUrl: './purchase-banner.component.html',
    styleUrls:['./purchase-banner.component.less']
})

export class PurchaseBannerComponent {
  @Input() show: boolean;
  
  constructor(private purchaseBannerService: PurchaseBannerService) { }

  
    closeBanner() {
        this.show = false;
        this.purchaseBannerService.hide();
    }
}
