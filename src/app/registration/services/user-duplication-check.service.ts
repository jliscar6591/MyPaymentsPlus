import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { UserDuplicationModel, UserDuplicationResponseModel } from '../model/index';
import { UtilityService } from '../../shared/services/index';


@Injectable()

export class UserDuplicationCheckService {
    //Contains response from the api
    public userDuplicationResponse: UserDuplicationResponseModel;
    //Contains parameters required by the api
    public userDuplication: UserDuplicationModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

	constructor(private http: Http,
		private utilityService: UtilityService) { }

	public getCheckDuplication(userDuplication: UserDuplicationModel, loginResponse: LoginResponseModel, userDuplicationResponse: UserDuplicationResponseModel): Observable<number> {
		let newJwt: any;

        let successMessage: string = '';
        let failureMessage: string = '';

        let Url = Constants.WebApiUrl.Auth + '/user/' + userDuplication.email + '/' + userDuplication.application;  // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        let options = new RequestOptions({ headers: headers });

        this.userDuplicationResponse = userDuplicationResponse;

        this.http.get(Url, options)
            .subscribe(
            data => {
                this.userDuplicationResponse = data.json();

            },
			error => {
				this.utilityService.processApiErr(error, loginResponse, failureMessage);
				this.result = true;
			},
			() => {
				//processing the successful response
				this.result = true;

			});
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
