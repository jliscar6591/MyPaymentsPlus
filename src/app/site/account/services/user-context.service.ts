import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable,  pipe } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel, LoginModel } from '../../../login/model/index';
import { UserContextModel } from '../meal-purchases/model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, ValidateCookieService, LoginStoreService} from '../../../shared/services/index';

@Injectable()


export class UserContextService {

    public defaultData: UserContextModel;

    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public newLoginResponse: LoginResponseModel;
  public newToken: string;
  public newTokenResults: boolean = false;
  public gotNewUserContext$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public callUserCntxtCnt: number;
  
    constructor(private cookieService: CookieService,
      private utilityService: UtilityService,
      private http: Http,
      private HttpC: HttpClient,
      private currTokenServ: CurrentTokenService,
      private tokenService: TokenService,
      private loginStoreSrvc: LoginStoreService
    ) { }



    //Get the default district  and state for the current logged in user
    public deriveDefaults(loginResponse: LoginResponseModel): Observable<number> {
        let newJwt: any;
        let token = loginResponse.access_token;
        let successMessage: string = '';
        let failureMessage: string = 'Failed to get deriveDefaults';

        let Url = Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(Url, options)
            .subscribe(
            data => {
                this.defaultData = data.json();
                newJwt = data.headers.toJSON(); 
                this.result = true;
            },
            error => {
                this.utilityService.processApiErr(error, loginResponse, failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response
                loginResponse.access_token = newJwt.jwt_refresh[0];
                //test
                //loginResponse.isBlockACH = true;
                //this.defaultData.isFroEnabled = false;
                //

                loginResponse.allPaymentsResumeDate = this.defaultData.allPaymentsResumeDate;//add
                loginResponse.allPaymentsSuspended = this.defaultData.allPaymentsSuspended//add
                loginResponse.cartItemCount = this.defaultData.cartItemCount;
                loginResponse.districtKey = this.defaultData.districtKey;
                loginResponse.districtName = this.defaultData.districtName;//add
                loginResponse.expires_in = this.defaultData.expires_in;//add
                loginResponse.firstName = this.defaultData.firstName;//add
                loginResponse.incidentId = this.defaultData.incidentId;//add
                loginResponse.isAchAllowed = this.defaultData.isAchAllowed;
                loginResponse.isAlertsAllowedDistrict = this.defaultData.isAlertsAllowedDistrict;
                loginResponse.isAutoPayEnabled = this.defaultData.isAutoPayEnabled;
                loginResponse.isBlockACH = this.defaultData.isBlockACH;
                loginResponse.isBlockPayments = this.defaultData.isBlockPayments;
                loginResponse.isDisableMealPaymentsDistrict = this.defaultData.isDisableMealPaymentsDistrict;
                loginResponse.isNewExperience = this.defaultData.isNewExperience;
                loginResponse.lastName = this.defaultData.lastName;
                loginResponse.mealPaymentsResumeDate = this.defaultData.mealPaymentsResumeDate;//add
                loginResponse.mealPaymentsSuspended = this.defaultData.mealPaymentsSuspended;//add
                loginResponse.requiresRelationship = this.defaultData.requiresRelationship;//add
                loginResponse.requiresStudent = this.defaultData.requiresStudent;//add
                loginResponse.state = this.defaultData.state;
                loginResponse.isFroEnabled = this.defaultData.isFroEnabled;
                loginResponse.isOldExperienceAllowed = this.defaultData.isOldExperienceAllowed;
              

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval);

  }

  public deriveDefaultsNew(loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Failed to get deriveDefaults';
    let token = loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);

    let Url = Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

   // console.log("The URL: ", Url)
  //  console.log("the options: ", options)


    return this.HttpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse ))
       // ,
      //  tap(data => console.log("Called By subscribeToGetDeriveDefaults: ", data))
      )
  }


  public subscribeToGetDeriveDefaultsNew(loginResponse: LoginResponseModel) {
    //console.log("subscribeToGetDeriveDefaultsNew")
    let failureMessage: string = 'Failed to get deriveDefaults';
    let loginResponseObj;
      if (loginResponse) {
        loginResponseObj = loginResponse;
      } else {
        loginResponseObj = this.loginResponse;
      }

    this.deriveDefaultsNew(loginResponseObj)
    .subscribe(
      data => {
        this.defaultData = data;
       this.result = true;
      },
      error => {
        this.utilityService.processApiErr(error, loginResponse, failureMessage);
        this.result = true;
      },
      () => {
        //processing the successful response      

        loginResponse.allPaymentsResumeDate = this.defaultData.allPaymentsResumeDate;//add
        loginResponse.allPaymentsSuspended = this.defaultData.allPaymentsSuspended//add
        //console.log('cartitemCount', this.defaultData.cartItemCount);
        loginResponse.cartItemCount = this.defaultData.cartItemCount;
        loginResponse.districtKey = this.defaultData.districtKey;
        loginResponse.districtName = this.defaultData.districtName;//add
        loginResponse.expires_in = this.defaultData.expires_in;//add
        loginResponse.firstName = this.defaultData.firstName;//add
        loginResponse.incidentId = this.defaultData.incidentId;//add
        loginResponse.isAchAllowed = this.defaultData.isAchAllowed;
        loginResponse.isAlertsAllowedDistrict = this.defaultData.isAlertsAllowedDistrict;
        loginResponse.isAutoPayEnabled = this.defaultData.isAutoPayEnabled;
        loginResponse.isBlockACH = this.defaultData.isBlockACH;
        loginResponse.isBlockPayments = this.defaultData.isBlockPayments;
        loginResponse.isDisableMealPaymentsDistrict = this.defaultData.isDisableMealPaymentsDistrict;
        loginResponse.isNewExperience = this.defaultData.isNewExperience;
        loginResponse.lastName = this.defaultData.lastName;
        loginResponse.mealPaymentsResumeDate = this.defaultData.mealPaymentsResumeDate;//add
        loginResponse.mealPaymentsSuspended = this.defaultData.mealPaymentsSuspended;//add
        loginResponse.requiresRelationship = this.defaultData.requiresRelationship;//add
        loginResponse.requiresStudent = this.defaultData.requiresStudent;//add
        loginResponse.state = this.defaultData.state;
        loginResponse.isFroEnabled = this.defaultData.isFroEnabled;
        loginResponse.isOldExperienceAllowed = this.defaultData.isOldExperienceAllowed;


      });
     
  }

  public postNewUserContext(districtKey: string, loginResponse: LoginResponseModel): Observable <any> {
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Failed to get deriveDefaults';
    let token = loginResponse.access_token;
   // console.log("postNewUserContext loginResponse: ", this.loginResponse)
    this.currentToken = this.tokenService.getCurrentToken(token);
    let Url = Constants.WebApiUrl.Profile + '/UserContext/' + districtKey;
    let body = [{ }]
   // JSON.stringify(cartItemDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    //Used to inspect whats being sent to the api call while troubleshooting
    //console.log("The Url: ", Url);
    //console.log("Da Body: ", body)
    //console.log("Options: ", options)
    return this.HttpC.put(Url, body, options)
      .pipe(
      catchError((error: any) => this.utilityService.handleError(error, this.loginResponse, failureMessage))
      //  ,
     //  tap((data:any)=> console.log("We got New UserContext: ", data))
      )

  }

  public subscribeToPostNewUserContext(districtObj: any, loginResponse: LoginResponseModel) {
 // console.log("calling subscribeToPostNewUserContext: ", districtObj)
    let districtKey = districtObj[0].districtKey;
   // console.log("What is the loginResponse: ", loginResponse)
    let failureMessage: string = 'Failed to get New User Credentials';
    let loginModelObj: any;

    this.postNewUserContext(districtKey, loginResponse)
      .subscribe(
        data => {
         // this.newLoginResponse = data;
   
         
          loginModelObj = data.apiUserContext;
         // console.log("did we get a loginModelObj: ", loginModelObj)
          this.newToken = data.jwt;
          this.newTokenResults = true;
        },
      error => {
        this.utilityService.processApiErr(error, loginResponse, failureMessage);
        this.newTokenResults = true;
      },
      () => {
        loginResponse.access_token = this.newToken;
        loginResponse.allPaymentsResumeDate = loginModelObj.allPaymentsResumeDate;//add
        loginResponse.allPaymentsSuspended = loginModelObj.allPaymentsSuspended//add
        loginResponse.cartItemCount = loginModelObj.cartItemCount;
        loginResponse.districtKey = loginModelObj.districtKey;
        loginResponse.districtName = loginModelObj.districtName;//add
        loginResponse.expires_in = loginModelObj.expires_in;//add
        loginResponse.firstName = loginModelObj.firstName;//add
        loginResponse.incidentId = loginModelObj.incidentId;//add
        loginResponse.isAchAllowed = loginModelObj.isAchAllowed;
        loginResponse.isAlertsAllowedDistrict = loginModelObj.isAlertsAllowedDistrict;
        loginResponse.isAutoPayEnabled = loginModelObj.isAutoPayEnabled;
        loginResponse.isBlockACH = loginModelObj.isBlockACH;
        loginResponse.isBlockPayments = loginModelObj.isBlockPayments;
        loginResponse.isDisableMealPaymentsDistrict = loginModelObj.isDisableMealPaymentsDistrict;
        loginResponse.isNewExperience = loginModelObj.isNewExperience;
        loginResponse.lastName = loginModelObj.lastName;
        loginResponse.mealPaymentsResumeDate = loginModelObj.mealPaymentsResumeDate;//add
        loginResponse.mealPaymentsSuspended = loginModelObj.mealPaymentsSuspended;//add
        loginResponse.requiresRelationship = loginModelObj.requiresRelationship;//add
        loginResponse.requiresStudent = loginModelObj.requiresStudent;//add
        loginResponse.state = loginModelObj.state;
        loginResponse.isFroEnabled = loginModelObj.isFroEnabled;
        loginResponse.isOldExperienceAllowed = loginModelObj.isOldExperienceAllowed;

        this.newLoginResponse = loginResponse;
    // console.log("We got a New LoginResponse: ", this.newLoginResponse)
       
      
        //console.log("What is the New UserContext LoginResponse: ", this.loginResponse);
        //console.log("Do we have default Data: ", this.defaultData);
        let testDefaultData: any = this.defaultData;
        if (testDefaultData) {
        //  console.log("The testDefaultDate: ", testDefaultData)
          testDefaultData.districtKey = this.newLoginResponse.districtKey;
          testDefaultData.districtName = this.newLoginResponse.districtName;
          this.loginStoreSrvc.createLoginObj(testDefaultData, this.newLoginResponse);
        }

       // console.log("Creating a cookie: ", this.newLoginResponse)

        this.loginStoreSrvc.loadLogin(this.newLoginResponse)

        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        
        this.callUserCntxtCnt = 0;
       //Tells app we got a new token now call api's using the new Token
        this.gotNewUserContext$.emit(this.newTokenResults);
       
      }

      )
  }


  private handleError(error, failureMessage) {
    //console.log("R we handling an error: ", error)
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
   // console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
