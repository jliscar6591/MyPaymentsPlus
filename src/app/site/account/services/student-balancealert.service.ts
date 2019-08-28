import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { StudentBalanceAlertModel, StudentBalanceAlertInputModel } from '../meal-purchases/model/index';
import { UtilityService, LoginStoreService } from '../../../shared/services/index';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable()

export class StudentBalanceAlertService {    
    public studentBalanceAlerts: any;
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

    constructor(
      private http: Http,
      private httpC: HttpClient,
      public loginStoreSrvc: LoginStoreService,
        private utilityService: UtilityService
    ) { }

    // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to get Balance Alerts of the students.
  public getStudentBalnaceAlertsNew(loginResponse: LoginResponseModel) {
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;

    let successMessage: string = 'Successful';
    let failureMessage: string = 'Failed to get Student Balance Alerts';

    this.loginResponse = loginResponse;

    let Url = Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        // ,
        // tap(data => console.log("I think we got students: ", data))
      )
  }

  public subscribeToGetStudentBlanaceAlertsNew(loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'No Students to Manage';

    if (this.loginStoreSrvc.cookieStateItem) {
      loginResponseObj = this.loginStoreSrvc.cookieStateItem;
    } else {
      loginResponseObj = loginResponse;
    }
    this.getStudentBalnaceAlertsNew(loginResponseObj)
      .subscribe(
      data => {
        this.studentBalanceAlerts = data;
      },
      error => {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        this.result = true;
      },
      () => {
        //processing the successful response
        this.result = true;
      });
  }

  private handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

    public getStudentBalanceAlerts(loginResponse: LoginResponseModel): Observable<number> {
        let newJwt: any;
        let token = loginResponse.access_token;
        this.loginResponse = loginResponse;

        let successMessage: string = 'Successful';
        let failureMessage: string = 'Failed to get Student Balance Alerts';

        this.loginResponse = loginResponse;

        let Url = Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration';  // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(Url, options)       
            .subscribe(
            data => {
                this.studentBalanceAlerts = data.json();
                newJwt = data.headers.toJSON();     
            },
            error => {
                this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response
                this.loginResponse.access_token = newJwt.jwt_refresh[0];
                this.result = true;               
            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }

     // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to save Balance Alerts of the students.
    public saveStudentBalanceAlerts(studentAlertInputs: StudentBalanceAlertInputModel[], loginResponse: LoginResponseModel): Observable<number> {
        let newJwt: any;

        let successMessage: string = 'Successfully Updated Student Alert Level';
        let failureMessage: string = 'Failed to Update Student Alert Level';

        let Url = Constants.WebApiUrl.Profile + '/LowBalanceNotificationConfiguration';  // URL to web API
        let body = JSON.stringify(studentAlertInputs);
        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);

        let options = new RequestOptions({ headers: headers });

        this.loginResponse = loginResponse;

        this.http.put(Url, body, options)
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
                this.getStudentBalanceAlerts(this.loginResponse);                
                this.result = true;

            });       
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
