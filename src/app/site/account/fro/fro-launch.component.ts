import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseModel } from "../../../login/model/index"
import {
  CookieService,
  ValidateCookieService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from "../../../app.settings";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { FroAppAvailabilityService, FroAppStatusService } from "../services/index"
import { FroAppAvailabilityModel, FroAppStatusModel } from '../meal-purchases/model/index'
//import { setTimeout } from 'timers';
@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'fro-launch.component.html',
  styleUrls: ['fro-launch.component.less']
})

//@Component({
//    template: '<h1>{{froAppAvailabilityService.froAppAvailability.froAppBlackoutEnds}}</h1>',  
//    styleUrls: ['fro-launch.component.less']
//})

export class FroLaunchComponent implements OnInit {
  private loginResponse: LoginResponseModel;
  public isFroStatusGetting: boolean;
  public isFroAvailabilityGetting: boolean;
  public getFroAvailabilityErr: boolean = false;
  public getFroAvailabilityErrMsg: string = '';

  private getFroStatusErr: boolean = false;
  private getFroStatusErrMsg: string = '';
  public isFroStatus: boolean;
  private froAppAvailability: FroAppAvailabilityModel;
  public isBlackedOut: boolean;
  public appBeginYear: number;

  constructor(
    private router: Router,
    private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private utilityService: UtilityService,
    private froAppAvailabilityService: FroAppAvailabilityService,
    private froAppStatusService: FroAppStatusService,
    private loginStoreService: LoginStoreService
  ) {
    this.loginResponse = this.loginStoreService.cookieStateItem;
  }

  ngOnInit() {
   // this.loginResponse = this.validateCookie.validateCookie();
    this.getFroStatus();
    this.getFroAppAvailability();
    setTimeout(() => { this.isBlackedOut = this.setBlackout(); }, 1000);

    //this.fakeContent = `<h1>Free and reduced stub</h1>`
  }


  //Get fro availability
  getFroAppAvailability() {
    this.isFroAvailabilityGetting = true;
    this.froAppAvailabilityService.result = false;
    let subscription = this.froAppAvailabilityService.getAppAvailability(this.loginResponse)
      .subscribe(() => {
        if (this.froAppAvailabilityService.result == true) {
          subscription.unsubscribe();

          if (this.froAppAvailabilityService.loginResponse.messageType === Constants.Error) {
            this.getFroAvailabilityErr = true;
            this.getFroAvailabilityErrMsg = this.froAppAvailabilityService.loginResponse.message;

            this.utilityService.clearErrorMessage(this.froAppAvailabilityService.loginResponse);
          } else {
            this.loginStoreService.loadLogin(this.froAppAvailabilityService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.froAppAvailabilityService.loginResponse);
          }
          this.froAppAvailability = this.froAppAvailabilityService.froAppAvailability;

          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          seconds.subscribe(
            x => {
              if (x == Constants.SpinnerDelay) {
                this.isFroAvailabilityGetting = false;
              }
            });
        } else {
          ++this.froAppAvailabilityService.count;
        }
      });
  }

  //Get status
  getFroStatus() {
    this.isFroStatusGetting = true;
    this.froAppStatusService.result = false;
    let subscription = this.froAppStatusService.getStatus(this.loginResponse)
      .subscribe(() => {
        if (this.froAppStatusService.result == true) {
          subscription.unsubscribe();

          if (this.froAppStatusService.loginResponse.messageType &&
            this.froAppStatusService.loginResponse.messageType === Constants.Error) {
            this.getFroStatusErr = true;
            this.getFroStatusErrMsg = this.froAppStatusService.loginResponse.message;

            this.utilityService.clearErrorMessage(this.froAppStatusService.loginResponse);
          } else {
            this.loginStoreService.loadLogin(this.froAppStatusService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.froAppStatusService.loginResponse);
          }
          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          if (this.froAppStatusService.froAppStatus && this.froAppStatusService.froAppStatus.length > 0) {
            this.isFroStatus = true;
          }
          seconds.subscribe(
            x => {
              if (x == Constants.SpinnerDelay) {
                this.isFroStatusGetting = false;

              }
            });
        } else {
          ++this.froAppStatusService.count;
        }
      });
  }

  //Navigate to start new fro app
  startNewFroApp(msg: string) {
    window.location.href = Constants.FroAppStartUrl.FroAppStartUrl + '/' + this.loginResponse.districtKey + '/' + this.froAppAvailabilityService.froAppAvailability.userId;
    }

  //Stub for action that can be taken on status
  //Continue making app entries
  continueApp(msg: string) {
    console.log(msg);
  }

  //How the eligibility was determined
  eligibilityDetermination(msg: string) {
    console.log(msg);
  }

  //Download the application
  downloadApplication(msg: string) {
    console.log(msg);
  }

  /*If today is > Jul 1st && today is < this.froAppAvailability.appBlackoutEnds
      return true
      The Start App button should be hidden;
      Show banner
 */
  private setBlackout(): boolean {
    
    let todaysDte = this.getToday();

    let currYear = this.getCurrentYear();
    const froObj = this.froAppAvailabilityService.froAppAvailability;
    const beginBlackOutDte = froObj.appBlackoutBegins;
    const endBlackoutDte = froObj.appBlackoutEnds;
   
    if (todaysDte >= beginBlackOutDte && todaysDte < endBlackoutDte) {
      this.isBlackedOut = true;
     // console.log("Its a blackOut, where's Red and Meth ", this.isBlackedOut);
      return true;
    } else {
      this.isBlackedOut = false;
     // console.log("Today is a Good Day, tell Ice Cube: ", this.isBlackedOut);
      return false;
    }

  }

  getToday() {
    let d = new Date();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    let yyyy = d.getFullYear();
    let today = mm + "/" + dd + "/" + yyyy;

    return today;
  }

  getCurrentYear() {
    let d = new Date();
    let yyyy = d.getFullYear();

    this.appBeginYear = yyyy
   // console.log("What is the app Begin Year: ", this.appBeginYear);

    return this.appBeginYear;
  }



}
