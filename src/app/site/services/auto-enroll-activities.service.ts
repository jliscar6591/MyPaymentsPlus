import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

import { Constants } from '../../app.settings';
import { UtilityService, CurrentTokenService, TokenService, LoginStoreService } from '../../shared/services/index'
import { LoginResponseModel } from '../../login/model/index';

@Injectable({
  providedIn: 'root'
})
export class AutoEnrollActivitiesService {
  public loginResponse: LoginResponseModel;
  public currentToken: string;
  public cartCount: any;
  public result: boolean;

  constructor(
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private tokenService: TokenService,
    private loginStoreSvc: LoginStoreService,
  ) { this.loginResponse = this.loginStoreSvc.cookieStateItem; }

  public getAutoEnrollActivities() {
    let token = this.loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Profile + '/CartAutoLoad';
    let body = '';
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };

    return this.httpC.post(Url, body, options)
      .pipe(
        //tap(data => this.cartCount = data)
      );
  }

  public subscribeToGetAutoEnrollActivities() {
    this.getAutoEnrollActivities()
      .subscribe(
        data => {
          this.cartCount = data;
          this.result = true;
        },
        () => {
          //console.log('cartCount', this.cartCount);
        });
    return this.cartCount;
  }
}
