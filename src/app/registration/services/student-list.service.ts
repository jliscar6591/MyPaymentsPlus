import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StudentModel } from '../model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, LoginStoreService } from '../../shared/services/index'

@Injectable()

export class StudentListService {
  //Contains district list
  public students: StudentModel[];
  //Contains parameters to constrain district by state
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public gotStudentList: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private loginStoreSrvc: LoginStoreService
  ) { }

  public getStudentsNew(loginResponse: LoginResponseModel): Observable<any> {
   // console.log("Calling getStudentsNew: ", loginResponse)
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = '';  
    this.currentToken = this.tokenService.getCurrentToken(token);
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Auth + '/Student';  // URL to web API
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

  public subscribeToGetStudentsNew(loginResponse: LoginResponseModel) {
  //  console.log("Does subscribeToGetStudentsNew Have: ", this.loginStoreSrvc.cookieStateItem);
    let loginResponseObj;
    let failureMessage: string = 'No Students to Manage';
 
    if (this.loginStoreSrvc.cookieStateItem) {
      loginResponseObj = this.loginStoreSrvc.cookieStateItem;
    } else {
      loginResponseObj = loginResponse;
    }
    
    this.getStudentsNew(loginResponseObj)
      .subscribe(
      data => {
        this.students = data;
      },
      error => {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        this.result = true;
      },
      () => {

        this.result = true;
        this.gotStudentList.emit(this.result)
      }
      );


  }

  private handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

}
