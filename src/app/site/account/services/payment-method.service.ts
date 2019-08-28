import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { PaymentMethodModel, PaymentMethodInputModel, PaymentMethodDetailModel } from '../meal-purchases/model/index';
import { UtilityService, TokenService, CurrentTokenService } from '../../../shared/services/index';

@Injectable()

export class PaymentMethodService {
  public paymentMethods: PaymentMethodModel[];

  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  public resultSetDefaultPayment: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  private getPaymentMethods$: any;

  constructor(
    private http: Http,
    private httpC: HttpClient,
    private utilityService: UtilityService,
    private tokenService: TokenService,
    private currTokenServ: CurrentTokenService,
  ) { }


  public getPaymentMethodsNew(loginResponse: LoginResponseModel): Observable<any> {
    // console.log("Calling getPaymentMethodsNew: ", loginResponse)
    let failureMessage: string = 'Get Payment Methods Failed';
    this.loginResponse = loginResponse;
    // console.log("the login Response: ", this.loginResponse);
    let token = this.loginResponse.access_token;
    // console.log("What is the getPaymentMethodsNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);
    //For Testing
    //this.loginResponse.districtKey = "0d3b28a7-425c-487e-97da-1bc8cbeb0c28";
    // this.loginResponse.districtName = "Gwinnett County Public Schools (Test)";
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Wallet + '/WalletDetailSummary';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    //console.log("The Url: ", Url)
    //console.log("The headers: ", headers)
    // console.log("The options")

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
        //  ,
        // tap(data => console.log("I think we got a Payment Methods: ", data))
      )
  }

  public subscribeToGetPaymentMethods(loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';

    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    // console.log("What is the loginResponse for getPaymentMethods: ", loginResponseObj);

    this.getPaymentMethods$ = this.getPaymentMethodsNew(loginResponseObj)
      .subscribe(
        data => {
          this.paymentMethods = data;
        },
        error => {
          this.utilityService.processApiErr(error, loginResponseObj, failureMessage)
        },
        () => {
          //  console.log("What R these paymentMethods: ", this.paymentMethods)
          this.result = true;
        }
      )
  }


  public updatePaymentMethodNew(updatepayment: PaymentMethodDetailModel, loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = 'Successfully updated Payment method';
    let failureMessage: string = 'Failed to update payment account';

    this.loginResponse = loginResponse;
    // console.log("the login Response: ", this.loginResponse);
    let token = this.loginResponse.access_token;
    // console.log("What is the getRemoteStudentMeals token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);

    let Url = Constants.WebApiUrl.Wallet + '/Wallet';  // URL to web API
    let body = JSON.stringify(updatepayment);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    })

    let options = { headers: headers };

    this.loginResponse = loginResponse;
    return this.httpC.put(Url, body, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
        // ,
        //  tap(data => console.log("I think we got a Payment Methods: ", data))
      )
  }

  public subscribeToUpdatePaymentMethodNew(updatepayment: PaymentMethodDetailModel, loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';
   // console.log('PaymentMethodsNew LOgin Resposne: ', loginResponse)

    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.updatePaymentMethodNew(updatepayment, loginResponseObj)
      .subscribe(
        data => {
         // console.log("Response from Wallet: ", data);
          this.result = true;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          this.result = true;
        }
      )
  }


  public setDefaultWallet(walletKey: string, loginResponse: LoginResponseModel): Observable<number> {
    this.resultSetDefaultPayment = false;
    let newJwt: any;
    let successMessage: string = 'Successfully set default wallet';
    let failureMessage: string = 'Failed to set default wallet';

    let Url = Constants.WebApiUrl.Wallet + '/wallet/default/';  // URL to web API
    let body = JSON.stringify({ value: walletKey });
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + loginResponse.access_token);

    let options = new RequestOptions({ headers: headers });

    this.loginResponse = loginResponse;

    this.http.patch(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.resultSetDefaultPayment = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.resultSetDefaultPayment = true;

        });
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)

  }

  //Use regular expressions to discern the card type
  //based on the card number format
 public getCardType(cardNumber: string) {
    //  console.log("do we knowe the Card #: ", cardNumber)
    let carNumPrefix = cardNumber.substr(0, 1);
    // console.log("What is the carNumPrefix: ", carNumPrefix)
    if (carNumPrefix == '4') {
      return 'Visa';
    } else if ((carNumPrefix == '2') || (carNumPrefix == '5')) {
      return 'MasterCard';
    } else if ((carNumPrefix == '6')) {
      // console.log("should be Discover Card")
      return 'Discover';
    } else if ((carNumPrefix == '3')) {
      return this.setCardType(cardNumber)
    } else {
      return Constants.Error;
    }
  }

  //We have Four different Card Types that use 3 as a prefix.
  //We have to look at the two digit prefix to determine the correct Card type
  private setCardType(cardNumber: string) {
    let tempPrefix = cardNumber.substr(0, 2);
    // console.log("What is the 2-digit Prefix: ", tempPrefix)
    if (tempPrefix == '30') {
      return 'CarteBlanche';
    } else if (tempPrefix == '35') {
      return 'JCB';
    } else if ((tempPrefix == '36') || (tempPrefix == '38')) {
      return 'DinersClub';
    } else if ((tempPrefix == '34') || (tempPrefix == '37')) {
      return 'AmEx';
    } else {
      return Constants.Error;
    }
  }


}

