import { Component, OnInit } from '@angular/core';
import { FeesService } from '../../services/fees.service';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from '../../../app.settings';
import { FeesList } from '../../model/index';
import { SiteHomeComponent } from '../../site-home.component';

@Component({
  selector: 'fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.less']
})
export class FeesListComponent implements OnInit {
  private loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
  public feesList: FeesList[];
  public siteHomeComponent: SiteHomeComponent;
  constructor(
    private feesService: FeesService,
   // private cookieService: CookieService,
   // private validateCookie: ValidateCookieService,
    private loginStoreSvc: LoginStoreService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    //this.feesService.subscribeToGetFees(this.loginResponse);
  }

  ngDoCheck() {

    if (this.feesService.result === true) {
      this.feesList = this.feesService.feesList;
    }
  }

  ngAfterContentInit() {

  }


}
