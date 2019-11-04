import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../../app.settings';
import { UtilityService, CurrentTokenService, CookieService, LoginStoreService } from '../../../shared/services/index'
import { LoginResponseModel } from '../../../login/model/index';

@Injectable({
  providedIn: 'root'
})
export class SpendingLimitsService {
  public loginResponse: LoginResponseModel;
  public currentToken: string;
  public result: boolean = false;
  public spendingLimits: any;
  public listReady: boolean;

  constructor(private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private loginStoreSvc:  LoginStoreService
  ) { this.loginResponse = this.loginStoreSvc.cookieStateItem;}

  public getSpendingLimit(loginResponse: LoginResponseModel): Observable<any>{
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
    let failureMessage: string = 'Get Spending limits List Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/SpendingLimit';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url,  options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      ,
      tap(data => console.log("I think we got spendingLimits: ", data))
      )
  }

  public subscribeToGetSpendingLimits(loginResponse) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getSpendingLimit(loginResponseObj)
      .subscribe(
      data => {
        this.spendingLimits = data;
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
          this.listReady = true;

        }
        this.result = true;
      }
      );
    return this.spendingLimits;
  }

  public putSpendingLimits(loginResponse: LoginResponseModel, responses): Observable<any>{
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
    let failureMessage: string = 'Get Orientation List Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/SpendingLimit';  // URL to web API
    let body = responses;
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.put(Url, body, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      ,
      tap(data => console.log("I think we posted spending limits: ", data))
      )
  }

  public subscribeToPutSpendingLimits(loginResponse, responses) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.putSpendingLimits(loginResponseObj, responses)
      .subscribe(
      data => {
        this.spendingLimits = data;
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
          this.listReady = true;

        }
        this.result = true;
      }
      );
    return this.spendingLimits;
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
