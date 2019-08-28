import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { SimpleDialogComponent } from './simple-dialog.component';

@Injectable()
export class SimpleDialogService {

    constructor(private dialog: MatDialog) { }

    public open(title: string, content: string, primaryActionDescription: string, error: string, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MatDialogRef<SimpleDialogComponent>;
        let config = new MatDialogConfig();

        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(SimpleDialogComponent, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.content = content;
        dialogRef.componentInstance.primaryActionDescription = primaryActionDescription;
        dialogRef.componentInstance.error = error;
        return dialogRef.afterClosed();
    }
    public close() {
        let dialogRef: MatDialogRef<SimpleDialogComponent>;
        dialogRef.close();
    }
}
