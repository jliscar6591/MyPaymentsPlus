import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from '../../shared/services/utility.service';
import { LoginStoreService } from '../../shared/services/login-store.service';
//Local
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { DistrictModel, DistrictViewModel } from '../../shared/model/index';

@Injectable()

export class DistrictListService {
  //Contains district list
  public districtList: any;
  //Contains parameters to constrain district by state
  public districtViewModel: any;
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

  public getDistrictNew(districtViewModel: any, loginResponse: LoginResponseModel) {
    let successMessage: string = '';
    let failureMessage: string = '';
    let token = loginResponse.access_token;
    let Url = Constants.WebApiUrl.Auth + '/DistrictList/' + districtViewModel.stateId;  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        ,
        tap(data => this.districtList = data
        )

      )
  }

  public subscribeToGetDistrictNew(districtViewModel: any, loginResponse: LoginResponseModel) {
    let loginResponseObj;
    let failureMessage: string = 'Updating District Failed';

    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getDistrictNew(districtViewModel, loginResponseObj)
      .subscribe(
        data => {
          this.districtList = data;
        },
        error => {
          this.utilityService.processApiErr(error, loginResponseObj, failureMessage)
        },
      () => {
        console.log(this.districtList);
          this.result = true;
        })
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

  public getDistrict(districtViewModel: DistrictViewModel, loginResponse: LoginResponseModel): Observable<number> {
    // console.log(districtViewModel)
    //  console.log(loginResponse)
    let successMessage: string = '';
    let failureMessage: string = '';

    let Url = Constants.WebApiUrl.Auth + '/DistrictList/' + districtViewModel.stateId;  // URL to web API
    let headers = new Headers({ 'Content-Type': 'application/JSON' });

    let options = new RequestOptions({ headers: headers });

    this.loginResponse = loginResponse;

    this.http.get(Url, options)
      .subscribe(
        data => { this.districtList = data.json() },
        error => {
          if (error["status"]) {
            this.loginResponse.status = error["status"];
            if (error["status"] != '500') {
              this.loginResponse.message = failureMessage;
            } else {
              this.loginResponse.message = failureMessage;
            }
          } else {
            this.loginResponse.message = failureMessage;
          }

          this.loginResponse.showCloseButton = true;
          this.loginResponse.messageType = Constants.Error;
          this.loginResponse.messageTitle = 'Message: ';
          this.result = true;
        },
        () => {
          //processing the successful response
          this.result = true;

        });
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval);

  }
}
