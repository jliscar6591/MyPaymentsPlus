import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NutrisliceItemsDialogComponent } from './nutrislice-items-dialog/nutrislice-items-dialog.component';

@Component({
  selector: 'app-nutrislice',
  templateUrl: './nutrislice.component.html',
  styleUrls: ['./nutrislice.component.less']
})
export class NutrisliceComponent implements OnInit {
  public dialogResult: any;
  public mobile: boolean;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
  }

  openNutrisliceMealItems() {
    let dialogRef = this.dialog.open(NutrisliceItemsDialogComponent, {
      width: '750px',
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogResult = result;

    })
  }

}
