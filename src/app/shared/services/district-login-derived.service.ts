import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

import {Router} from '@angular/router';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CookieService } from 'ngx-cookie';
import { LoginStoreService } from '../../shared/services/login-store.service';

@Injectable()

export class DistrictLoginDerivedService {

    //Derived district
    public districtName: string;
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

    constructor(private cookieService: CookieService,
        private router: Router,
      private http: Http,
      private loginStoreService: LoginStoreService
    ) { }


    //Get the district for the current logged in user
    deriveDistrict(): void {
      let schoolDistrict: string = '';
     // this.cookieService.get(Constants.AuthCookieName)
        if (this.loginStoreService.cookieStateItem) {
            //The cookie should have a fresh access token when coming from initial registration
          this.loginResponse = this.loginStoreService.cookieStateItem;
            //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
            if (this.loginResponse.access_token) {
                let subscription = this.getDerivedDistrict(this.loginResponse.access_token)
                    .subscribe(() => {
                        if (this.result == true) {

                            subscription.unsubscribe();

                          if (this.loginResponse.messageType === Constants.Error) {
                            this.loginStoreService.loadLogin(this.loginResponse);
                               // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                                //Navigate to login
                                let link = ['/home'];
                                this.router.navigate(link);
                            } else {
                                //schoolDistrict = this.districtName;
                           // console.log("Creating a cookie: ", this.loginResponse)
                            this.loginStoreService.loadLogin(this.loginResponse);
                             //   this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                            }

                        } else {
                            ++this.count;
                        }
                    });
            } else {

                //No cookie no response model so we make one
                this.loginResponse.messageType = Constants.Error;
                this.loginResponse.message = 'Your session has timed out. Please sign in.';
              //console.log("Creating a cookie: ", this.loginResponse)
              this.loginStoreService.loadLogin(this.loginResponse);
               // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                //Navigate to login
                let link = ['/home'];
                this.router.navigate(link);
            }

        } else {

            this.loginResponse = new LoginResponseModel;
            this.loginResponse.messageType = Constants.Error;
            this.loginResponse.message = 'Your session has timed out. Please sign in.';
         // console.log("Creating a cookie: ", this.loginResponse)
          this.loginStoreService.loadLogin(this.loginResponse)
           // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            //Navigate to login
            let link = ['/home'];
            this.router.navigate(link);
        }
    }



    public getDerivedDistrict(token: string): Observable<number> {
        //Get session
        let newJwt: any;
        this.loginResponse = new LoginResponseModel;
        let successMessage: string = '';
        let failureMessage: string = 'Failed to process request.';
        let Url = Constants.WebApiUrl.Auth + '/District';  // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        headers.append('Authorization', 'bearer ' + token);
        let options = new RequestOptions({ headers: headers });

        this.http.get(Url, options)
            .subscribe(
            data => {
                this.districtName = data.json();
                newJwt = data.headers.toJSON();
            },
            error => {
                if (error["status"]) {
                    switch (error["status"]) {
                        case '500':
                            this.loginResponse.status = error["status"];
                            let errorObject: any = JSON.parse(error["_body"]);
                            this.loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject["incidentId"];
                        default:
                            this.loginResponse.message = failureMessage
                    }
                } else {
                    this.loginResponse.message = failureMessage;
                }

                this.loginResponse.access_token = token;
                this.loginResponse.showCloseButton = true;
                this.loginResponse.messageType = Constants.Error;
                this.loginResponse.messageTitle = 'Message: ';
                this.result = true;
            },
            () => {
                //processing the successful response
              //  this.loginResponse.access_token = newJwt.jwt_refresh[0];               
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
