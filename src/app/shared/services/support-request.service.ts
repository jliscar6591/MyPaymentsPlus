import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

import { RouterStateSnapshot, Router } from '@angular/router';


//Local
import { Constants } from '../../app.settings';
import { ChangePasswordPutModel, LoginResponseModel } from '../../login/model/index';
import {SupportRequestDetailModel  } from '../../site/supplemental/model/index';

@Injectable()

export class SupportRequestService {
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

	constructor(private http: Http,
		private router: Router) { }

    public requestSupport(supportRequestDetail: SupportRequestDetailModel, loginResponse: LoginResponseModel): Observable<number> {
        let successMessage: string = 'Successfully sent support request email.';
        let failureMessage: string = 'Failed to send support request email.';

        let Url = Constants.WebApiUrl.Auth + '/SupportRequest';  // URL to web API

        let body = JSON.stringify(supportRequestDetail);

        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        let options = new RequestOptions({ headers: headers });

        this.loginResponse = loginResponse;

        this.http.put(Url, body, options)
            .subscribe(
            data => { },
            error => {
                if (error["status"]) {
					this.loginResponse.status = error["status"];
                    //custom handling of '404 Page Not Found' messages
					if (error["status"] == '404') {                        
						this.loginResponse.message = "This is a 404 error Message";
						this.router.navigate(['/notfound']);
					}
					if (error["status"] != '500') {
						this.loginResponse.message = failureMessage;
					} else {
                        this.loginResponse.message = failureMessage;
                    }
                } else {
                    this.loginResponse.message = failureMessage;
                }

                this.loginResponse.showCloseButton = true;
                this.loginResponse.messageType = Constants.Error;
                this.loginResponse.messageTitle = 'Message: ';
                this.result = true;
            },
            () => {
                //processing the successful response
                this.loginResponse.showCloseButton = true;               
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
