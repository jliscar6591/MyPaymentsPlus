import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { ProfileRelationshipPutModel } from '../meal-purchases/model/index';
import { UtilityService } from '../../../shared/services/index'

@Injectable()

export class ProfileRelationshipService {
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

    constructor(
        private http: Http,
        private utilityService: UtilityService
    ) { }

    public putRelationship(profileRelationshipPutModel: ProfileRelationshipPutModel, loginResponse: LoginResponseModel): Observable<number> {
        let newJwt: any;
        let token = loginResponse.access_token;
        this.loginResponse = loginResponse;

        let successMessage: string = '';
        let failureMessage: string = 'Update District Relationship Failed';

        this.loginResponse = loginResponse;

        let Url = Constants.WebApiUrl.Profile + '/Relationship';  // URL to web API
        let body = JSON.stringify(profileRelationshipPutModel);

        let headers = new Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);

        let options = new RequestOptions({ headers: headers });

        this.http.put(Url, body, options)
            .subscribe(
            data => {
                newJwt = data.headers.toJSON();
            },
            error => {
                this.utilityService.processApiErr(error,this.loginResponse,failureMessage);
                this.result = true;
            },
            () => {
                //processing the successful response
                this.loginResponse.access_token = newJwt.jwt_refresh[0];               
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
