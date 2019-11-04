import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeesService } from '../../services/fees.service';
import { MultiDistrictService } from '../../services/multi-district.service';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service';
import { Constants } from '../../../app.settings';

import { FeesList, FeeItems } from 'app/site/model';
import { DashboardHomeComponent } from 'app/site/dashboard/dashboard-home.component';
//import { setTimeout } from 'timers';
import { Plugins, AppState } from '@capacitor/core';
const { App } = Plugins;


@Component({
  selector: 'fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.less']
})
export class FeesComponent implements OnInit {
  public loginResponse: LoginResponseModel;
  public feesList: FeesList[];
  public feeDetails: FeeItems[];
  public isList: boolean = false;
  public getFeesCounter: number = 0;
  public appState: AppState;
  public deviceInfo: any;
  public web: boolean;
  public mobile: boolean;
  public feesInterval: any;

  constructor(
    private feesService: FeesService,
    //  private cookieService: CookieService,
    // private validateCookie: ValidateCookieService,
    //  private messageProcessorService: MessageProcessorService,
    // private districtLoginDerivedService: DistrictLoginDerivedService,
    private loginStoreSvc: LoginStoreService,
    private multiDistrictSrvc: MultiDistrictService,
    private refreshService: RefreshService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  async ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.feesService.subscribeToGetFees(this.loginResponse);

    this.feesInterval = setInterval(() => {
      if (this.feesService.result === true) {

        this.getFees();
        clearInterval(this.feesInterval);
      }
    }, 500);
  }

  ngDoCheck() {

  }

  ngAfterContentInit() {
    this.multiDistrictSrvc.didSwitchDistrict.subscribe(() => {
      // console.log("Did Fees see the Switch - ngAfterContentInit")
      if (this.multiDistrictSrvc.newDistrictSelected) {
        //  console.log("Did Fees see the Switch")
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.feesService.subscribeToGetFees(this.loginResponse);
        if (this.refreshService.refreshFeesCnter < 4) {
          setTimeout(() => {
            this.getFees();
            this.multiDistrictSrvc.newDistrictSelected = false;
          }, 2000)
        }
        ;
      }
    });

  }

  getFees() {
    this.isList = false;
    if (this.feesService.result === true) {
      this.feesList = this.feesService.feesList;
      this.isList = (this.feesList.length > 0) ? true : false;
    }

  }

  ngOnDestroy() {

  }

}
