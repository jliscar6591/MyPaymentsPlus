import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as LoginStoreActions from '../../shared/store/actions/loginStore.actions';
import { LoginStoreModel } from '../../shared/store/model/login-store.model';
import { useAnimation } from '@angular/animations';
import { LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import * as CookieStoreActions from '../../shared/store/actions/cookieStore.actions';
import { window } from 'rxjs-compat/operator/window';
import { Window } from 'selenium-webdriver';


@Injectable()

export class LoginStoreService {
  public loginStore: Observable<LoginStoreModel>;
  public loginState: any;
  public loginStateItems: LoginStoreModel;
  private loginObjItem: LoginStoreModel;
  public storeLoginResponse: LoginStoreModel;
  public fixedLoginResponse: LoginResponseModel;
  public currentLoginObj: LoginStoreModel;
  public storeCookie: LoginResponseModel
  public cookieStore$: Observable<LoginResponseModel>;
  public cookieState: any;
  public cookieStateItem: LoginResponseModel;
  public didBrowserRefresh: boolean = false;
  public deviceModel: any;
  public devicePlatform: any;
  public deviceManufact: any;

  constructor(private cookieService: CookieService,
              public store: Store<AppState>,
              private state: State<AppState>
  )
    {
    this.loginStore = store.select(state => state.loginStore)
    this.cookieStore$ = store.select(state => state.cookieStore)
  }

  public createLoginObj(usercontext, loginResponse) {
    //console.log("LoginResponse count: ", loginResponse.cartItemCount)
    let tmpLoginRespone: LoginResponseModel = new LoginResponseModel();
    tmpLoginRespone = loginResponse;
  //  console.log("Do we have an carItemCount: ", loginResponse.cartItemCount);
   // console.log("Do we have the usercontext count: ", usercontext.cartItemCount)
   // console.log("Tmp Val: ", tmpLoginRespone)
    let tempLoginObjItem: LoginStoreModel =  new LoginStoreModel();
    tempLoginObjItem.access_token = loginResponse.access_token;
     tempLoginObjItem.expires_in = (usercontext.expires_in)? usercontext.expires_in : '';
     tempLoginObjItem.status = (tmpLoginRespone.status)? tmpLoginRespone.status : '';
     tempLoginObjItem.incidentId = (tmpLoginRespone.incidentId)? tmpLoginRespone.incidentId : '';
     tempLoginObjItem.message = (tmpLoginRespone.message)? tmpLoginRespone.message : '';
     tempLoginObjItem.messageType = (tmpLoginRespone.messageType)? tmpLoginRespone.messageType : '';
      tempLoginObjItem.requiresStudent = (tmpLoginRespone.requiresStudent)? tmpLoginRespone.requiresStudent : false;
     tempLoginObjItem.requiresRelationship = (tmpLoginRespone.requiresStudent)? tmpLoginRespone.requiresStudent : false;
     tempLoginObjItem.firstName = (usercontext.firstName)? usercontext.firstName : '';
     tempLoginObjItem.lastName = (usercontext.lastName) ? usercontext.lastName : '';
    tempLoginObjItem.cartItemCount = tmpLoginRespone.cartItemCount;
     tempLoginObjItem.districtKey = (usercontext.districtKey) ? usercontext.districtKey : '';
     tempLoginObjItem.districtName = (usercontext.districtName) ? usercontext.districtName : '';
     tempLoginObjItem.districtHasActivities = (usercontext.districtHasActivities) ? usercontext.districtHasActivities : false;
     tempLoginObjItem.districtHasExams = (usercontext.districtHasExams) ? usercontext.districtHasExams : false;
     tempLoginObjItem.districtHasFees = (usercontext.districtHasFees) ? usercontext.districtHasFees : false;
     tempLoginObjItem.isNewExperience = (usercontext.isNewExperience) ? usercontext.isNewExperience : false;
     tempLoginObjItem.allPaymentsSuspended = (usercontext.allPaymentsSuspended) ? usercontext.allPaymentsSuspended : false;
     tempLoginObjItem.allPaymentsResumeDate = (usercontext.allPaymentsResumeDate) ? usercontext.allPaymentsResumeDate : null;
     tempLoginObjItem.mealPaymentsSuspended = (usercontext.mealPaymentsSuspended) ? usercontext.mealPaymentsSuspended : false;
     tempLoginObjItem.mealPaymentsResumeDate = (usercontext.mealPaymentsResumeDate) ? usercontext.mealPaymentsResumeDate : null;
     tempLoginObjItem.isBlockACH = (usercontext.isBlockACH) ? usercontext.isBlockACH : false;
     tempLoginObjItem.isBlockPayments = (usercontext.isBlockPayments) ? usercontext.isBlockPayments : false;
     tempLoginObjItem.state = (usercontext.state) ? usercontext.state : 'GA';
     tempLoginObjItem.isAchAllowed = (usercontext.isAchAllowed) ? usercontext.isAchAllowed : false;
     tempLoginObjItem.isAutoPayEnabled = (usercontext.isAutoPayEnabled) ? usercontext.isAutoPayEnabled : false;
     tempLoginObjItem.isAlertsAllowedDistrict = (usercontext.isAlertsAllowedDistrict) ? usercontext.isAlertsAllowedDistrict : false;
     tempLoginObjItem.isDisableMealPaymentsDistrict = (usercontext.isDisableMealPaymentsDistrict) ? usercontext.isDisableMealPaymentsDistrict : false;
     tempLoginObjItem.isFroEnabled = (usercontext.isFroEnabled) ? usercontext.isFroEnabled : false;
     tempLoginObjItem.externalNavRequest = (tmpLoginRespone.externalNavRequest) ? tmpLoginRespone.externalNavRequest : '';
     tempLoginObjItem.isOldExperienceAllowed = (tmpLoginRespone.isOldExperienceAllowed) ? tmpLoginRespone.isOldExperienceAllowed : false;
    tempLoginObjItem.isMultiDistrict = (usercontext.availableDistricts.length > 0) ? true : false;

    this.loginObjItem = tempLoginObjItem;
   // console.log("Do we have loginObjItem Ready:  ", this.loginObjItem)

  
      this.store.dispatch(new LoginStoreActions.ClearLogin());
      this.store.dispatch(new LoginStoreActions.LoadLoginSuccess(this.loginObjItem));
  
    
    this.loginStore.subscribe(c => this.loginState = c);
    if (this.loginState) {
      this.storeLoginResponse = this.loginState.data;
     // console.log("dO WE hAVE A login STORE iTEM: ", this.storeLoginResponse);
      this.fixLoginResponse(this.storeLoginResponse);
    }


    

  }

  fixLoginResponse(currentLoginResponse): LoginResponseModel {
  //  console.log("Calling fixLOginResponse: ", currentLoginResponse);
   // console.log("Do we have the current LoginStoreObj: ", this.storeLoginResponse);
  //  console.log("Do we have an carItemCount: ", this.storeLoginResponse.cartItemCount);
  //  console.log("Do we have the currentLoginResponse count: ", currentLoginResponse.cartItemCount)
    let tempLoginResponse: any = new LoginResponseModel;
    if (this.storeLoginResponse) {
      tempLoginResponse.access_token = ' ' + this.storeLoginResponse.access_token;
      // tempLoginResponse.expires_in = '';
      tempLoginResponse.status = this.storeLoginResponse.status;
      // tempLoginResponse.incidentId = '';
      tempLoginResponse.message = ''
      tempLoginResponse.messageType = '';
      tempLoginResponse.messageTitle = '';
      tempLoginResponse.showCloseButton = false;
      tempLoginResponse.closeHtml = '';
      tempLoginResponse.requiresStudent = this.storeLoginResponse.requiresStudent;
      tempLoginResponse.requiresRelationship = this.storeLoginResponse.requiresRelationship,
        tempLoginResponse.firstName = this.storeLoginResponse.firstName;
      tempLoginResponse.lastName = this.storeLoginResponse.lastName;
      tempLoginResponse.cartItemCount = this.storeLoginResponse.cartItemCount;
      tempLoginResponse.districtKey = this.storeLoginResponse.districtKey;
      tempLoginResponse.districtName = this.storeLoginResponse.districtName;
      tempLoginResponse.isNewExperience = this.storeLoginResponse.isNewExperience;
      tempLoginResponse.districtHasActivities = this.storeLoginResponse.districtHasActivities;
      tempLoginResponse.districtHasExams = this.storeLoginResponse.districtHasExams;
      tempLoginResponse.districtHasFees = this.storeLoginResponse.districtHasFees;
      tempLoginResponse.allPaymentsSuspended = this.storeLoginResponse.allPaymentsSuspended;
      tempLoginResponse.allPaymentsResumeDate = this.storeLoginResponse.allPaymentsResumeDate;
      tempLoginResponse.mealPaymentsSuspended = this.storeLoginResponse.mealPaymentsSuspended;
      tempLoginResponse.mealPaymentsResumeDate = this.storeLoginResponse.mealPaymentsResumeDate;
      tempLoginResponse.isBlockACH = this.storeLoginResponse.isBlockACH;
      tempLoginResponse.isBlockPayments = this.storeLoginResponse.isBlockPayments;
      tempLoginResponse.state = this.storeLoginResponse.state;
      tempLoginResponse.isAchAllowed = this.storeLoginResponse.isAchAllowed;
      tempLoginResponse.isAutoPayEnabled = this.storeLoginResponse.isAutoPayEnabled;
      tempLoginResponse.isAlertsAllowedDistrict = this.storeLoginResponse.isAlertsAllowedDistrict;
      tempLoginResponse.isDisableMealPaymentsDistrict = this.storeLoginResponse.isDisableMealPaymentsDistrict;
      tempLoginResponse.isFroEnabled = this.storeLoginResponse.isFroEnabled;
      tempLoginResponse.externalNavRequest = this.storeLoginResponse.externalNavRequest;
      tempLoginResponse.isOldExperienceAllowed = this.storeLoginResponse.isOldExperienceAllowed;
      tempLoginResponse.showCloseButton = false;
      tempLoginResponse.closeHtml = '';
    } else {
      tempLoginResponse.access_token = ' '  + currentLoginResponse.access_token;
      // tempLoginResponse.expires_in = '';
      tempLoginResponse.status = currentLoginResponse.status;
      // tempLoginResponse.incidentId = '';
      tempLoginResponse.message = ''
      tempLoginResponse.messageType = '';
      tempLoginResponse.messageTitle = '';
      tempLoginResponse.showCloseButton = false;
      tempLoginResponse.closeHtml = '';
      tempLoginResponse.requiresStudent = currentLoginResponse.requiresStudent;
      tempLoginResponse.requiresRelationship = currentLoginResponse.requiresRelationship,
        tempLoginResponse.firstName = currentLoginResponse.firstName;
      tempLoginResponse.lastName = currentLoginResponse.lastName;
      tempLoginResponse.cartItemCount =  currentLoginResponse.cartItemCount;
     // (currentLoginResponse.cartItemCount) ? currentLoginResponse.cartItemCount : 0;
      tempLoginResponse.districtKey = currentLoginResponse.districtKey;
      tempLoginResponse.districtName = currentLoginResponse.districtName;
      tempLoginResponse.districtHasActivities = currentLoginResponse.districtHasActivities;
      tempLoginResponse.districtHasExams = currentLoginResponse.districtHasExams;
      tempLoginResponse.districtHasFees = currentLoginResponse.districtHasFees;
      tempLoginResponse.isNewExperience = currentLoginResponse.isNewExperience;
      tempLoginResponse.allPaymentsSuspended = currentLoginResponse.allPaymentsSuspended;
      tempLoginResponse.allPaymentsResumeDate = currentLoginResponse.allPaymentsResumeDate;
      tempLoginResponse.mealPaymentsSuspended = currentLoginResponse.mealPaymentsSuspended;
      tempLoginResponse.mealPaymentsResumeDate = currentLoginResponse.mealPaymentsResumeDate;
      tempLoginResponse.isBlockACH = currentLoginResponse.isBlockACH;
      tempLoginResponse.isBlockPayments = currentLoginResponse.isBlockPayments;
      tempLoginResponse.state = currentLoginResponse.state;
      tempLoginResponse.isAchAllowed = currentLoginResponse.isAchAllowed;
      tempLoginResponse.isAutoPayEnabled = currentLoginResponse.isAutoPayEnabled;
      tempLoginResponse.isAlertsAllowedDistrict = currentLoginResponse.isAlertsAllowedDistrict;
      tempLoginResponse.isDisableMealPaymentsDistrict = currentLoginResponse.isDisableMealPaymentsDistrict;
      tempLoginResponse.isFroEnabled = currentLoginResponse.isFroEnabled;
      tempLoginResponse.externalNavRequest = currentLoginResponse.externalNavRequest;
      tempLoginResponse.isOldExperienceAllowed = currentLoginResponse.isOldExperienceAllowed;
      tempLoginResponse.showCloseButton = false;
      tempLoginResponse.closeHtml = '';
    }
   // console.log("Do we have tempLoginResponse: ", tempLoginResponse)
   
    this.fixedLoginResponse = tempLoginResponse;
   // console.log("The cookie about to be PUT: ", this.fixedLoginResponse)
    this.loadLogin(this.fixedLoginResponse)
//this.cookieService.putObject(Constants.AuthCookieName, this.fixedLoginResponse)
return this.fixedLoginResponse;


  }


  public getLoginObj() {
  //  console.log("Calling getLoginObj!!!! ")
    this.loginStore.subscribe(c => this.loginState = c);
    if (this.loginState) {
      this.storeLoginResponse = this.loginState.data;
      this.currentLoginObj = this.storeLoginResponse;
   // }
    } else {
      let tempLogin: any = this.cookieStateItem;   
      this.currentLoginObj = tempLogin;
    }


    return this.currentLoginObj;
  }

  
  //Loads the Cookie Store with the LoginResponse object and stores a copy of it in sessionStorage for refresh purposes
  public loadLogin(loginRepsone: any) {
   //console.log("Do we have a login to load into the Store Now: ", loginRepsone);
    
    this.store.dispatch(new CookieStoreActions.ClearCookie);
    this.store.dispatch(new CookieStoreActions.LoadCookieSuccess(loginRepsone));
   
    this.cookieStore$.subscribe(c => this.cookieState = c)
    if (this.cookieState) {
      this.cookieStateItem = this.cookieState.data;
      let storageItem = JSON.stringify(this.cookieStateItem)
      sessionStorage.setItem(Constants.AuthCookieName, storageItem);
    

    }

  }

  public getLoginResponse() {
 //   console.log("Calling getLoginResponse")
    this.cookieStore$.subscribe(c => this.cookieState = c)
    if (this.cookieState) {
   //   console.log("We got a cookieState: ", this.cookieState)
      this.cookieStateItem = this.cookieState.data;
     

    }

    return this.cookieStateItem;

  }


  public clearSessionStorage() {
   // console.log("Calling clearSessionStorage ")
    this.store.dispatch(new CookieStoreActions.ClearCookie);
    sessionStorage.clear();
    

  }
    
}
