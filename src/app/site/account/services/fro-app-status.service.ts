import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { Router } from '@angular/router';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CookieService } from '../../../shared/services/index';
import { FroAppStatusModel } from '../meal-purchases/model/index';
import { UtilityService } from '../../../shared/services/index';

@Injectable()


export class FroAppStatusService {

    public froAppStatus: FroAppStatusModel[];

    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

    constructor(private cookieService: CookieService,
        private router: Router,
        private utilityService: UtilityService,
        private http: Http) { }



    //Get the default district  and state for the current logged in user
    public getStatus(loginResponse: LoginResponseModel): Observable<number> {
        this.loginResponse = loginResponse;
        let newJwt: any;
        let token = loginResponse.access_token;
        let successMessage: string = '';
        let failureMessage: string = 'Failed to get get status';

        let Url = Constants.WebApiUrl.Profile + '/FroStatus'; // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);

        let options = new RequestOptions({ headers: headers });

        this.http.get(Url, options)
        //this.http.get('src/app/mock/fro-app-status.json')
            .subscribe(
            data => {
                this.froAppStatus = data.json();
                newJwt = data.headers.toJSON();
                this.result = true;
            },
            error => {
                this.utilityService.processApiErr(error, loginResponse, failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response
                loginResponse.access_token = newJwt.jwt_refresh[0];
                //console.log(this.froAppStatus)
            });
        return Observable.interval(Constants.PollingInterval);

    }
}
