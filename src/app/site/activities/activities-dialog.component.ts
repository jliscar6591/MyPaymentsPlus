import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Component, OnInit, Inject, Output, EventEmitter, } from '@angular/core';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as ActivityStoreActions from '../../shared/store/actions/activityStore.actions'
import { ActivitiesService } from '../services/activities.service';
import { ActivitiesList, Activities, Categories, Accounts } from 'app/site/model/activities.model';
import { ActivityDetails } from './activities-details.component';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivitiesComponent } from 'app/site/activities/activities.component';
import { AddCartItemService } from '../services/add-cart-item.service';
import { FormsService } from '../services/forms.service';
import { CartResponse } from '../model/cart-response-model';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';
import { Form, Fields, Choices } from '../model/forms.model';
import { FormsDialogComponent } from './forms/forms-dialog/forms-dialog.component';
import { PictureDialogComponent } from './picture-dialog.component';
import { ActivitiesListComponent } from './activities-list.component';
import { PageLoadingService } from '../../shared/components/page-loading/page-loading.service';

@Component({
  selector: 'app-activities-dialog',
  templateUrl: './activities-dialog.component.html',
  styleUrls: ['./activities-dialog.component.less'],
  providers: [FormsService]
})
export class ActivitiesDialogComponent implements OnInit {
  public mobile: boolean = false;
  public activitiesListCompnent: ActivitiesListComponent;
  public loginResponse: LoginResponseModel;
  public activityStore: Observable<ActivitiesList>;
  public activitiesList: ActivitiesList;
  public activities: Activities[];
  public cartResponse: CartResponse;
  public activityState: any;
  public activitiesReady: boolean = false;
  public accountKey: string;
  public studentFirstName: string;
  public activityKey: string;
  public activityName: string;
  public description: string;
  public form: Form[];
  public startDate: string;
  public endDate: string;
  public isQuantity: boolean;
  public isVariable: boolean;
  public isPartialPay: boolean;
  public partialPayDue: string;
  public signupEndDate: string;
  public minimumPayment: number;
  public activityFormId: number;
  public productImageId: number;
  public amount: number;
  public insideIndex: number;
  public outsideIndex: number;
  public isInCart: boolean;
  public dialogActivityForm = new FormGroup({
    activityAmount: new FormControl(),
    quantity: new FormControl()
  })
  public fixedInterval: any;
  public partialInterval: any;
  public variableInterval: any;
  public isAdding: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ActivitiesDialogComponent>,
    private store: Store<AppState>,
    private activitiesService: ActivitiesService,
    private validateCookie: ValidateCookieService,
    private formBuilder: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private addCartItemService: AddCartItemService,
    private formsService: FormsService,
    private loginStoreSvc: LoginStoreService,
    @Inject(MAT_DIALOG_DATA) public data: Activities
  ) {
    this.activityStore = store.select(state => state.activityStore);
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    //console.log('data on the dialog', this.data);
    this.activitiesList = this.activitiesService.activitiesList;
    this.createForm();
  }

  createForm() {
    this.dialogActivityForm = this.formBuilder.group({
      activityAmount: '',
      quantity: ''
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  public openPictureDialog() {
    if (this.mobile) {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '300px',
        height: '300px',
        data: this.data.s3UriFull
      })
    } else {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '600px',
        data: this.data.s3UriFull
      })
    }
  }

  public addToCart(formId: any, studentKey: any) {
    if (formId !== 0) {
      this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
      this.pageLoadingService.show('Loading your forms');
      this.isAdding = true;
      if (this.dialogActivityForm.value.quantity === '') {
        this.data.quantity = 1;
        this.data.amountInCart = this.data.amount * this.data.quantity;
      } else {
        this.data.quantity = this.dialogActivityForm.value.quantity;
        this.data.amountInCart = this.data.amount * this.data.quantity;
      }

      this.openFormsDialogFixed();
    } else {
        if (this.dialogActivityForm.value.quantity === '') {
          this.data.quantity = 1;
          this.data.amountInCart = this.data.amount * this.data.quantity;
          let activity = this.data;
          this.addCartItemService.putCartActivityNew(
            activity,
            this.loginResponse)
            .subscribe(
              response => {
                this.cartResponse = response;

              },
              error => {
                this.addCartItemService.result = false;
              },
              () => {
                //console.log('activity added cart response', this.cartResponse);
                this.activitiesService.subscribeToGetActivities(this.loginResponse);
                this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
                this.updateDialogData();
                this.dialogRef.close();
              })
        } else {
          this.data.quantity = this.dialogActivityForm.value.quantity;
          this.data.amountInCart = this.data.amount * this.data.quantity;
          let activity = this.data;
          this.addCartItemService.putCartActivityNew(
            activity,
            this.loginResponse)
            .subscribe(
              response => {
                this.cartResponse = response;
              },
              error => {
                this.addCartItemService.result = false;
              },
              () => {
                //console.log('activity added cart response', this.cartResponse);
                this.activitiesService.subscribeToGetActivities(this.loginResponse);
                this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList));
                this.updateDialogData();
                this.dialogRef.close();
              })
        }
    }
  }




  public addToCartPartial(formId: any, studentKey: any) {
    if (formId !== 0) {
      this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
      this.data.quantity = 1;
      this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
      this.pageLoadingService.show('Loading your forms');
      this.isAdding = true;
      this.openFormsDialogPartial();
    } else if (parseInt(this.dialogActivityForm.value.activityAmount) < this.data.minimumPayment) {
      document.getElementById('amount').style.color = 'red';
    } else if (parseInt(this.dialogActivityForm.value.activityAmount) > this.data.amount) {
      document.getElementById('amount').style.color = 'red';
      document.getElementById('amount').innerHTML = 'Amount must be less than $' + this.data.amount;
    } else {
      //console.log('calling addCart ActivityPartial');
      this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
      this.data.quantity = 1;
      let activity = this.data;
      this.addCartItemService.putCartActivityNew(
        activity,
        this.loginResponse)
        .subscribe(
          response => {
            this.cartResponse = response;

          },
          error => {
            this.addCartItemService.result = false;
          },
          () => {
            //console.log('activity added cart response', this.cartResponse);
            this.activitiesService.subscribeToGetActivities(this.loginResponse);
            this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
            this.updateDialogData();
            this.dialogRef.close();
          })
    }
  }

  public addToCartVariable(formId: any, studentKey: any) {
    //console.log('calling addCart ActivityVariable');
    if (formId !== 0) {
      this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
      this.data.quantity = 1;
      this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
      this.pageLoadingService.show('Loading your forms');
      this.isAdding = true;
      this.openFormsDialogVariable();
    } else if (this.dialogActivityForm.value.activityAmount === '') {
      this.data.amountInCart = this.data.amount;
      this.data.quantity = 1;
      let activity = this.data;
      this.addCartItemService.putCartActivityNew(
        activity,
        this.loginResponse)
        .subscribe(
          response => {
            this.cartResponse = response;

          },
          error => {
            this.addCartItemService.result = false;
          },
          () => {
            //console.log('activity added cart response', this.cartResponse);
            this.activitiesService.subscribeToGetActivities(this.loginResponse);
            this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
            this.updateDialogData();
            this.dialogRef.close();
          })
    } else if (this.dialogActivityForm.value.activityAmount < 1) {
      document.getElementById('amount').style.color = 'red';
    } else {
      this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
      this.data.quantity = 1;
      let activity = this.data;
      this.addCartItemService.putCartActivityNew(
        activity,
        this.loginResponse)
        .subscribe(
          response => {
            this.cartResponse = response;

          },
          error => {
            this.addCartItemService.result = false;
          },
          () => {
            //console.log('activity added cart response', this.cartResponse);
            this.activitiesService.subscribeToGetActivities(this.loginResponse);
            this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
            this.updateDialogData();
            this.dialogRef.close();
          })
    }
  }

  public editAmount() {
    this.data.isInCart = false;
    this.data.quantity = 0;
    this.data.formResponse = [];
  }

  public updateDialogData() {
    this.data.isInCart = true;
  }


  public openFormsDialogFixed() {
    this.fixedInterval = setInterval(() => {
      if (this.formsService.form) {
        this.dialogRef.close();
        this.pageLoadingService.hide();
        //console.log('form', this.formsService.form);
        let dialogRef: MatDialogRef<FormsDialogComponent>;

        let config = new MatDialogConfig();

        config.panelClass = 'my-class';
        config.maxHeight = '700px';
        config.width = '750px';
        config.data = {
          form: this.formsService.form,
          activity: this.data,
          quantity: this.data.quantity,
          amount: this.data.amount,
          isValid: null
        };
        config.disableClose = true;
        dialogRef = this.dialog.open(FormsDialogComponent, config);
        clearInterval(this.fixedInterval)
      }
    }, 50);
  }

  public openFormsDialogPartial() {
    this.partialInterval = setInterval(() => {
      if (this.formsService.form) {
        this.dialogRef.close();
        this.pageLoadingService.hide();
        //console.log('form', this.formsService.form);
        let dialogRef: MatDialogRef<FormsDialogComponent>;

        let config = new MatDialogConfig();

        config.panelClass = 'my-class';
        config.maxHeight = '700px';
        config.width = '750px'
        config.data = {
          form: this.formsService.form,
          activity: this.data,
          quantity: 1,
          amount: this.data.amount,
          isValid: null
        }
        config.disableClose = true;
        dialogRef = this.dialog.open(FormsDialogComponent, config);
        clearInterval(this.partialInterval)
      }
    }, 50);


  }

  public openFormsDialogVariable() {
    this.variableInterval = setInterval(() => {
      if (this.formsService.form) {
        this.dialogRef.close();
        this.pageLoadingService.hide();
        //console.log('form', this.formsService.form);
        let dialogRef: MatDialogRef<FormsDialogComponent>;

        let config = new MatDialogConfig();

        config.panelClass = 'my-class';
        config.maxHeight = '700px';
        config.width = '750px'
        config.data = {
          form: this.formsService.form,
          activity: this.data,
          quantity: 1,
          amount: this.dialogActivityForm.value.activityAmount,
          isValid: null
        }
        config.disableClose = true;
        dialogRef = this.dialog.open(FormsDialogComponent, config);
        clearInterval(this.variableInterval);
      }
    }, 50);
  }

}

