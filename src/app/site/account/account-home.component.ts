import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProfileUserprofileService } from "./services/index";
import { Subscription } from 'rxjs';
import { LoginResponseModel } from '../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.less'],
  host: { 'class': 'sidenav-layout-container' }
})

export class AccountHomeComponent {
  public sidenavState: boolean = true;
  private routerSubscription: Subscription;
  public mobile: boolean;
  public loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();


  constructor(
    private profileUserprofileService: ProfileUserprofileService,
    private router: Router,
   // private validateCookie: ValidateCookieService,
    private loginStoreSvc: LoginStoreService

  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    
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
