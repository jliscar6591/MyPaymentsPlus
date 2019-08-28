import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap, first } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { ProfileUserprofileGetModel } from '../meal-purchases/model/index';
import { UtilityService, TokenService, CurrentTokenService } from '../../../shared/services/index';

@Injectable()

export class ProfileUserprofileService {
    //Contains district list
    public profileUserprofileGetModel: ProfileUserprofileGetModel = {
        "firstName": "",
        "lastName": "",
        "email": "",
        "districtName": "",
        "emailUpdates": false,
        "isParent": false,
        "isStudent": false,
        "isStaff": false,
        "isGuest": false
    };
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public getProfileUser$: Subscription;
  public gotProfile$: Observable<boolean>;

    constructor(
        private http: Http,
      private httpC: HttpClient,
      private utilityService: UtilityService,
      private tokenService: TokenService,
      private currTokenServ: CurrentTokenService,
    ) { }


  public getUserprofileNew(loginResponse: LoginResponseModel, failureMessage: string): Observable<any> {
   // let failureMessage: string = 'Get User Profile Failed';
    this.loginResponse = loginResponse;
    // console.log("the login Response: ", this.loginResponse);
    let token = this.loginResponse.access_token;
    // console.log("What is the getPaymentMethodsNew token: ", token)

    this.currentToken = this.tokenService.getCurrentToken(token);

    let Url = Constants.WebApiUrl.Profile + '/UserProfile';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
         // ,
         //tap(data => console.log("I think we got a Profile: ", data))
      )


  }

  public subscribeToGetUserProfile(loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Get User Profile Failed';

    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getProfileUser$ = this.getUserprofileNew(loginResponseObj, failureMessage)
      .subscribe(
        data => {
          this.profileUserprofileGetModel = data
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response

          this.result = true;
          this.gotProfile$ = new Observable(observer => {
            observer.next(true);
            observer.complete();
          });
          this.gotProfile$.pipe(
            first(data => data == true)
          );
         // this.getProfileUser$.unsubscribe();

        }
      );
    

  }
}
