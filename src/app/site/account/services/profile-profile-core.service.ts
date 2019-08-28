import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

//Local
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { ProfileProfileCorePutModel } from '../meal-purchases/model/index';
import { UtilityService, CurrentTokenService } from '../../../shared/services/index'
import { tap } from 'rxjs/operators';

@Injectable()

export class ProfileProfileCoreService {
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;

    constructor(
        private http: Http,
      private utilityService: UtilityService,
      private currTokenServ: CurrentTokenService,
      private httpC: HttpClient
    ) { }

    public putProfileCore(profileProfileCorePutModel: ProfileProfileCorePutModel, loginResponse: LoginResponseModel): Observable<number> {

        let newJwt: any;
        let token = loginResponse.access_token;
        this.loginResponse = loginResponse;

        let successMessage: string = '';
        let failureMessage: string = 'Update Profile Failed';

        this.loginResponse = loginResponse;

        var errHeader: any = {
            _body: '',
            status: ''
        }

        let Url = Constants.WebApiUrl.Profile + '/ProfileCore';
        let body = JSON.stringify(profileProfileCorePutModel);
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

  //public putProfileCore(profileProfileCorePutModel: ProfileProfileCorePutModel, loginResponse: LoginResponseModel): Observable<any> {
  //  this.loginResponse = loginResponse;
  //  let successMessage: string = '';
  //  let failureMessage: string = 'Transfer Status Not Found';
  //  let token = loginResponse.access_token;
  //  this.currentToken = token;
  //  let testString = this.currentToken.match(/bearer/);
  //  if (testString) {
  //    this.currentToken = this.currentToken;
  //  } else {
  //    this.currentToken = 'bearer ' + this.currentToken;
  //  }


  //  this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

  //    var errHeader: any = {
  //          _body: '',
  //          status: ''
  //      }

  //      let Url = Constants.WebApiUrl.Profile + '/ProfileCore';
  //  let body = JSON.stringify(profileProfileCorePutModel);
  //  let headers = new HttpHeaders({
  //    'Content-Type': 'application/JSON',
  //    'Authorization': this.currentToken
  //  });

  //  let options = { headers: headers };
    
  //  console.log("the URL: ", Url)
  //  console.log("the body: ", body);
  //  console.log("options: ", options)


  //  return this.httpC.put(Url, body, options)
  //    .pipe(
  //    catchError(error => ( this.handleError(error, failureMessage)) ),
  //            tap(data => {
  //                  if (data) {
  //                    this.result = true;
  //                  }
  //             })
  //         )
  //}

  private handleError(error, failureMessage) {
    this.result = false;
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);

    return Observable.throwError(this.loginResponse.message);
  }
}
