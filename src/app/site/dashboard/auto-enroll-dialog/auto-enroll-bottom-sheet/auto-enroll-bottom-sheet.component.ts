import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';


@Component({
  selector: 'app-auto-enroll-bottom-sheet',
  templateUrl: './auto-enroll-bottom-sheet.component.html',
  styleUrls: ['./auto-enroll-bottom-sheet.component.less']
})
export class AutoEnrollBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AutoEnrollBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any)
  { }

  ngOnInit() {
    //console.log(this.data);
  }

  public closeSheet() {
    this.bottomSheetRef.dismiss();
  }
}
