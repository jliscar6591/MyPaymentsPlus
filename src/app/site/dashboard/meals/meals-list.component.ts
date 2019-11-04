import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { StudentMeal, CartItem } from '../../model/index';
import { StudentMealsService } from "../../services/student-meals.service";
import { StudentMealsServiceRemote } from "../../services/student-meals.service-remote";
import { MealsComponent } from "./meals.component";
import { SiteHomeComponent } from '../../site-home.component';
import { LoginResponseModel } from '../../../login/model/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { RefreshService } from '../../../shared/services/refresh.service';
import { LoginStoreService } from '../../../shared/services/login-store.service';
import { TransfersService, MultiDistrictService, CartCheckoutItemsService } from '../../services/index';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as MealStoreActions from '../../../shared/store/actions/mealStore.actions';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StudentListService } from '../../../registration/services/index';
import { MealsAddBottomSheetComponent } from './meals-add-bottom-sheet.component';
import { ISubscription } from "rxjs/Subscription";
//import { window } from 'rxjs-compat/operator/window';
//import { setTimeout } from 'timers';


@Component({
  selector: 'meals-list',
  moduleId: module.id,
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals.component.less', '../dashboard-home.component.less']
})

export class MealsListComponent {
  public isSuspendPayment: boolean = false;
  public studentMeals: any;
  public subscription: ISubscription;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public xferSubscription: any;
  public mealStateCounter: number = 0;
  public userContextSubscription: any;
  public userContextCounter: number = 0;
  public testCounter: number = 0;
  public testCounter2: number = 0;
  public latestMealsSun: any;
  public nowMobile: boolean;
  public getMpppInterval: any;
  public isStudentsGetting: boolean;
  public tabIndex = 0;
  public checkoutInterval: any;
  public isMobile: boolean;
  public listInterval: any;
  private xferStatusInterval: any;
  public cartStateItems: CartItem;
  public isXferFeePaid: boolean = false;
  public reply: boolean = false;
  public availStatus: any;
  public statusInterval: any;
  private loginResponse: LoginResponseModel;
  public formInterval: any;
  public canTransfer: boolean = true;
  public isPending: boolean = false;
  public activeStudents: any;

  constructor(
    private siteHomeComponent: SiteHomeComponent,
    public studentMealsService: StudentMealsService,
    public studentRemoteMealsSrvc: StudentMealsServiceRemote,
    public mealsComponent: MealsComponent,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transfersService: TransfersService,
    private refreshService: RefreshService,
    public multiDistrictSrvc: MultiDistrictService,
    private studentListService: StudentListService,
    public loginStoreSrvc: LoginStoreService,
    private _bottomSheet: MatBottomSheet,
    public store: Store<AppState>,
    private state: State<AppState>,
  ) {
    this.mealStore = store.select(state => state.mealStore)
    this.mealsComponent.isStudentsGetting = true;
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
  }


  public cartItemCount: number = 0;



  public async ngOnInit() {

    //console.log("Loading Meals List: ", this.mealsComponent.refreshStudents);
    this.isPending = false;
    await this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
    await this.transfersService.subscribeToGetTransferStatusNew(this.loginResponse);
    this.isMobile = (window.innerWidth < 960) ? true : false;
    //Shows the Getting MPP Balances message while waiting for response from getStudentsRemote
    this.isSuspendPayment = this.studentMealsService.getSuspendPayment();
    this.getMpppInterval = await setInterval(() => {
      if (this.mealsComponent.isStudentsGetting === true) {
        //  console.log("Should show MPP Loading");
        this.pageLoadingService.show("Getting MPP Balances....");
      } else if (this.studentRemoteMealsSrvc.studentMeals) {
        clearInterval(this.getMpppInterval);
        this.pageLoadingService.hide();
        // setTimeout(() => { this.pageLoadingService.hide(); }, 0)
        if (this.studentRemoteMealsSrvc.studentMeals != undefined) {
          // console.log("Does ngONIt have StudentMeals: ", this.studentRemoteMealsSrvc.studentMeals);
          var i;
          for (i = 0; i < this.studentRemoteMealsSrvc.studentMeals.length; i++) {
            this.studentRemoteMealsSrvc.studentMeals[i].showBarcode = false;
            var j;
            for (j = 0; j < this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].length; j++) {
              if (this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].transferPendingAmount > 0 || this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].transferPendingAmount < 0) {
                this.isPending = true;
                break;
              } else {
                this.isPending = false;
              }

            }
          }
          // console.log(this.isPending);
        }
      }
    }, 20);
    this.nowMobile = this.isMobile;
    //if (this.mealsComponent.refreshStudents === false) {
    //  await this.mealsComponent.reBuildForm();
    //}

    //Rebuilds the form if the component tries to load with a blank form

    //console.log(this.nowMobile);
    //if (this.nowMobile) {
    //  if (this.mealsComponent.addCartAmountMobileForm.value === {}) {
    //    // console.log("No FORM vale: ", this.mealsComponent.addCartAmountMobileForm.value);
    //    this.mealsComponent.addCartAmountMobileForm = await this.mealsComponent.formBuilder.group({});
    //     console.log("Do we have the form: ", this.mealsComponent.addCartAmountMobileForm.value);
    //  }
    //} else if (!this.nowMobile) {
    //  if (this.mealsComponent.addCartAmountForm.value === {}) {
    //    //  console.log("No FORM vale: ", this.mealsComponent.addCartAmountForm.value);
    //    this.mealsComponent.addCartAmountForm = await this.mealsComponent.formBuilder.group({});
    //    //console.log("Do we have the form: ", this.mealsComponent.addCartAmountForm.value);
    //  }
    //}


    //console.log("Do we have the form: ", this.mealsComponent.addCartAmountMobileForm.value);

    this.mealStateCounter = 0;
    this.listInterval = setInterval(async () => {
      //console.log(this.studentRemoteMealsSrvc.listReady);
      if (this.studentRemoteMealsSrvc.listReady == true) {
        this.siteHomeComponent.siteMealsRefresh = true;
        if (this.mealsComponent.studentMealsComponent) {
          this.studentMeals = this.mealsComponent.studentMealsComponent;
          // console.log("this.mealsComponent.studentMealsComponent: ", this.studentMeals)
        } else {
          this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
          //  console.log("this.studentMealsService.studentMeals: ", this.studentMeals)
        }
        clearInterval(this.listInterval);
        // this.mealsComponent.refreshStudents = true;
      } else {
        this.studentMeals = await this.formatStudentMeals(this.mealsComponent.studentMealsComponent);
        console.log("this.formatStudentMeals: ", this.studentMeals)
        this.mealsComponent.refreshStudents = true;
        clearInterval(this.listInterval);
      }
    }, 100);

    let tempIntrvl =
      await setInterval(() => {
        if (!this.mealsComponent.addCartAmountForm.controls) {
          this.mealsComponent.isStudentsGetting = true;
        } else {
          this.mealsComponent.isStudentsGetting = false;
          clearInterval(tempIntrvl);
        }

        //(!this.mealsComponent.addCartAmountForm.controls) ? true : false;
        // console.log('.mealsComponent.isStudentsGetting: ', this.mealsComponent.isStudentsGetting)
      }, 100)
    // this.mealsComponent.isStudentsGetting = (!this.mealsComponent.addCartAmountForm.controls) ? true : false; 
    var i;
    for (i = 0; i < this.studentMeals.length; i++) {
      var j;
      for (j = 0; j < this.studentMeals[i].mealAccounts.length; j++) {
        //console.log('transfer amount', this.studentMeals[i].mealAccounts[j].transferPendingAmount)
        if (this.studentMeals[i].mealAccounts[j].transferPendingAmount !== 0) {
          this.canTransfer = false;
          //console.log(this.canTransfer);
        }
      }
    }
  }

  ngDoCheck() {


    // //if (this.studentRemoteMealsSrvc.result === true && this.mealsComponent.refreshStudents === true) {
    // //  //console.log('NGDOCHECK nUMBER 1')
    // //  this.mealStore.subscribe(c => this.mealState = c);
    // //  if (this.mealState) {
    // //    this.studentMealsService.studentMeals = this.mealState.data;
    // //    this.studentMeals = this.studentMealsService.studentMeals;
    // //    this.mealsComponent.refreshStudents = false;
    // //    this.siteHomeComponent.siteMealsRefresh = false;
    // //  }
    // //}
    // this.isStudentsGetting = this.mealsComponent.isStudentsGetting;

    // this.xferSubscription = this.refreshService.xferEvent$.subscribe(() => {
    //   if (this.refreshService.mealRefresh && this.mealStateCounter < 4) {
    //     //console.log('NGDOCHECK nUMBER 2')
    //     this.mealStore.subscribe(c => this.mealState = c);
    //     if (this.mealState) {
    //       this.studentMealsService.studentMeals = this.mealState.data;
    //       this.studentMeals = this.studentMealsService.studentMeals;
    //       this.mealsComponent.refreshStudents = false;
    //       this.refreshService.siteRefreshNow = false;
    //       this.xferSubscription.unsubscribe();
    //       this.mealStateCounter++;
    //     }
    //   }
    // });



    // // setTimeout(() => {
    // //  if (!this.refreshService.haveUserContext || this.siteHomeComponent.siteHomeRefreshCounter < 5) {
    // // console.log('NGDOCHECK nUMBER 3')
    // //if (this.siteHomeComponent.siteMealsRefresh === true) {
    // //  this.refreshService.haveUserContext = true;
    // //  this.siteHomeComponent.siteHomeRefreshCounter = 6;
    // //}
    // this.userContextSubscription = this.siteHomeComponent.userContextRefresh$.subscribe(() => {
    //   this.siteHomeComponent.siteHomeRefreshCounter++;
    //   // console.log('NGDOCHECK nUMBER 3: ', this.siteHomeComponent.siteMealsRefresh)
    //   if (this.siteHomeComponent.siteMealsRefresh === true) {
    //     //this.siteHomeComponent.userContextRefresh$.emit(false);
    //     this.userContextSubscription.unsubscribe();
    //     this.mealsComponent.isStudentsRemote = false;
    //     // console.log("setting isStudentsRemote: ", this.mealsComponent.isStudentsRemote)
    //     // console.log("We saw the Emission: ", this.siteHomeComponent.siteMealsRefresh)
    //     this.mealStore.subscribe(c => this.mealState = c);
    //     if (this.mealState) {
    //       this.studentMealsService.studentMeals = this.mealState.data;
    //       this.studentMeals = [];
    //       this.studentMeals = this.studentMealsService.studentMeals;
    //       this.siteHomeComponent.siteMealsRefresh = false;
    //       this.refreshService.multiDistrictRefresh = true;
    //       this.refreshService.multiDistrictEvent$.emit(this.refreshService.multiDistrictRefresh);
    //       this.pageLoadingService.hide();


    //     }
    //   } else {
    //     if (this.multiDistrictSrvc.newDistrictSelected && this.userContextCounter < 2) {
    //       this.mealsComponent.isStudentsRemote = false;
    //       // console.log("setting isStudentsRemote2: ", this.mealsComponent.isStudentsRemote)
    //       this.mealStore.subscribe(c => this.mealState = c);
    //       if (this.mealState) {
    //         this.studentMealsService.studentMeals = this.mealState.data;
    //         this.studentMeals = [];
    //         this.studentMeals = this.studentMealsService.studentMeals;
    //         this.pageLoadingService.hide();
    //         // setTimeout(() => {
    //         this.siteHomeComponent.siteMealsRefresh = false;
    //         this.refreshService.multiDistrictRefresh = true;
    //         this.refreshService.multiDistrictEvent$.emit(this.refreshService.multiDistrictRefresh);
    //         //  console.log("Unsubcribing userContextSubscription")
    //         this.userContextSubscription.unsubscribe();

    //         //  }, 500)


    //       }
    //       this.userContextCounter++;
    //     }
    //   }

    // })
    // // }



    // //}, 0);

    // if (!this.studentMeals) {
    //   this.latestMealsSun = this.mealsComponent.lateMeals$.subscribe(() => {
    //     //console.log('NGDOCHECK nUMBER 4')
    //     if (this.mealsComponent.refreshStudents === true) {
    //       this.studentMeals = this.mealsComponent.studentMealsComponent;
    //       this.refreshService.refreshMealsList(this.loginStoreSrvc.cookieStateItem);
    //     }
    //   })
    // }

  }

  ngAfterViewInit() {
    // console.log("Calling Meals List ngAfterViewInit: ", this.studentMealsService.studentMeals)
    //console.log("Is the meals LIst Ready: ", this.studentMealsService.listReady)
    //this.cdr.detectChanges();

    this.xferStatusInterval = setInterval(() => {
      //console.log(this.transfersService);
      if (this.transfersService.gotStautsCode) {
        //console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
        this.reply = this.transfersService.result;
        if (this.transfersService.isFeeAdded === false) {
          this.isXferFeePaid = true;
        } else {
          this.isXferFeePaid = false;
        }

        clearInterval(this.xferStatusInterval);
        //console.log('this.reply: ', this.reply)
        //console.log('this.isXferFeePaid: ', this.transfersService.hasPaidTransFee)
      }
    }, 50);
    this.statusInterval = setInterval(() => {
      this.availStatus = this.transfersService.xferLinkStatus;
      clearInterval(this.statusInterval);
    }, 50)

    if (this.mealsComponent.refreshStudents === true && this.siteHomeComponent.siteMealsRefresh === true) {
      this.mealStore.subscribe(c => this.mealState = c);
      if (this.mealState) {
        //console.log("Meals List Meal State: ", this.mealState)
        this.studentRemoteMealsSrvc.studentMeals = this.mealState.data;
        this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
        //console.log("Meals LIst this.studentMeals: ", this.studentMeals)
        this.mealsComponent.refreshStudents = (this.studentMeals.length > 0) ? true : false;
        this.siteHomeComponent.siteMealsRefresh = (this.studentMeals.length < 0) ? true : false;
        this.pageLoadingService.hide();
      }
      this.refreshService.mealRefreshCounter++;
    }


    //setTimeout(() => {
    this.mealStore.subscribe(c => this.mealState = c);
    if (this.mealState) {
      //console.log("Does Meals List see the filtered MealState: ", this.mealState.data)
      if (this.mealState.data.length > 0) {
        this.studentRemoteMealsSrvc.studentMeals = this.mealState.data;
        this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
        //console.log("What is Student Meals: ", this.studentMeals)
        this.mealsComponent.refreshStudents = false;
        this.refreshService.siteRefreshNow = false;
        // this.xferSubscription.unsubscribe();
      } else {
        this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
        if (this.studentMeals) {
          this.store.dispatch(new MealStoreActions.LoadMealsSuccess(this.studentMeals))
          //  console.log("What is studentRemoteMealsSrvc.Student Meals: ", this.studentMeals)
        }
        this.mealsComponent.refreshStudents = true;

      }

      this.mealStateCounter += 1;
    }
    //}, 1000)

    if (this.siteHomeComponent.showDistricts) {
      this.siteHomeComponent.getDistrictcounter = 0;

    }

    if (this.mealsComponent.refreshStudents === true || this.mealsComponent.isStudentsGetting === false) {
      //setTimeout(() => {
      this.mealStore.subscribe(c => this.mealState = c);
      if (this.mealState) {
        this.studentMealsService.studentMeals = this.mealState.data;
        this.studentMeals = this.studentMealsService.studentMeals;
        this.mealsComponent.refreshStudents = false;
        this.refreshService.siteRefreshNow = false;
        // this.xferSubscription.unsubscribe();
        this.mealStateCounter += 1;
      }
      //}, 1000)

    }


    this.pageLoadingService.hide();

  }

  //Converts list to an array 
  private formatStudentMeals(studentMeals): any {
    let studentMealsList = [];
    //let accountBal;
    if (studentMeals) {
      for (var i = 0; i < studentMeals.length; i++) {
        // var testKey = Object.keys(studentMeals[0]);
        var b = Object.keys(studentMeals).map(e => { return { accounts: studentMeals[e] } });
        studentMealsList.push(b[i].accounts);
      }

    }

    return studentMealsList;
  }

  //Updates student meals if the balances are out of date
  public async updateStudentMeals() {
    // alert(this.loginStoreSrvc.devicePlatform);
    this.mealsComponent.errorRefreshCnt++;
    // console.log("MealsComponent.errorRefreshCnt: ", this.mealsComponent.errorRefreshCnt)
    //commenting out for Testing
    // this.mealsComponent.isStudentsRemote = false;
    this.pageLoadingService.show("Retrieving Account Information")
    if (this.studentRemoteMealsSrvc.getMealsErr === true) {
      this.studentRemoteMealsSrvc.getMealsErr = false;
      // console.log("clearing studentMeals error: ", this.studentRemoteMealsSrvc.getMealsErr)
    }
    await this.studentRemoteMealsSrvc.subscribeToGetMeals(this.loginStoreSrvc.cookieStateItem);

    // setTimeout(() => { 
    //this.mealsComponent.getStudentMealsRemoteNew();
    // }, 10)

    // console.log("Do we have a count: ", this.mealsComponent.errorRefreshCnt)
    //This keeps track of the refresh counter and displays a fatal error message if the screen is refreshed more than 3 times.
    if (this.mealsComponent.errorRefreshCnt > 4) {
      //  console.log("this.mealsComponent.isCurrentDate: ", this.mealsComponent.isCurrentDate)
      this.mealsComponent.fatalMealsError = true;
      // console.log(" this.fatalMealsError: ", this.mealsComponent.fatalMealsError)
    }
    // setTimeout(() => { 
    this.pageLoadingService.hide()
    // }, 4000)
  }

  public openAddBottomSheet(outsideIndex: number): void {

    this._bottomSheet.open(MealsAddBottomSheetComponent, {
      data: {
        index: outsideIndex,
        model: this.studentRemoteMealsSrvc.studentMeals[outsideIndex]
      }
    });
  }

  public openTransferBottomSheet(outsideIndex: number): void {
    this._bottomSheet.open(MealsAddBottomSheetComponent, {
      data: { index: outsideIndex }
    });
  }

  public openFee(outsideIndex) {
    //console.log(outsideIndex);
    //console.log(this.studentRemoteMealsSrvc.studentMeals[outsideIndex])
    let model = this.studentRemoteMealsSrvc.studentMeals[outsideIndex].mealAccounts;
    let index = outsideIndex;
    let account = {
      firstName: this.studentRemoteMealsSrvc.studentMeals[outsideIndex].firstName,
      lastname: this.studentRemoteMealsSrvc.studentMeals[outsideIndex].lastName
    }
    this.transfersService.openFee(model, index, account, this.loginStoreSrvc.cookieStateItem);
  }

  public openBarcode(outsideIndex) {
    console.log(outsideIndex);
    var i;
    console.log(this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode);
    console.log(this.studentListService.students[outsideIndex].studentId);
    if (this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode) {
      this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode = false;
      
    } else {
      this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode = true;
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

  }

  ngOnDestroy() {
    this.siteHomeComponent.cartStoreCounter = 0;
    this.siteHomeComponent.getCartItemcounter = 0;
    this.siteHomeComponent.updateCartCounter = 0;
    this.refreshService.stopRefreshMeals();
    this.mealStateCounter = 0;
    this.refreshService.haveUserContext = false;
    this.testCounter = 0;
    this.testCounter2 = 0;
    this.refreshService.mealRefreshCounter = 0;
    this.mealsComponent.isStudentsRemote = false;
    this.mealsComponent.isStudentsGetting = false;
    if (this.getMpppInterval) { clearInterval(this.getMpppInterval); }
  }
}
