import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.less']
})
export class PictureDialogComponent implements OnInit {
  public mobile: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
