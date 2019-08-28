import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentMealsService, StudentMealsServiceRemote, AddCartItemService, ValidCartCountService } from "../../services/index";
import { LoginResponseModel } from "../../../login/model/index"
import { CartAddAmount } from "../../../site/model/index"
import {
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';

import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { Constants } from "../../../app.settings";
import { MealsEmptyComponent } from "./meals-empty.component"
import { MealsListComponent } from "./meals-list.component"
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap, first } from 'rxjs/operators';
import { StudentMeal, MealAccount, CartResponse, CartItem } from '../../model/index';
import { SuspendPaymentWarningService } from '../../../shared/components/suspend-payment-warning/suspend-payment-warning.service';
import { MultiDistrictService, TransfersService, } from '../../services/index';
import { StudentListService } from '../../../registration/services/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions';
import * as MealStoreActions from '../../../shared/store/actions/mealStore.actions';
import { Plugins } from '@capacitor/core';
import { ISubscription } from "rxjs/Subscription";

@Component({
  moduleId: module.id,
  selector: 'meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.less', '../dashboard-home.component.less']
})

export class MealsComponent implements OnInit, AfterViewInit, OnDestroy {
  public addCartAmountForm: FormGroup;
  public addCartAmountMobileForm: FormGroup;

  public loginResponse: LoginResponseModel;
  public isStudentsGetting: boolean = true;
  public getStudentErr: boolean = false;
  private getStudentErrMsg: string = '';
  public isStudents: boolean = false;
  public mobileFormReady: boolean = false;
  public isStudentsRemoteGetting: boolean = true;
  public getStudentRemoteErr: boolean = false;
  private getStudentRemoteErrMsg: string = '';
  public isStudentsRemote: boolean = false;
  public formReady: boolean = false;
  private isLoading: boolean;
  private isAddCartAmountSaving: boolean = false;
  public testStudentList: any;
  public testStudentRemoteList: any;
  public refreshStudents: boolean = false;
  public cartResponse: CartResponse;
  public cartStore: Observable<CartItem>;
  public cartState: any;
  public cartStateItems: CartItem;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public districtMealStore: Observable<StudentMeal>;
  public districtMealState: any;
  public districtMealStateMeal: StudentMeal;
  private getStudentCounter: number = 0;
  public studentMealsComponent: any;
  private refreshStudentsCounter: number = 0;
  public xferSubscription: any;
  public xferRequestInterval: any;
  public hadPendingXfers: boolean = false;
  public stillPendingCounter: number = 0;
  public pendingStillCalled: number = 0;
  public xIntervalCounter: number = 0;
  public testStudentRemoteCnter: number = 0;
  public multiDistrictRefreshCntr: number = 0;
  public testStudent$: any;
  public listReadyCounter: number = 0;
  public lateMeals$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isMobile: boolean = false;
  public mealsInterval: any;
  public isCurrentDate: boolean = true;
  public errorRefreshCnt: number = 0;
  public fatalMealsError: boolean = false;
  public getRemoteInterval: any;
  public getRemoteIntrvlCount: number = 0;
  public isStudentRemoteIntrvl: any;
  public deviceInfo: any;
  private formCompleted$: Subscription;
  public remoteInterval: any;
  public mobileFormInterval: any;
  private subscription: ISubscription;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public studentMealsService: StudentMealsService,
    public studentMealsServiceRemote: StudentMealsServiceRemote,
    public addCartItemService: AddCartItemService,
    private utilityService: UtilityService,
    private suspendPaymentWarningService: SuspendPaymentWarningService,
    public validateCartService: ValidCartCountService,
    public store: Store<AppState>,
    private state: State<AppState>,
    public receiptService: ReceiptService,
    private refreshService: RefreshService,
    private transfersService: TransfersService,
    private multiDistrictSvc: MultiDistrictService,
    private loginStoreSvc: LoginStoreService,
    //public cdr: ChangeDetectorRef,
    private pageLoadingService: PageLoadingService

  ) {
    this.cartStore = store.select(state => state.cartStore)
    this.mealStore = store.select(state => state.mealStore)
    this.districtMealStore = store.select(state => state.districtMealStore)
    this.addCartAmountForm = this.formBuilder.group({});
    this.addCartAmountMobileForm = this.formBuilder.group({});
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  };

  async ngOnInit() {
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
    this.isMobile = (window.innerWidth < 960) ? true : false;
    // console.log('deviceInfo',this.deviceInfo);
    // console.log("Calling Meals")
    await this.mealStore.subscribe(c => this.mealState = c);
    if (window.innerWidth < 960) {

      this.isStudentsRemote = false;
    }
    if (!this.loginResponse.isDisableMealPaymentsDistrict) {
      //console.log("Calling getRemote New")
      this.getStudentMealsRemoteNew();
    }
  }

  ngDoCheck() { }

  ngAfterViewInit() {
    //this.cdr.detectChanges();
    //console.log(this.studentMealsServiceRemote.studentMeals);
    //console.log(this.mealState);
    this.remoteInterval = setInterval(() => {
      if (this.studentMealsServiceRemote.studentMeals && this.addCartAmountForm.controls || this.addCartAmountMobileForm.controls) {
        this.isStudentsRemote = true;
      }
    }, 50);
  }

  getSuspendPayment(): boolean {
    let issupended: boolean;
    let warning: boolean = false;
    let warningMsg: string = '';
    //console.log("Calling getSuspendPayment from Meals: ", this.loginResponse);

    if (this.loginResponse.isBlockPayments) {
      warningMsg += `Payments are disabled for this account.`;
      warning = true;
    }
    else if (this.loginResponse.allPaymentsSuspended) {
      warningMsg += `All payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate + '.';
      warning = true;
    } else if (this.loginResponse.mealPaymentsSuspended) {
      warningMsg += `Meal payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate + '.';
      warning = true;
    } else if (this.loginResponse.isDisableMealPaymentsDistrict) {
      warningMsg += 'Meal payments are disabled at your district.';
      warning = true;
    }
    return issupended = this.suspendPaymentWarningService.getWarning(warning, warningMsg);

  }

  //for desktop browser component
  initListItem() {
    return this.formBuilder.group({
      'addAmount': [null, [Validators.pattern(Constants.DecimalPattern)]]
    }, { updateOn: 'submit' });
  }

  //for mobile browser component
  initAddAmountMobile() {
    //console.log("Building Mobile Form")
    return this.formBuilder.group({
      'addAmountMobile': [null, [Validators.pattern(Constants.DecimalPattern)]],
      'mealSelectMobile': ['']
    }, { updateOn: 'submit' });
  }

  //For mobile
  public addCartItemMobile(params: any) {
    //console.log('params', params);
    this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].addAmount = params.amount;
    this.addCartItem(params, this.studentMealsService.studentMeals);
  }

  public async getStudentMealsRemoteNew() {
    // console.log("Calling getStudentMealsRemoteNew")

    //console.log("Do we have mealService: ", this.mealService.mealStateMeals);
    let list: any = [];
    // console.log("Do we have mealState: ", this.mealState)
    if (this.mealState !== undefined) {
      this.getRemoteInterval = setInterval(async () => {
        this.getRemoteIntrvlCount++;
        if (this.getRemoteIntrvlCount < 6) {
          if (this.mealState.data && this.studentMealsServiceRemote.result) {

            this.studentMealsServiceRemote.studentMeals = this.mealState.data;
            //console.log("mealState: ", this.studentMealsServiceRemote.studentMeals)

            this.studentMealsComponent = this.studentMealsServiceRemote.studentMeals;
            //console.log("do we have  this.studentMealsComponent: ", this.studentMealsComponent)
            //Checking to make sure the mealAccounts are current
            list = this.studentMealsComponent;
            this.checkDate(list);
            clearInterval(this.getRemoteInterval);
            if (this.studentMealsComponent) {
              this.testStudentList = this.studentMealsComponent;
              //console.log("this.testStudentList: ", this.testStudentList.length)
              //Build Form
              this.addCartAmountMobileForm = this.formBuilder.group({});
              for (let i = 0; i < this.testStudentList.length; i++) {
                //For use with the mobile version. Mobile is flatter 
                //it only contains one add amount field per student.
                //the selection of category is by ddl.
                if (this.isMobile) {
                  //this.mobileFormInterval = setInterval(() => {
                  clearInterval(this.mobileFormInterval);
                  this.addCartAmountMobileForm.valueChanges;
                  this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
                  //  console.log("this.addCartAmountMobileForm.addControl: ", this.addCartAmountMobileForm.addControl)
                  const arrayControl = <FormArray>this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                  // console.log("do we have arrayControl: ", arrayControl)
                  for (let mealAccount of this.testStudentList[i].mealAccounts) {
                    arrayControl.push(this.initAddAmountMobile());
                  }
                  // }, 500)

                  //console.log("Do we have a form Here: ", this.addCartAmountMobileForm.controls)
                  //}, 50);
                  this.mobileFormReady = true;

                }



                //For us with desktop version. Desktop includes
                if (!this.isMobile) {
                  //the categories as a row under the student along with the add amount fields and the submit button
                  await this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
                  const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
                  for (let mealAccount of this.testStudentList[i].mealAccounts) {
                    arrayControl.push(this.initListItem());
                  }

                  this.formReady = true;

                  //console.log("Do we have a form Here: ", this.addCartAmountForm.controls)

                }

              }
              this.isStudentsGetting = this.isStudents = (this.testStudentList.length < 0) ? true : false;
              // console.log("isStudentsGetting: ", this.isStudentsGetting);
              this.isStudentsRemoteGetting = (this.testStudentList.length < 0) ? true : false;
              //console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
              this.pageLoadingService.hide();

            } else {
              this.studentMealsServiceRemote.subscribeToGetMeals(this.loginResponse);
              //Meal Store empty need to getMeals and subscribe to the formCompleted Observable 
              //  this.formCompleted$ = this.studentMealsServiceRemote.mealsCompleted.subscribe(() => {
              if (this.studentMealsServiceRemote.studentMeals) {
                list = [];
                list = this.studentMealsServiceRemote.studentMeals;
                // console.log("Calling check Date: ", list)
                // this.checkDate(list);
                this.store.dispatch(new MealStoreActions.ClearMeals());
                this.store.dispatch(new MealStoreActions.LoadMealsSuccess(list))
                this.mealStore.subscribe(c => this.mealState = c);
                if (this.mealState) {
                  this.studentMealsServiceRemote.studentMeals = this.mealState.data;
                  //console.log("mealState: ", this.studentMealsServiceRemote.studentMeals)
                  this.studentMealsComponent = this.studentMealsServiceRemote.studentMeals;

                  this.isStudents = (this.studentMealsComponent.length > 0) ? true : false;

                }
                //Now that we have studentMeals build the form for meals-list
                if (this.studentMealsComponent) {
                  this.isMobile = (window.innerWidth < 960) ? true : false;
                  this.testStudentList = this.studentMealsComponent;
                  //Build Form
                  for (let i = 0; i < this.testStudentList.length; i++) {
                    //For use with the mobile version. Mobile is flatter 
                    //it only contains one add amount field per student.
                    //the selection of category is by ddl.
                    if (this.isMobile) {
                      this.addCartAmountMobileForm = this.formBuilder.group({});
                      // setTimeout(() => {
                      this.addCartAmountMobileForm.valueChanges;
                      await this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
                      //  console.log("this.addCartAmountMobileForm.addControl: ", this.addCartAmountMobileForm.addControl)
                      const arrayControl = <FormArray>this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                      // console.log("do we have arrayControl: ", arrayControl)
                      for (let mealAccount of this.testStudentList[i].mealAccounts) {
                        arrayControl.push(this.initAddAmountMobile());
                      }
                      this.mobileFormReady = true;
                      // }, 500)
                    }

                    //For us with desktop version. Desktop includes
                    if (!this.isMobile) {
                      //the categories as a row under the student along with the add amount fields and the submit button
                      await this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
                      const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
                      for (let mealAccount of this.testStudentList[i].mealAccounts) {
                        arrayControl.push(this.initListItem());
                      }
                      this.formReady = true;

                    }

                  }
                  this.isStudentsGetting = (this.studentMealsComponent.length < 0) ? true : false;
                  // console.log("isStudentsGetting: ", this.isStudentsGetting);
                  this.isStudentsRemoteGetting = (this.studentMealsComponent.length < 0) ? true : false;
                  // console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
                  this.pageLoadingService.hide();
                }
              }
              //});

            }

          }
        }
      }, 500)
    } else {
      //The meal store was emptied out when we left the dashboard
      // console.log("the meal store was empty calling CafeteriaAccounts/Remote")
      this.subscription = this.studentMealsServiceRemote.getRemoteStudentMeals(this.loginResponse)
        .subscribe(
          data => {
            this.studentMealsComponent = data;
          },
          error => {
            // console.log("Error: No Meals: ", this.studentMealsComponent);
          },
          async () => {
            this.studentMealsServiceRemote.weGotStudents.emit(true);
            this.isStudentsRemoteGetting = this.studentMealsComponent.length > 0;
            //Checking to make sure the mealAccounts are current
            list = this.studentMealsComponent;
            this.checkDate(list);
            this.loginStoreSvc.loadLogin(this.loginResponse)
            // console.log("What is tempMeals: ", list)
            this.store.dispatch(new MealStoreActions.ClearMeals());
            this.store.dispatch(new MealStoreActions.LoadMealsSuccess(list));

            // console.log("Calling this.formCompleted ")
            this.studentMealsServiceRemote.formCompleted = new Observable(observer => {
              observer.next(true);
              observer.complete();
            });
            this.studentMealsServiceRemote.formCompleted.pipe(
              first(data => data == true)
            );

            if (this.studentMealsComponent) {

              this.testStudentList = this.studentMealsComponent;
              this.isStudentsRemote = (this.testStudentList.length > 0) ? true : false;
              this.isMobile = (window.innerWidth < 960) ? true : false;
              //  console.log("is this Mobile 2: ", this.isMobile)
              //Build Form
              for (let i = 0; i < this.testStudentList.length; i++) {
                //For use with the mobile version. Mobile is flatter 
                //it only contains one add amount field per student.
                //the selection of category is by ddl.
                if (this.isMobile) {
                  this.addCartAmountMobileForm = this.formBuilder.group({});
                  //setTimeout(() => {
                  this.addCartAmountMobileForm.valueChanges;
                  await this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
                  //  console.log("this.addCartAmountMobileForm.addControl: ", this.addCartAmountMobileForm.addControl)
                  const arrayControl = <FormArray>this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                  // console.log("do we have arrayControl: ", arrayControl)
                  for (let mealAccount of this.testStudentList[i].mealAccounts) {
                    arrayControl.push(this.initAddAmountMobile());
                  }
                  //}, 0)
                  this.mobileFormReady = true;
                  //console.log("Do we have a form Here: ", this.addCartAmountMobileForm.controls)
                }

                if (!this.isMobile) {
                  //the categories as a row under the student along with the add amount fields and the submit button
                  await this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
                  const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
                  for (let mealAccount of this.testStudentList[i].mealAccounts) {
                    arrayControl.push(this.initListItem());
                  }
                  this.formReady = true;
                }
              }//End of For Loop
            }//End if If statement

            // this.isStudentsGetting = this.isStudents = (this.testStudentList.length < 0) ? true : false;
            //console.log("isStudentsGetting: ", this.isStudentsGetting);
            // this.isStudentsRemoteGetting = (this.testStudentList.length < 0) ? true : false;

            this.isStudentsRemote = (this.testStudentList.length > 0) ? true : false;
            this.isStudentsGetting = (this.testStudentList.length < 0) ? true : false;
            //  console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
            this.pageLoadingService.hide();
          }
        )


    }
  }
  //End of getRemote

  public addCartItem(params: any, studentMeals) {
    //console.log("Adding cart item: ", params);
    this.addCartItemService.result = false;

    let account: any = this.studentMealsServiceRemote.studentMeals;
    //console.log("These are the accounts: ", account)
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    //console.log("What is the current LoginResponse: ", this.loginResponse)

    
    if (params.valid && params.amount) {
      account[params.outsideIndex].mealAccounts[params.insideIndex].addAmount = parseFloat(params.amount)
    }
    if (params.valid && account[params.outsideIndex].mealAccounts[params.insideIndex].addAmount) {
      //start spinner
      account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = true;
      //start spinner mobile
      //console.log('do we get in here');
      //console.log("Do we have the new LoginResponse: ", this.loginResponse);
      let subscription =
        this.addCartItemService.putCartItemNew(account, params, this.loginResponse)
          .subscribe(
            response => {
              this.cartResponse = response;
              this.refreshService.refreshMeals();
              this.refreshService.refreshCart();
            },
            error => {
              this.addCartItemService.result = false;
              if (this.addCartItemService.loginResponse.messageType === Constants.Error) {
                console.log('is there an error');
                //error report
                account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmount = true;
                account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmountMsg = this.addCartItemService.loginResponse.message;
                //error report mobile
                account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmount = true;
                account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmountMsg = this.addCartItemService.loginResponse.message;
                //finish spinner
                account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;
                //finish spinner mobile
                account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;

                this.utilityService.clearErrorMessage(this.addCartItemService.loginResponse);
              }
            },
            () => {
              // //console.log("What is cartResponse:  ", this.cartResponse);
              if (this.cartResponse.itemCount > 0) {
                this.loginResponse.cartItemCount = this.cartResponse.itemCount;
                this.addCartItemService.count = this.loginResponse.cartItemCount;
                this.validateCartService.fixCartNow = true;
                this.addCartItemService.addedToCart = true;
              }
              //account,
              this.setAccountCartAmount(this.cartResponse, params);
              this.studentMealsService.needGetStudents.emit(true);
              this.validateCartService.fixCartNow = true;
              this.loginStoreSvc.loadLogin(this.addCartItemService.loginResponse);

              let tempResponse: any;
              tempResponse = this.cartResponse;
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempResponse))
              this.cartStore.subscribe(c => this.cartState = c);
              this.cartStateItems = this.cartState.data;
              if (this.cartStateItems) {
                this.addCartItemService.result = false;
                this.addCartItemService.cartUpdate.emit(false);
                this.refreshService.refreshCart();
              }
              //console.log('cartstate', this.cartState);

              //let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
              //seconds.subscribe(
              //  x => {
              //    if (x == Constants.SpinnerDelay) {
              //      //finish spinner
              account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;
              //  }
              //});

              this.addCartItemService.count = this.cartResponse.itemCount;

              subscription.unsubscribe();
            }
          );
    }
  }

  private setAccountCartAmount(countResponse, params) {
    let itemIndex;
    //countResponse.itemCount > 0
    if (params.insideIndex > 0) {
      itemIndex = params.insideIndex - 1;
    } else {
      itemIndex = params.insideIndex;
      // console.log("The itemIndex from inside - 1: ", itemIndex)
    }

    if (this.studentMealsService.studentMeals) {
      if (countResponse.items[itemIndex].itemAmount > 0) {
        for (let i = 0; i < countResponse.items.length; i++) {
          if (this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].categoryKey == countResponse.items[i].mealCategoryKey) {
            this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].cartAmount = countResponse.items[i].itemAmount;
          }
        }
      } else {
        this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].cartAmount = countResponse.items[itemIndex].amountInCart;
      }
    }
  }

  public setMultiDistrictMeals() {
    // console.log("Calling setMultiDistrictMeals ")
    setTimeout(() => {
      this.districtMealStore.subscribe(m => this.districtMealState = m);
      if (this.districtMealState) {

        this.districtMealStateMeal = this.districtMealState.data;
        //console.log("this DistrictMealStateMeal: ", this.districtMealStateMeal)
      }
    }, 2000)

  }

  public async reBuildForm() {
    // this.studentMealsServiceRemote.studentMeals = this.mealState.data;
    //  console.log("Need to Rebuild Form: ", this.mealState.data)
    if (this.mealState.data) {
      this.testStudentList = this.mealState.data;
    }
    this.studentMealsServiceRemote.listReady = (this.testStudentList.length > 0) ? true : false;
    if (this.studentMealsServiceRemote.listReady === true && this.studentMealsServiceRemote.studentMeals.length > 0) {
      //  console.log("Need to Rebuild Form2: ", this.testStudentList)
      if (this.testStudentList) {
        // this.getStudentRemoteErr = (this.testStudentList.length < 0) ? true : false;
        this.studentMealsServiceRemote.getMealsErr = (this.testStudentList.length == 0) ? true : false;
        this.getStudentRemoteErr = this.studentMealsServiceRemote.getMealsErr;
        // console.log("Rebuilding form RemoteError is: ", this.getStudentRemoteErr)
        //Build Form
        for (let i = 0; i < this.testStudentList.length; i++) {

          //For use with the mobile version. Mobile is flatter 
          //it only contains one add amount field per student.
          //the selection of category is by ddl.
          //this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.initAddAmountMobile())

          ////For us with desktop version. Desktop includes
          ////the categories as a row under the student along with the add amount fields and the submit button
          //this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
          //const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
          //for (let mealAccount of this.testStudentList[i].mealAccounts) {
          //  arrayControl.push(this.initListItem());
          //}
          //console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
          if (this.isMobile) {
            this.addCartAmountMobileForm = this.formBuilder.group({});
            setTimeout(async () => {
              this.addCartAmountMobileForm.valueChanges;
              await this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
              //  console.log("this.addCartAmountMobileForm.addControl: ", this.addCartAmountMobileForm.addControl)
              const arrayControl = <FormArray>this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
              // console.log("do we have arrayControl: ", arrayControl)
              for (let mealAccount of this.testStudentList[i].mealAccounts) {
                arrayControl.push(this.initAddAmountMobile());
              }
            }, 200)
          } else {
            //the categories as a row under the student along with the add amount fields and the submit button
            await this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
            const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
            for (let mealAccount of this.testStudentList[i].mealAccounts) {
              arrayControl.push(this.initListItem());
            }

          }

        }
      } else {
        //setTimeout(() => {
        this.testStudentList = this.studentMealsService.studentMeals;
        //Build Form
        for (let i = 0; i < this.testStudentList.length; i++) {
          if (this.isMobile) {
            this.addCartAmountMobileForm = this.formBuilder.group({});

            this.addCartAmountMobileForm.valueChanges;
            await this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
            //  console.log("this.addCartAmountMobileForm.addControl: ", this.addCartAmountMobileForm.addControl)
            const arrayControl = <FormArray>this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
            // console.log("do we have arrayControl: ", arrayControl)
            for (let mealAccount of this.testStudentList[i].mealAccounts) {
              arrayControl.push(this.initAddAmountMobile());
            }

          } else {
            //the categories as a row under the student along with the add amount fields and the submit button
            await this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]));
            const arrayControl = <FormArray>this.addCartAmountForm.controls['addAmountArray' + i];
            for (let mealAccount of this.testStudentList[i].mealAccounts) {
              arrayControl.push(this.initListItem());
            }

          }
        }
        //}, 500)
      }
    }


  }

  //Checks for Date integrity of the meal balances
  public checkDate(studentMeals) {
    //  console.log("do wehave the currentDate: ", studentMeals);
    let mealDate: any;
    let mealTime: any;
    /*Right now forcing the date for Test Purposes, should really check the following object:
    studentMeals[0].mealAccounts[0].currentBalanceLastUpdated.slice(0, 10);*/
    if (studentMeals.length > 0) {
      mealDate = studentMeals[0].mealAccounts[0].currentBalanceLastUpdated.slice(0, 10);
      mealTime = new Date(studentMeals[0].mealAccounts[0].currentBalanceLastUpdated)
    } else {
      mealDate = "2000-01-01";
      mealTime = "00:00:00";
    }

    // console.log("mealDate and Time: ", mealDate)
    //Using the full DateTime to check for a more than 60 minutes time difference in diff()

    //for debugging
    //new Date("2019-04-15T13:50:36.257")
    // console.log("mealTime: ", mealTime)
    //.slice(0, 10);
    //For debugging
    //'2019-04-29';
    //
    //console.log("mealDate: ", mealDate)
    var now = new Date();
    // console.log("what is now: ", now)
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    // console.log("What is today: ", today);
    if (today == mealDate) {
      this.isCurrentDate = true;
    } else {
      this.isCurrentDate = false;
    }
    // console.log("isCurrentDate: ", this.isCurrentDate)
    //Displays the Failed Communications error when we get a 206
    //which is a successful response with no data
    if (this.studentMealsServiceRemote.getMealsErr) {
      this.getStudentRemoteErr = this.studentMealsServiceRemote.getMealsErr;

    }

    //if (today == mealDate) {
    //  this.diff(mealTime, now);
    //}

    //For debuging to force the Communications error to display
    //else {
    //  this.getStudentRemoteErr = true;
    //}

    //  console.log("We got a Meals Error: ", this.getStudentRemoteErr)

  }

  //Calculates the time difference between Now and the last update Date of the Meal Accounts

  //diff(start, end) {
  //  // console.log("Start: ", start)
  //  // console.log("end: ",end )
  //  // console.log("iscurrentDate Here: ", this.isCurrentDate)
  //  var diff = end.getTime() - start.getTime();
  //  var resultInMinutes = Math.round(diff / 60000)
  //  // console.log("resultInMinutes: ", resultInMinutes)
  //  if (this.deviceInfo.model === 'Macintosh' && this.deviceInfo.platform === 'web') {
  //    if (resultInMinutes > 560) {
  //      this.isCurrentDate = false;
  //      // alert("I am mac: " + this.deviceInfo.model);
  //      // console.log("iscurrentDate: ", this.isCurrentDate)
  //      //console.log("fatalMealsError: ", this.fatalMealsError)
  //    }
  //  } else if (this.deviceInfo.model === 'iPhone' && this.deviceInfo.platform === 'web') {
  //    if (resultInMinutes > 600) {
  //      this.isCurrentDate = false;
  //      // alert("I am ios: " + this.deviceInfo.model);
  //      // console.log("iscurrentDate: ", this.isCurrentDate)
  //      // console.log("fatalMealsError: ", this.fatalMealsError)
  //      // alert("I am ios");
  //    }
  //    //this.isCurrentDate = true;
  //  } else {
  //    if (resultInMinutes > 60 && (this.deviceInfo.model !== 'iPhone' || this.deviceInfo.model !== 'Macintosh')) {
  //      this.isCurrentDate = false;
  //      // console.log("iscurrentDate: ", this.isCurrentDate)
  //      //console.log("fatalMealsError: ", this.fatalMealsError)
  //    }
  //  }
  //}
  /**
   * I was beginning to create a way to check when Pending Transfers had processed per the original requirements
   * I was told that it isn't needed anymore but I don't believe that so I'm keeping this function
   * In case I need to fully implement -JT
   * @param studentMeals
   */
  //public checkForPendingXfers(studentMeals) {
  //  console.log("checkForPendingXfers")
  //  if (studentMeals) {
  //    console.log("Student Meals: ", studentMeals)
  //  }

  //}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let element = event.currentTarget as Window;
    this.isMobile = (element.innerWidth < 960) ? true : false;
  }

  ngOnDestroy() {
    this.multiDistrictSvc.multiDistrictRefreshCntr = 0;
    this.studentMealsService.isStudents = false;
    this.studentMealsService.listReady = false;
    this.listReadyCounter = 0;
    this.isStudentsGetting = true;
    this.isStudentsRemote = false;
    this.errorRefreshCnt = 0;
    this.addCartAmountMobileForm.reset();
    this.store.dispatch(new MealStoreActions.ClearMeals());
    // console.log("Destroying Meals: ", this.isStudentsRemote );
  }

}

