import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { FeedbackDialogComponent } from '../dashboard/feedback/feedback-dialog.component';

@Injectable()
export class FeedbackDialogService {

    constructor(private dialog: MatDialog) { }

    public open(returnToClassic: boolean, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MatDialogRef<FeedbackDialogComponent>;
        let config = new MatDialogConfig();
        
      config.viewContainerRef = viewContainerRef;
      config.panelClass = 'center-width-dialog';
      
        
      dialogRef = this.dialog.open(FeedbackDialogComponent, config);
        dialogRef.componentInstance.returnToClassic = returnToClassic;

        return dialogRef.afterClosed();     
    }
}
