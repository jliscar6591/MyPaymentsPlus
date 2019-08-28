import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DistrictViewModel } from '../../../shared/model/index';
import { Constants } from '../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { DistrictContentService } from '../../../registration/services/index';
import { DashboardDistrictMessageService } from '../../services/index';
import { MobileDistrictMessageComponent } from '../district-message/mobile-district-message.component';
import {
  StateProvinceListService,
  DistrictListService,
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'district-message',
  templateUrl: './district-message.component.html',
  styleUrls: ['../dashboard-home.component.less']
})

export class DistrictMessageComponent {
  public mobile: boolean;
  private loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  private districtName;
  public noShow: boolean = false;

  constructor(private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    public mobileDistrictMessage: MobileDistrictMessageComponent,
    private messageProcessorService: MessageProcessorService,
    public dashboardDistrictMessageService: DashboardDistrictMessageService,
    private loginStoreSrvc: LoginStoreService
  ) {
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
  }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.getDistrictContent();
    this.getDistrictName();
  }

  getDistrictContent() {
    let subscription = this.dashboardDistrictMessageService.getContent(this.loginResponse)
      .subscribe(() => {
        if (this.dashboardDistrictMessageService.result == true) {
          subscription.unsubscribe();

          if (this.dashboardDistrictMessageService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSrvc.loadLogin(this.dashboardDistrictMessageService.loginResponse);
            //this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
            this.messageProcessorService.messageHandler();

          } else {
            this.dashboardDistrictMessageService.districtContent;
            this.loginStoreSrvc.loadLogin(this.dashboardDistrictMessageService.loginResponse);
            //	this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
          }
        } else {
          ++this.dashboardDistrictMessageService.count;
        }
      });
  }

  getDistrictName() {
    let subscription = this.dashboardDistrictMessageService.getName(this.loginResponse)
      .subscribe(() => {
        if (this.dashboardDistrictMessageService.result == true) {
          subscription.unsubscribe();

          if (this.dashboardDistrictMessageService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSrvc.loadLogin(this.dashboardDistrictMessageService.loginResponse);
            //this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
            this.messageProcessorService.messageHandler();
          } else {
            this.dashboardDistrictMessageService.districtName;
            this.loginStoreSrvc.loadLogin(this.dashboardDistrictMessageService.loginResponse);
            //	this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
          }
        } else {
          ++this.dashboardDistrictMessageService.count;
        }
      });
  }

  closeDistrictMessage() {
    this.noShow = true;
  }

}
