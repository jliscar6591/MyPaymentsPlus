import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StudentAddDetailModel } from '../model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, LoginStoreService } from '../../shared/services/index';



@Injectable()

export class StudentAddService {
  //Contains values to send to the api
  public studentAddDetail: StudentAddDetailModel;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public isDeleted: boolean = false;
  public addStudentResult: boolean = false;
  public studentAdded$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public addStudentSubscription: any;


  constructor(private http: Http,
    private httpC: HttpClient,
    private utilityService: UtilityService,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private loginStoreSrvc:  LoginStoreService
  ) { }



  private addStudentNew(studentAddDetail: StudentAddDetailModel, loginResponse: LoginResponseModel): Observable<any> {
   // console.log("What is LoginResponse: ", loginResponse)
    let successMessage: string = '';
    let failureMessage: string = 'Failed to add student';
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Auth + '/user';  // URL to web API
    let body = JSON.stringify(studentAddDetail).replace(/"\s+|\s+"/g, '"');

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    return this.httpC.put(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       // ,
       // tap(data => console.log("I think We Added a student: ", data)),
      )
  }




  public subscribeToAddStudentNew(studentAddDetail: StudentAddDetailModel, loginResponse: LoginResponseModel) {
    let loginResponseObj = loginResponse;
    let failureMessage: string = 'Failed To Add Student';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.addStudentNew(studentAddDetail, loginResponseObj)
      .subscribe(
        data => {
          this.result = true;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = false;
        },
        () => {
          //processing the successful response
          this.result = true;
          this.addStudentResult = this.result;
          this.studentAdded$.emit(this.addStudentResult);
        }
      );
  }


  public deleteStudentNew(accountBalanceId: string, loginResponse: LoginResponseModel): Observable<any> {
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    this.currentToken = token;
    let successMessage: string = '';
    let failureMessage: string = 'Failed To Remove Student';


    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
      this.currentToken.trim();
    }

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Auth + '/student/' + accountBalanceId;  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    //  console.log("What is the url: ", Url);

    //console.log("Jwt: ", this.currentToken);

    // console.log("What are the headers: ", options);


    return this.httpC.delete(Url, options)

      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //  ,
        // tap(data => console.log("I think We Deleted students: ", data)),

      )
  }


  public subscribeToDeleteStudent(accountBalanceId: string, loginResponse: LoginResponseModel) {
    //console.log("What is isDelted: ", this.isDeleted);
    let loginResponseObj;
    if (this.loginStoreSrvc.cookieStateItem) {
      loginResponseObj = this.loginStoreSrvc.cookieStateItem;
    } else {
      loginResponseObj = loginResponse;
    }
    let resp: any;
    let failureMessage: string = 'Failed To Remove Student';
    this.deleteStudentNew(accountBalanceId, loginResponseObj)
      .subscribe(
        data => {
          resp = data;

        },
        error => {
          console.log(" " + failureMessage + ":", resp);
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = false;
        },
        () => {
          this.result = true;
          this.isDeleted = (this.result)?  true : false;
          this.loginStoreSrvc.loadLogin(this.loginResponse)
        }
      );
  }

  private handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
} 
