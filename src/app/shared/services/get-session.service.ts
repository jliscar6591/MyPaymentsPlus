import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

import { RouterStateSnapshot, Router } from '@angular/router';


//Local
import { Constants } from '../../app.settings';
import { ChangePasswordPutModel, LoginResponseModel } from '../../login/model/index';
import { SupportRequestDetailModel } from '../../site/supplemental/model/index';

@Injectable()

export class GetSessionService {
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;
    //Authorized flag
    public isAuthorized: boolean = false;

    constructor(private http: Http,
        private router: Router) { }

    getSession(loginResponse: LoginResponseModel): Observable<number> {
        let successMessage: string = '';
        let failureMessage: string = 'Failed to process request.';
        let newJwt: any;


        let Url = Constants.WebApiUrl.Auth + '/Session';  // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        headers.append('Authorization', 'bearer ' + loginResponse.access_token);
        let options = new RequestOptions({ headers: headers });

        this.http.get(Url, options)
            .subscribe(
            data => {
                newJwt = data.headers.toJSON();
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
                loginResponse.access_token = newJwt.jwt_refresh[0];
                loginResponse.message = "";
                loginResponse.messageType = Constants.Success;
                loginResponse.showCloseButton = false
                this.isAuthorized = true;
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)
    }
}
