import { Injectable } from '@angular/core';

@Injectable()
export class PurchaseBannerService {
    private showBanner: boolean = false;
    public confirmation: any;

    constructor() { }

    public show(confirmation): void {
        this.showBanner = true;
        this.confirmation = confirmation;
    }

    public hide(): void {
        this.showBanner = false;
    }

    public getBanner(): boolean {
        return this.showBanner;
    }
}
