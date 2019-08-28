import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { AutoPayRate } from '..//model/autopay-rate.model';
import { UtilityService, CurrentTokenService, CookieService, TokenService, LoginStoreService } from '../../../shared/services/index';

@Injectable({
  providedIn: 'root'
})
export class AutopayFeeService {
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  public currentToken: string;
  public autopayRate: AutoPayRate;

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private tokenService: TokenService,
    private loginStoreSrvc: LoginStoreService) { }

  public getAutoPayFee(loginResponse: LoginResponseModel): Observable<any> {
    let failureMessage: string = 'Failed to get Auto Pay Details';
    this.loginResponse = loginResponse;
    let token: any = '';
    token = this.loginResponse.access_token;
    // console.log("What is the getPaymentMethodsNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);
    this.result = false;
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/RatePlan';  // URL to web API

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
          // ,
          //tap(data => console.log("Called By subscribetoGetAutoPayfee: ", data))
      )
  }

  public subscribetoGetAutoPayFee(loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Failed to get fee';
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getAutoPayFee(loginResponseObj)
      .subscribe(
      data => {
        this.autopayRate = data;
      },
      error => {
          this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
          this.result = true;
      },
      () => {
        //console.log('is this being called for auto pay rate');
      })
  }
}
