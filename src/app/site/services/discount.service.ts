import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService, CookieService } from '../../shared/services/index'
import { LoginResponseModel } from '../../login/model/index';
import { CartItem, CartItemDetail, CheckoutItem } from '../model/index';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  public loginResponse: LoginResponseModel;
  public currentToken: string;
  public result: boolean;
  public CheckoutItem: any;

  constructor(private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
  ) { }

  public applyDiscount(loginResponse: LoginResponseModel, code: string) {
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    let successMessage: string = '';
    let failureMessage: string = 'Apply Discount Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Sale + '/Discount';
    let body = JSON.stringify({ code: code });
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage)),
        tap(data => console.log("discount response: ", data))
      )
  }

  public subscribeToApplyDiscount(loginResponse, code) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.applyDiscount(loginResponseObj, code)
      .subscribe(
        data => {
          this.CheckoutItem = data;
          this.result = true;
        },
        error => {
          //  console.log("Error: No Fees: ", this.feesList)
          this.result = false;
        }
        ,
        () => {
          if (this.result == false) {

          } else {

          }
          this.result = true;
        }
      );
    return this.CheckoutItem;
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    this.result = false;
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
