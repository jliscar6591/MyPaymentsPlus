import { Component, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StudentMeal, MealAccount } from '../../model/index';
import { AddCartItemService, StudentMealsService, StudentMealsServiceRemote } from '../../services/index';
import { TransfersService, MultiDistrictService } from '../../services/index';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem, CartResponse } from '../../model/index';
import { Observable } from 'rxjs';
import { SiteHomeComponent } from '../../site-home.component';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service';
import { error } from '@angular/compiler/src/util';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as MealStoreActions from '../../../shared/store/actions/mealStore.actions';
//import { clearInterval, setTimeout, setInterval } from 'timers';
//import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions'




@Component({
  selector: 'add-amount-selector',
  templateUrl: 'meals-list-add-to-cart.component.html',
  styleUrls: ['meals.component.less']
})

export class MealsListAddToCartComponent {
  private loginResponse: LoginResponseModel = this.loginStoreSvc.cookieStateItem;
  private threshold: number = Constants.studentMealBalanceWarningThreshold;
  public firstName: any;
  public balDate: any;
  public availStatus: any;
  public reply: boolean;
  public testStatus: string;
  public isNewDistrict: boolean = this.multiDistrictSrvc.newDistrictSelected;
  public pendingTransfer: boolean;
  public isXferFeePaid: boolean;
  private xferStatusInterval: any;
  public xferLinkStatus: any;
  public testStudentList: any;
  public doWeHaveStatus: boolean;
  public xFerLinkCounter: number = 0;
  public xferStatusCounter: number = 0;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public subscription: any;
  public mealsListRefreshCounter: number = 0;
  public xferSubscription: any;
  public xferRequestInterval: any;
  public mealRefreshCounter: number = 0;
  public didSwitchCounter: number = 0;
  public modelCounter: number = 0;
  public isAddCartAmountSaving: boolean = false;
  public formInterval: any;
  public getXferInterval: any;

  constructor(
    private router: Router,
    private addCartItemService: AddCartItemService,
    private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private utilityService: UtilityService,
    private dialogService: SimpleDialogService,
    private viewContainerRef: ViewContainerRef,
    private transfersService: TransfersService,
    public receiptService: ReceiptService,
    public multiDistrictSrvc: MultiDistrictService,
    public studentService: StudentMealsService,
    public studentRemoteService: StudentMealsServiceRemote,
    public siteHomeComponent: SiteHomeComponent,
    private loginStoreSvc: LoginStoreService,
    private store: Store<AppState>,
    private state: State<AppState>,
    private refreshService: RefreshService


  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.mealStore = store.select(state => state.mealStore)
  };

  //public cartStore: Observable<CartResponse>;
  @Input() addAmountValidation: any;
  @Input() form: FormGroup;
  @Input() model: StudentMeal[];
  @Input() insideIndex: number;
  @Input() outsideIndex: number;
  @Input() account: StudentMeal;
  @Input() isSuspendPayment: boolean;
  @Input() mealModel: MealAccount[];
  @Input() cartItemDetailModel: CartItemDetail[];
  @Input() feeFristName: string;
  @Input() feeLastName: string;



  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  @Output() addCartItemDesktop: EventEmitter<any> = new EventEmitter<any>();
  // @Output()




  async ngOnInit() {
    //  console.log("Calling Meal-List-Add-To-Cart")
    //console.log(this.transfersService);
    // console.log(this.transfersService.availableStatus.status);
    this.mealStore.subscribe(c => this.mealState = c);
    if (!this.model) {
      if (this.mealState) {
        this.model = this.mealState.data;
        // console.log("Do we have a model: ", this.model);
      }
    }

    this.formInterval = setInterval(() => {
      if (this.form) {
        clearInterval(this.formInterval)
        //Validation reporting
        this.form.valueChanges
          .subscribe(data => this.utilityService.onValueChanged(this.form, this.formErrors, this.validationMessages));
      }

    }, 50)

    this.xferStatusInterval = await setInterval(() => {
      // console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
      this.reply = this.transfersService.result;
      // console.log(this.transfersService.availableStatus);
      if (this.transfersService.availableStatus) {
        if (this.transfersService.availableStatus.status === 4) {
          this.isXferFeePaid = false;
        } else if (this.transfersService.availableStatus.status === 3) {
          this.isXferFeePaid = true;
        }
        // console.log('this.reply: ', this.reply)
        //console.log('this.isXferFeePaid: ', this.isXferFeePaid)
        clearInterval(this.xferStatusInterval);
      }
    }, 50);


    this.firstName = this.account.firstName;
    this.balDate = this.account.balanceDate;

    //console.log('availableStatus: ', this.transfersService.xferLinkStatus)

    //if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
    //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem);
    //  // this.transfersService.subscribeToGetPendingRequests(this.loginStoreSvc.cookieStateItem);
    //  // console.log("transferService Meals-list-add-to-cart subscribeToGetMeals ")
    //  // this.studentService.subscribeToGetMeals(this.loginStoreSvc.cookieStateItem)
    //  this.xferStatusCounter++;
    //}
    this.refreshService.multiDistrictEvent$.subscribe(() => {
      if (this.refreshService.multiDistrictRefresh) {
        this.model = [];
        this.studentService.studentMeals = this.refreshService.multiDistrictMealRefresh();
        // if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
        //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem);
        //this.transfersService.subscribeToGetTransferFeeStatusNew(this.loginStoreSvc.cookieStateItem);

        this.loginStoreSvc.loadLogin(this.loginStoreSvc.cookieStateItem);
        this.transfersService.gotStautsCode = true;
        // console.log("did the subscribe complete: ", this.xferStatusCode)
        this.transfersService.gotStatusCodeCount++;
        // if (this.transfersService.gotStautsCode == true && (this.transfersService.isTransferCallCnt < this.transfersService.gotStatusCodeCount)) {
        //window.clearInterval(this.getXferInterval);
        this.transfersService.xferLinkStatus = this.transfersService.xferStatusCode;
        (this.xferLinkStatus) ? this.transfersService.isTransfer(this.transfersService.xferLinkStatus) : this.transfersService.reply = false;


        if (this.studentService.studentMeals) {
          this.model = this.studentService.studentMeals;
        } else {
          this.model = this.studentRemoteService.studentMeals;
        }
        this.refreshService.multiDistrictRefresh = false;

      }
    });

    this.refreshService.mealsListEvent$.subscribe(() => {
      if (this.refreshService.mealsListRefresh === true) {
        this.mealStore.subscribe(c => this.mealState = c);
        if (this.mealState) {
          this.model = this.mealState.data;
        } else {
          this.model = this.studentRemoteService.studentMeals;
        }
        // console.log("the model: ", this.model)
        this.refreshService.mealsListRefresh = false;
      }
    })



  }

  ngDoCheck() {

    this.availStatus = this.transfersService.xferLinkStatus;
    if (this.availStatus == 2) {
      this.studentService.needGetStudents.emit(true);
    }
  }

  ngAfterContentChecked() {


  }


  ngAfterViewInit() {
    //  console.log("Callinf Meals List Add ngAfterViewInit: ", this.model)
    setTimeout(() => {
      // console.log("Do we see the NEW MODEL NOW: ", this.model);

      //  console.log("Or NOW from StudentService: ", this.studentService.studentMeals);
      if (this.refreshService.multiDistrictRefresh && this.siteHomeComponent.siteMealsRefresh === true) {
        let testMeals: any = this.studentService.studentMeals.map(a => a.mealAccounts);
        for (let i = 0; i < testMeals.length; i++) {
          this.model.push(testMeals[i]);
        }
        this.refreshService.multiDistrictRefresh = false;
        //  console.log("Our new Model: ", this.model)
      }


      if (this.account) {
        this.account.mealAccounts.reverse();
      }
    }, 100)

    //Makes sure the most cuurent status code is being used in case any transfers were processed or became pending
    // this.doWeHaveStatus = this.transfersService.gotStautsCode;

    if (this.didSwitchCounter < 1) {
      this.multiDistrictSrvc.didSwitchDistrict.subscribe(() => {
        if (this.multiDistrictSrvc.newDistrictSelected) {
          this.multiDistrictSrvc.newDistrictSelected = false;
        }
      })
      this.didSwitchCounter++;
    }
    else {

      if (this.didSwitchCounter < 3) {

        this.didSwitchCounter++;
      }
    }


  }

  isMealAccounts() {
    if (this.account) {
      return this.account.mealAccounts.length > 0;
    } else {
      return false;
    }
  }

  update(content) {
    this.changed.emit(content);

    //  console.log("Do we have a Pending Amount: ", this.model[this.insideIndex].mealAccounts[this.outsideIndex].cartAmount);
  }

  public formErrors = {
    'addAmount': ''
  };

  validationMessages = {
    'addAmount': {
      'pattern': 'Only numbers are allowed.'
    },
  };

  //Update cart amount on the client side.
  updateCartAmount(j: number) {
    // console.log("Updating this Account: ", this.account.mealAccounts[j])
    let cartSum: number = this.account.mealAccounts[j].cartAmount;
    // console.log("What is CartSum: ", cartSum)
    // console.log("do we have a addAmount: ", this.account.mealAccounts[j].addAmount);
    this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
    this.studentService.needGetStudents.emit(true);
    this.addCartItemService.cartUpdate.emit(true);
    this.form.reset();
    this.model[j].isAddCartAmountSaving = (this.account.mealAccounts[j].cartAmount < 0) ? true : false;
    setTimeout(() => {
      this.isAddCartAmountSaving = (this.account.mealAccounts[j].cartAmount < 0) ? true : false;
      this.account['isAddCartAmountSaving'] = (this.account.mealAccounts[j].cartAmount < 0) ? true : false;
      // console.log("Are you still Saving: ", this.account['isAddCartAmountSaving'])

    }, 500)


  }

  //Determine the color of warning icon
  //concatenate a string of classes to 
  //render the warning icon with the
  //desired color.
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

  addCartItem(i: number, j: number) {
    // console.log("Calling addCartITEM: ", this.model[j]);
    this.isAddCartAmountSaving = true;
    this.model[j].isAddCartAmountSaving = true;
    this.account['isAddCartAmountSaving'] = this.model[j].isAddCartAmountSaving;
    //console.log("Is Cart amount Saving: ", this.account['isAddCartAmountSaving'])


    this.addCartItemDesktop.emit({
      valid: this.form.valid,
      outsideIndex: i,
      insideIndex: j
    });
    this.siteHomeComponent.fixCartFlag = true;
    //Client side update cartAmount
    this.updateCartAmount(j);
  }

  public showCategoryDescr(insideIndex: number) {
    this.dialogService.open("Category Description", this.model[insideIndex].categoryDescription, null, null, this.viewContainerRef)
  }

  checkCategory(category) {
    if (category == 'Bonus') {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    // console.log("Destroy Now");
    this.transfersService.gotStautsCode = false;
    this.doWeHaveStatus = this.transfersService.gotStautsCode;
    this.didSwitchCounter = 0;
    this.modelCounter = 0;
  }
}
