import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StudentMeal, MealAccount } from '../../model/index';
import { AddCartItemService, StudentMealsServiceRemote, StudentMealsService } from '../../services/index';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem } from '../../model/index';
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
import * as MealStoreActions from '../../../shared/store/actions/mealStore.actions';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';



@Component({
  selector: 'add-amount-selector-mobile',
  templateUrl: 'meals-list-add-to-cart-mobile.component.html',
  styleUrls: ['meals.component.less']
})

export class MealsListAddToCartMobileComponent {
  private loginResponse: LoginResponseModel;
  private failedAddCartAmount: boolean = false;
  private failedAddCartAmountMsg: string = '';

  private isAddCartAmountSaving: boolean = false;
  public isMealPlanSelected: boolean;

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
  public statusInterval: any;
  public formInterval: any;

  constructor(
    private addCartItemService: AddCartItemService,
    private utilityService: UtilityService,
    public mealsComponent: MealsComponent,
    private loginStoreSvc: LoginStoreService,
    public studentRemoteService: StudentMealsServiceRemote,
    private store: Store<AppState>,
    private state: State<AppState>,
    private refreshService: RefreshService,
    private dialogService: SimpleDialogService,
    private transfersService: TransfersService,
    private studentService: StudentMealsService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.mealStore = store.select(state => state.mealStore)
  };

  @Input() formAmount: FormGroup;
  @Input() model: StudentMeal[];
  @Input() outsideIndex: number;
  @Input() account: StudentMeal;
  @Input() insideIndex: number;
  @Input() isSuspendPayment: boolean;


  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartItemMobile: EventEmitter<any> = new EventEmitter<any>();




  ngOnInit() {
    console.log("Loading Meals Mobile: ", this.model)
    console.log("Meals MObile: ", this.account)
    this.isMealPlanSelected = false;
    //initialize the category dropdown list with the bonus filtered out
    this.categoryNames[this.outsideIndex] = this.filterBonus(this.account.mealAccounts);
    this.formInterval = setInterval(() => {
      clearInterval(this.formInterval)
      this.formAmount.valueChanges
        .subscribe(data => this.utilityService.onValueChanged(this.formAmount, this.formErrors, this.validationMessages));
    }, 50)
    this.firstName = this.account.firstName;
    //console.log(this.mealsComponent.addCartAmountMobileForm)
    //if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
    ////console.log("what is availableStatus: ", this.transfersService.availableStatus)
    //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem)
    //  this.xferStatusCounter++;

    //  }




    this.refreshService.mealsListEvent$.subscribe(() => {
      if (this.refreshService.mealsListRefresh === true) {
        this.mealStore.subscribe(c => this.mealState = c);
        if (this.mealState) {
          this.model = this.mealState.data;
        } else {
          let testList: any = this.studentRemoteService.studentMeals;
          this.model = testList;
        }
        this.refreshService.mealsListRefresh = false;
        // console.log("Refreshed the model: ", this.model)
      }
    })

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

  formErrors = {
    'addAmountMobile': '',
    'mealSelectMobile': ''
  };

  validationMessages = {
    'addAmountMobile': {
      'pattern': 'Only numbers are allowed.'
    },

    'mealSelectMobile': {
      'pattern': 'No Meal Plan selected.'
    }
  };

  //Update cart amount on the client side.
  updateCartAmount(j: number) {
    let cartSum: number = this.account.mealAccounts[j].cartAmount;
    this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
    this.formAmount.reset();
  }

  //We need to know when the line item is a bonus
  //amounts can not be added in this case
  //and other special provisions may be required
  //Currently the only indicator is the category name
  filterBonus(mealAccounts: MealAccount[]): any {
    let categoryNames: any = [{
      categoryName: ''
    },
    {
      categoryIndex: 0
    }]
    var i: number = 0
    var j: number = 0
    mealAccounts.forEach(function (item) {
      if (item.isDepositable) {
        categoryNames[i].categoryName = item.categoryName;
        categoryNames[i].categoryIndex = j;
        i++
      }
      j++
    })
    return categoryNames;
  }

  addCartItem(amount: string, i: number, j: number) {
    if (j == undefined) {
      this.isMealPlanSelected = true;
      this.mealSelectedErrMsg = this.validationMessages.mealSelectMobile.pattern;
    } else {
      this.isMealPlanSelected = false;
      this.addCartItemMobile.emit({
        valid: this.formAmount.valid,
        amount: amount,
        outsideIndex: i,
        insideIndex: j
      });
      //Client side update cartAmount
      this.updateCartAmount(j);

    }


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
    let catName = this.account.mealAccounts.map(b => b.categoryName);
    let myBal = this.account.mealAccounts.map(a => a.currentBalance);

    if (cartBalance >= this.threshold) {
      return false;
    } else {
      //Make sure flag is not set for Bonus accounts
      let catCheck = this.checkCategory(cartCategory);
      return catCheck;
    }
  }

  //public showCategoryDescr(insideIndex: number) {
  //  this.dialogService.open("Category Description", this.model[insideIndex].categoryDescription, null, null, this.viewContainerRef)
  //}

  public checkCategory(category) {
    if (category == 'Bonus') {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.transfersService.isTransferCallCnt = 0;
    this.transfersService.gotStatusCodeCount = 0;
  }

}
