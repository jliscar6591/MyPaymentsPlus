import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';


//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StateProvinceModel } from '../../shared/model/index';
import { UtilityService } from '../../shared/services/index';


@Injectable()

export class SegmentationReadService {
    //Contains district list
    public stateProvinceList: StateProvinceModel[];
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

	constructor(private http: Http,
		private utilityService: UtilityService) { }

	public getState(loginResponse: LoginResponseModel, stateProvinceList: StateProvinceModel[]): Observable<number> {
		let newJwt: any;

        let successMessage: string = '';
        let failureMessage: string = '';

        let Url = Constants.WebApiUrl.Auth + '/StateProvinceList';  // URL to web API
        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        let options = new RequestOptions({ headers: headers });

        this.loginResponse = loginResponse;
        this.stateProvinceList = stateProvinceList;

        this.http.get(Url, options)
            .subscribe(
            data => {
                newJwt = data.headers.toJSON();
                this.stateProvinceList = data.json()
            },
			error => {
				this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
				this.result = true;
			},
			() => {
				//processing the successful response
				this.loginResponse.access_token = newJwt.jwt_refresh[0]
				this.result = true;

			});
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

    }
}
