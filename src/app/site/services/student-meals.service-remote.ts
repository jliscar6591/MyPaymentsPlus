import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap, first } from 'rxjs/operators';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StudentMeal } from '../model/index';
import { UtilityService, CurrentTokenService, TokenService, LoginStoreService } from '../../shared/services/index';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as MealStoreActions from '../../shared/store/actions/mealStore.actions';


@Injectable()

export class StudentMealsServiceRemote {
  //Contains district list
  public studentMeals: any;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  public isStudentsRemoteGetting: boolean;
  public weGotStudents: EventEmitter<boolean> = new EventEmitter<boolean>();
  public listReady: boolean = false;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public getMealsErr: boolean;
  public studentMealsSub$: Subscription;
  public formCompleted: Observable<boolean>;
  public mealsCompleted: Observable<boolean>;
  

  constructor(
      private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
      private tokenService: TokenService,
    private loginStoreSvc: LoginStoreService,
    public store: Store<AppState>,
    //private state: State<AppState>,
  ) { this.mealStore = store.select(state => state.mealStore) }


  public getRemoteStudentMeals(loginResponse: LoginResponseModel): Observable<any> {
    //console.log("Calling Student Remote: ", loginResponse);
    //console.log("Calling Student Remote Access: ", loginResponse.access_token);
    //console.log("Do we have a loginStore val: ", this.loginStoreSvc.cookieStateItem)

    let token: any;
    //  let tempLoginResponse: LoginResponseModel;

    if (this.loginStoreSvc.cookieStateItem) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
      token = this.loginResponse.access_token;
    } else {
      this.loginResponse = loginResponse;
      token = this.loginResponse.access_token;
    }


    // console.log("getRemoteStudentMeals After access_Token added: ", this.loginResponse)

      //  console.log("What is the getRemoteStudentMeals token: ", token)
    this.currentToken = this.tokenService.getCurrentToken(token);
    //  console.log("CurrentToken After getRemoteStudentMeals tokenService: ", this.currentToken);


    let failureMessage: string = 'Get Student Meals Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    //console.log("Login Response before APICall: ", this.loginResponse)



    let Url = Constants.WebApiUrl.Profile + '/CafeteriaAccounts/GetRemote';  // URL to web API
    let  headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };

    //console.log("Url: ", Url);
    //console.log("Options: ", options);


    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        ,
        tap(data => this.studentMeals = data)
      )

  }


  public subscribeToGetMeals(loginResponse) {
     //console.log("subscribeToGetMeals: ", loginResponse)
    this.isStudentsRemoteGetting = true;
     if (this.loginStoreSvc.cookieStateItem) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;

    } else {
      this.loginResponse = loginResponse;
      //this.loginResponse;
    }

    // console.log("What is the getMeals loginResponseObj: ", this.loginResponse)
    this.studentMealsSub$ =
    this.getRemoteStudentMeals(this.loginResponse)
      .subscribe(
        data => {
          //  console.log("Returned Data: ", data)
          this.studentMeals = data;
          this.result = true;
        },
        error => {
          console.log("Error: No Meals: ", this.studentMeals);
          this.result = false;
        }
        ,
        () => {
          if (this.utilityService.posCommError) {
          //  console.log("We got a commError: ", this.loginResponse)
            this.getMealsErr = this.utilityService.posCommError;
            //  console.log("What is getMealsErr: ", this.getMealsErr)
          }
          //console.log("Did we get Meals: ", this.studentMeals);
          if (this.result == false) {
            this.isStudentsRemoteGetting = false;
          } else {

            this.weGotStudents.emit(true);
              //console.log("WeGotStudents: ", this.studentMeals);
            this.isStudentsRemoteGetting = this.studentMeals.length > 0;
            this.loginStoreSvc.loadLogin(this.loginResponse)
            let tempMeals: any = this.studentMeals;
           //  console.log("What is tempMeals: ", tempMeals)
            this.store.dispatch(new MealStoreActions.ClearMeals());
            this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
            
           // console.log("Calling this.formCompleted ")
            this.formCompleted = new Observable(observer => {
              observer.next(true);
              observer.complete();
            });
            this.formCompleted.pipe(
              first(data => data == true)
            );

          }

        
        

         this.studentMealsSub$.unsubscribe();
        }
      );
    return this.studentMeals;

  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }


}
