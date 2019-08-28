import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';


//Local
import { Constants } from '../../app.settings';
import { ChangePasswordPutModel, LoginResponseModel } from '../../login/model/index';
import { UtilityService } from '../../shared/services/utility.service';
import { LoginStoreService } from '../../shared/services/login-store.service';


@Injectable()

export class ChangePasswordService {
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
  public count: number = 0;
  public currentToken: string;

  constructor(private http: Http,
    private httpC: HttpClient,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
            // private currTokenServ: CurrentTokenService,
            // private tokenService: TokenService
  ) { }

    public changePassword(changePutDetail: ChangePasswordPutModel, loginResponse: LoginResponseModel): Observable<number> {
        let successMessage: string = '';
        let failureMessage: string = 'Failed to reset your password';
        let newJwt: any;

        let Url = Constants.WebApiUrl.Auth + '/reset';  // URL to web API
        let body = JSON.stringify(changePutDetail);
        let headers = new Headers({ 'Content-Type': 'application/JSON' });

        let options = new RequestOptions({ headers: headers });

        this.loginResponse = loginResponse;

        this.http.put(Url, body, options)
            .subscribe(
            data => {
                newJwt = data.headers.toJSON();
            },
            error => {
                if (error["status"]) {
                    this.loginResponse.status = error["status"];
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
                this.loginResponse.access_token = newJwt.jwt_refresh[0];
              this.loginResponse.showCloseButton = false;
             // this.loginStoreService.loadLogin(this.loginResponse);
                this.result = true;

            });
        //Return to calling program every polling interval
        return Observable.interval(Constants.PollingInterval)

  }
  private changePasswordNew(changePutDetail: ChangePasswordPutModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = 'Failed to reset your password';
    let Url = Constants.WebApiUrl.Auth + '/reset';  // URL to web API
    let body = JSON.stringify(changePutDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON'
    });

    let options = { headers: headers };

   // console.log("Da Url: ", Url)
   //console.log("Da body: ", body)
   //console.log("Da options: ", options)

   
    return this.httpC.put(Url, body, options)
     .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
      // ,
      //  tap(data => console.log("I think pasword was Changed: ", data))
      )

  }

  public subscribeToChangeNewPasswordNew(changePutDetail: ChangePasswordPutModel, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Failed to reset your password';
    let newJwt: any;
    this.loginResponse = loginResponse;
    if (changePutDetail) {
      this.changePasswordNew(changePutDetail)
        .subscribe(
              data => {
               //newJwt = data.headers.toJSON();
               // console.log("Did we get headers: ", data)
              },
            error => {
              if (error["status"]) {
                this.loginResponse.status = error["status"];
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
              this.result = false;
            },
            () => {
              //processing the successful response
           //  this.loginResponse.access_token = newJwt.jwt_refresh[0];
              this.loginResponse.showCloseButton = false;
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
