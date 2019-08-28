import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        PageLoadingComponent
    ],
    providers: [
        PageLoadingService
    ],
    exports: [
        PageLoadingComponent
    ],
    entryComponents: [
        PageLoadingComponent
    ]
})

export class PageLoadingModule {

}
