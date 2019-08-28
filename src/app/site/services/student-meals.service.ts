import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StudentMeal } from '../model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, ValidateCookieService, LoginStoreService } from '../../shared/services/index';
import { SuspendPaymentWarningService } from '../../shared/components/suspend-payment-warning/suspend-payment-warning.service';
import { error } from '@angular/compiler/src/util';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as MealStoreActions from '../../shared/store/actions/mealStore.actions';

@Injectable()

export class StudentMealsService {
  //Contains district list
  public studentMeals:any;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public isStudentsGetting: boolean;
  public getStudentErr: boolean;
  public getStudentErrMsg: string;
  public isStudents: boolean;
  public weGotStudents: EventEmitter<boolean> = new EventEmitter<boolean>();
  public needGetStudents: EventEmitter<boolean> = new EventEmitter<boolean>();
  public listReady: boolean = false;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private suspendPaymentWarningService: SuspendPaymentWarningService,
    private tokenService: TokenService,
    private validateCookieService: ValidateCookieService,
    public store: Store<AppState>,
    private state: State<AppState>,
    private loginStoreSvc: LoginStoreService
  ) { this.mealStore = store.select(state => state.mealStore) }



  public getStudentMealsNew(loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
   // console.log("Login Response B4 TokenService: ", this.loginResponse)
    let token = this.loginResponse.access_token;
   // console.log("What is the token: ", token)
    this.currentToken = this.tokenService.getCurrentToken(token);
   // console.log("CurrentToken After tokenService: ", this.currentToken);

   

    let successMessage: string = '';
    let failureMessage: string = 'Get Student Meals Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Profile + '/CafeteriaAccounts';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
   // console.log("Url: ", Url);
   // console.log("Options: ", options);


    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
     // ,
   //  tap(data => console.log("I think we got students: ", data))

      )

  }

  public subscribeToGetMeals(loginResponse) {
 //  console.log("subscribeToGetMeals:  ", this.loginStoreSvc.cookieStateItem)
    let newMealsList;
    let loginResponseObj;
    this.isStudentsGetting = true;
    let accountsWCrtAmtList: any = [];
    if (this.loginStoreSvc.cookieStateItem) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
    } else {
      this.loginResponse = loginResponse;
    }

   // console.log("B4 getStudentMealsNew: ", this.loginResponse)
    this.getStudentMealsNew(this.loginResponse)
      .subscribe(
      data => {
        this.studentMeals = data;
        this.result = true;
      },
      error => {
        console.log("Error: No Meals: ", this.studentMeals);
        this.result = false;
      }
      ,
      () => {
       // console.log("The result: ", this.result)
          if (this.result == false) {
            this.isStudentsGetting = false;
            this.getStudentErr = true;
            this.getStudentErrMsg = this.loginResponse.message;
          } else {
            this.weGotStudents.emit(true);
            this.needGetStudents.emit(true);
            this.studentMeals = this.formatStudentMeals(this.studentMeals);
            this.listReady = true;
            this.isStudents = this.studentMeals.length > 0;
          //  console.log("Creating a cookie: ", this.loginResponse)
            this.loginStoreSvc.loadLogin(this.loginResponse);

            
            let tempMeals: any = this.studentMeals;
           // console.log("Student Meals Refreshing Store: ", tempMeals)
            this.store.dispatch(new MealStoreActions.ClearMeals());
            this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals))
          }
      }
      );
    return this.studentMeals;
  }

  getSuspendPayment(): boolean {
    let issupended: boolean;
    let warning: boolean = false;
    let warningMsg: string = '';

    if (this.loginResponse.isBlockPayments) {
      warningMsg += `Payments are disabled for this account.`;
      warning = true;
    }
    else if (this.loginResponse.allPaymentsSuspended) {
      warningMsg += `All payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate + '.';
      warning = true;
    } else if (this.loginResponse.mealPaymentsSuspended) {
      warningMsg += `Meal payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate + '.';
      warning = true;
    } else if (this.loginResponse.isDisableMealPaymentsDistrict) {
      warningMsg += 'Meal payments are disabled at your district.';
      warning = true;
    }
    issupended = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
    return issupended;

  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

  //Converts list to an array
  public formatStudentMeals(studentMeals): any {
    let studentMealsList = [];
    let accountBal;
    for (var i = 0; i < studentMeals.length; i++) {
      var testKey = Object.keys(studentMeals[0]);
      var b = Object.keys(studentMeals).map(e => { return { accounts: studentMeals[e] } });
      studentMealsList.push(b[i].accounts);

    }
    return studentMealsList;
  }

  public setStudentMeals(studentlist) {
    this.studentMeals = studentlist;
  }

}
