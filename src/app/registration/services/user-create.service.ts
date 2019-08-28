import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { RegistrationDetailModel } from '../model/index';
import { UtilityService } from '../../shared/services/index';


@Injectable()

export class UserCreateService {
	//Contains values to send to the api
	public registrationDetailModel: RegistrationDetailModel;
	//True when http call returns
	public result: boolean = false;
	//Used to count retry 
	public count: number = 0;

	constructor(private http: Http,
		private utilityService: UtilityService) { }

	public postCreateUser(registrationDetail: RegistrationDetailModel, loginResponse: LoginResponseModel): Observable<number> {

		let newJwt: any;

		let successMessage: string = '';
		let failureMessage: string = '';

		let Url = Constants.WebApiUrl.Auth + '/user';  // URL to web API
		let headers = new Headers({ 'Content-Type': 'application/JSON' });
		let body = JSON.stringify(registrationDetail);
		let options = new RequestOptions({ headers: headers });
		let resp = {
			userId: ''
		};

		this.http.post(Url, body, options)
			.subscribe(
			data => {
				newJwt = data.headers.toJSON();
				resp = data.json();
			},
			error => {
				this.utilityService.processApiErr(error, loginResponse, failureMessage);
				this.result = true;
			},
			() => {
				//processing the successful response

				//alert(newJwt.jwt_refresh[0]);

				loginResponse.access_token = newJwt.jwt_refresh[0]
				
				loginResponse.districtKey = registrationDetail.districtKey;
				loginResponse.showCloseButton = false;
				loginResponse.message = successMessage + " id: " + resp.userId;
				loginResponse.messageType = Constants.Success;
				loginResponse.messageTitle = 'Message: ';
			 this.result = true;

			});
		//Return to calling program every polling interval
		return Observable.interval(Constants.PollingInterval)

	}
} 
