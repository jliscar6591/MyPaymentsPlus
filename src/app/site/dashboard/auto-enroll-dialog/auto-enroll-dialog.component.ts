import { FeeDetails } from 'app/site/dashboard/fees/fees-details.component';
import { Component, OnInit, Inject, Output, EventEmitter, QueryList, } from '@angular/core';
import { ActivitiesService, FeesService, TransfersService, CartCheckoutService, CartCheckoutItemsService, MultiDistrictService, StudentMealsService, ValidCartCountService, AddCartItemService } from '../../services/index';
import { UserContextService } from '../../account/services/index';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import { MatRadioChange, MatRadioButton } from '@angular/material';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from '../../../app.settings';
import { FeesList, FeeItems, CartAddAmount, CartItem, CartResponse, FeeCartDetail } from 'app/site/model';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as FeeStoreActions from '../../../shared/store/actions/feeStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { FeesComponent } from 'app/site/dashboard/fees/fees.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSelectionListChange } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgModel } from '@angular/forms';
import { FormsDialogComponent } from '../../activities/forms/forms-dialog/forms-dialog.component';
import { FormsService } from '../../services/forms.service';
import { AutoEnrollFormsComponent } from './auto-enroll-forms.component';
import { Activities } from 'app/site/model/activities.model';
import { ActivityCartDetail } from 'app/site/model/activity-cart-detail.model';
import { Plugins } from '@capacitor/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { AutoEnrollBottomSheetComponent } from '../auto-enroll-dialog/auto-enroll-bottom-sheet/auto-enroll-bottom-sheet.component';
import { OrientationService } from '../../services/orientation.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-auto-enroll-dialog',
  templateUrl: './auto-enroll-dialog.component.html',
  styleUrls: ['./auto-enroll-dialog.component.less'],
  providers: [FormsService]
})
export class AutoEnrollDialogComponent implements OnInit {
  public feeStore: Observable<FeesList[]>;
  public feeState: any;
  public feesList: any;
  public activitiesList: any;
  public feeDetails: FeeItems[];
  public mrChange: any;
  private loginResponse: LoginResponseModel;
  public showButton: boolean = false;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public cart: any;
  public activities: any;
  public selectedActivities: any;
  public selectedFees: any;
  public newForms: any;
  public autoCartList: any;
  public broadCastDetail;
  public listReady: boolean = false;
  public selectedAllArray: any;
  public autoCartAllList: any;
  public autoFeesList: any;
  public cartResponse: any;
  public newFormsCounter: number = 0;
  public activitiesWithForms: any;
  public selectedAllTotal: number = 0;
  public mobile: boolean;
  public selectAll: boolean = false;
  public step = 0;
  public orientationInterval: any;
  public orientationList: any;
  public responses: any = [];
  public hasOrientations: boolean = false;
  public gettingOrientation: boolean;
  public formInterval: any;
  public newlySelected: any = [];
  public account: any;
  public currentFeeSelection: any;

  constructor(
    private addCartItemService: AddCartItemService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AutoEnrollDialogComponent>,
    private loginStoreSvc: LoginStoreService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private feesService: FeesService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    private districtLoginDerivedService: DistrictLoginDerivedService,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    private validCartCountService: ValidCartCountService,
    private activitiesService: ActivitiesService,
    private formBuilder: FormBuilder,
    private formsService: FormsService,
    private cartCheckoutService: CartCheckoutService,
    public orientationService: OrientationService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    public userContextService: UserContextService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.feeStore = store.select(state => state.feeStore);
    this.cartStore = store.select(state => state.cartStore);
  }

  async ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    // this.feesList = this.feesService.feesList;
    this.autoFeesList = this.data.feesList;
    this.autoCartList = this.data.cart;
    console.log(this.autoFeesList);
    console.log(this.autoCartList);
    this.listReady = true;
    this.selectedFees = [];
    this.selectedActivities = [];
    this.selectedAllArray = [];
    this.newForms = [];
    // console.log('usercontext', this.userContextService.defaultData);
    if (this.userContextService.defaultData.isSuggestedAutoChecked) {
      // console.log('does it get to the select all part');
      this.selectAllItems();
    }
  }

  ngDoCheck() {
  }

  openBottomSheet(item): void {
    this.bottomSheet.open(AutoEnrollBottomSheetComponent, {
      data: item
    }
    );
  }

  public selectAllItems() {
    this.selectedAllArray = [];
    var j;
    for (j = 0; j < this.autoCartList.length; j++) {
      this.selectedActivities.push(this.autoCartList[j]);
      this.selectedAllArray.push(this.autoCartList[j]);
      this.responses.push(this.autoCartList[j]);
      this.newlySelected.push(this.autoCartList[j]);
    }
    // console.log('newly selected at ng on it', this.newlySelected);
    this.selectedAllTotal = 0;
    var k;
    for (k = 0; k < this.selectedAllArray.length; k++) {
      this.selectedAllTotal = this.selectedAllArray[k].amount + this.selectedAllTotal;
    }
    this.selectAll = true;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  public onCheckBoxChange(event, index, item, student) {
    item.checked = !item.checked;
    // console.log('checked?', item.checked);
    if (item.checked) {
      // console.log(index, event, item);
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

  public onChange(mrChange: MatRadioChange) {
    // console.log(mrChange.value);
    let mrButton: MatRadioButton = mrChange.source;
    this.showButton = true;
    // console.log(mrButton.name);
    // console.log(mrButton.checked);
    // console.log(mrButton.inputId);
    this.nextStep();
  }

  public hideSubmit() {
    this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
    this.orientationInterval = setInterval(() => {
      this.gettingOrientation = true;
      if (this.orientationService.orientationResponse) {
        // console.log('response',this.orientationService.orientationResponse);
        this.gettingOrientation = false;
        this.responses = [];
        this.openSnackBar();
        clearInterval(this.orientationInterval);
      }
    }, 1000);
  }

  openSnackBar() {

    this.snackBar.open('Documents Submitted', '✔', {
      duration: 2000,
    });
  }

  //Creates a FeeItem to be added to the cart
  private preProcessAddFeeAmount(cartItem: FeeItems, studentKey: string, name: string) {
    //console.log('is this being called');
    let cartFeeDetail: FeeCartDetail = {
      liteItemType: 'fee',
      itemKey: cartItem.feeTransactionKey,
      districtKey: this.loginResponse.districtKey,
      accountBalanceID: studentKey,
      itemName: cartItem.feeName,
      itemAmount: cartItem.amount,
      amountInCart: cartItem.amountInCart,
      amountToPay: cartItem.amount - cartItem.amountInCart,
      studentName: name,
      isPartialPayEligible: cartItem.supportsPartialPay,
      partialPayDue: cartItem.partialPayDue,
      minimumPayment: cartItem.minimumPayment

    }
    this.broadCastCartFeeItem(cartFeeDetail);
    return cartFeeDetail;
  }

  public broadCastCartFeeItem(cartFeeDetail) {
    this.broadCastDetail = cartFeeDetail
    return this.broadCastDetail;
  }

  private preProcessActivityAddAmount(cartItem: Activities, studentKey: string, studentName: string) {
    let cartActivityDetail: ActivityCartDetail = {
      liteItemType: 'activity',
      itemKey: cartItem.activityKey,
      districtKey: this.loginResponse.districtKey,
      accountBalanceID: cartItem.studentKey,
      itemName: cartItem.activityName,
      itemAmount: cartItem.amount,
      studentName: cartItem.studentName,
      isPartialPayEligible: cartItem.isPartialPay,
      partialPayDue: cartItem.partialPayDue,
      minimumPayment: cartItem.minimumPayment,
      amountInCart: cartItem.amountInCart,
      quantity: cartItem.quantity,
      formResponse: cartItem.formResponse,
      activityFormId: cartItem.activityFormId,
    }
    this.broadCastCartActivityItem(cartActivityDetail);
    return cartActivityDetail;
  }

  public broadCastCartActivityItem(cartActivityDetail) {
    this.broadCastDetail = cartActivityDetail
    return this.broadCastDetail;
  }

  //Adds and removes activities from the selected activity list when clicked
  onSelectionActivities(e, v, ) {
    console.log('v', v);
    console.log('e.option', e.option);
    // console.log('user context is suggested', this.userContextService.defaultData.isSuggestedAutoChecked);
    if (e.option.selected === true) {
      if (e.option.value.isInCart) {
        this.addCartItemService.subscribeTodeleteCartItemNew(e.option.value.activityKey, e.option.value.studentKey, this.loginResponse);
      }
      if (this.userContextService.defaultData.isSuggestedAutoChecked) {
        if (this.selectedActivities.length === 0) {
          this.selectedActivities.push(e.option.value);
        } else {
          if (this.selectedActivities.includes(e.option.value)) {
            var i;
            for (i = 0; i < this.selectedActivities.length; i++) {
              if (this.selectedActivities[i] === e.option.value) {
                this.selectedActivities.splice(i, 1);
              }
            }
          } else {
            this.selectedActivities.push(e.option.value);
          }
          // console.log('newlyselected beofer the splice', this.newlySelected);
          if (this.newlySelected.includes(e.option.value)) {
            var k;
            for (k = 0; k < this.newlySelected.length; k++) {
              if (this.newlySelected[k] === e.option.value) {
                this.newlySelected.splice(k, 1);
              }
            }
          } else {
            this.newlySelected.push(e.option.value);
          }

        };
        // console.log('newly selected', this.newlySelected);
        // console.log('selectedActivites', this.selectedActivities);
        this.selectedAllArray = this.selectedActivities.concat(this.selectedFees);
        if (this.selectedAllArray === false) { }
        this.selectedAllTotal = 0;
        var j;
        for (j = 0; j < this.selectedAllArray.length; j++) {
          this.selectedAllTotal = this.selectedAllArray[j].amount + this.selectedAllTotal;
        }
      } else {
        this.newlySelected = [];
        this.newlySelected.push(e.option.value);
        if (this.selectedActivities.length === 0) {
          this.selectedActivities.push(e.option.value);
        } else {
          if (this.selectedActivities.includes(e.option.value)) {
            var i;
            for (i = 0; i < this.selectedActivities.length; i++) {
              if (this.selectedActivities[i] === e.option.value) {
                this.selectedActivities.splice(i, 1);
              }
            }
          } else {
            this.selectedActivities.push(e.option.value);
          }
          // console.log('selectedActivites', this.selectedActivities);
        }
        this.selectedAllArray = this.selectedActivities.concat(this.selectedFees);
        if (this.selectedAllArray === false) { }
        this.selectedAllTotal = 0;
        var j;
        for (j = 0; j < this.selectedAllArray.length; j++) {
          this.selectedAllTotal = this.selectedAllArray[j].amount + this.selectedAllTotal;
        }
        e.option.value.isInCart = true;
        this.checkForNewForms();
      }
    } else {
      if (e.option.value.isInCart) {
        this.addCartItemService.subscribeTodeleteCartItemNew(e.option.value.activityKey, e.option.value.studentKey, this.loginResponse);
      }
      var i;
      for (i = 0; i < this.selectedActivities.length; i++) {
        if (this.selectedActivities[i] === e.option.value) {
          this.selectedActivities.splice(i, 1);
        }
      }

      var k;
      for (k = 0; k < this.newlySelected.length; k++) {
        if (this.newlySelected[k] === e.option.value) {
          this.newlySelected.splice(k, 1);
        }
      }

      this.selectedAllArray = this.selectedActivities.concat(this.selectedFees);
      if (this.selectedAllArray === false) { }
      this.selectedAllTotal = 0;
      var j;
      for (j = 0; j < this.selectedAllArray.length; j++) {
        this.selectedAllTotal = this.selectedAllArray[j].amount + this.selectedAllTotal;
      }
    }

  }

  //Adds and removes fees from the selected fees list when clicked
  onSelectionFees(e, v) {
    this.currentFeeSelection = e.option.value;
    console.log('selected fees', this.selectedFees);
    console.log('v', v);
    console.log('e.option', e.option);
    if (this.selectedFees.length === 0) {
      this.selectedFees.push(e.option.value);
    } else {
      if (this.selectedFees.includes(e.option.value)) {
        var i;
        for (i = 0; i < this.selectedFees.length; i++) {
          if (this.selectedFees[i] === e.option.value) {
            this.selectedFees.splice(i, 1);
          }
        }
      } else {
        this.selectedFees.push(e.option.value);
      }
      console.log('selectedFees', this.selectedFees);
    }
    console.log('selectedFees', this.selectedFees);
    this.selectedAllArray = this.selectedActivities.concat(this.selectedFees);
    this.selectedAllTotal = 0;
    var j;
    for (j = 0; j < this.selectedAllArray.length; j++) {
      this.selectedAllTotal = this.selectedAllArray[j].amount + this.selectedAllTotal;
    }
    var k;
    this.account = [];
    for(k=0;k< this.feesService.feesList.length; k++){
      if(k === e.option.value.outsideIndex){
        this.account.push(this.feesService.feesList[k]);
      }
    }
    console.log('this.account', this.account);          
    if (e.option.value.isInCart === false) {
      e.option.value.amountInCart = e.option.value.amount;
      let params = {
        outsideIndex: e.option.value.outsideIndex,
        insideIndex: e.option.value.insideIndex,
      }
      this.addCartItemService.putCartFeeNew(this.account[0], params, this.loginResponse);
      e.option.value.isInCart = true;
    } else {
      this.addCartItemService.subscribeTodeleteCartItemNew(e.option.value.feeTransactionKey, e.option.value.studentKey, this.loginResponse);
      e.option.value.isInCart = false;
    }
  }

  //Adds all selected activities and fees to the cart
  async  addAutoEnrolledItems() {
    this.selectedAllArray = [];
    var i;
    for (i = 0; i < this.selectedActivities.length; i++) {
      this.selectedActivities[i].amountInCart = this.selectedActivities[i].amount;
      this.selectedActivities[i].quantity = 1;
      this.selectedAllArray.push(this.selectedActivities[i]);
    }

    // console.log('selected all', this.selectedAll);
    this.addCartItemService.subscribeToPostCartGroup(this.selectedAllArray, this.loginResponse);
    this.checkForNewForms();
    this.responses = [];
    if (this.userContextService.defaultData.isSuggestedAutoChecked) {
      this.dialogRef.close();
    }
  }

  //Sees if any the activities added to the cart have a required form
  public async checkForNewForms() {
    this.newForms = [];
    this.formsService.newForms = [];
    this.activitiesWithForms = [];
    var i;
    for (i = 0; i < this.newlySelected.length; i++) {
      if (this.newlySelected[i].activityFormId !== 0) {
        this.activitiesWithForms.push(this.newlySelected[i]);
      }
    }
    var j;
    for (j = 0; j < this.activitiesWithForms.length; j++) {
      this.newForms.push(this.activitiesWithForms[j].formModel);
    }
    this.formInterval = setInterval(() => {
      // console.log('newlySelected', this.newlySelected);
      if (this.newlySelected[0].activityFormId !== 0) {
        if (this.newForms.length > 0) {
          // console.log('forms that need to be filled out', this.newForms);
          clearInterval(this.formInterval);
          this.openAutoEnrollFormsDialog();
        }
      } else {
        clearInterval(this.formInterval);
        this.selectedAllArray = [];
        var i;
        for (i = 0; i < this.selectedActivities.length; i++) {
          this.selectedActivities[i].amountInCart = this.selectedActivities[i].amount;
          this.selectedActivities[i].quantity = 1;
          this.selectedAllArray.push(this.selectedActivities[i]);
        }
        this.addCartItemService.subscribeToPostCartGroup(this.selectedAllArray, this.loginResponse);
        // console.log('why doesnt it clear this interval');
      }
    }, 50);
  }

  //Opens dialog containing forms for activities
  public openAutoEnrollFormsDialog() {
    if (!this.mobile) {
      //console.log('does this get called?');
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
      config.disableClose = true;
      config.maxHeight = '750px';
      config.width = '750px';
      config.data = {
        forms: this.newForms,
        activities: this.activitiesWithForms,
        quantity: 1
      }
      const dialogRef = this.dialog.open(AutoEnrollFormsComponent, config);
    } else {
      // console.log('does this get called?');
      // console.log('new forms', this.newForms);
      // console.log('activities with forms', this.activitiesWithForms);
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
      config.disableClose = true;
      config.maxHeight = '675px';
      config.width = '350px';
      config.data = {
        forms: this.newForms,
        activities: this.activitiesWithForms,
        quantity: 1
      }
      const dialogRef = this.dialog.open(AutoEnrollFormsComponent, config);
    }
  }

  //closes dialog
  async onNoClick() {
    this.dialogRef.close();
  }

}
