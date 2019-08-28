import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService, CookieService, LoginStoreService } from '../../shared/services/index'
import { LoginResponseModel } from '../../login/model/index';

@Injectable({
  providedIn: 'root'
})
export class OrientationService {
  public loginResponse: LoginResponseModel;
  public currentToken: string;
  public listReady: boolean = false;
  public orientationList: any;
  public result: boolean = false;
  public orientationResponse: any;
  public orientationAutoEnrollList: any;

  
  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private loginStoreSvc:  LoginStoreService
  ) { this.loginResponse = this.loginStoreSvc.cookieStateItem;}

  public getOrientationList(loginResponse: LoginResponseModel): Observable<any> {
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

    let Url = Constants.WebApiUrl.Profile + '/Orientation';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      // ,
      // tap(data => console.log("I think we got student orientations: ", data))
      )
  }

  public subscribeToGetOrientation(loginResponse) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getOrientationList(loginResponseObj)
      .subscribe(
      data => {
        this.orientationList = data;
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
    return this.orientationList;
  }

  public postOrientation(loginResponse: LoginResponseModel, responses): Observable<any>{
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

    let Url = Constants.WebApiUrl.Profile + '/Orientation';  // URL to web API
    let body = responses;
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.post(Url, body, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      ,
      tap(data => console.log("I think we posted orientations: ", data))
      )
  }

  public subscribeToPostOrientation(loginResponse, responses) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.postOrientation(loginResponseObj, responses)
      .subscribe(
      data => {
        this.orientationResponse = data;
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
    return this.orientationResponse;
  }

  public getOrientationAutoEnroll(loginResponse: LoginResponseModel): Observable<any> {
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

    let Url = Constants.WebApiUrl.Profile + '/Orientation/AutoEnroll';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      ,
      tap(data => console.log("I think we got student orientations: ", data))
      )
  }

  public subscribeToGetOrientationAutoEnroll(loginResponse) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getOrientationAutoEnroll(loginResponseObj)
      .subscribe(
      data => {
        this.orientationAutoEnrollList = data;
        this.result = true;

      },

      error => {
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
    return this.orientationList;
  }
  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
