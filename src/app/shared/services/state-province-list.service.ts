import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from '../../shared/services/utility.service';
import { LoginStoreService } from '../../shared/services/login-store.service';
//Local
import { catchError, map, tap } from 'rxjs/operators';
//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StateProvinceModel } from '../../shared/model/index';


@Injectable()

export class StateProvinceListService {
    //Contains district list
    public stateProvinceList: StateProvinceModel[];
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

    constructor(
      private http: Http,
      private httpC: HttpClient,
      private loginStoreSvc: LoginStoreService,
      private utilityService: UtilityService,
  ) { this.loginResponse = this.loginStoreSvc.cookieStateItem; }

  public getStateNew(loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = '';

    this.loginResponse = loginResponse;

   return this.http.request("/assets/data/state-province.data.json")
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
        //  ,
        // tap(data => console.log("I think we got a Payment Methods: ", data))
      )
  }

  public subscribeToGetStateNew(loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';

    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getStateNew(loginResponseObj)
      .subscribe(
      data => {
        this.stateProvinceList = data.json();
      },
      error => {
        this.utilityService.processApiErr(error, loginResponseObj, failureMessage)
      },
      () => {
        this.result = true;
      }
      )
  }

    public getState(loginResponse: LoginResponseModel): Observable<number> {
        let successMessage: string = '';
        let failureMessage: string = '';

        this.loginResponse = loginResponse;

        this.http.request("/assets/data/state-province.data.json")
            .subscribe(
            data => { this.stateProvinceList = data.json() },
            error => {
                this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
