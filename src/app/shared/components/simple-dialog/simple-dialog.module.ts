import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';

import { SimpleDialogComponent } from './simple-dialog.component';
import { SimpleDialogService } from './simple-dialog.service';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        SimpleDialogComponent
    ],
    providers: [
        SimpleDialogService
    ],
    exports: [
        SimpleDialogComponent
    ],
    entryComponents: [
        SimpleDialogComponent
    ]
})

export class SimpleDialogModule {

}
