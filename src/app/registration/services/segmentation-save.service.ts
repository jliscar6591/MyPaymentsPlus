import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { SegmentationDetailModel } from '../model/index';
import { UtilityService } from '../../shared/services/index';


@Injectable()

export class SegmentationSaveService {
	//True when http call returns
	public result: boolean = false;
	//Used to count retry 
	public count: number = 0;

	constructor(private http: Http,
		private utilityService: UtilityService) { }

	public saveSegmentation(segmentationDetail: SegmentationDetailModel, loginResponse: LoginResponseModel): Observable<number> {

		let newJwt: any;

		let successMessage: string = '';
		let failureMessage: string = '';

		let Url = Constants.WebApiUrl.Auth + '/segmentation';  // URL to web API
		let body = JSON.stringify(segmentationDetail);
		let headers = new Headers({ 'Content-Type': 'application/JSON' });
		headers.append('Authorization', 'bearer ' + loginResponse.access_token);

		let options = new RequestOptions({ headers: headers });

		this.http.put(Url, body, options)
			.subscribe(
			data => {
				newJwt = data.headers.toJSON();
			},
			error => {
				this.utilityService.processApiErr(error, loginResponse, failureMessage);
				this.result = true;
			},
			() => {
				//processing the successful response
				loginResponse.access_token = newJwt.jwt_refresh[0]
				this.result = true;

			});
		//Return to calling program every polling interval
		return Observable.interval(Constants.PollingInterval)

	}
}
