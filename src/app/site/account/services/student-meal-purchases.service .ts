import { Pipe, PipeTransform, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { StudentMealPurchaseSearchModel, StudentMealPurchaseModel } from '../meal-purchases/model/index';
import { UtilityService, CurrentTokenService, TokenService } from '../../../shared/services/index'
import { StudentModel } from '../../../registration/model/index';

@Injectable()

export class StudentMealPurchasesService {
  private studentMealPurchaseModel: StudentMealPurchaseModel;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public getStudentMeals$: any;
  public gotMealPurchases: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenService: CurrentTokenService,
    private tokenService: TokenService
  ) { }

  public studentModel: StudentModel;


  private getStudentMealPurchasesNew(studentMealPurchaseSearchModel: StudentMealPurchaseSearchModel, loginResponse: LoginResponseModel): Observable<any> {

    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Get Student Meal Purchases Failed';
    let token = loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);
    this.currTokenService.setCurrentToken(this.currentToken, this.loginResponse);
   // console.log("what is the studentMealPurchaseSearchModel: ", studentMealPurchaseSearchModel.student.accountBalanceId)

    let Url = Constants.WebApiUrl.Profile + '/PurchaseHistory';  // URL to web API
    let body =
    {
      "startDate": studentMealPurchaseSearchModel.startDate.toString(),
      "endDate": studentMealPurchaseSearchModel.endDate.toString(),
      "accountBalanceId": studentMealPurchaseSearchModel.student.accountBalanceId
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    //console.log("The URL: ", Url)
    //console.log("Da Body: ", body)
    //console.log("Headers: ", headers);

    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.utilityService.handleError(error, failureMessage, this.loginResponse))
      ,
      tap(data => this.studentMealPurchaseModel = data)
     )

  }

  public subscribeToGetStudentMealPurchases(studentMealPurchaseSearchModel: StudentMealPurchaseSearchModel, loginResponse: LoginResponseModel) {
    //console.log("Calling subscribeToGetStudentMealPurchases: ", studentMealPurchaseSearchModel)
    let loginResponseObj;
    let failureMessage: string = 'Get Student Meal Purchases Failed';
    //Ensures that we have a loginResponse . If an empty[] loginResponse is passsed then the current global one is used
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }
    this.getStudentMeals$ =
      this.getStudentMealPurchasesNew(studentMealPurchaseSearchModel, loginResponseObj)
        .subscribe(
          data => {
            studentMealPurchaseSearchModel.student = data
          },
          error => {
            this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
            this.result = true;
          },
          () => {
           /// console.log("processing the successful response");

            //Fake filter JSON includes AccountBalanceId
            //studentMealPurchaseSearchModel.student.studentMealPurchases =
            //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
            //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
            //Comment out for fake
            this.result = true;
            this.gotMealPurchases.emit(this.result);
            //this.getStudentMeals$.unsubscribe();
          }
        )
  }
}
