import { Component, OnInit, Inject, } from '@angular/core';
import { MatRadioChange, MatRadioButton } from '@angular/material';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../../../login/model/index';
import { LoginStoreService } from '../../../shared/services/index';
import { OrientationService } from '../../services/orientation.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSelectionListChange } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { AutoEnrollDialogComponent } from '../../dashboard/auto-enroll-dialog/auto-enroll-dialog.component';
import { ActivitiesService } from '../../services/activities.service';
import { ValidCartCountService, TransfersService, CartCheckoutService, MultiDistrictService, FeesService, AddCartItemService, CartCheckoutItemsService } from '../../../site/services/index';
import { Plugins } from '@capacitor/core';
import { UserContextService } from '../../../site/account/services/index';
import { FormControl } from '@angular/forms';
import { SiteHomeComponent } from '../../../site/site-home.component';


@Component({
  selector: 'app-orientation-dialog',
  templateUrl: './orientation-dialog.component.html',
  styleUrls: ['./orientation-dialog.component.less']
})
export class OrientationDialogComponent implements OnInit {
  public responses: any;
  public isMobile: boolean;
  public mrChange: any;
  private loginResponse: LoginResponseModel;
  public showButton: boolean = false;
  public step = 0;
  public orientationInterval: any;
  public orientationList: any;
  public unsignedDocuments: any;
  public signedDocuments: any;
  public gettingOrientation: boolean = true;
  public hasSigned: boolean;
  public hasUnsigned: boolean;
  public feesList: any;
  public showInCart: boolean;
  public detailedResponses: any;
  public detailedIds: any;
  public autoEnrollActivitiesCounter: number = 0;
  public activitiesList: any;
  public autoCartList: any;
  public autoCartListReady: boolean;
  public autoFeesList: any;
  public autoFeesListReady: boolean;
  public autoEnrollInterval: any;
  public districtHasFees: boolean = false;
  public districtHasActivities: boolean = false;
  public deviceInfo: any;
  public web: boolean;
  public userContextDefault: any;
  public showFees: boolean = true;
  public showActivities: boolean = true;
  public unsignedOrientationList: any = [];
  public answer: boolean = false;

  constructor(
    private router: Router,
    private loginStoreSvc: LoginStoreService,
    public orientationService: OrientationService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrientationDialogComponent>,
    public dialog: MatDialog,
    private feesService: FeesService,
    private addCartItemService: AddCartItemService,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    private activitiesService: ActivitiesService,
    private userContextService: UserContextService,
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  async ngOnInit() {
    console.log(this.data.orientationList);
    this.orientationList = this.data.orientationList;
    this.responses = [];
    this.autoFeesList = [];
    this.autoEnrollActivitiesCounter = 0;
    this.userContextDefault = this.userContextService.defaultData;
    console.log('uercontext', this.userContextDefault);
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
    if (this.deviceInfo.platform === 'web') {
      this.web = true;
      if (this.userContextDefault.districtHasFees) {
        this.districtHasFees = true;
        this.showFees = true;
      }
      if (this.userContextDefault.districtHasActivities) {
        this.districtHasActivities = true;
        this.showActivities = true;
      }
    } else {
      if (this.userContextDefault.districtHasFees) {
        this.districtHasFees = true;
      }
      if (this.userContextDefault.districtHasActivities) {
        this.districtHasActivities = true;
      }
      if (this.userContextService.defaultData.isMobileMealsOnly === true) {
        this.showFees = false;
        this.showActivities = false;
      } else {
        this.showFees = true;
        this.showActivities = true;

      }
    }
    var i;
    for (i = 0; i < this.orientationList.length; i++) {
      if (this.orientationList[i].orientation.signedDocuments.length > 0) {
        this.hasSigned = true;
      }
      if (this.orientationList[i].orientation.unsignedDocuments.length > 0) {
        this.hasUnsigned = true;
        this.unsignedOrientationList.push(this.orientationList[i]);
      }
    }
    this.gettingOrientation = false;
    clearInterval(this.orientationInterval);
    console.log('unsigned orientationLists', this.unsignedOrientationList);
    console.log('orientation list', this.orientationList);
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if (this.step === this.unsignedOrientationList.length - 1) {

    }
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  public onCheckBoxChange(event, studentIndex, documentIndex, item, student) {
    item.checked = !item.checked;
    // console.log('checked?', item.checked);
    if (item.checked) {
      // console.log(studentIndex, documentIndex, event, item);
      let response = {
        'accountBalanceID': student.accountBalanceID,
        'orientationItemID': item.orientationItemId,
        'signed': item.checked
      }
      this.responses.push(response);
      // console.log("responses", this.responses);
      this.nextStep();
    } else {
      var i;
      for (i = 0; i < this.responses.length; i++) {
        if (this.responses[i].orientationItemID === item.orientationItemId) {
          this.responses.splice(i, 1);
        }

      }
    }
  }

  public onChangeAgree(mrChange: MatRadioChange, studentIndex, documentIndex, item, student) {
    console.log(mrChange.value);
    console.log(studentIndex, documentIndex, item, student);
    let mrButton: MatRadioButton = mrChange.source;
    if (mrChange.value == 1) {
      this.answer = true;
    } else {
      this.answer = false;
    }
    let response = {
      'accountBalanceID': student.accountBalanceID,
      'orientationItemID': item.orientationItemId,
      'signed': this.answer
    }
    var i;
    for (i = 0; i < this.responses.length; i++) {
      if (this.responses[i].orientationItemID === item.orientationItemId) {
        this.responses.splice(i, 1)
      }
    }
    this.responses.push(response);
    this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
    console.log("responses", this.responses);
    this.nextStep();
  }

  public onChangeYes(mrChange: MatRadioChange, studentIndex, documentIndex, item, student) {
    console.log(mrChange.value);
    console.log(studentIndex, documentIndex, item, student);
    console.log(studentIndex, documentIndex, item, student);
    let mrButton: MatRadioButton = mrChange.source;
    this.showButton = true;
    console.log(mrButton.name);
    console.log(mrButton.checked);
    console.log(mrButton.inputId);
    if (mrChange.value == 1) {
      this.answer = true;
    } else {
      this.answer = false;
    }
    let response = {
      'accountBalanceID': student.accountBalanceID,
      'orientationItemID': item.orientationItemId,
      'signed': this.answer
    }
    var i;
    for (i = 0; i < this.responses.length; i++) {
      if (this.responses[i].orientationItemID === item.orientationItemId) {
        this.responses.splice(i, 1)
      }
    }
    this.responses.push(response);
    this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
    console.log("responses", this.responses);
    this.nextStep();
  }

  public async signDocuments() {
    this.gettingOrientation = true;
    this.orientationService.orientationList
    this.unsignedOrientationList = [];
    await this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
    await this.orientationService.subscribeToGetOrientationAutoEnroll(this.loginResponse);
    this.orientationInterval = await setInterval(() => {
      if (this.orientationService.orientationResponse) {
        var i;
        for (i = 0; i < this.orientationList.length; i++) {
          if (this.orientationList[i].orientation.signedDocuments.length > 0) {
            this.hasSigned = true;
          }
          if (this.orientationList[i].orientation.unsignedDocuments.length > 0) {
            this.hasUnsigned = true;
            this.unsignedOrientationList.push(this.orientationList[i]);
          }
        }
        console.log('response', this.orientationService.orientationResponse);
        this.gettingOrientation = false;
        this.responses = [];
        if (this.unsignedOrientationList.length === 0) {
          if (this.activitiesService.activitiesList && this.feesService.feesList && this.autoEnrollActivitiesCounter === 0) {
            if (this.districtHasFees || this.districtHasActivities) {
              console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
              this.openAutoEnrollDialog();
              this.autoEnrollActivitiesCounter++;
              this.gettingOrientation = false;
              this.dialogRef.close();
            }
          } else {
            this.gettingOrientation = false;
            this.dialogRef.close();
          }
        }
        this.gettingOrientation = false;
        this.openSnackBar();
        clearInterval(this.orientationInterval);
      }
    }, 1000);
  }

  public ngDoCheck() {
    if (this.orientationService.orientationAutoEnrollList.length === 0) {
      this.onNoClick();
    }
  }

  openSnackBar() {

    this.snackBar.open('Documents Submitted', '✔', {
      duration: 2000,
    });
  }

  //closes dialog
  async onNoClick() {
    console.log(this.activitiesService.activitiesList, this.feesService.feesList, this.autoEnrollActivitiesCounter);
    if (this.activitiesService.activitiesList || this.feesService.feesList && this.autoEnrollActivitiesCounter === 0) {
      console.log(this.userContextDefault.districtHasFees, this.userContextDefault.districtHasActivities)
      if (this.userContextDefault.districtHasFees || this.userContextDefault.districtHasActivities) {
        console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
        this.openAutoEnrollDialog();
        this.autoEnrollActivitiesCounter++;
      }
    }
    this.dialogRef.close();
  }

  public openAutoEnrollDialog() {
    if (this.activitiesService.activitiesList) {
      this.autoCartList = [];
      this.activitiesList = this.activitiesService.activitiesList;
      var i;
      for (i = 0; i < this.activitiesList.length; i++) {
        var j;
        for (j = 0; j < this.activitiesList[i].accounts.length; j++) {
          var k;
          for (k = 0; k < this.activitiesList[i].accounts[j].activities.length; k++) {
            if (this.activitiesList[i].accounts[j].activities[k].isSuggested && !this.activitiesList[i].accounts[j].activities[k].isInCart) {
              this.autoCartList.push(this.activitiesList[i].accounts[j].activities[k]);
            }
          }
        }
        var l;
        for (l = 0; l < this.activitiesList[i].subCategory.length; l++) {
          var m;
          for (m = 0; m < this.activitiesList[i].subCategory[l].accounts.length; m++) {
            var n;
            for (n = 0; n < this.activitiesList[i].subCategory[l].accounts[m].activities.length; n++) {
              if (this.activitiesList[i].subCategory[l].accounts[m].activities[n].isSuggested && !this.activitiesList[i].subCategory[l].accounts[m].activities[n].isInCart) {
                this.autoCartList.push(this.activitiesList[i].subCategory[l].accounts[m].activities[n]);
              }
            }
          }
        }
        if (i + 1 == this.activitiesList.length) {
          this.autoCartListReady = true;
        }
      }
    } else {
      this.autoCartListReady = true;
    }
    if (this.feesService.feesList.length > 0) {
      this.feesList = this.feesService.feesList;
      console.log('feeslist', this.feesList);
      var o;
      for (o = 0; o < this.feesList.length; o++) {
        var p;
        for (p = 0; p < this.feesList[o].fees.length; p++) {
          if (this.feesList[o].fees[p].isAutoAddToCart && !this.feesList[o].fees[p].isInCart) {
            this.feesList[o].fees[p].name = this.feesList[o].name;
            this.feesList[o].fees[p].studentKey = this.feesList[o].studentKey;
            this.feesList[o].fees[p].insideIndex = p;
            this.feesList[o].fees[p].outsideIndex = o;
            this.autoFeesList.push(this.feesList[o].fees[p]);
          }
        }
        if (o + 1 == this.feesList.length) {
          this.autoFeesListReady = true;
        }
      }
    } else {
      this.autoFeesListReady = true;
    }
    console.log('autoCartList', this.autoCartList);
    console.log('autoFeesList', this.autoFeesList);
    console.log('cart list ready', this.autoCartListReady);
    console.log('fees list ready', this.autoFeesListReady);
    if (this.autoCartListReady && this.autoFeesListReady && (this.autoFeesList.length > 0 || this.autoCartList.length > 0)) {
      console.log('do we get to where the activities open');
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
      config.maxHeight = '750px';
      config.width = '650px';
      config.data = {
        feesList: this.autoFeesList,
        cart: this.autoCartList
      };
      config.disableClose = true;
      console.log(config.data);
      const dialogRef = this.dialog.open(AutoEnrollDialogComponent, config)

      dialogRef.afterClosed().subscribe(result => {
        this.feesService.subscribeToGetFees(this.loginResponse);
      });
      this.autoEnrollActivitiesCounter = 1;
    } else {
      this.autoEnrollActivitiesCounter = 1;
    }

  }

  public ngOnDestroy() {
    this.orientationService.subscribeToGetOrientationAutoEnroll(this.loginResponse);
  }

}
