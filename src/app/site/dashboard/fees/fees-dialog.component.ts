import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FeeDetails } from 'app/site/dashboard/fees/fees-details.component';
import { Component, OnInit, Inject, Output, EventEmitter, } from '@angular/core';
import { FeesService, TransfersService, CartCheckoutService, CartCheckoutItemsService, MultiDistrictService, StudentMealsService, ValidCartCountService, AddCartItemService } from '../../services/index';
import { UserContextService } from '../../account/services/index';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from '../../../app.settings';
import { FeesList, FeeItems, CartAddAmount } from 'app/site/model';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as FeeStoreActions from '../../../shared/store/actions/feeStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { FeesComponent } from 'app/site/dashboard/fees/fees.component';

@Component({
  selector: 'fees-dialog',
  templateUrl: './fees-dialog.component.html',
  styleUrls: ['./fees-dialog.component.less']
})
export class FeesDialogComponent implements OnInit {
  // @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  // @Output() addCartItemDesktop: EventEmitter<any> = new EventEmitter<any>();
  private loginResponse: LoginResponseModel
  public feesList: FeesList[];
  public feeDetails: FeeItems[];
  public name: string;
  public studentKey: string;
  public feeTransactionKey: string;
  public description: string;
  public dueDate: string;
  public feeName: string;
  public minimumPayment: number;
  public partialPayDue: string;
  public supportsPartialPay: boolean;
  public amount: number;
  public amountInCart: number;
  public amountToPay: number;
  public notificationType: number;
  public cleanOutCart: boolean = false;
  public cartProcessedFlag: any = this.transferService.cartProcessedEvt;
  public cartItemCount: number = 0;
  public feeAddedFlag: any = this.transferService.feeAddedToCart;
  public belowMinimum: boolean = false;
  public aboveMaximum: boolean = false;
  public i = this.data.outsideIndex;
  public j = this.data.insideIndex;
  public dialogFeesForm = new FormGroup({
    feeAmount: new FormControl()
  })
  public feeStore: Observable<FeesList[]>;
  public feeState: any;

  constructor(
    private userContextService: UserContextService,
    private studentMealsService: StudentMealsService,
    private transferService: TransfersService,
    private receiptService: ReceiptService,
    private utilityService: UtilityService,
    public dialog: MatDialog,
    private feesService: FeesService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    private districtLoginDerivedService: DistrictLoginDerivedService,
    private validCartCountService: ValidCartCountService,
    private addCartItemService: AddCartItemService,
    private formBuilder: FormBuilder,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    public dialogRef: MatDialogRef<FeesDialogComponent>,
    private loginStoreSvc: LoginStoreService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: FeeDetails) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.feeStore = store.select(state => state.feeStore);
  }

  ngOnInit() {
    this.feesList = this.feesService.feesList;
    //console.log('this is the data on the dialog', this.data);
    this.createForm();
  }

  createForm() {
    this.dialogFeesForm = this.formBuilder.group({
      feeAmount: '',
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  public addCartItem(i: number, j: number) {
    console.log("Calling addCartFEEitem");
    let feesList = this.feesList;
    let params = {
      outsideIndex: i,
      insideIndex: j,
    }
    console.log('params', params)
    this.addCartItemService.putCartFeeNew(
      feesList[i],
      params,
      this.loginResponse)
    this.updateCartAmount(i, j);
    this.feesList[i].fees[j].isInCart = true;
    this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amount;
    this.feesService.subscribeToGetFees(this.loginResponse);
    this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
    this.feesService.feesList[i].fees[j].isInCart = true;
  }

  //partial pay add item
  public addCartItemPartial(i: number, j: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    //console.log("Calling addCartFEEitem");
    if (parseInt(this.dialogFeesForm.value.feeAmount) < this.data.minimumPayment && this.data.amountToPay > this.data.minimumPayment) {
      document.getElementById('hint').innerHTML = "Amount must be above " + formatter.format(this.feesList[i].fees[j].minimumPayment);
      document.getElementById('hint').style.color = "red";
    } else if (parseInt(this.dialogFeesForm.value.feeAmount) > this.feesList[i].fees[j].amountToPay) {
      document.getElementById('hint').style.color = "red";
      document.getElementById('hint').innerHTML = "Amount must be smaller than " + formatter.format(this.feesList[i].fees[j].amountToPay);
    } else if (parseInt(this.dialogFeesForm.value.feeAmount) < this.data.minimumPayment && this.data.amountToPay < this.data.minimumPayment) {
      this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
      this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
      this.data.amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
      console.log('hi');
      let feesList = this.feesList;
      let params = {
        outsideIndex: i,
        insideIndex: j,
      }
      console.log('params', params)
      this.addCartItemService.putCartFeeNew(
        feesList[i],
        params,
        this.loginResponse)
      this.updateCartAmount(i, j);
      this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
      this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
      //console.log('feesList before dispatch to feeStore', this.feesList);
      this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
      this.feesService.subscribeToGetFees(this.loginResponse);
      this.feesList = this.feesService.feesList;
      this.feesService.result = false;
      this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
      this.feesService.feesList[i].fees[j].isInCart = true;
    } else if (!this.dialogFeesForm.value.feeAmount) {
      this.belowMinimum = false;
      this.aboveMaximum = false;
      this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountToPay;
      this.data.amountInCart = this.feesList[i].fees[j].amountToPay;
      let feesList = this.feesList;
      let params = {
        outsideIndex: i,
        insideIndex: j,
      }
      console.log('params', params)
      this.addCartItemService.putCartFeeNew(
        feesList[i],
        params,
        this.loginResponse)
      this.updateCartAmount(i, j);
      this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
    } else {
      this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
      this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
      this.data.amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
      let feesList = this.feesList;
      let params = {
        outsideIndex: i,
        insideIndex: j,
      }
      //console.log('params', params)
      this.addCartItemService.putCartFeeNew(
        feesList[i],
        params,
        this.loginResponse)
      this.updateCartAmount(i, j);
      this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
      this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
      //console.log('feesList before dispatch to feeStore', this.feesList);
      this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
      this.feesService.result = false;
      this.feesService.feesList[i].fees[j].isInCart = true;
    }

  }

  public editAmount(i: number, j: number) {
    this.data.isInCart = false;
  }

  updateCartAmount(i: number, j: number) {
    this.feesList[i].fees[j].isInCart = true;
    this.data.isInCart = true;

  }

}

