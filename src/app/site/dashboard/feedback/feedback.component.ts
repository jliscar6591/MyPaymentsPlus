import { Component, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

import { FeedbackDialogService } from '../../services/feedback-dialog.service';
import {
    UtilityService,
    ValidateCookieService,
  CookieService,
    LoginStoreService
} from '../../../shared/services/index';
import { LoginResponseModel } from '../../../login/model/index';
import { Constants } from '../../../app.settings';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { Plugins } from '@capacitor/core';
import { cleanSession } from 'selenium-webdriver/safari';

@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.less']
})

export class FeedbackComponent {
  private loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
  public isOldExperienceAllowed: boolean;
  public deviceInfo: any;
  public mobile: boolean;
  public isWeb: boolean;

    constructor(
        private feedbackDialogService: FeedbackDialogService,
        private viewContainerRef: ViewContainerRef,
        private validateCookie: ValidateCookieService,
        private cookieService: CookieService,
      private pageLoadingService: PageLoadingService,
        private loginStoreSvc: LoginStoreService
    ) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }

    async ngOnInit() {
      this.isOldExperienceAllowed = this.loginResponse.isOldExperienceAllowed;
      this.mobile = (window.innerWidth < 960) ? true : false;
      const { Device } = Plugins;
      this.deviceInfo = await Device.getInfo();
      if (this.deviceInfo.platform === 'web') {
        this.isWeb = true;
      }
    }

    showFeedbackDialog() {
        //open feedback dialog, false boolean is for whether or not this dialog is suppose to return to classic mpp
        this.feedbackDialogService.open(false, this.viewContainerRef)
            .subscribe((result: any) => {
                if (result) {
                    //feedback sent!
                }
            });
    }

    showReturnToClassicDialog() {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
       //check if feedback was already provided in the past
      //
      if (this.cookieService.get(Constants.FeedbackCookieName) !== undefined) {
            //if feedback provided then skip dialog and go straight to classic site
          if (this.isOldExperienceAllowed == true) {
            this.pageLoadingService.show("Returning to Classic MyPaymentsPlus");
            this.returnToClassic();
          } else {return}
        }
        else {
            //open feedback dialog, true boolean is for whether or not this dialog is suppose to return to classic mpp
            this.feedbackDialogService.open(true, this.viewContainerRef)
                .subscribe((result: any) => {
                    if (result) {
                        //feedback sent!
                        //show page loading overlay
                      this.pageLoadingService.show("Returning to Classic MyPaymentsPlus");
                      this.returnToClassic();
                    }
                });
        }
    } 



  returnToClassic() {
    console.log("Calling Return to classic");
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
      //this.validateCookie.validateCookie();
    let cleanToken = this.loginResponse.access_token.trim();
    console.log("do we have a clean token: ", cleanToken)
    window.location.href = Constants.ParentPaymentsUrl + '?id=' + cleanToken;
  }  
    
  
}
