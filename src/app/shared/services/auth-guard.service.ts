import { Injectable, Component } from '@angular/core';
import {
    CanActivate, CanActivateChild, Router,
    ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationStart
} from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CookieService } from 'ngx-cookie';
import { LoginStoreService } from '../../shared/services/login-store.service';
import { TokenService } from '../../shared/services/token.service';
import { CurrentTokenService } from '../../shared/services/current-token.service';
export let browserRefresh = false;

@Injectable()

export class AuthGuardService implements CanActivate, CanActivateChild {
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;
  private subscription: Subscription;


    constructor(private router: Router,
        private loginStoreSrvc: LoginStoreService,
      private httpC: HttpClient,
      private tokenService: TokenService,
      private currentTokenService: CurrentTokenService
     
    ) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //  console.log("Calling Can Activate: ", route)
    let grantAccess: boolean = true;
   // let nonCookie: any = this.loginStoreSrvc.cookieStateItem;
   // console.log("Do we have the nonCookie: ", this.loginStoreSrvc.cookieStateItem)
          if (this.loginStoreSrvc.cookieStateItem) {
       // if (this.cookieService.get(Constants.AuthCookieName)) {
            //The cookie should have a fresh access token when coming from initial registration
            this.loginResponse = this.loginStoreSrvc.cookieStateItem;
              //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
          //console.log("What is the Response from the Non-cookie: ", this.loginResponse);
            //Testing
            //this.loginResponse.access_token = 'MessedUpToken'

            if (this.loginResponse.access_token) {
               // let subscription = this.getSession(this.loginResponse)
              this.subscribeToGetSession(this.loginResponse)
                  // .subscribe(() => {
                        if (this.result == true) {

                           // subscription.unsubscribe();

                            if (this.loginResponse.messageType === Constants.Error) {
                                //Override specific error message from service
                                this.loginResponse.message = 'Your session has timed out. Please sign in.';

                                //The cookie is read by the home page and an error is 
                                //in loginResponse.message is shown
                           //   this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                              this.loginStoreSrvc.loadLogin(this.loginResponse);

                                grantAccess = false;

                                //Navigate to login
                                let link = ['/welcome'];
                                this.router.navigate(link);

                            } else {
                                grantAccess = true;
                              this.loginStoreSrvc.loadLogin(this.loginResponse);
                                //this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);

                            }
                        } else {
                            ++this.count;
                        }
                   // });
            } else {

                //No cookie no response model so we make one
                this.loginResponse.messageType = Constants.Error;
                this.loginResponse.message = 'Your session has timed out. Please sign in.';
              //  this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
              this.loginStoreSrvc.loadLogin(this.loginResponse);

                grantAccess = false;

                let link = ['/welcome'];
                this.router.navigate(link);
            }

        } else {

            this.loginResponse = new LoginResponseModel;
            this.loginResponse.messageType = Constants.Error;
            this.loginResponse.message = 'Your session has timed out. Please sign in.';
            this.subscription = this.router.events.subscribe((event) => {
          
              if (event instanceof NavigationStart) {
                browserRefresh = !this.router.navigated;
              }

              if (browserRefresh == true) {
                let data = sessionStorage.getItem(Constants.AuthCookieName);
                let retrievedCookie: LoginResponseModel = JSON.parse(data);
               // console.log("Did we turn it back to JSON: ", retrievedCookie)

                this.loginStoreSrvc.loadLogin(retrievedCookie);
                this.loginResponse = this.loginStoreSrvc.cookieStateItem;
               // console.log("Do we  have a store-cookie: ", this.loginResponse)
                grantAccess = true;
                browserRefresh = false;
                this.loginStoreSrvc.didBrowserRefresh = true;
                this.subscription.unsubscribe();
                 let link = ['/dashboard'];
                this.router.navigate(link);
            
               
              } else {
                grantAccess = false;  
                let link = ['/welcome'];
                this.router.navigate(link);
              }

            });

          

          
    }
        return grantAccess;

    }

  getSessionNew(loginResponse: LoginResponseModel): Observable<any> {
    //console.log("Calling getSessionNew: ", loginResponse)
    //console.log("GetSessoin nonCookie: ", this.loginStoreSrvc.cookieStateItem)
    //let successMessage: string = '';
    //let failureMessage: string = 'Failed to process request.';
    //let newJwt: any;

    let token = loginResponse.access_token;
   // console.log("What is the token: ", token)
    this.currentToken = this.tokenService.getCurrentToken(token);
    let Url = Constants.WebApiUrl.Auth + '/Session';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
     .pipe(
      //tap(data => console.log("I think we got Session: ", data))
      )

  }

  subscribeToGetSession(loginResponse: LoginResponseModel) {
    let successMessage: string = '';
    let failureMessage: string = 'Failed to process request.';

    this.getSessionNew(loginResponse)
      .subscribe(
        data => {
          this.result = true;
        },
        error => {
          loginResponse = new LoginResponseModel;
          if (error["status"]) {
            switch (error["status"]) {
              case '500':
                loginResponse.status = error["status"];
                let errorObject: any = JSON.parse(error["_body"]);
                loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject["incidentId"];
              default:
                loginResponse.message = failureMessage
            }
          } else {
            loginResponse.message = failureMessage;
          }

          loginResponse.showCloseButton = true;
          loginResponse.messageType = Constants.Error;
          loginResponse.messageTitle = 'Message: ';
          this.result = true;
        },
        () => {
          //Clear any errors that may exist.
          //Debug mock the cart count
          loginResponse.message = "";
          loginResponse.messageType = Constants.Success;
          loginResponse.showCloseButton = false;
          this.result = true;
        });

  }

}
