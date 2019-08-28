import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { PaymentMethodModel, PaymentMethodInputModel } from '../meal-purchases/model/index';
import { PaymentMethodService } from './payment-method.service';
import { UtilityService, TokenService, CurrentTokenService } from '../../../shared/services/index';


@Injectable()

export class PaymentAddService {
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public addPaymentMethod$: any;
  public subscription: any;

  constructor(
    private http: Http,
    private httpC: HttpClient,
    private utilityService: UtilityService,
    private tokenService: TokenService,
    private currTokenServ: CurrentTokenService,
    private paymentMethodService: PaymentMethodService
  ) { }

  private addPaymentMethodNew(paymentAddDetail: PaymentMethodInputModel, loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    // console.log("the addPaymentMethodNew login Response: ", this.loginResponse);
    let token = loginResponse.access_token;
    let failureMessage: string = 'Failed to add payment account';

    this.currentToken = this.tokenService.getCurrentToken(token);
    let Url = Constants.WebApiUrl.Wallet + '/Wallet';  // URL to web API
    let body = JSON.stringify(paymentAddDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
        //  ,
        // tap(data => console.log("I think we added a Payment Methods: ", data))
      )
  }

  public subscribeToAddPaymentMethods(paymentAddDetail: PaymentMethodInputModel, loginResponse: LoginResponseModel) {
    //console.log("Calling subscribeToAddPaymentMethods: ", paymentAddDetail)
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';
    loginResponseObj = this.utilityService.checkLoginResponse(loginResponse, this.loginResponse);

    this.addPaymentMethod$ = this.addPaymentMethodNew(paymentAddDetail, loginResponseObj)
      .subscribe(
        data => {
          //newJwt = data.headers.toJSON();
          //console.log("we got data:   ", data)
          this.result = (data) ? true : false;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
      () => {
        this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);
          //processing the successful response
          // this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.result = true;
          //console.log("the result: ", this.result)

        }
      )

  }

  public deletePaymentMethod(walletKey: string, loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    // console.log("the addPaymentMethodNew login Response: ", this.loginResponse);
    let token = loginResponse.access_token;
    let successMessage: string = 'success';
    let failureMessage: string = 'Unable to delete the payment method.';

    this.currentToken = this.tokenService.getCurrentToken(token);
    let Url = Constants.WebApiUrl.Wallet + '/Wallet/' + walletKey;  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.delete(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
        //  ,
        // tap(data => console.log("I think we deleted a Payment Methods: ", data))
      )
  }

  public subscribeToDeletePaymentMethod(walletKey: string, loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';
    loginResponseObj = this.utilityService.checkLoginResponse(loginResponse, this.loginResponse);
    this.subscription =
      this.deletePaymentMethod(walletKey,loginResponse)
        .subscribe(
          data => {
            
          },
          error => {
            this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
            this.result = true;
          },
          () => { 
            //console.log("What is the available Status: ", this.availableStatus);
            this.result = true;
            this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);
            this.result = true;

          }
        )
  }



} 
