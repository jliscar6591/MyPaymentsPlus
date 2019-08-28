import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LoginModel, LoginResponseModel } from '../../../../login/model/index';
import {
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../../shared/services/index';

@Component({
  selector: 'app-nutrislice-items-dialog',
  templateUrl: './nutrislice-items-dialog.component.html',
  styleUrls: ['./nutrislice-items-dialog.component.less']
})
export class NutrisliceItemsDialogComponent implements OnInit {
  private loginResponse: LoginResponseModel;
  

  constructor(
    public dialogRef: MatDialogRef<NutrisliceItemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private messageProcessorService: MessageProcessorService,
    private loginSrvcStore: LoginStoreService
  ) {
    this.loginResponse = this.loginSrvcStore.cookieStateItem;
    dialogRef.disableClose = true;
  }

  ngOnInit() {

  }

  onCloseConfirm() {
    this.dialogRef.close('Confirm');
  }

  onNoClick() {
    this.dialogRef.close(_result => 'result');
  }
}
