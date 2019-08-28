import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';



//Local
import { Constants } from '../../app.settings';
import { RequestPasswordChangeModel, LoginResponseModel } from '../../login/model/index';
import { UtilityService } from '../../shared/services/utility.service';

@Injectable()

export class RequestPassordChangeService {

    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;

  constructor(private http: Http,
    private httpC: HttpClient,
    private utilityService: UtilityService,
  ) { }

    public requestPasswordChange(requestDetail: RequestPasswordChangeModel, loginResponse: LoginResponseModel): Observable<number> {

        let message: string = '';
        this.result = false;
        let Url = Constants.WebApiUrl.Auth + '/reset';  // URL to web API
        let body = JSON.stringify(requestDetail);
        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        let options = new RequestOptions({ headers: headers });

        this.loginResponse = loginResponse;

        this.http.post(Url, body, options)
            .subscribe(
            data => {
                //processing the successful response
                this.loginResponse.messageType = Constants.Success;
                this.loginResponse.messageTitle = 'Message: ';
                this.loginResponse.message = message;
                this.result = true;
            },
            error => {
                //Initially it was thought that these various states would need a different message
                //If we are sure that this is not the case this can be simplified by eliminating
                //the blocks of logic.
                if (error["status"]) {
                    if (error["status"] != '500') {
                        this.loginResponse.message = message;
                    } else {
                        this.loginResponse.message = message;
                    }
                } else {
                    this.loginResponse.message = message;
                }

                this.loginResponse.showCloseButton = true;
                this.loginResponse.messageType = Constants.Error;
                this.loginResponse.messageTitle = 'Message: ';
                this.result = true;
            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)
  }

  private requestPasswordChangeNew(requestDetail: RequestPasswordChangeModel): Observable<any> {
   
    let failureMessage = "Error. Password was Not Changed";
    let Url = Constants.WebApiUrl.Auth + '/reset';  // URL to web API
    let body = JSON.stringify(requestDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON'
    });

    let options = { headers: headers };

    //console.log("Da Url: ", Url)
    //console.log("Da body: ", body)
   // console.log("Da options: ", options)


    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       //  ,
      //  tap(data => console.log("I think pasword was Changed: ", data))
      )

  }
  public subscribeToRequestPasswordChange(requestDetail: RequestPasswordChangeModel,  loginResponse: LoginResponseModel) {
    this.loginResponse = loginResponse;
    let message: string = '';
    this.result = false;
   // console.log("do we have a LoignResponse Model: ", this.loginResponse)
    if (requestDetail) {
      this.requestPasswordChangeNew(requestDetail)
        .subscribe(
          data => {
            //processing the successful response
            this.loginResponse.messageType = Constants.Success;
            this.loginResponse.messageTitle = 'Message: ';
            this.loginResponse.message = message;
            this.result = true;
           // console.log("Did we set the message: ", this.loginResponse.message)
           
          },
          error => {
            //Initially it was thought that these various states would need a different message
            //If we are sure that this is not the case this can be simplified by eliminating
            //the blocks of logic.
            if (error["status"]) {
              if (error["status"] != '500') {
                this.loginResponse.message = message;
              } else {
                this.loginResponse.message = message;
              }
            } else {
              this.loginResponse.message = message;
            }
            this.loginResponse.showCloseButton = true;
            this.loginResponse.messageType = Constants.Error;
            this.loginResponse.messageTitle = 'Message: ';
            this.result = true;
          },
          () => {
            this.result = true;
          }
       )
    }


  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

}
