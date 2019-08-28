import { Component, OnInit } from '@angular/core';
import { PageLoadingService } from './page-loading.service';

@Component({
    selector: 'page-loading',
    templateUrl: './page-loading.component.html',
    styleUrls: ['./page-loading.component.less']
})
export class PageLoadingComponent implements OnInit {
    public showLoading: boolean = false;
    private message: string;

    constructor(private pageLoadingService: PageLoadingService) { }

    ngOnInit() {
        this.pageLoadingService.showLoading.subscribe(value => {
            this.showLoading = value.show;
            if(value.show){
                this.message = value.message;
            }
        });
    }

}