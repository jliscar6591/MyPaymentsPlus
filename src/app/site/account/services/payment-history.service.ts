import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { UserPaymentSearchModel, UserPaymentModel } from '../meal-purchases/model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService } from '../../../shared/services/index';


@Injectable()


export class PaymentHistoryService {
    public userPaymentModel: UserPaymentModel[];
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  private subscription$: Subscription;

    constructor(
        private http: Http,
      private utilityService: UtilityService,
      private httpC: HttpClient,
      private currTokenServ: CurrentTokenService,
      private cookieService: CookieService,
      private tokenService: TokenService
    ) { }

  public getPaymentHistory(userPaymentSearchModel: UserPaymentSearchModel, loginResponse: LoginResponseModel): Observable<number> {
    //console.log("What is the LoginResponse- getPaymentHistory: ", loginResponse )

        let newJwt: any;
        let token = loginResponse.access_token;
        this.loginResponse = loginResponse;

        let successMessage: string = '';
        let failureMessage: string = 'Get Payment History Failed';

        this.loginResponse = loginResponse;



        let Url = Constants.WebApiUrl.Profile + '/PaymentHistory ';  // URL to web API

        let body = JSON.stringify(userPaymentSearchModel);

        //Fake //////////////////////////////////////////////////////////////////////////
        //let Url = '/app/mock/user-payments.json';

        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);

        let options = new RequestOptions({ headers: headers });

        //Fake //////////////////////////////////////////////////////////////////////////
        //this.http.request(Url)
        this.http.post(Url, body, options)
            .subscribe(
            data => {
                newJwt = data.headers.toJSON();
                this.userPaymentModel = data.json()
            },
            error => {
                this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response

                //Fake filter JSON includes AccountBalanceId ////////////////////////////
                //studentMealPurchaseSearchModel.student.studentMealPurchases =
                //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
                //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
                //Comment out for fake //////////////////////////////////////////////////
                this.loginResponse.access_token = newJwt.jwt_refresh[0]
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

  }

  public getPaymentHistoryNew(userPaymentSearchModel: UserPaymentSearchModel, loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = 'Get Payment History Failed';
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);


    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Profile + '/PaymentHistory ';  // URL to web API

    let body = JSON.stringify(userPaymentSearchModel);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };

     //console.log("URL: ", Url)
   // console.log("Body: ", body)
   //console.log("Options: ", options)

    
    return this.httpC.post(Url, body, options)
      .pipe(
      catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
      //,
      //  tap(data => console.log("Did we get Payment History: ", data))
      )
  }
  public subscribeTogetPaymentHistory(userPaymentSearchModel: UserPaymentSearchModel, loginResponse: LoginResponseModel) {
   // console.log("Subscribing to Get Payment History: ", userPaymentSearchModel)
    this.loginResponse = loginResponse;

    let successMessage: string = '';
    let failureMessage: string = 'Get Payment History Failed';
    this.subscription$ = this.getPaymentHistoryNew(userPaymentSearchModel, loginResponse)   
        .subscribe(
            data => {
       
              this.userPaymentModel = data
            },
            error => {
              this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
              this.result = true;
            },
            () => {
              //processing the successful response

              //Fake filter JSON includes AccountBalanceId ////////////////////////////
              //studentMealPurchaseSearchModel.student.studentMealPurchases =
              //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
              //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
              //Comment out for fake //////////////////////////////////////////////////
          
              this.result = true;
              //console.log("We got a userPaymentModel: ", this.userPaymentModel);

            });
  }

}
