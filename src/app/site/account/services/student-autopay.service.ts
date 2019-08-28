import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { StudentAutoPayModel, AutopaySetupModel } from '../meal-purchases/model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, LoginStoreService } from '../../../shared/services/index';

@Injectable()

export class PaymentAutoPayService {
  public autopayDetails: any;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public autoPayAdded$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public postResults: boolean = false;
  public updateResults: boolean = false;
  public autoPayUpdated$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public deleteResults: boolean = false;
  public autoPayDeleted$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private tokenService: TokenService,
    private loginStoreSrvc: LoginStoreService
  ) { }

  public getAutoPayDetails(loginResponse: LoginResponseModel): Observable<number> {
    this.result = false;
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;

    let successMessage: string = 'Success';
    let failureMessage: string = 'Failed to get Auto Pay Details';

    //  this.loginResponse = loginResponse;


    let Url = Constants.WebApiUrl.Profile + '/autopay';  // URL to web API
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);

    let options = new RequestOptions({ headers: headers });

    this.http.get(Url, options)
      .subscribe(
        data => {

          this.autopayDetails = data.json();
          newJwt = data.headers.toJSON();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0]
          this.result = true;


        });
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)
  }

  public getAutoPayDetailsNew(loginResponse: LoginResponseModel): Observable<any> {
    let failureMessage: string = 'Failed to get Auto Pay Details';
    this.loginResponse = loginResponse;
    let token: any = '';
    token = this.loginResponse.access_token;
   // console.log("What is the getPaymentMethodsNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);
    this.result = false;
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/autopay';  // URL to web API

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
     //   ,
      //  tap(data => console.log("Called By subscribetoGetAutoPayDetails: ", data))
      )
  }

  public subscribetoGetAutoPayDetails(loginResponse: LoginResponseModel) {
   // console.log("Calling subscribetoGetAutoPayDetails");
    let failureMessage: string = 'Failed to get deriveDefaults';
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    // console.log("What is the loginResponseObj: ", loginResponseObj)
    this.getAutoPayDetailsNew(loginResponseObj)
      .subscribe(
        data => {
          let tempList: any = data;
          this.autopayDetails = tempList;
        },
        error => {
          this.utilityService.processApiErr(error, loginResponseObj, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response  
         // console.log("Do we have the currentLoginRespopnse: ", this.loginStoreSrvc.storeLoginResponse);
          if (this.loginStoreSrvc.storeLoginResponse) {
            for (let i = 0; i < this.autopayDetails.length; i++) {
              if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.autopayDetails[i].districtKey) {
                let currDistrictDetails: any = this.autopayDetails[i];
                this.autopayDetails = currDistrictDetails;
              // console.log("Do we have the correct Details: ", this.autopayDetails)

              }
            }
          }


          this.result = true;
        }
      );

  }


  public setupStudentAutopay(autopayAddDetail: AutopaySetupModel, loginResponse: LoginResponseModel): Observable<number> {
    this.result = false;

    let newJwt: any;
    let successMessage: string = 'Successfully added Autopay';
    let failureMessage: string = 'Failed to add Autopay';

    let Url = Constants.WebApiUrl.Profile + '/AutoPay';  // URL to web API
    let body = JSON.stringify(autopayAddDetail);
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + loginResponse.access_token);

    let options = new RequestOptions({ headers: headers });

    this.loginResponse = loginResponse;

    this.http.post(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.getAutoPayDetails(this.loginResponse);
          this.result = true;

        });
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)
  }

  private setupStudentAutopayNew(autopayAddDetail: AutopaySetupModel, loginResponse: LoginResponseModel): Observable<any> {
    this.result = false;
    let successMessage: string = 'Successfully added Autopay';
    let failureMessage: string = 'Failed to add Autopay';
    this.loginResponse = loginResponse;
    let token: any = '';
    token = this.loginResponse.access_token;
   // console.log("What is the getPaymentMethodsNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);


    let Url = Constants.WebApiUrl.Profile + '/autopay';  // URL to web API
    let body = JSON.stringify(autopayAddDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    //Used for debugging
    //console.log("The Url: ", Url)
    //console.log("Da Body: ", body)
    //console.log("Options: ", options)
    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
       // ,
       // tap(data => console.log(successMessage + ": ", data))
      )
  }

  public subscribeToSetupStudentAutoPay(autopayAddDetail: AutopaySetupModel, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Failed to add Autopay';
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.setupStudentAutopayNew(autopayAddDetail, loginResponseObj)
      .subscribe(
        data => {
          // newJwt = data.headers.toJSON();
          this.result = true;
          this.postResults = this.result;
          //(!data) ? true : false;

          this.result;
          //
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          //this.loginResponse.access_token = newJwt.jwt_refresh[0];
          //this.getAutoPayDetails(this.loginResponse);
          this.subscribetoGetAutoPayDetails(loginResponseObj);
          this.result = true;
          this.autoPayAdded$.emit(this.postResults)


        }
      );
  }

  private updateAutopayNew(autopayAddDetail: AutopaySetupModel, loginResponse: LoginResponseModel): Observable<any> {
    this.result = false;
    let successMessage: string = 'Successfully updated Payment method';
    let failureMessage: string = 'Failed to update payment account';
    this.loginResponse = loginResponse;
    let token: any = '';
    token = this.loginResponse.access_token;
    // console.log("What is the updateAutopayNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);

    // console.log("updateAutopayNew currToken: ", this.currentToken)

    let Url = Constants.WebApiUrl.Profile + '/AutoPay';  // URL to web API
    let body = JSON.stringify(autopayAddDetail);

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.patch(Url, body, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
      //  ,
       // tap(data => console.log(successMessage + ": ", data))
        )
  }

  public subscribeToUpdatePaymentAutoPay(autopayAddDetail: AutopaySetupModel, loginResponse: LoginResponseModel) {
    // this.updateResults = false;
    let loginResponseObj: any;
    let failureMessage: string = 'Failed to update payment account';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.updateAutopayNew(autopayAddDetail, loginResponseObj)
      .subscribe(
        data => {
          this.result = true;
         },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = (error) ? false : true;
        },
        () => {
          //processing the successful response
          this.subscribetoGetAutoPayDetails(loginResponseObj);
          this.result = true;
          this.updateResults = this.result;
          //Tells the autoPayComponent to Refresh itsself with the updated data
          this.autoPayUpdated$.emit(this.updateResults);
        }

      )
  }

  public deleteAutopay(autoPaySettingsKey: string, loginResponse: LoginResponseModel): Observable<number> {
    this.result = false;

    let newJwt: any;

    let successMessage: string = 'success';

    let failureMessage: string = 'Unable to delete the autopay.';
    let Url = Constants.WebApiUrl.Profile + '/AutoPay/' + autoPaySettingsKey;  // URL to web API                 
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + loginResponse.access_token);

    let options = new RequestOptions({ headers: headers });
    this.loginResponse = loginResponse;


    this.http.delete(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0]
          this.getAutoPayDetails(this.loginResponse);
          this.result = true;

        });

    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)
  }

  private deleteAutoPayNew(autoPaySettingsKey: string, loginResponse: LoginResponseModel): Observable<any> {
    this.result = false;
    let successMessage: string = 'Successfully updated Payment method';
    let failureMessage: string = 'Failed to update payment account';
    this.loginResponse = loginResponse;
    // console.log("Access Toek: ", this.loginResponse.access_token)

    let token: any = '';
    token = this.loginResponse.access_token;
    // console.log("What is the updateAutopayNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);

    // console.log("updateAutopayNew currToken: ", this.currentToken)

    let Url = Constants.WebApiUrl.Profile + '/AutoPay/' + autoPaySettingsKey  // URL to web API

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.delete(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
       // ,
       // tap(data => console.log(successMessage + ": ", data))
      )
  }

  public subscribeToDeleteAutoPay(autoPaySettingsKey: string, loginResponse: LoginResponseModel) {
    let loginResponseObj: any;
    let failureMessage: string = 'Failed to update payment account';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.deleteAutoPayNew(autoPaySettingsKey, loginResponseObj)
      .subscribe(
        data => {
          this.result = true;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.subscribetoGetAutoPayDetails(loginResponseObj);
          this.result = true;
          this.deleteResults = this.result;
          this.autoPayDeleted$.emit(this.deleteResults);

        });

  }

}
