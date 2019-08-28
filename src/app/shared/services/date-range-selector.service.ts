import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';


//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { DateRangeSelectorModel } from '../../shared/model/index';
import { UtilityService } from './utility.service'

@Injectable()

export class DateRangeSelectorService {
    //Contains district list
    public dateRangeSelectorModel: DateRangeSelectorModel[];
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

    public getDateRangeSelections(loginResponse: LoginResponseModel): Observable<number> {
        let successMessage: string = '';
        let failureMessage: string = 'Date range selection list failed';

        this.loginResponse = loginResponse;

        this.http.request('/assets/data/date-range-selector.data.json')
            .subscribe(
            data => { this.dateRangeSelectorModel = data.json() },
            error => {
                this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
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
