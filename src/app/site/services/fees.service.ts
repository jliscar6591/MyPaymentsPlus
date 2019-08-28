import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService, CookieService } from '../../shared/services/index'
import { LoginResponseModel } from '../../login/model/index';
import { FeesList, FeeItems } from '../model/index';

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  public feesList: FeesList[];
  public fees: FeeItems[];
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  public isStudentsGetting: boolean;
  public getStudentErr: boolean;
  public getStudentErrMsg: string;
  public count: number = 0;
  public currentToken: string;
  public listReady: boolean = false;

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
  ) { }

  public getFeesList(loginResponse: LoginResponseModel): Observable<any> {
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
    let failureMessage: string = 'Get Fees List Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/StudentFee';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      //,
      //tap(data => console.log("I think we got student fees: ", data))
      )
  }

  public subscribeToGetFees(loginResponse) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getFeesList(loginResponseObj)
      .subscribe(
      data => {
        this.feesList = data;
        this.result = true;

      },

      error => {
      //  console.log("Error: No Fees: ", this.feesList)
        this.result = false;
      }
      ,
      () => {
        if (this.result == false) {
          this.isStudentsGetting = false;
          this.getStudentErr = true;
          this.getStudentErrMsg = this.loginResponse.message;
        } else {
          this.listReady = true;

        }
        this.result = true;
      }
      );
    return this.feesList;
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

}



