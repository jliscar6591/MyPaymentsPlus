import { Component, HostListener, ViewChild, ChangeDetectorRef, ViewEncapsulation, OnDestroy, EventEmitter, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { LoginModel, LoginResponseModel } from '../login/model/index';
import { StudentMeal, MealAccount, CartResponse, CartItem } from '../../app/site/model/index';
import { Constants } from '../app.settings';
import { UserContextService } from '../site/account/services/index';
import { StudentMealsService } from '../site/services/student-meals.service';
import { StudentMealsServiceRemote } from '../site/services/student-meals.service-remote';
import { StudentListService, DistrictContentService } from '../registration/services/index';
import { ValidCartCountService, TransfersService, CartCheckoutService, MultiDistrictService, FeesService, AddCartItemService, CartCheckoutItemsService } from '../site/services/index';
import { AuthenticationService, LoginStoreService, UtilityService } from '../shared/services/index';
import { RefreshService } from '../shared/services/refresh.service';
import { PageLoadingService } from '../shared/components/page-loading/page-loading.service';
import { ReceiptService } from '../shared/components/receipt/receipt.service';
import { FormGroup, FormControl, } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap, first } from 'rxjs/operators';
import { Store, State } from '@ngrx/store';
import { AppState } from '../app.state';
import * as CartStoreActions from '../shared/store/actions/cartStore.actions';
import * as MealStoreActions from '../shared/store/actions/mealStore.actions';
import * as DistrictMealStoreActions from '../shared/store/actions/districtMealStore.actions';
export let browserRefresh = false;
import { ActivitiesService } from './services/activities.service';
import { Plugins } from '@capacitor/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, throwToolbarMixedModesError } from '@angular/material';
import { AutoEnrollDialogComponent } from './dashboard/auto-enroll-dialog/auto-enroll-dialog.component';
import { OrientationDialogComponent } from './dashboard/orientation-dialog/orientation-dialog.component';
import { OrientationService } from './services/orientation.service';


@Component({
  moduleId: module.id,
  templateUrl: 'site-home.component.html',
  styleUrls: ['./site-home.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SiteHomeComponent {
  public sidenavLayout: boolean = false;
  public tabIndex = 0;
  public loginResponse: LoginResponseModel;
  public mobile: boolean = false;
  private title: string = '';
  private userOptions: number = null;
  private isTranslateOption: boolean = true;
  public cartItemCount: number = 0;
  public cleanOutCart: boolean = false;
  public cartProcessedFlag: any = this.transferService.cartProcessedEvt;
  public feeAddedFlag: any = this.transferService.feeAddedToCart;
  public navSeleceted: boolean = false;
  public cartItem: any;
  public subscription: any;
  public districtList: any = [];
  public defaultDistrict: any;
  public selectedDistrict: any;
  public userData: any = [];
  public isDestroyed: boolean = false;
  public studentMealsList: any;
  public studentFeesList: any;
  public fixCartFlag: boolean;
  public showDistricts: boolean = false;
  public paymntProcessedCounter: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: any;
  public cartStateItems: CartItem;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public districtMealStore: Observable<StudentMeal>;
  public districtMealState: any;
  public districtMealStateMeal: StudentMeal;
  public siteMealsRefresh: boolean = false;
  public updateCartCounter: number = 0;
  public siteMealsCounter: number = 0;
  public getCartCounter: number = 0;
  public checkMealsCounter: number = 0;
  public cartStoreCounter: number = 0;
  public getCartItemcounter: number = 0;
  private cartRefreshCounter: number = 0;
  public checkoutInterval: any;
  public getDefaultDatacounter: number = 0;
  private getDefaultDataInterval: any;
  public feeStore: any;
  public getDistrictsSub: any;
  public getDistrictcounter: number = 0;
  public haveCartCount: boolean = false;
  public currentDistrictList: any = [];
  public userContextRefresh$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public refreshUserContext: boolean = false;
  public isContextRefreshing: boolean = false;
  public multiDistrictRecheckCntr: number = 0;
  public selectedLoginResponse: LoginResponseModel;
  public siteHomeRefreshCounter: number = 0;
  public updateCartSubScription$: any;
  public userRefreshedCounter: number = 0;
  public newDistrictCartCounter: number = 0;
  public feesList: any;
  public browserRefreshSub$: any;
  public isMultiDistrict: boolean;
  public autoEnrollCounter: number = 0;
  public deviceInfo: any;
  public web: boolean;
  public userContextDefault: any;
  public showFees: boolean = false;
  public showActivities: boolean = false;
  public districtHasFees: boolean;
  public districtHasActivities: boolean;
  public autoEnrollActivitiesCounter: number = 0;
  public activitiesList: any;
  public autoCartList: any;
  public autoCartListReady: boolean;
  public autoFeesList: any;
  public autoFeesListReady: boolean;
  private studentMealsInterval: any;
  public feeState: any;
  public showReceipt: boolean;
  public userContextIntrvl: any;
  public autoEnrollInterval: any;
  district = new FormGroup({
    defaultDistrict: new FormControl()
  });

  welcome = new FormGroup({
    userOptions: new FormControl()
  })
  public orientationDialogInterval: any;
  public unsignedDocumentCount: number = 0;
  public districtHasExams: boolean;
  public districtHasOrientations: boolean;
  public showOrientations: boolean = false;
  public showExams: boolean = false;
  public suggestedActivitiesList: any = [];


  @ViewChild('userOptionsDropdown') options;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private userContextService: UserContextService,
    private studentMealsService: StudentMealsService,
    private studentMealsRemoteService: StudentMealsServiceRemote,
    public studentListService: StudentListService,
    private validCartCountService: ValidCartCountService,
    private transferService: TransfersService,
    private cdr: ChangeDetectorRef,
    private receiptService: ReceiptService,
    private multiDistrictSrvc: MultiDistrictService,
    private feesService: FeesService,
    private addCartItemService: AddCartItemService,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    private store: Store<AppState>,
    private state: State<AppState>,
    private cartCheckoutSrvc: CartCheckoutItemsService,
    private refreshService: RefreshService,
    public dialog: MatDialog,
    private pageLoadingService: PageLoadingService,
    private loginStoreSvc: LoginStoreService,
    private activitiesService: ActivitiesService,
    private utilityService: UtilityService,
    public orientationService: OrientationService

  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.defaultDistrict = this.loginResponse.districtName;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setTitle();
        //need a better way to do this - to know that the outer layout needs to account for a sidenav is there is one
        this.sidenavLayout = (this.router.url.indexOf('/account') >= 0) ? true : false;
      }
    });

    this.cartStore = store.select(state => state.cartStore)
    this.mealStore = store.select(state => state.mealStore)
    this.feeStore = store.select(state => state.feeStore);
    this.districtMealStore = store.select(state => state.districtMealStore)
  }

  ngDoCheck() {
    if (this.addCartItemService.cartResponse) {
      if (this.addCartItemService.cartResponse.itemCount !== undefined) {
        this.cartItemCount = this.addCartItemService.cartResponse.itemCount;
        //console.log(this.cartItemCount);
      }
    } else if (this.cartCheckoutItemsService.cartItem && this.addCartItemService.cartResponse) {
      this.cartItemCount = this.cartCheckoutItemsService.cartItem.itemCount;
      //console.log(this.cartItemCount);
    }

    if (this.addCartItemService.cartResponse && this.addCartItemService.deleteResult) {
      window.setTimeout(() => {
        //console.log('cartState', this.cartState);
        //console.log("Calling getCartCount DoCheck")
        this.getCartCount();
        //console.log(this.cartItemCount);
        this.addCartItemService.deleteResult = false;
      }, 1000);

    }

    if (this.userContextDefault.districtHasOrientations) {
      if (this.orientationService.orientationAutoEnrollList && this.userContextDefault.districtHasOrientations) {
        if (this.orientationService.orientationAutoEnrollList.length === 0) {
          this.unsignedDocumentCount = 0;
        } else {
          this.unsignedDocumentCount = this.orientationService.currentDocumentCount;
        }
      }
    }


    // if (this.refreshService.cartRefresh) {
    //   let temptState: any;
    //   this.cartStore.subscribe(c => this.cartState = c);
    //   if (this.cartState) {
    //     temptState = this.cartState.data;
    //     // console.log("getCartCount - cartRefresh: ", this.refreshService.cartRefresh)
    //     window.setTimeout(() => { this.getCartCount(); }, 1000);
    //     window.setTimeout(() => { this.refreshService.stopCartRefresh(); }, 0)
    //     //console.log('this.cartitemCount', this.cartItemCount);
    //     // this.getCartCount();
    //     // this.refreshService.stopCartRefresh();
    //     this.cartRefreshCounter++;
    //     if (this.cartRefreshCounter > 4) {
    //       this.refreshService.cartRefresh = false;
    //     }

    //   }
    // }


    // this.getCartItemcounter++;
    // //console.log("this.getCartItemcounter = ", this.getCartItemcounter)
    // if (this.getCartItemcounter == 5 && this.cartCheckoutItemsService.cartItem) {
    //   window.setTimeout(() => {
    //     // console.log("Did we get a Lite Cart: ", this.cartCheckoutItemsService.cartItem)
    //     if (this.cartCheckoutItemsService.cartItem) {
    //       this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
    //       this.cartItemCount = this.countStore();
    //       if (this.cartItemCount > 0) {
    //         this.haveCartCount = true;
    //       }
    //     }

    //   }, 1000);
    // }





    if (this.paymntProcessedCounter < 1) {
      this.getDistrictcounter = 0;
      // console.log("Calling RefeshMeals: ", this.paymntProcessedCounter)
      this.receiptService.processedPayment.subscribe(
        data => (this.refeshMeals(data)),
        this.showReceipt = true
      );
      this.paymntProcessedCounter++;

    }

    // if (this.userContextService.defaultData && this.getDistrictcounter < 1) {
    //   this.userData = this.userContextService.defaultData;
    //   //console.log("We got userData: ", this.userData);
    //   this.loginStoreSvc.fixLoginResponse(this.userData);
    //   this.getUserDistricts(this.userData);

    //   this.userContextService.result = false;
    //   //  console.log("Should be clearing Interval")
    //   if (this.userData.availableDistricts.length > 1) {
    //     if (!this.studentListService.result) {
    //       //  console.log("subscribeToGetStudentsNew fromSite")
    //       this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
    //     }
    //     this.showDistricts = (this.userData.availableDistricts.length > 0) ? true : false;
    //   }


    //   this.getDistrictcounter++;
    // } else {
    //   if (!this.userContextService.defaultData && this.getDefaultDatacounter < 1) {
    //     this.getDefaultDatacounter++;
    //   }
    // }

    // if (!this.showDistricts && this.multiDistrictRecheckCntr < 3) {
    //   let districtList = this.getUserDistricts(this.userData);
    //   this.multiDistrictRecheckCntr++;
    // }

    // this.multiDistrictSrvc.didSwitchDistrict.subscribe(() => {
    //   if (this.multiDistrictSrvc.newDistrictSelected === true && this.newDistrictCartCounter < 1) {
    //     this.newDistrictCartCount();
    //     this.newDistrictCartCounter++;
    //   }
    // });

    if (this.mobile && this.router.url == '/terms' || this.router.url == '/privacy-policy' || this.router.url == '/about' || this.router.url == '/support' || this.router.url == '/welcome') {
      document.getElementById('app-toolbar').style.backgroundColor = 'white';
    }
    //} else if (this.mobile && this.router.url !== '/terms' || this.router.url !== '/privacy-policy' || this.router.url !== '/about' || this.router.url !== '/support' || this.router.url !== '/welcome' && this.mobile) {
    //  document.getElementById('app-toolbar').style.backgroundColor = 'rgb(56,131,208)';
    //}

    //if (this.router.url == '/checkout') {
    //  var i;
    //  for (i = 0; i < this.cartCheckoutSrvc.cartItem.items.length; i++) {
    //    if (this.cartCheckoutSrvc.cartItem.items[i].isAutoEnrolled && this.cartCheckoutSrvc.cartItem.items[i].activityFormId && this.cartCheckoutSrvc.cartItem.items[i].formResponse.length === 0) {
    //      console.log('hey this is where ill show the forms you didnt fill out');
    //    }
    //  }
    //}
    //console.log('this.cartitemCount', this.cartItemCount);
  }

  async ngOnInit() {
    //console.log("Calling site Home")
    if (this.router.url == '/dashboard') {
      this.mobile = (window.innerWidth < 800) ? true : false;
      this.userContextDefault = this.userContextService.defaultData;
      await this.feesService.subscribeToGetFees(this.loginResponse);
      await this.activitiesService.subscribeToGetActivities(this.loginResponse);
      await this.activitiesService.subscribeToGetSuggestedActivities(this.loginResponse);
      //Calling CafeteriaAccounts to fill MealStore with values to be used if
      //no response from CafeteriaAccountRemote
      if (this.studentMealsService.result === false && this.siteMealsCounter < 1) {
        // console.log("Calling getMeals from site studentMealsService.result: ", this.loginResponse)
        // this.studentMealsService.subscribeToGetMeals(this.loginResponse);

        // console.log("B4 getStudentMealsNew: ", this.loginResponse)
        this.subscription = this.studentMealsService.getStudentMealsNew(this.loginResponse)
          .subscribe(
            data => {
              this.studentMealsService.studentMeals = data;
              this.studentMealsService.result = true;
            },
            error => {
              // console.log("Error: No Meals: ", this.studentMealsService.studentMeals);
              this.studentMealsService.result = false;
            }
            ,
            () => {
              // console.log("The result: ", this.result)
              if (this.studentMealsService.result == false) {
                this.studentMealsService.isStudentsGetting = false;
                this.studentMealsService.getStudentErr = true;
                this.studentMealsService.getStudentErrMsg = this.loginResponse.message;
              } else {
                this.studentMealsService.weGotStudents.emit(true);
                this.studentMealsService.needGetStudents.emit(true);
                this.studentMealsService.studentMeals = this.studentMealsService.formatStudentMeals(this.studentMealsService.studentMeals);
                this.studentMealsService.listReady = true;
                this.studentMealsService.isStudents = this.studentMealsService.studentMeals.length > 0;
                //  console.log("Creating a cookie: ", this.loginResponse)
                this.loginStoreSvc.loadLogin(this.loginResponse);


                let tempMeals: any = this.studentMealsService.studentMeals;
                // console.log("Student Meals Refreshing Store: ", tempMeals)
                this.store.dispatch(new MealStoreActions.ClearMeals());
                this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals))
              }
            }
          );
        //  return this.studentMealsService.studentMeals;


        /*WE will write the data returned from CafeteriaAccounts to the store once received
         * This value will be displayed if a response from CafeteriaAccountRemote is not
         * received in a timely fashion, after approximately 10 seconds
         */
        this.getDefaultDataInterval = setInterval(() => {
          this.studentMealsList = this.studentMealsService.studentMeals;
          // console.log("did site Get Student Meals: ", this.studentMealsList)
          if (this.studentMealsList) {
            // console.log("We should write to the store real quick: ", this.studentMealsList)
            clearInterval(this.getDefaultDataInterval)
            this.store.dispatch(new MealStoreActions.LoadMealsSuccess(this.studentMealsList))
          }
        }, 500)

        this.siteMealsCounter++;
      } else {
        if (this.siteMealsCounter < 5) {
          this.siteMealsCounter++;
        }

      }




      await this.transferService.subscribeToGetTransferFeeStatusNew(this.loginResponse);
      //  console.log('I am dashboard GetRemote')
      //this.studentMealsRemoteService.subscribeToGetMeals(this.loginStoreSvc.cookieStateItem);

      // console.log("What is the getMeals loginResponseObj: ", this.loginResponse)
      this.studentMealsRemoteService.studentMealsSub$ =
        this.studentMealsRemoteService.getRemoteStudentMeals(this.loginResponse)
          .subscribe(
            data => {
              //  console.log("Returned Data: ", data)
              this.studentMealsRemoteService.studentMeals = data;
              this.studentMealsRemoteService.result = true;
            },
            error => {
              // console.log("Error: No Meals: ", this.studentMealsRemoteService.studentMeals);
              this.studentMealsRemoteService.result = false;
            }
            ,
            () => {
              if (this.utilityService.posCommError) {
                //  console.log("We got a commError: ", this.loginResponse)
                this.studentMealsRemoteService.getMealsErr = this.utilityService.posCommError;
                // console.log("What is getMealsErr: ", this.studentMealsRemoteService.getMealsErr)
              }
              //console.log("Did we get Meals: ", this.studentMeals);
              if (this.studentMealsRemoteService.result == false) {
                this.studentMealsRemoteService.isStudentsRemoteGetting = false;
              } else {

                this.studentMealsRemoteService.weGotStudents.emit(true);
                //  console.log("WeGotStudents: ", this.studentMeals);
                this.studentMealsRemoteService.isStudentsRemoteGetting = this.studentMealsRemoteService.studentMeals.length > 0;
                this.loginStoreSvc.loadLogin(this.loginResponse)
                let tempMeals: any = this.studentMealsRemoteService.studentMeals;
                // console.log("What is tempMeals: ", tempMeals)
                this.store.dispatch(new MealStoreActions.ClearMeals());
                this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));

                // console.log("Calling this.formCompleted ")
                this.studentMealsRemoteService.formCompleted = new Observable(observer => {
                  observer.next(true);
                  observer.complete();
                });
                this.studentMealsRemoteService.formCompleted.pipe(
                  first(data => data = true)
                );


              }




              this.studentMealsRemoteService.studentMealsSub$.unsubscribe();
            }
          );

    }
    this.feeStore.subscribe(c => this.feeState = c);
    this.autoEnrollActivitiesCounter = 0;
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
    console.log('user context', this.userContextDefault);
    //checks to see if district has orientations and sets local variable

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
      if (this.userContextDefault.districtHasOrientations) {
        this.districtHasOrientations = true;
        this.showOrientations = true;
        //checks to see if district has exams and sets local variable
      }
      if (this.userContextDefault.districtHasExams) {
        this.districtHasExams = true;
        this.showExams = true;
      }
    
      console.log('service default data', this.userContextService.defaultData);
      if (this.userContextService.defaultData.isMobileMealsOnly === true) {
        this.showFees = false;
        this.showActivities = false;
        this.showOrientations = false;
        this.showExams = false;
      } else {
        this.showFees = true;
        this.showActivities = true;
        this.showOrientations = true;
        this.showExams = true;

      }
    }

    if (this.userContextService.defaultData.districtHasOrientations) {
      await this.orientationService.subscribeToGetOrientationAutoEnroll(this.loginResponse);
    }

      this.orientationDialogInterval = await setInterval(() => {
        if (this.userContextDefault.districtHasOrientations && this.orientationService.orientationAutoEnrollList !== undefined) {
          console.log('ORIENTATION AUTO ENROLL', this.orientationService.orientationAutoEnrollList);
          var i;
          for (i = 0; i < this.orientationService.orientationAutoEnrollList.length; i++) {
            this.unsignedDocumentCount = this.unsignedDocumentCount + this.orientationService.orientationAutoEnrollList[i].orientation.unsignedDocuments.length;
          }
          console.log('doc count', this.unsignedDocumentCount);
          console.log(this.districtHasOrientations);
          if (this.unsignedDocumentCount > 0 && this.userContextDefault.districtHasOrientations) {
            console.log(this.orientationService.orientationAutoEnrollList);
            console.log('doc count', this.unsignedDocumentCount);
            console.log('DOES IT GET TO THIS POINT TO OPEN THE ORIENTATION DIALOG?');
            this.openOrientationDialog();
            clearInterval(this.orientationDialogInterval);
          } else if (this.userContextDefault.districtHasOrientations || !this.userContextDefault.districtHasOrientations && this.orientationService.orientationAutoEnrollList.length === 0) {
            clearInterval(this.orientationDialogInterval);
            //Opens Auto Enroll dialog for fees/Activities
            this.autoEnrollInterval = setInterval(() => {
              if (this.activitiesService.suggestedActivitiesList && this.feesService.feesList && this.autoEnrollActivitiesCounter === 0) {
                if (this.districtHasFees || this.districtHasActivities) {
                  console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
                  this.openAutoEnrollDialog();
                  this.autoEnrollActivitiesCounter++;
                  clearInterval(this.orientationDialogInterval);
                  clearInterval(this.autoEnrollInterval);
                }
              }
            }, 500);
          }
        } else {
          this.autoEnrollInterval = setInterval(() => {
            if (this.activitiesService.suggestedActivitiesList && this.feesService.feesList && this.autoEnrollActivitiesCounter === 0) {
              if (this.districtHasFees || this.districtHasActivities) {
                console.log('OR DOES IT SKIP STRAIGHT TO HERE TO THE 2nD PART?');
                this.openAutoEnrollDialog();
                this.autoEnrollActivitiesCounter++;
                clearInterval(this.orientationDialogInterval);
                clearInterval(this.autoEnrollInterval);
              } else{
                clearInterval(this.orientationDialogInterval);
                clearInterval(this.autoEnrollInterval);
              }
            }
          }, 500);
        } 
      }, 500);
      if(!this.userContextDefault.districtHasActivities && !this.userContextDefault.districtHasFees && !this.districtHasOrientations){
        clearInterval(this.orientationDialogInterval);
        clearInterval(this.autoEnrollInterval);
      }

    // console.log("Calling Site Component : ", this.loginStoreSvc.didBrowserRefresh)
    //need something a bit more robust to select which state to go to based on route 
    this.tabIndex = (this.router.url.indexOf('dashboard') >= 0) ? 0 : 1;
    this.setTitle();

    this.studentMealsList = this.studentMealsService.studentMeals;
    if (this.studentMealsList || this.studentFeesList) {
      if (this.transferService.feeCartCount == 0 && this.cartStoreCounter < 2) {
        //console.log("Calling Get Cart Count from ngOnIt")
        this.getCartCount();
        // console.log(this.cartItemCount);
      } else if (this.receiptService.clearCart == true) {
        this.cartItemCount = this.cartItemCount;
      }
    }

    this.findDistricts(this.loginResponse);

    if (this.loginStoreSvc.didBrowserRefresh === true) {
      this.multiDistrictCheck();
    }



  }

  ngAfterViewInit() {
    // console.log('feestate', this.feeState)

    this.cdr.detectChanges();
    window.setTimeout(() => {
      // console.log("calling getCartCount - detectChanges")
      this.getCartCount();

    }, 1000)

    this.userContextService.gotNewUserContext$.subscribe(() => {

      if (this.userContextService.newTokenResults === true && this.userRefreshedCounter < 1) {
        this.userRefreshedCounter++;
        this.siteMealsRefresh = (this.studentMealsService.studentMeals.length > 0) ? true : false;
        // console.log("siteMealRefresh? ", this.siteMealsRefresh)
        this.showDistricts = (this.userData.availableDistricts.length > 0) ? true : false;
        //console.log("Show Districts? ", this.showDistricts);
      }
    });

    this.browserRefreshSub$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !this.router.navigated;
        //console.log("What is browserRefresh: ", browserRefresh);
        //console.log("Do we have a Refresh LoginResponse: ", this.loginStoreSvc.cookieStateItem)
      }
    });
  }

  //Opens orientation dialog
  public openOrientationDialog() {
    if (this.orientationService.orientationAutoEnrollList.length > 0) {
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
      config.maxHeight = '625px';
      config.width = '650px';
      config.data = {
        orientationList: this.orientationService.orientationAutoEnrollList
      };
      config.disableClose = true;
      console.log(config.data);
      const dialogRef = this.dialog.open(OrientationDialogComponent, config)

      dialogRef.afterClosed().subscribe(result => {
        this.orientationService.subscribeToGetOrientation(this.loginResponse);
      });
    }
  }

  //Opens autoEnroll dialog
  public openAutoEnrollDialog() {
    if (this.activitiesService.suggestedActivitiesList) {
      this.autoCartList = [];
      this.suggestedActivitiesList = this.activitiesService.suggestedActivitiesList;
      var i;
      for (i = 0; i < this.suggestedActivitiesList.length; i++) {
        var j;
        for (j = 0; j < this.suggestedActivitiesList[i].accounts.length; j++) {
          var k;
          for (k = 0; k < this.suggestedActivitiesList[i].accounts[j].activities.length; k++) {
            if (this.suggestedActivitiesList[i].accounts[j].activities[k].isSuggested && !this.suggestedActivitiesList[i].accounts[j].activities[k].isInCart) {
              this.autoCartList.push(this.suggestedActivitiesList[i].accounts[j].activities[k]);
            }
          }
        }
        var l;
        for (l = 0; l < this.suggestedActivitiesList[i].subCategory.length; l++) {
          var m;
          for (m = 0; m < this.suggestedActivitiesList[i].subCategory[l].accounts.length; m++) {
            var n;
            for (n = 0; n < this.suggestedActivitiesList[i].subCategory[l].accounts[m].activities.length; n++) {
              if (this.suggestedActivitiesList[i].subCategory[l].accounts[m].activities[n].isSuggested && !this.suggestedActivitiesList[i].subCategory[l].accounts[m].activities[n].isInCart) {
                this.autoCartList.push(this.suggestedActivitiesList[i].subCategory[l].accounts[m].activities[n]);
              }
            }
          }
        }
        if (i + 1 == this.suggestedActivitiesList.length) {
          this.autoCartListReady = true;
        }
      }
    }
    if (this.feesService.feesList) {
      this.autoFeesList = [];
      this.feesList = this.feesService.feesList;
      console.log('feeslist', this.feesList);
      var o;
      for (o = 0; o < this.feesList.length; o++) {
        var p;
        for (p = 0; p < this.feesList[o].fees.length; p++) {
          if (this.feesList[o].fees[p].isSuggested && !this.feesList[o].fees[p].isInCart) {
            this.feesList[o].fees[p].name = this.feesList[o].name;
            this.feesList[o].fees[p].studentKey = this.feesList[o].studentKey;
            this.feesList[o].fees[p].insideIndex = p;
            this.feesList[o].fees[p].outsideIndex = o;
            this.autoFeesList.push(this.feesList[o].fees[p]);
          }
        }
        if (o + 1 == this.feesList.length) {
          this.autoFeesListReady = true;
          console.log('auto fees list', this.autoFeesList);
        }
      }
    }
    if (this.autoCartListReady && this.autoFeesListReady && this.autoFeesList.length > 0 || this.autoCartList.length > 0) {
      console.log('autoCartList', this.autoCartList);
      console.log('autoFeesList', this.autoFeesList);
      let config = new MatDialogConfig();
      config.panelClass = 'my-class';
      config.maxHeight = '625px';
      config.width = '650px';
      config.data = {
        feesList: this.autoFeesList,
        cart: this.autoCartList
      };
      config.disableClose = true;
      //console.log(config.data);
      const dialogRef = this.dialog.open(AutoEnrollDialogComponent, config)

      dialogRef.afterClosed().subscribe(result => {
        this.feesService.subscribeToGetFees(this.loginResponse);
      });
      this.autoEnrollActivitiesCounter = 1;
    } else {
      this.autoEnrollActivitiesCounter = 1;
    }

  }

  private multiDistrictCheck() {
    //  console.log("Do we have a Refresh LoginResponse: ", this.loginStoreSvc.cookieStateItem)
    let selectedDistrict = this.loginStoreSvc.cookieStateItem.districtName;
    this.userContextService.subscribeToGetDeriveDefaultsNew(this.loginStoreSvc.cookieStateItem);
    window.setTimeout(() => {
      //  console.log("Do we have defaultData: ", this.userContextService.defaultData)
      if (this.userContextService.defaultData) {
        this.showDistricts = (this.userContextService.defaultData.availableDistricts.length > 0) ? true : false;
        this.loginStoreSvc.didBrowserRefresh = false;
      }
    }, 0)
  }

  public getCartCount() {
    this.getCartCounter++;
    this.cartStoreCounter++;
    this.updateCartCounter++;
    let storeCount: number;
    if (this.loginStoreSvc.cookieStateItem) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
    } else {
      this.loginResponse = this.loginStoreSvc.fixLoginResponse(this.loginStoreSvc.storeLoginResponse);
    }
    // this needs to come out once we're doing more than meal payments: this.loginResponse.mealPaymentsSuspended
    // They could have something in the cart besides meals.
    if (this.loginResponse.isBlockPayments || this.loginResponse.allPaymentsSuspended || this.loginResponse.mealPaymentsSuspended) {
      this.cartItemCount = 0;
    } else {
      //Validates the Cart Amount before returning it
      if (this.feeAddedFlag == true) {
        this.cartItemCount = this.loginResponse.cartItemCount;
      } else {
        if (this.studentMealsService.studentMeals || this.feesService.feesList && this.multiDistrictSrvc.newDistrictSelected === false) {
          this.cartStore.subscribe(c => this.cartState = c);
          if (this.cartState) {
            this.cartItemCount = this.countStore();
            this.refreshService.stopCartRefresh();
          }
          if (this.studentMealsService.studentMeals || this.feesService.feesList) {
            if (this.cartState) {
              this.cartItemCount = this.countStore();
              this.loginResponse.cartItemCount = this.cartItemCount;
            }
            if (this.cartCheckoutItemsService.cartItem && !this.cartState) {
              if (this.cartCheckoutItemsService.cartItem.itemCount) {
                this.cartItemCount = this.cartCheckoutItemsService.cartItem.itemCount;

              } else {
                this.cartItemCount = this.loginResponse.cartItemCount;

              }
            }
          } else {
            this.cartItemCount = this.loginResponse.cartItemCount;
          }
        } else {
          //Just in case studentMeals has been set to false before we got a cartState
          this.cartStore.subscribe(c => this.cartState = c);
          if (this.cartState) {
            this.cartItemCount = this.countStore();
            this.cartItemCount = this.cartState.data.itemCount;
            this.loginResponse.cartItemCount = this.cartItemCount;
            //console.log("Did we get a cart count from the CartStore: ", this.loginResponse.cartItemCount)
          }
        }

        this.updateCartCounter++;
        this.addCartItemService.addedToCart = false;
      }

      if (this.multiDistrictSrvc.newDistrictSelected === true) {

        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
        window.setTimeout(() => {

          if (this.cartCheckoutItemsService.cartItem) {
            this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
            this.cartItemCount = this.countStore();
            if (this.cartItemCount > 0) {
              this.haveCartCount = true;
            }
          }

        }, 1000);

        this.addCartItemService.addedToCart = false;

      }


      //This checks to see if a fee has been added to the cart if not the cart amount should be the loginresponse.cartItemAmount
      if (this.transferService.feeCartCount == 0 || this.transferService.feeCartCount == undefined) {
        if (this.cartCheckoutItemsService.cartItem && !this.cartState && storeCount) {
          this.cartItemCount = storeCount;
          this.refreshService.stopCartRefresh();
        }
      } else if (this.receiptService.clearCart == false || this.receiptService.clearCart == undefined) {
        //If a transfer fee is accepted the cart count is set to 1
        this.cartItemCount = this.transferService.feeCartCount;
      } else if (this.cartProcessedFlag == true) {
        this.cartItemCount = 0;
      } else {
        this.cartItemCount = this.cartItemCount;
      }
      this.receiptService.clearCart == false;
    }
    //this.validCartCountService.fixCartNow = false;
    if (this.cartItemCount > 0) {
      // console.log("What is the final cartCount: ", this.cartItemCount)
      this.haveCartCount = true;
      return this.haveCartCount;
    } else {
      //  console.log("What is the final cartCount- False: ", this.cartItemCount)
      this.haveCartCount = false;
      return this.haveCartCount;
    }
  }

  public countStore() {
    //  console.log("Calling countStore")
    let temptState;
    let storeTempItem;
    let storeCount;
    this.receiptService.clearCart = false;
    this.cartStore.subscribe(c => this.cartState = c);
    temptState = this.cartState;
    if (temptState) {
      storeTempItem = temptState.data;
      storeCount = storeTempItem.itemCount;
      // console.log(storeCount)
      this.haveCartCount = (storeCount > 0) ? true : false;
      // console.log("Should we Show Cart: ", this.haveCartCount)
      return storeCount;
    } else {
      this.haveCartCount = (this.cartItemCount > 0) ? true : false;
      //  console.log("Should we Show Cart: ", this.haveCartCount)
      return this.cartItemCount;
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


  public newDistrictCartCount() {
    console.log("Calling newDistrictCartCount ")
    let testObj = this.loginStoreSvc.getLoginObj();
    window.setTimeout(() => {
      // console.log("do we have a testObj: ", testObj)
      if (testObj) {
        //  console.log("We had a testObj: ", testObj)
        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(testObj);
      } else {
        let testStieCookie = this.loginStoreSvc.cookieStateItem;
        // console.log("Do we have the correct loginResponse: ", testStieCookie)
        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(testStieCookie);
      }


    }, 1000)

    setTimeout(() => {
      // console.log("Do we have the correct CartItems: ", this.cartCheckoutItemsService.cartItem)
      this.store.dispatch(new CartStoreActions.ClearCart());
      if (this.cartCheckoutItemsService.cartItem) {
        this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
        this.cartItemCount = this.countStore();
        if (this.cartItemCount > 0) {
          this.haveCartCount = true;
        }
      }

    }, 1000)

  }

  reroute(index) {
    this.tabIndex = index;
  }

  switchUserOptions() {
    if (this.userOptions == 1 && (this.router.url.indexOf('/account') < 0)) {
      this.userOptions = null;
      this.tabIndex = 1;
      this.router.navigate(['/account']);

    }
    else if (this.userOptions == 2) {

      //do a sign out
      this.logOut();
    }
    this.userOptions = null;
  }

  logOut() {
    this.loginStoreSvc.clearSessionStorage();
    this.router.navigate(['/welcome']);

  }

  userOptionsAccount() {
    return (this.router.url.indexOf('/account') >= 0) ? true : false;
  }

  //Checks on whether or not to show the sign in card in-line
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobile = (window.innerWidth < 800) ? true : false;
  }

  setTitle() {
    this.title = this.route.snapshot.firstChild.data['title'];
  }

  getUserDistricts(userData) {
    //console.log("Calling getUserDistricts", userData.availableDistricts);
    this.districtList = userData.availableDistricts;
  }


  setDistrict(userOptions) {
    // console.log("Calling setDistrict")
    if (this.loginResponse.districtName == userOptions) {
      this.loginStoreSvc.loadLogin(this.loginResponse);
    }
    this.pageLoadingService.show("Retrieving Account Data");
    this.getDistrictcounter = 0;
    this.userRefreshedCounter = 0;
    this.multiDistrictSrvc.multiDistrictRefreshCntr = 0;
    if (this.refreshService.haveUserContext === true) {
      this.refreshService.haveUserContext = false;
      //  console.log("WE set haveUserContext")
      this.siteHomeRefreshCounter = 0;
      this.refreshService.mealRefreshCounter = 0;
      this.refreshService.mealRefresh = false;
    }
    let dList = this.districtList;
    if (this.multiDistrictSrvc.processedDistrict) {
      //"We switched Districts clear Processed after the receipt is closed. Set to ensure the correct district is used to refresh the dashboard
      this.multiDistrictSrvc.processedDistrict = '';
      // console.log("We switched Districts clear Processed: ", this.multiDistrictSrvc.processedDistrict);
      this.selectedLoginResponse = this.loginResponse;
    }
    this.selectedDistrict = this.getSelectedDistrict(userOptions, dList);
    if (this.selectedDistrict) {
      //  console.log("the selected DISTRICT: ", this.selectedDistrict);
      this.defaultDistrict = this.selectedDistrict[0].distirctName;

    }

    this.multiDistrictSrvc.newDistrictSelected = true;
    //  console.log("New District Selected: ", this.multiDistrictSrvc.newDistrictSelected);



    if (this.router.url == '/account/payment-method') {
      //  console.log('Im Payment Method');
      this.subscribeToPostNewUserContext(this.selectedDistrict, this.loginResponse);
      window.setTimeout(() => {
        // console.log("do we have an updated LoginResponse: ", this.loginResponse)
        this.multiDistrictSrvc.paymentMethodsUpdate();
      }, 2000)
    } else {
      this.pageLoadingService.show("Retrieving Account Data...");
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
      this.subscribeToPostNewUserContext(this.selectedDistrict, this.loginResponse);

      this.userContextIntrvl =
        window.setInterval(() => {
          this.studentMealsService.studentMeals = [];
          // console.log("Do we have userContextNow newLoginResponse:  ", this.userContextService.newLoginResponse )
          if (this.userContextService.newLoginResponse) {
            this.loginResponse = this.userContextService.newLoginResponse;
            this.loginStoreSvc.loadLogin(this.loginResponse)
            //console.log("Calling from setDistrict 1")
            window.clearInterval(this.userContextIntrvl);
            // this.studentMealsRemoteService.subscribeToGetMeals(this.loginResponse);
            this.studentMealsRemoteService.getRemoteStudentMeals(this.loginResponse)
              .subscribe(
                data => {
                  //  console.log("Returned Data: ", data)
                  this.studentMealsRemoteService.studentMeals = data;
                  this.studentMealsRemoteService.result = true;
                  this.studentMealsRemoteService.listReady = true;
                },
                error => {
                  // console.log("Error: No Meals: ", this.studentMealsRemoteService.studentMeals);
                  this.studentMealsRemoteService.result = false;
                }
                ,
                () => {
                  if (this.utilityService.posCommError) {
                    //  console.log("We got a commError: ", this.loginResponse)
                    this.studentMealsRemoteService.getMealsErr = this.utilityService.posCommError;
                    //  console.log("What is getMealsErr: ", this.getMealsErr)
                  }
                  //console.log("Did we get Meals: ", this.studentMeals);
                  if (this.studentMealsRemoteService.result == false) {
                    this.studentMealsRemoteService.isStudentsRemoteGetting = false;
                  } else {

                    this.studentMealsRemoteService.weGotStudents.emit(true);
                    //  console.log("WeGotStudents: ", this.studentMeals);
                    this.studentMealsRemoteService.isStudentsRemoteGetting = this.studentMealsRemoteService.studentMeals.length > 0;
                    this.loginStoreSvc.loadLogin(this.loginResponse)
                    let tempMeals: any = this.studentMealsRemoteService.studentMeals;
                    // console.log("What is tempMeals: ", tempMeals)
                    this.store.dispatch(new MealStoreActions.ClearMeals());
                    this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));

                    // console.log("Calling this.formCompleted ")
                    this.studentMealsRemoteService.formCompleted = new Observable(observer => {
                      observer.next(true);
                      observer.complete();
                    });
                    this.studentMealsRemoteService.formCompleted.pipe(
                      first(data => data == true)
                    );

                  }
                  this.studentMealsRemoteService.studentMealsSub$.unsubscribe();
                  this.processedNewList();
                }
              );

          }
        }, 0)


    }
    this.getCartCount();

  }

  public findDistricts(loginResponse) {
    //  console.log("Calling find Districts: ", loginResponse);
    this.multiDistrictSrvc.subscribeToGetDistricts(this.loginResponse);
  }

  public getSelectedDistrict(userOptions, dList) {
    let selectedOption: any = [];
    for (let i = 0; i < dList.length; i++) {
      if (userOptions == dList[i].districtName) {
        selectedOption.push(dList[i]);
      }
    }
    return selectedOption;
  }

  //Refreshes meals after refresh event ex: processed payment, returning back to the dashboard
  public refeshMeals(refreshNow: boolean) {
    if (refreshNow) {
      this.addCartItemService.count = 0;
      this.getCartCount();
      // console.log("Calling getMeals from refeshMeals: ")
      this.studentMealsRemoteService.subscribeToGetMeals(this.loginResponse);
      this.studentMealsService.listReady = true;
      this.siteMealsRefresh = true;
      if (this.studentMealsRemoteService.studentMeals) {
        let tempStudentMeal: any;
        tempStudentMeal = this.studentMealsRemoteService.studentMeals;
        this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeal));
        this.mealStore.subscribe(m => this.mealState = m);
        if (this.mealState) {
          this.mealStateMeals = this.mealState.data;
        }
      }
      this.cartStore.subscribe(c => this.cartState = c);
      if (this.cartState) {
        this.cartStateItems = this.cartState.data;
      }

    }
  }

  public subscribeToPostNewUserContext(districtObj: any, loginResponse: LoginResponseModel) {
    // console.log("calling subscribeToPostNewUserContext: ", districtObj)
    let districtKey = districtObj[0].districtKey;
    // console.log("What is the loginResponse: ", loginResponse)
    let failureMessage: string = 'Failed to get New User Credentials';
    let loginModelObj: any;

    this.userContextService.postNewUserContext(districtKey, loginResponse)
      .subscribe(
        data => {
          // this.newLoginResponse = data;
          loginModelObj = data.apiUserContext;
          // console.log("did we get a loginModelObj: ", loginModelObj)
          this.userContextService.newToken = data.jwt;
          this.userContextService.newTokenResults = true;
        },
        error => {
          this.utilityService.processApiErr(error, loginResponse, failureMessage);
          this.userContextService.newTokenResults = true;
        },
        () => {
          loginResponse.access_token = this.userContextService.newToken;
          loginResponse.allPaymentsResumeDate = loginModelObj.allPaymentsResumeDate;//add
          loginResponse.allPaymentsSuspended = loginModelObj.allPaymentsSuspended//add
          loginResponse.cartItemCount = loginModelObj.cartItemCount;
          loginResponse.districtKey = loginModelObj.districtKey;
          loginResponse.districtName = loginModelObj.districtName;//add
          loginResponse.expires_in = loginModelObj.expires_in;//add
          loginResponse.firstName = loginModelObj.firstName;//add
          loginResponse.incidentId = loginModelObj.incidentId;//add
          loginResponse.isAchAllowed = loginModelObj.isAchAllowed;
          loginResponse.isAlertsAllowedDistrict = loginModelObj.isAlertsAllowedDistrict;
          loginResponse.isAutoPayEnabled = loginModelObj.isAutoPayEnabled;
          loginResponse.isBlockACH = loginModelObj.isBlockACH;
          loginResponse.isBlockPayments = loginModelObj.isBlockPayments;
          loginResponse.isDisableMealPaymentsDistrict = loginModelObj.isDisableMealPaymentsDistrict;
          loginResponse.isNewExperience = loginModelObj.isNewExperience;
          loginResponse.lastName = loginModelObj.lastName;
          loginResponse.mealPaymentsResumeDate = loginModelObj.mealPaymentsResumeDate;//add
          loginResponse.mealPaymentsSuspended = loginModelObj.mealPaymentsSuspended;//add
          loginResponse.requiresRelationship = loginModelObj.requiresRelationship;//add
          loginResponse.requiresStudent = loginModelObj.requiresStudent;//add
          loginResponse.state = loginModelObj.state;
          loginResponse.isFroEnabled = loginModelObj.isFroEnabled;
          loginResponse.isOldExperienceAllowed = loginModelObj.isOldExperienceAllowed;

          this.userContextService.newLoginResponse = loginResponse;
          // console.log("We got a New LoginResponse: ", this.newLoginResponse)


          //console.log("What is the New UserContext LoginResponse: ", this.loginResponse);
          //console.log("Do we have default Data: ", this.defaultData);
          let testDefaultData: any = this.userContextService.defaultData;
          if (testDefaultData) {
            //  console.log("The testDefaultDate: ", testDefaultData)
            testDefaultData.districtKey = this.userContextService.newLoginResponse.districtKey;
            testDefaultData.districtName = this.userContextService.newLoginResponse.districtName;
            this.loginStoreSvc.createLoginObj(testDefaultData, this.userContextService.newLoginResponse);
          }

          this.loginStoreSvc.loadLogin(this.userContextService.newLoginResponse)

          this.loginResponse = this.loginStoreSvc.cookieStateItem;

          this.userContextService.callUserCntxtCnt = 0;
          //Tells app we got a new token now call api's using the new Token
          this.userContextService.gotNewUserContext$.emit(this.userContextService.newTokenResults);

        }

      )
  }


  private processedNewList() {
    //console.log("Calling new Processed List: ", this.studentMealsRemoteService.studentMeals)

    if (this.studentMealsRemoteService.studentMeals.length > 0) {
      let tempStudentMeals: any = this.studentMealsRemoteService.studentMeals;
      this.store.dispatch(new MealStoreActions.ClearMeals());
      //  window.setTimeout(() => {
      this.isContextRefreshing = true;
      this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeals));
      this.mealStore.subscribe(m => this.mealState = m);
      if (this.mealState) {
        this.mealStateMeals = this.mealState.data;
        this.siteMealsRefresh = true;
        this.userContextRefresh$.emit(this.siteMealsRefresh);
        this.newDistrictCartCounter = 0;
        this.multiDistrictSrvc.newDistrictSelected = true;
        // console.log("Sitehome saw district switch: ", this.multiDistrictSrvc.newDistrictSelected)
        this.multiDistrictSrvc.didSwitchDistrict.emit(true);
        //  this.pageLoadingService.hide();
      }
      //   }, 0)
    } else {
      this.studentMealsRemoteService.weGotStudents.subscribe(() => {
        if (this.studentMealsRemoteService.studentMeals.length > 0) {
          let tempStudentMeals: any = this.studentMealsRemoteService.studentMeals;
          this.isContextRefreshing = (tempStudentMeals.length > 0) ? true : false;
          this.store.dispatch(new MealStoreActions.ClearMeals());

          this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeals));
          this.mealStore.subscribe(m => this.mealState = m);
          if (this.mealState) {
            this.mealStateMeals = this.mealState.data;
            this.siteMealsRefresh = (this.mealStateMeals) ? true : false;
            this.userContextRefresh$.emit(this.siteMealsRefresh);
            this.newDistrictCartCounter = 0;
            this.multiDistrictSrvc.newDistrictSelected = true;
            // console.log("Sitehome saw district switch: ", this.multiDistrictSrvc.newDistrictSelected)
            this.multiDistrictSrvc.didSwitchDistrict.emit(true);
            this.studentMealsRemoteService.weGotStudents.unsubscribe();

          }
        }
      })
    }

  }

  ngOnDestroy() {
    this.isDestroyed = true; /* Update our state. */
    this.updateCartCounter = 0;
    this.siteMealsCounter = 0;
    this.getCartCounter = 0;
    this.cartStoreCounter = 0;
    this.multiDistrictSrvc.newDistrictSelected = false;
  }
}
