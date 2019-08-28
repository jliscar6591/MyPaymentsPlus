import { Component, OnInit, Inject, Output, EventEmitter, } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FeesComponent } from './fees.component';
import { FeesDialogComponent } from './fees-dialog.component';
import { SiteHomeComponent } from '../../site-home.component';
import { FeesService, TransfersService, CartCheckoutService, CartCheckoutItemsService, MultiDistrictService, StudentMealsService, ValidCartCountService, AddCartItemService } from '../../services/index';
import { UserContextService } from '../../account/services/index';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem, CartResponseItem, CheckoutItem, CartResponse } from '../../model/index';
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
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as FeeStoreActions from '../../../shared/store/actions/feeStore.actions';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions';
import { tap } from 'rxjs/internal/operators/tap';
import { RefreshService } from '../../../shared/services/refresh.service';
import { state } from '@angular/animations/src/animation_metadata';
import { empty } from 'rxjs/internal/observable/empty';

export interface FeeDetails {
  name: string;
  studentKey: string;
  feeTransactionKey: string;
  description: string;
  dueDate: string;
  feeName: string;
  minimumPayment: number;
  partialPayDue: string;
  supportsPartialPay: boolean;
  amount: number;
  amountInCart: number;
  amountToPay: number;
  notificationType: number;
  insideIndex: number;
  outsideIndex: number;
  isInCart: boolean;
}

@Component({
  selector: 'fees-details',
  templateUrl: './fees-details.component.html',
  styleUrls: ['./fees-details.component.less']
})
export class FeesDetailsComponent implements OnInit {
  //@Output() changed: EventEmitter<any> = new EventEmitter<any>();
  //@Output() addCartItemDesktop: EventEmitter<any> = new EventEmitter<any>();
  private loginResponse: LoginResponseModel;
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
  public feeCallCount: number = 0;
  public isInCart: boolean;
  public notificationType: number;
  public cleanOutCart: boolean = false;
  public cartProcessedFlag: any = this.transferService.cartProcessedEvt;
  public cartItemCount: number = 0;
  public feeAddedFlag: any = this.transferService.feeAddedToCart;
  public belowMinimum: boolean = false;
  public aboveMaximum: boolean = false;
  public insideIndex: number;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public outsideIndex: number;
  public empty: number = NaN;
  public submitted: boolean = false;
  public subscription: any;
  public feeInterval: any;
  public feesForm = new FormGroup({
    feeAmount: new FormControl(),
  })
  public feeStore: Observable<FeesList[]>;
  public feeState: any;


  constructor(
    public feesComponent: FeesComponent,
    public siteHomeComponent: SiteHomeComponent,
    // private userContextService: UserContextService,
    private studentMealsService: StudentMealsService,
    private transferService: TransfersService,
    private receiptService: ReceiptService,
    //  private utilityService: UtilityService,
    public dialog: MatDialog,
    private feesService: FeesService,
    // private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    // private messageProcessorService: MessageProcessorService,
    //  private districtLoginDerivedService: DistrictLoginDerivedService,
    private validCartCountService: ValidCartCountService,
    private addCartItemService: AddCartItemService,
    // private cartCheckoutItemsService: CartCheckoutItemsService,
    private loginStoreSvc: LoginStoreService,
    private formBuilder: FormBuilder,
    private refreshService: RefreshService,
    private store: Store<AppState>,
    private state: State<AppState>
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.feeStore = store.select(state => state.feeStore);
    this.createForm();
  }

  createForm() {
    this.feesForm = this.formBuilder.group({
      feeAmount: '',
    });
  }

  ngOnInit() {
    //this.subscription = this.feesService.subscribeToGetFees(this.loginResponse);
    this.feesList = this.feesService.feesList;
    this.feeCallCount = 0;
  }

  ngDoCheck() {
    if (this.addCartItemService.result) {
      //console.log('cartResponse on ng do check', this.addCartItemService.cartResponse);
      let tempResponse: any;
      tempResponse = this.addCartItemService.cartResponse;
      this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempResponse))
      this.addCartItemService.result = false;
    }

    if (this.addCartItemService.result && this.feeState.loaded) {
      this.feeStore.subscribe(c => this.feeState = c);
      this.feeInterval = setInterval(() => {
        if (this.feeState.data) {
          this.feesList = this.feeState.data;
          clearInterval(this.feeInterval);
        }
      }, 1000);
      this.addCartItemService.result = false;
      //console.log('does this run when i add on ein the dialog');
    }

    if (this.feesService.result === true && this.feeCallCount === 0) {
      this.feesService.subscribeToGetFees(this.loginResponse);
      this.feesList = this.feesService.feesList;
      this.feesService.result = false;
      //console.log('what am i getting in here before the dispatch', this.feesList);
      this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList))
      this.feeStore.subscribe(c => this.feeState = c);
      this.feesList = this.feeState.data;
      this.feeCallCount = 1;
    }

  }

  ngAfterContentInit() {
    //console.log('here is the current feesList on the fee-details component', this.feesList);
  }

  public editAmount(i: number, j: number) {
    this.feesList[i].fees[j].isInCart = false;
    this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amountInCart + this.feesList[i].fees[j].amountToPay;
  }

  public formatFeeDetails(studentKey, feeTransactionKey) {
    //console.log(this.feesList);
    var i;
    for (i = 0; i < this.feesList.length; i++) {
      if (studentKey === this.feesList[i].studentKey) {
        this.name = this.feesList[i].name;
        this.studentKey = this.feesList[i].studentKey;
        //console.log('student key: ', this.studentKey);
        var j;
        for (j = 0; j < this.feesList[i].fees.length; j++) {
          if (feeTransactionKey === this.feesList[i].fees[j].feeTransactionKey) {
            this.insideIndex = j;
            this.outsideIndex = i;
            this.feeTransactionKey = this.feesList[i].fees[j].feeTransactionKey;
            this.description = this.feesList[i].fees[j].description;
            this.dueDate = this.feesList[i].fees[j].dueDate;
            this.feeName = this.feesList[i].fees[j].feeName;
            //console.log('fee key: ', this.feeTransactionKey);
            this.minimumPayment = this.feesList[i].fees[j].minimumPayment;
            this.partialPayDue = this.feesList[i].fees[j].partialPayDue;
            this.supportsPartialPay = this.feesList[i].fees[j].supportsPartialPay;
            this.amount = this.feesList[i].fees[j].amount;
            this.amountInCart = this.feesList[i].fees[j].amountInCart;
            this.amountToPay = this.feesList[i].fees[j].amountToPay;
            this.notificationType = this.feesList[i].fees[j].notificationType;
            this.isInCart = this.feesList[i].fees[j].isInCart;
          }
        }
      }
    }

    this.openFeeDialog();
  }



  public openFeeDialog() {
    const dialogRef = this.dialog.open(FeesDialogComponent, {
      width: '650px',
      data: {
        outsideIndex: this.outsideIndex,
        insideIndex: this.insideIndex,
        name: this.name,
        student: this.studentKey,
        feeTransactionKey: this.feeTransactionKey,
        description: this.description,
        dueDate: this.dueDate,
        feeName: this.feeName,
        minimumPayment: this.minimumPayment,
        partialPayDue: this.partialPayDue,
        supportsPartialPay: this.supportsPartialPay,
        amount: this.amount,
        amountToPay: this.amountToPay,
        amountInCart: this.amountInCart,
        notificationType: this.notificationType,
        isInCart: this.isInCart
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.addCartItemService.cartResponse) {
        this.feesList[this.outsideIndex].fees[this.insideIndex].amountInCart = result;
        this.feesList[this.outsideIndex].fees[this.insideIndex].amountToPay = this.amountToPay - result;
        this.feesList[this.outsideIndex].fees[this.insideIndex].isInCart = true;
      }
    });
  };

  updateCartAmount(i: number, j: number) {

    this.feesList[i].fees[j].isInCart = true;

  };




  public addCartItem(i: number, j: number) {
    console.log("Calling addCartFEEitem");
    let feesList = this.feesList;
    let params = {
      outsideIndex: i,
      insideIndex: j,
    }
    this.addCartItemService.putCartFeeNew(
      feesList[i],
      params,
      this.loginResponse)
    this.updateCartAmount(i, j);
    this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amount;
    this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amount - this.feesList[i].fees[j].amountInCart;
    //console.log('feesList before dispatch to feeStore', this.feesList);
    this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList))
    this.feeStore.subscribe(c => this.feeState = c);
    this.feesList = this.feeState.data;
    this.siteHomeComponent.fixCartFlag = true;
    //this.refreshService.refreshCart();
    //console.log('cartResponse', this.addCartItemService.cartResponse);
  }

  //partial pay add item
  public addCartItemPartial(i: number, j: number) {
    console.log("what is going on");
    console.log('fees form value', this.feesForm.value.feeAmount);
    console.log('feeslist', this.feesList);
    console.log('i & j', i, j);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    if (parseInt(this.feesForm.value.feeAmount) < this.feesList[i].fees[j].minimumPayment && this.feesList[i].fees[j].amountToPay > this.feesList[i].fees[j].minimumPayment) {
      document.getElementById('amount' + i + j).innerHTML = "Amount must be above " + formatter.format(this.feesList[i].fees[j].minimumPayment);
      document.getElementById('amount' + i + j).style.color = "red";
      console.log('hi');
    } else if (parseInt(this.feesForm.value.feeAmount) > this.feesList[i].fees[j].amountToPay) {
      document.getElementById('amount' + i + j).style.color = "red";
      document.getElementById('amount' + i + j).innerHTML = "Amount must be smaller than " + formatter.format(this.feesList[i].fees[j].amountToPay);
      console.log('hi');
    } else if (parseInt(this.feesForm.value.feeAmount) < this.feesList[i].fees[j].minimumPayment && this.feesList[i].fees[j].amountToPay < this.feesList[i].fees[j].minimumPayment) {
      console.log('hi');
      this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
      console.log(this.feesList[i].fees[j].amountInCart);
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
      this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
      this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amount - this.feesList[i].fees[j].amountInCart;
      console.log('feesList before dispatch to feeStore', this.feesList);
      this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList))
      this.feeStore.subscribe(c => this.feeState = c);
      this.feesList = this.feeState.data;
      this.siteHomeComponent.fixCartFlag = true;
    } else if (!this.feesForm.value.feeAmount) {
      console.log('hi');
      this.belowMinimum = false;
      this.aboveMaximum = false;
      //console.log('is it NaN');
      this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountToPay;
      //console.log('cart amount i want to show in cart', this.feesList[i].fees[j].amountInCart);
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
      //console.log('feesList before dispatch to feeStore', this.feesList);
      this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList))
      this.feeStore.subscribe(c => this.feeState = c);
      this.feesList = this.feeState.data;
      this.siteHomeComponent.fixCartFlag = true;
    } else {
      this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
      this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountInCart;
      this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
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
      this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
      //console.log('feesList before dispatch to feeStore', this.feesList);
      this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList))
      this.feeStore.subscribe(c => this.feeState = c);
      this.feesList = this.feeState.data;
      this.feesService.feesList[i].fees[j].isInCart = true;
      this.siteHomeComponent.fixCartFlag = true;
    }

  }

  ngOnDestroy() {
    this.feesService.feesList = [];
    this.store.dispatch(new FeeStoreActions.LoadFees());
    //console.log('feesList on destory', this.feesList);
  }

}

