import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { UtilityService } from '../../shared/services/utility.service';
import { LoginStoreService } from '../../shared/services/login-store.service';


import { Router, ActivatedRoute } from '@angular/router';

//Local
import { Constants } from '../../app.settings';
import { LoginModel, LoginResponseModel } from '../../login/model/index';

@Injectable()

export class AuthenticationService {
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;


  constructor(
          private http: Http,
          private httpC: HttpClient,
    private utilityService: UtilityService,
    private loginStoreService: LoginStoreService
   
  ) {
    this.loginResponse = new LoginResponseModel();
  }

  private authenticateNew(loginDetail: LoginModel): Observable<any> {
    this.result = false;
    let loginUrl = Constants.WebApiUrl.Auth + '/login';  // URL to web API
    let body = JSON.stringify(loginDetail);
    let headers = new HttpHeaders({ 'Content-Type': 'application/JSON' });
    let count: number = 0;
    let options = { headers: headers };
    let failureMessage: string = 'Login Failed';

    //console.log("The loginUrl: ", loginUrl)
    //console.log("Da Body: ", body)
    //console.log("Da Header: ", options)

    return this.httpC.post(loginUrl, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //,
      // tap(data => console.log("I think we got a Login Object: ", data))
      )
  }

  public subscribeToAuthenticate(loginDetail: LoginModel, loginResponse: LoginResponseModel) {
    this.authenticateNew(loginDetail)
      .subscribe(
          data => {
            this.loginResponse = data;
            //console.log("What is the data loginResponse: ", this.loginResponse)
            this.result = true;
          },
        error => {
          this.loginResponse = loginResponse;
          if (error["status"]) {
            //console.log("Do we have a login Error: ", error["status"]);
            if (error["status"] != '500') {
              this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
            } else {
              this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
            }
          } else {
            this.loginResponse.message = "Invalid credentials. Please try again or click Forgot Password above.";
          }
          this.loginResponse.showCloseButton = true;
          this.loginResponse.closeHtml = '<button>Close</button>';
          this.loginResponse.messageType = Constants.Error;
          this.loginResponse.messageTitle = 'Message: ';
          this.result = true;
        },
        () => {
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.message = '';
          this.loginResponse.externalNavRequest = loginResponse.externalNavRequest;
          this.loginResponse.cartItemCount = 0;
         // console.log("Did we get a LoginResponse: ", this.loginResponse)
                    
        }
      )
  }

  public refreshAccessToken(newToken, currToken, currLoginResp) {
      this.loginResponse = currLoginResp;
  //  console.log("What is the refreshAccessToken - this.loginResp: ", this.loginResponse)
 //   console.log("Do we have a cookieStateItem: ", this.loginStoreService.cookieStateItem)
    if (this.loginResponse.cartItemCount > 0) {
    //  console.log("I got ONE: ", this.loginResponse.cartItemCount)
    } else {
      //console.log("WE GOT Nuttin: ", this.loginResponse.cartItemCount)
    }
    if (newToken) {
       if (currToken == newToken) {
         this.loginResponse.access_token = currToken;
       } else {
         this.loginResponse.access_token = newToken;
       }
    }

    this.loginStoreService.loadLogin(this.loginResponse);
    //this.loginStoreService.loadLogin(this.loginResponse);
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

}
