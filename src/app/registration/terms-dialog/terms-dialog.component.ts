import { Component, OnInit } from '@angular/core';
import { SupplementalTermsComponent } from '../../site/supplemental/supplemental-terms.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.less']
})
export class TermsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
