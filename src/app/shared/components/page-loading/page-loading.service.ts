import { Injectable, EventEmitter } from '@angular/core';
import { PageLoadingComponent } from './page-loading.component';

@Injectable()
export class PageLoadingService {
    public showLoading: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    public show(message?: string): void {
        this.showLoading.emit({
            message: message, 
            show: true
        });
    }

    public hide(): void {
        this.showLoading.emit({
            message: '',
            show: false
        });
    }
}