import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AddCartItemService, StudentMealsServiceRemote, StudentMealsService, CartCheckoutItemsService } from '../../services/index';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { StudentMeal, MealAccount, CartItem } from '../../model/index';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { Observable } from 'rxjs';
import { MealsComponent } from "./meals.component";
import { RefreshService } from '../../../shared/services/refresh.service';
import { TransfersService, MultiDistrictService } from '../../services/index';
import {
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meals-add-bottom-sheet',
  templateUrl: './meals-add-bottom-sheet.component.html',
  styleUrls: ['./meals-add-bottom-sheet.component.less', './meals.component.less']
})
export class MealsAddBottomSheetComponent implements OnInit {
  private loginResponse: LoginResponseModel;
  private failedAddCartAmount: boolean = false;
  private failedAddCartAmountMsg: string = '';

  private isAddCartAmountSaving: boolean = false;
  public isMealPlanSelected: boolean;
  public tabIndex = 0;
  public checkoutInterval: any;
  private threshold: number = Constants.studentMealBalanceWarningThreshold;
  public firstName: any;
  public categoryNames: any[] = [];
  public mealSelectedErrMsg: string = '';
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  private xferStatusInterval: any;
  public xferStatusCounter: number = 0;
  public isXferFeePaid: boolean = false;
  public reply: boolean = false;
  public availStatus: any;
  public cartStateItems: CartItem;
  public statusInterval: any;
  public formInterval: any;
  public formAmount: FormGroup;
  public student: any;
  public depositableAccounts: any;
  public throwAccountError: boolean = false;
  public accountList: any;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<MealsAddBottomSheetComponent>,
    public studentRemoteMealsSrvc: StudentMealsServiceRemote,
    private addCartItemService: AddCartItemService,
    private utilityService: UtilityService,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    public mealsComponent: MealsComponent,
    private loginStoreSvc: LoginStoreService,
    private viewContainerRef: ViewContainerRef,
    private store: Store<AppState>,
    private state: State<AppState>,
    private refreshService: RefreshService,
    private dialogService: SimpleDialogService,
    private transfersService: TransfersService,
    private studentService: StudentMealsService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.mealStore = store.select(state => state.mealStore)
  }

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartItemMobile: EventEmitter<any> = new EventEmitter<any>();

  async ngOnInit() {
    //console.log("Does ngONIt have StudentMeals: ", this.studentRemoteMealsSrvc.studentMeals)
    //console.log('index', this.data.index);
    // console.log('model', this.data.model);
    this.student = this.data.model;
    this.formAmount = new FormGroup({
      amount: new FormControl('', Validators.required),
      account: new FormControl('', Validators.required)
    })
    this.depositableAccounts = [];
    var i;
    for (i = 0; i < this.student.mealAccounts.length; i++) {
      if (this.student.mealAccounts[i].isDepositable) {
        let accounts = {
          account: this.student.mealAccounts[i],
          index: i
        }
        await this.depositableAccounts.push(accounts);
      }
    }
    console.log(this.depositableAccounts);
    console.log(this.depositableAccounts[0].index);
    this.formAmount.controls.account.setValue(0);
    let selected = this.depositableAccounts[0].index;
    console.log('initially slected account should be first on the despositable list', selected);
    document.getElementById(selected).style.backgroundColor = '#c5e1a5';
    document.getElementById(selected).style.color = '#2e7d32';
  }

  ngAfterViewInit() {
    this.xferStatusInterval = setInterval(() => {
      if (this.transfersService.gotStautsCode) {
        // console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
        this.reply = this.transfersService.result;
        this.isXferFeePaid = this.transfersService.isXferFeePaid;
        clearInterval(this.xferStatusInterval);
        // console.log('this.reply: ', this.reply)
        // console.log('this.isXferFeePaid: ', this.isXferFeePaid)
      }
    }, 50);
    this.statusInterval = setInterval(() => {
      this.availStatus = this.transfersService.xferLinkStatus;
      clearInterval(this.statusInterval);
    }, 50)
  }

  ngDoCheck() {

    if (this.availStatus == 2) {
      this.studentService.needGetStudents.emit(true);
      clearInterval(this.statusInterval);
    }
  }

  update(content) {
    this.changed.emit(content);
  }

  updateCartAmount(j: number) {
    let cartSum: number = this.student.mealAccounts[j].cartAmount;
    this.student.mealAccounts[j].cartAmount = cartSum + parseInt(this.formAmount.controls.amount.value);
    this.formAmount.controls.amount.reset();
  }

  updateCartAmountQuick(amount: number, j: number) {
    let cartSum: number = this.student.mealAccounts[j].cartAmount;
    this.student.mealAccounts[j].cartAmount = cartSum + amount;
    this.formAmount.controls.amount.reset();
  }

  public listChange(event) {
    if (event.isUserInput) {
      if (this.student.mealAccounts[event.source.value].isDepositable) {
        let selected = event.source.value.toString();
        // console.log('selected account - 157', selected);
        var i;
        for (i = 0; i < this.student.mealAccounts.length; i++) {
          if (i !== event.source.value && this.student.mealAccounts[i].isDepositable) {
            document.getElementById(i.toString()).style.backgroundColor = 'white';
            document.getElementById(i.toString()).style.color = 'rgba(0, 0, 0, 0.87)';
          }
        }
        // console.log('selected account - 165', selected);
        document.getElementById(selected).style.backgroundColor = '#c5e1a5';
        document.getElementById(selected).style.color = '#2e7d32';
      }
      // console.log('#', event.source.value, 'boolean', event.source.selected);
    }
  }

  addCartItem(amount: number, j: number) {
    if (j === 0) {
      j = this.depositableAccounts[0].index;
    }
    this.isMealPlanSelected = false;
    let params = {
      valid: true,
      amount: amount,
      outsideIndex: this.data.index,
      insideIndex: j
    };
    this.mealsComponent.addCartItemMobile(params);
    //Client side update cartAmount
    this.updateCartAmountQuick(amount, j);
    this.bottomSheetRef.dismiss();
  }

  addCartItemCustom() {
    //console.log(this.depositableAccounts[this.formAmount.controls.account.value].index);
    this.isMealPlanSelected = false;
    let j = this.depositableAccounts[this.formAmount.controls.account.value].index;
    let params = {
      valid: this.formAmount.valid,
      amount: parseInt(this.formAmount.controls.amount.value),
      outsideIndex: this.data.index,
      insideIndex: j
    }
    this.mealsComponent.addCartItemMobile(params);
    //this.addCartItemMobile.emit({
    //  valid: this.formAmount.valid,
    //  amount: parseInt(this.formAmount.controls.amount.value),
    //  outsideIndex: this.data.index,
    //  insideIndex: parseInt(this.formAmount.controls.account.value)
    //});
    //Client side update cartAmount
    this.updateCartAmount(parseInt(this.depositableAccounts[this.formAmount.controls.account.value].index));

  }

  getWarnIcon(cartBalance: number): string {
    let classes: string = " material-icons ";
    if (cartBalance < 0) {
      classes += " warnRed ";
    }
    if (cartBalance < this.threshold) {
      classes += " warn ";
    }
    return classes + " meals-amount-warning "
  }

  //Determine when the warning triangle is to be displayed
  isWarning(cartBalance: number, cartCategory: string): boolean {
    let catName = this.student.mealAccounts.map(b => b.categoryName);
    let myBal = this.student.mealAccounts.map(a => a.currentBalance);

    if (cartBalance >= this.threshold) {
      return false;
    } else {
      //Make sure flag is not set for Bonus accounts
      let catCheck = this.checkCategory(cartCategory);
      return catCheck;
    }
  }

  public insertAccount(insideIndex) {
    if (this.student.mealAccounts[insideIndex].isDepositable) {
      this.formAmount.controls.account.setValue(insideIndex, { emitModelToViewChange: true });
      var i;
      for (i = 0; i < this.student.mealAccounts.length; i++) {
        if (i !== insideIndex && this.student.mealAccounts[i].isDepositable) {
          document.getElementById(i.toString()).style.backgroundColor = 'white';
          document.getElementById(i.toString()).style.color = 'rgba(0, 0, 0, 0.87)';
        }
      }
      let selected = insideIndex.toString();
      document.getElementById(selected).style.backgroundColor = '#c5e1a5';
      document.getElementById(selected).style.color = '#2e7d32';
      this.throwAccountError = false;
      // console.log(this.formAmount.controls.account);
    } else {
      this.throwAccountError = true;
      setTimeout(() => {
        this.throwAccountError = false;
      }, 2000);
    }
  }

  public viewCart() {
    // console.log("Calling veiwCart")
    let proceedCart: CartItem;
    // console.log("about to subscribeToGetCartCheckoutCartItem - SiteHome1:  ", this.cartCheckoutItemsService.cartItem)
    this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
    if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
      if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
        if (this.cartStateItems) {
          proceedCart = this.cartStateItems;
        } else {
          proceedCart = this.cartCheckoutItemsService.cartItem;
        }
        //  console.log("proceedCart: ", proceedCart)

        if (proceedCart && this.router.url !== '/review') {
          this.tabIndex = null;
          this.router.navigate(['/checkout']);
          window.clearInterval(this.checkoutInterval);
        }
      }

    } else {
      this.checkoutInterval = window.setInterval(() => {

        if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
          if (this.cartStateItems) {
            proceedCart = this.cartStateItems;
          } else {
            proceedCart = this.cartCheckoutItemsService.cartItem;
          }
          //  console.log("proceedCart: ", proceedCart)

          if (proceedCart && this.router.url !== '/review') {
            this.tabIndex = null;
            this.router.navigate(['/checkout']);
            window.clearInterval(this.checkoutInterval);
          }
        }
      }, 500);
    }
    this.bottomSheetRef.dismiss();

  }

  public checkCategory(category) {
    if (category == 'Bonus') {
      return false;
    } else {
      return true;
    }
  }

  public showCategoryDescr(insideIndex: number) {
    // console.log('category index', insideIndex);
    this.dialogService.open("Category Description", this.student.mealAccounts[this.data.index].account[insideIndex].categoryDescription, null, null, this.viewContainerRef)
  }

  public closeSheet() {
    this.bottomSheetRef.dismiss();
  }


  ngOnDestroy() {
    this.transfersService.isTransferCallCnt = 0;
    this.transfersService.gotStatusCodeCount = 0;
  }

}
