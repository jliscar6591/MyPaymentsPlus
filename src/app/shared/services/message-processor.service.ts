import { Injectable, OnInit } from '@angular/core';

//Local
import { LoginResponseModel } from '../../login/model/index';
import { CookieService } from 'ngx-cookie';
import { ValidateCookieService } from './validate-cookie.service';
import { Constants } from '../../app.settings';
import { LoginStoreService } from '../../shared/services/login-store.service';


//Third party
import { ToasterContainerComponent, ToasterService, Toast, ToasterConfig } from 'angular2-toaster/angular2-toaster';


@Injectable()
export class MessageProcessorService {
  constructor(
    private cookieService: CookieService,
    private toasterService: ToasterService,
    private validateCookieService: ValidateCookieService,
    private loginStoreService: LoginStoreService

  ) {
    this.toasterService = toasterService;
  }

  public toasterconfig: ToasterConfig = new ToasterConfig({ tapToDismiss: true, limit: 1 });

  public messageHandler(): void {
    let loginResponse: LoginResponseModel;
      //this.validateCookieService.validateCookie();
    if (this.loginStoreService.cookieStateItem) {
      loginResponse = this.loginStoreService.cookieStateItem;
        //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
      //When there is message report it.
      if (loginResponse.message && loginResponse.message != '') {

        if (loginResponse.showCloseButton) {
          var toast: Toast = {
            type: loginResponse.messageType
            , title: loginResponse.messageTitle
            , body: loginResponse.message
            , showCloseButton: loginResponse.showCloseButton
            , closeHtml: loginResponse.closeHtml
            , timeout: 0
            , onHideCallback: () => {
              loginResponse.message = '';
              loginResponse.messageTitle = '';
              loginResponse.messageType = '';
              this.loginStoreService.loadLogin(loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);
            }
          };
        } else {
          var toast: Toast = {
            type: loginResponse.messageType
            , title: loginResponse.messageTitle
            , body: loginResponse.message
            , showCloseButton: false
            , closeHtml: loginResponse.closeHtml
            , timeout: 5000
            , onHideCallback: () => {
              loginResponse.message = '';
              loginResponse.messageTitle = '';
              loginResponse.messageType = '';
              this.loginStoreService.loadLogin(loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);
            }
          };
        }
        this.toasterService.pop(toast);
        //Clear error message
        loginResponse.message = '';
        loginResponse.messageType = '';
        loginResponse.messageTitle = '';
        loginResponse.message = '';
        loginResponse.showCloseButton = false;
        loginResponse.closeHtml = '';
        this.loginStoreService.loadLogin(loginResponse);
       // this.cookieService.putObject(Constants.AuthCookieName, loginResponse);

      }
    }
  }
}
