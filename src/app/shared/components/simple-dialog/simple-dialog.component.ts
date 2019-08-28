import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.less']
})
export class SimpleDialogComponent implements OnInit {

  public title: string;
  public content: string;
  public primaryActionDescription: string;
  public error: string;

  constructor(public dialogRef: MatDialogRef<SimpleDialogComponent>  ) { }

  ngOnInit() {
  }

}
