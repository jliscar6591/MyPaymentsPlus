import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthGuardService } from '../../shared/services/index'
import { LoginResponseModel } from "../../login/model/index"
import { Constants } from '../../app.settings'
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';

@Component({
  selector: 'supplemental-home',
  templateUrl: './supplemental.component.html',
  styleUrls: ['./supplemental.component.less']
})

export class SupplementalComponent {
  public sidenavState: boolean;
  public supportAvailable: boolean;
  private loginResponse: LoginResponseModel;


  constructor(
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    private cookieService: CookieService,
    private router: Router,
    private loginStoreSvc: LoginStoreService
  ) { }

  ngOnInit() {

    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    //this.validateCookie.validateCookie();
    //this.getAuthStatus(this.loginResponse);
    //Checks whether to show the sign in card inline
    this.sidenavState = (window.innerWidth < 599) ? false : true;

    //check if support is available 
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    this.supportAvailable = (currentDay > 0 && currentDay < 6) ? true : false;
    if (this.supportAvailable) {
      var currentTime = currentDate.getHours();

      var startSupportHours = new Date();
      startSupportHours.setHours(7, 30, 0); // 7:30 am
      var endSupportHours = new Date();
      endSupportHours.setHours(17, 30, 0); // 5.30 pm

      this.supportAvailable = (currentDate >= startSupportHours && currentDate <= endSupportHours) ? true : false;
    }
  }

  public nav() {
    this.router.navigate(['/welcome']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sidenavState = (window.innerWidth < 599) ? false : true;
  }


}
