import { Component, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';
//import { PurchaseBannerService } from '../../shared/components/purchase-banner/purchase-banner.service';
import { Observable, Subscription } from 'rxjs';
import { SiteHomeComponent } from '../site-home.component';
import { ReceiptService } from '../../shared/components/receipt/receipt.service';
import { BonusScheduleService } from '../services/bonus-schedule.service';
import { ActivitiesService, ValidCartCountService, StudentMealsService, StudentMealsServiceRemote, TransfersService, CartCheckoutService, MultiDistrictService, FeesService, AddCartItemService, CartCheckoutItemsService } from '../services/index';
import { FeesList } from '../model/index';
import { Store, State } from '@ngrx/store';
import { mealBonusSchedule } from '../model/meal-bonus-schedule.model';
import {
  AuthGuardService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';
import { Constants } from '../../app.settings';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { NutrisliceComponent } from './nutrislice/nutrislice.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { CartItemDetail, CartItem, CartResponseItem, CheckoutItem, CartResponse } from '../model/index';
import { AppState } from '../../app.state';
import { AutoEnrollDialogComponent } from './auto-enroll-dialog/auto-enroll-dialog.component';
//import { setTimeout, setInterval, clearInterval } from 'timers';
import { MobileDistrictMessageComponent } from './district-message/mobile-district-message.component';
import { DistrictMessageComponent } from './district-message/district-message.component';
import { AutoEnrollActivitiesService } from '../services/auto-enroll-activities.service';
import { UserContextService } from '../account/services/user-context.service';
import { Plugins } from '@capacitor/core';

@Component({
  moduleId: module.id,
  templateUrl: 'dashboard-home.component.html',
  styleUrls: ['../../app.component.less', './dashboard-home.component.less']
})

export class DashboardHomeComponent implements OnDestroy {
  private mealBonusSchedule: mealBonusSchedule[];
  public loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  public isBonus: boolean = false;

  // public showPurchaseBanner: boolean = false;
  public mobile: boolean;
  //public showReceipt: boolean = false;
  public feesList: FeesList[];
  public isBonusSchedule: boolean = false;
  public subscription: Subscription;
  private receiptCounter: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public feeStore: Observable<FeesList[]>;
  public feeState: any;
  public autoEnrollFeesCounter: number = 0;
  public openMeals: boolean = false;
  public showFees: boolean = false;
  public showActivities: boolean = false;
  public openNutrislice: boolean = false;
  public openFeedback: boolean = false;
  public deviceInfo: any;
  public web: boolean;
  public userContextDefault: any;
  public districtHasFees: boolean = false;
  public districtHasActivities: boolean = false;
  public rowHeight: any;
  public feeInterval: any;
  public districtHasOrientations: any;
  public districtHasExams: any;
  // public showReceiptInterval: any;

  constructor(
    // public purchaseBannerService: PurchaseBannerService,
    private siteHomeComponent: SiteHomeComponent,
    public receiptService: ReceiptService,
    public bonusScheduleService: BonusScheduleService,
    private messageProcessorService: MessageProcessorService,
    private addCartItemService: AddCartItemService,
    private studentMealsService: StudentMealsService,
    private transferMealsService: TransfersService,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private feesService: FeesService,
    private cartCheckoutSrvc: CartCheckoutItemsService,
    private loginStoreSrvc: LoginStoreService,
    public studentMealsServiceRemote: StudentMealsServiceRemote,
    private activitiesService: ActivitiesService,
    private userContextService: UserContextService
  ) {
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    this.feeStore = store.select(state => state.feeStore);
  }

  async ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.getMealBonusSchedule();
    // console.log('login response', this.loginResponse);
    await this.studentMealsServiceRemote.subscribeToGetMeals(this.loginResponse);
    if (!this.userContextService.defaultData) {
      this.userContextService.subscribeToGetDeriveDefaultsNew(this.loginResponse);
      setTimeout(() => { this.userContextDefault = this.userContextService.defaultData; }, 1000)
    } else {
      this.userContextDefault = this.userContextService.defaultData;
      // console.log('default data', this.userContextService.defaultData)
    }
    //onsole.log('loginStoreSrvc', this.loginStoreSrvc);
    this.feeInterval = setInterval(() => {
      if (this.feesService.feesList) {
        if (this.feesService.feesList.length === 0) {
          this.showFees = false;
        } else {
          this.showFees = true;
        }
      }
    }, 500);
    //  console.log("do we have the user Defaults on Dashboard: ", this.userContextService.defaultData);
    // console.log("about to call subscribeToGetCartCheckoutCartItem - Dashboard1 ")
    this.cartCheckoutSrvc.subscribeToGetCartCheckoutCartItem(this.loginResponse);
    //console.log('loginResponse', this.loginResponse);
    //console.log('userContext', this.userContextService);
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
    //console.log(this.deviceInfo);
    //console.log('default', this.userContextDefault);
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
      }
      if (this.userContextDefault.districtHasExams) {
        this.districtHasExams = true;
      }
    } else {
      //console.log(this.userContextService.defaultData.isMobileMealsOnly);
      if (this.userContextDefault.districtHasFees) {
        this.districtHasFees = true;
      }
      if (this.userContextDefault.districtHasActivities) {
        this.districtHasActivities = true;
      }
      if (this.userContextDefault.districtHasOrientations) {
        this.districtHasOrientations = true;
      }
      if (this.userContextDefault.districtHasExams) {
        this.districtHasExams = true;
      }
      if (this.userContextService.defaultData.isMobileMealsOnly === true) {
        this.showFees = false;
        this.showActivities = false;
      } else {
        this.showFees = true;
        this.showActivities = true;
      }
    }

    //this.showReceiptInterval = setInterval(() => {
    //  // && this.receiptCounter < 4 this.receiptService.showReceipt
    //  //this.receiptService.result && this.receiptService.showReceipt
    //  if (this.siteHomeComponent.showReceipt) {
    //    console.log("the receiptCounter: ", this.receiptCounter)
    //    this.setShowReceipt();
    //   // this.receiptCounter++;
    //    clearInterval(this.showReceiptInterval);
    //  }
    //}, 500)


  }

  ngDoCheck() {
    let paymentType = this.receiptService.paymentType;
    // console.log("Do we have this cart: ", paymentType);
    if (paymentType == 'userFee') {
      this.receiptService.goToMakeTransfer();

    }



    if (this.mealBonusSchedule) {
      if (this.mealBonusSchedule.length > 0) {
        this.isBonusSchedule = true;
      }
    }


  }

  //setShowReceipt() {
  //  this.showReceipt = this.receiptService.showReceipt;
  //  console.log("setShowReceipt: ", this.showReceipt);
  //}

  getMealBonusSchedule() {
    let subscription = this.bonusScheduleService.getBonusSchedule(this.loginResponse)
      .subscribe(() => {
        if (this.bonusScheduleService.result == true) {
          subscription.unsubscribe();
          if (this.bonusScheduleService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSrvc.loadLogin(this.bonusScheduleService.loginResponse);
          } else {
            this.mealBonusSchedule = this.bonusScheduleService.mealbonusSchedule;
            this.loginStoreSrvc.loadLogin(this.bonusScheduleService.loginResponse)
          }
        } else {
          ++this.bonusScheduleService.count;
        }
      });
  }

  ngOnDestroy() {
    // console.log("closed the receipt update Site: ", this.siteHomeComponent.siteMealsRefresh)
    this.siteHomeComponent.siteMealsRefresh = true;
    // this.siteHomeComponent.refeshMeals(true);
    if (this.receiptService.displayReceipt()) {
      this.receiptService.hide();
      this.receiptCounter = 0;
    }

  }


}
