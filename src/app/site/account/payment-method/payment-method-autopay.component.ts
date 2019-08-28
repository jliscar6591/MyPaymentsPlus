import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseModel } from '../../../login/model/index';
import {
    CookieService,
    ValidateCookieService,
    MessageProcessorService,
  UtilityService,
    LoginStoreService
} from '../../../shared/services/index';

@Component({
    moduleId: module.id,
    templateUrl: './payment-method-autopay.component.html',
    styleUrls: ['./payment-method.component.less']

})

export class PaymentMethodAutopayComponent {
  public loginResponse: LoginResponseModel
    //= this.validateCookie.validateCookie();
    constructor(
       // private validateCookie: ValidateCookieService
      private loginStoreSvc: LoginStoreService

    ) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
      // console.log('PaymentMethodAutopayComponent: ')
    }

}
