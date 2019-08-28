import { Component, OnInit } from '@angular/core';
import { SupplementalPrivacyComponent } from '../../site/supplemental/supplemental-privacy.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-privacy-dialog',
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.less']
})
export class PrivacyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PrivacyDialogComponent>, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
   
  }

}
