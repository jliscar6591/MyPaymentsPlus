"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngx_cookie_1 = require("ngx-cookie");
var store_1 = require("@ngrx/store");
var LoginStoreActions = require("../../shared/store/actions/loginStore.actions");
var login_store_model_1 = require("../../shared/store/model/login-store.model");
var index_1 = require("../../login/model/index");
var app_settings_1 = require("../../app.settings");
var CookieStoreActions = require("../../shared/store/actions/cookieStore.actions");
var LoginStoreService = /** @class */ (function () {
    function LoginStoreService(cookieService, store, state) {
        this.cookieService = cookieService;
        this.store = store;
        this.state = state;
        this.didBrowserRefresh = false;
        this.loginStore = store.select(function (state) { return state.loginStore; });
        this.cookieStore$ = store.select(function (state) { return state.cookieStore; });
    }
    LoginStoreService.prototype.createLoginObj = function (usercontext, loginResponse) {
        var _this = this;
        //console.log("LoginResponse count: ", loginResponse.cartItemCount)
        var tmpLoginRespone = new index_1.LoginResponseModel();
        tmpLoginRespone = loginResponse;
        //  console.log("Do we have an carItemCount: ", loginResponse.cartItemCount);
        // console.log("Do we have the usercontext count: ", usercontext.cartItemCount)
        // console.log("Tmp Val: ", tmpLoginRespone)
        var tempLoginObjItem = new login_store_model_1.LoginStoreModel();
        tempLoginObjItem.access_token = loginResponse.access_token;
        tempLoginObjItem.expires_in = (usercontext.expires_in) ? usercontext.expires_in : '';
        tempLoginObjItem.status = (tmpLoginRespone.status) ? tmpLoginRespone.status : '';
        tempLoginObjItem.incidentId = (tmpLoginRespone.incidentId) ? tmpLoginRespone.incidentId : '';
        tempLoginObjItem.message = (tmpLoginRespone.message) ? tmpLoginRespone.message : '';
        tempLoginObjItem.messageType = (tmpLoginRespone.messageType) ? tmpLoginRespone.messageType : '';
        tempLoginObjItem.requiresStudent = (tmpLoginRespone.requiresStudent) ? tmpLoginRespone.requiresStudent : false;
        tempLoginObjItem.requiresRelationship = (tmpLoginRespone.requiresStudent) ? tmpLoginRespone.requiresStudent : false;
        tempLoginObjItem.firstName = (usercontext.firstName) ? usercontext.firstName : '';
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
        this.loginStore.subscribe(function (c) { return _this.loginState = c; });
        if (this.loginState) {
            this.storeLoginResponse = this.loginState.data;
            // console.log("dO WE hAVE A login STORE iTEM: ", this.storeLoginResponse);
            this.fixLoginResponse(this.storeLoginResponse);
        }
    };
    LoginStoreService.prototype.fixLoginResponse = function (currentLoginResponse) {
        //  console.log("Calling fixLOginResponse: ", currentLoginResponse);
        // console.log("Do we have the current LoginStoreObj: ", this.storeLoginResponse);
        //  console.log("Do we have an carItemCount: ", this.storeLoginResponse.cartItemCount);
        //  console.log("Do we have the currentLoginResponse count: ", currentLoginResponse.cartItemCount)
        var tempLoginResponse = new index_1.LoginResponseModel;
        if (this.storeLoginResponse) {
            tempLoginResponse.access_token = ' ' + this.storeLoginResponse.access_token;
            // tempLoginResponse.expires_in = '';
            tempLoginResponse.status = this.storeLoginResponse.status;
            // tempLoginResponse.incidentId = '';
            tempLoginResponse.message = '';
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
        }
        else {
            tempLoginResponse.access_token = ' ' + currentLoginResponse.access_token;
            // tempLoginResponse.expires_in = '';
            tempLoginResponse.status = currentLoginResponse.status;
            // tempLoginResponse.incidentId = '';
            tempLoginResponse.message = '';
            tempLoginResponse.messageType = '';
            tempLoginResponse.messageTitle = '';
            tempLoginResponse.showCloseButton = false;
            tempLoginResponse.closeHtml = '';
            tempLoginResponse.requiresStudent = currentLoginResponse.requiresStudent;
            tempLoginResponse.requiresRelationship = currentLoginResponse.requiresRelationship,
                tempLoginResponse.firstName = currentLoginResponse.firstName;
            tempLoginResponse.lastName = currentLoginResponse.lastName;
            tempLoginResponse.cartItemCount = currentLoginResponse.cartItemCount;
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
        this.loadLogin(this.fixedLoginResponse);
        //this.cookieService.putObject(Constants.AuthCookieName, this.fixedLoginResponse)
        return this.fixedLoginResponse;
    };
    LoginStoreService.prototype.getLoginObj = function () {
        var _this = this;
        //  console.log("Calling getLoginObj!!!! ")
        this.loginStore.subscribe(function (c) { return _this.loginState = c; });
        if (this.loginState) {
            this.storeLoginResponse = this.loginState.data;
            this.currentLoginObj = this.storeLoginResponse;
            // }
        }
        else {
            var tempLogin = this.cookieStateItem;
            this.currentLoginObj = tempLogin;
        }
        return this.currentLoginObj;
    };
    //Loads the Cookie Store with the LoginResponse object and stores a copy of it in sessionStorage for refresh purposes
    LoginStoreService.prototype.loadLogin = function (loginRepsone) {
        //console.log("Do we have a login to load into the Store Now: ", loginRepsone);
        var _this = this;
        this.store.dispatch(new CookieStoreActions.ClearCookie);
        this.store.dispatch(new CookieStoreActions.LoadCookieSuccess(loginRepsone));
        this.cookieStore$.subscribe(function (c) { return _this.cookieState = c; });
        if (this.cookieState) {
            this.cookieStateItem = this.cookieState.data;
            var storageItem = JSON.stringify(this.cookieStateItem);
            sessionStorage.setItem(app_settings_1.Constants.AuthCookieName, storageItem);
        }
    };
    LoginStoreService.prototype.getLoginResponse = function () {
        var _this = this;
        //   console.log("Calling getLoginResponse")
        this.cookieStore$.subscribe(function (c) { return _this.cookieState = c; });
        if (this.cookieState) {
            //   console.log("We got a cookieState: ", this.cookieState)
            this.cookieStateItem = this.cookieState.data;
        }
        return this.cookieStateItem;
    };
    LoginStoreService.prototype.clearSessionStorage = function () {
        // console.log("Calling clearSessionStorage ")
        this.store.dispatch(new CookieStoreActions.ClearCookie);
        sessionStorage.clear();
    };
    LoginStoreService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ngx_cookie_1.CookieService,
            store_1.Store,
            store_1.State])
    ], LoginStoreService);
    return LoginStoreService;
}());
exports.LoginStoreService = LoginStoreService;
//# sourceMappingURL=login-store.service.js.map