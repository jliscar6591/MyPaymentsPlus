import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProfileUserprofileService } from "../services/index";
import { Subscription } from 'rxjs/Subscription';
import { LoginResponseModel } from '../../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { TransfersService, MultiDistrictService } from '../../services/index';
import { StudentListService } from 'app/registration/services';
import { StudentBalanceAlertService } from "../services/index";
import { PaymentMethodService } from "../services/index";
import { PaymentAutoPayService } from '../services/index';

@Component({
  moduleId: module.id,
  selector: 'app-account-mobile',
  templateUrl: './account-mobile.component.html',
  styleUrls: ['./account-mobile.component.less'],
  host: { 'class': 'sidenav-layout-container' }
})
export class AccountMobileComponent {
  public sidenavState: boolean = true;
  private routerSubscription: Subscription;
  private mobile: boolean;
  public loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
  public showXferHistory: boolean;
  constructor(
  //  private profileUserprofileService: ProfileUserprofileService,
    private router: Router,
   // private validateCookie: ValidateCookieService,
    private studentBalanceAlertService: StudentBalanceAlertService,
    private transfersService: TransfersService,
    private loginStoreSvc: LoginStoreService,
    public studentListService: StudentListService,
    private paymentMethodService: PaymentMethodService,
    private paymentAutoPayService: PaymentAutoPayService,
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }
  ngOnInit() {
    //console.log('AccountHomeComponent')
    //If the pages is refreshed we need to check the transfer status again
    if (!this.transfersService.xferStatusCode) {
      this.transfersService.subcribeTogetTransferFeeStatus(this.loginResponse)
    }
    this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
    this.studentBalanceAlertService.subscribeToGetStudentBlanaceAlertsNew(this.loginResponse);
    this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);
    this.paymentAutoPayService.subscribetoGetAutoPayDetails(this.loginResponse);
    this.showXferHistory = this.setShowXferHistory(this.transfersService.xferStatusCode)
    this.mobile = (window.innerWidth < 800) ? true : false;
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.mobile) {
          this.sidenavState = (event.url !== '/account') ? false : true;
        }
        else {
          this.sidenavState = true;
        }
      }
    });
  }

  setShowXferHistory(statusCode) {
    if (statusCode) {
      if (statusCode.status == 1 || statusCode.status == undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      window.setTimeout(() => {
        if (this.transfersService.xferStatusCode == 1 || this.transfersService.xferStatusCode == undefined) {
          return false;
        } else {
          return true;
        }
      }, 2000)
    }
  }
  getAutopaySettingLabel(): string {
    let label: string = '';
    if (this.loginResponse.isAutoPayEnabled && !this.loginResponse.isDisableMealPaymentsDistrict) {
      label = 'Payment Methods & Autopay'
    } else {
      label = 'Payment Methods'
    }
    return label;
  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobile = (window.innerWidth < 800) ? true : false;
  }
}

