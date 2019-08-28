import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material';
import { BonusAdDialogComponent } from './bonus-ad-dialog/bonus-ad-dialog.component'

@Component({
  selector: 'app-bonus-ad',
  templateUrl: './bonus-ad.component.html',
  styleUrls: ['./bonus-ad.component.less']
})
export class BonusAdComponent implements OnInit {

  dialogResult = "";

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  showBonusAdDialog() {
    let dialogRef = this.dialog.open(BonusAdDialogComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog Closed: ${result}');
      this.dialogResult = result;

    })
  }
}
