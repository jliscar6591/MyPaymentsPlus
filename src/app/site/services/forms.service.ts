
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService, CookieService, LoginStoreService } from '../../shared/services/index'
import { LoginResponseModel } from '../../login/model/index';
import { Form, Fields, Choices } from '../model/forms.model';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  public loginResponse: LoginResponseModel;
  public currentToken: string;
  public form: any;
  public result: boolean;
  public fields: Fields[];
  public choices: Choices[];
  public newForms: any;

  constructor(
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private loginStoreSvc: LoginStoreService,
    private cookieService: CookieService,
  ) { this.loginResponse = this.loginStoreSvc.cookieStateItem;}

  public getForm(loginResponse: LoginResponseModel, formId: any, studentKey: any) {
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    let successMessage: string = '';
    let failureMessage: string = 'Get Form Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let Url = Constants.WebApiUrl.Profile + '/Form/' + formId + '/' + studentKey;
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //,
        //tap(data => console.log("form response: ", data))
      )


  };

  public subscribeToGetForm(loginResponse, formId, studentKey) {
    this.newForms = [];
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getForm(loginResponseObj, formId, studentKey)
      .subscribe(
        data => {
          this.form = data;
          this.result = true;

        },

        error => {
          //  console.log("Error: No Fees: ", this.feesList)
          this.result = false;
        }
        ,
        () => {
          if (this.result == false) {

          } else {

          }
          this.newForms.push(this.form);
          this.result = true;
        }
      );
    return this.form;
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }


}
