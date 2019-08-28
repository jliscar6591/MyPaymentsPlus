import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as _throw } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { DistrictModel, DistrictList } from '../../shared/model/index';
import { UserContextModel } from '../../site/account/meal-purchases/model/index';
import { LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService } from '../../shared/services/index';


@Injectable()
export class MultiDistrictService {
  public newDistrictSelected: boolean;
  public loginResponse: LoginResponseModel;
  public UserContextModel: UserContextModel;
  public userData: UserContextModel;
  public currentToken: string;
  public districList: any;
  public districtItem: any;
  public result: boolean = false;
  public multiDistrictFlag: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public upDatePaymentMethod$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public shouldUpdate: boolean = false;
  public updateAutoPay: boolean = false;
  public autoPayCounter: number = 0;
  public originalToken: string;
  public processedDistrict: any;
  public didSwitchDistrict: EventEmitter<boolean> = new EventEmitter<boolean>();
  public accountLoginResponse: LoginResponseModel;
  public currentDistrict: string;
  public multiDistrictRefreshCntr: number = 0;

  constructor(private http: Http,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private utilityService: UtilityService
  ) { }





  refreshDistrict(districtObj: DistrictModel, loginResponse) {
    this.getNewDistrictData();
  }

  getNewDistrictData() {
     console.log("Calling Get New District");

    return this.newDistrictSelected = true;
  }

  getDistricts(loginResponse): Observable<any> {
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
    let failureMessage: string = 'Failed to get Available Districts';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/UserContext'; // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };



    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        // ,
        // tap(data => console.log("I think we got students: ", data))

      )

  }

  subscribeToGetDistricts(loginResponse): Observable<any> {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }
    // console.log("What is destroy$: ", this.destroy$)
    if (this.destroy$.closed == false) {
      this.getDistricts(loginResponseObj)
        .takeUntil(this.destroy$)
        .subscribe(
          data => {
            this.userData = data;
            this.result = true;
          },
          error => {
            console.log("Error: No Districts Found");
            this.result = false;
          },
          () => {
            if (this.result == true) {

              // console.log("What do you want to do with this Context: ", this.userData.availableDistricts);
              // this.districtItem = this.userData.availableDistricts;
              this.districList = this.userData.availableDistricts;
              this.isMultiDistrict(this.districList);
              this.originalToken = this.loginResponse.access_token;
              // console.log("Do we have the original token here: ", this.originalToken);
              this.destroy$.next(true);
              this.destroy$.unsubscribe();
            }
          }
        );
    }




    //this.districList = [];
    return this.districList
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

  public isMultiDistrict(districtList): boolean {
    //console.log("What is the districtObjLength: ", districtList.length);
    if (districtList.length > 1) {

      this.multiDistrictFlag = true;
    } else {
      //console.log("I amNOT multiddistrict");
      this.multiDistrictFlag = false;
      //For Development only
      //this.multiDistrictFlag = true;

    }

    return this.multiDistrictFlag;
  }

  /*This service will be used to notify components when there has been a userContext change
  * Which will require the component to update itsself with the new selected district values
  * */
  public paymentMethodsUpdate() {
    //console.log("Payment Methods Need Updatin")
    this.shouldUpdate = true;
    this.updateAutoPay = true;
    this.upDatePaymentMethod$.emit(this.shouldUpdate);

  }

}
