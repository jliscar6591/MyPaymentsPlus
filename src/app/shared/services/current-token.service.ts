import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../../login/model/index';

@Injectable({
  providedIn: 'root'
})
export class CurrentTokenService {
  public currentToken;
  public currentLoginResponse;
  constructor() { }

  //Setes the current token and the LoginResponse that is sent to the http-interceptor to compare the current jwt and LoginResposnse with the jwt that is returned in the api server response
  setCurrentToken(tokenObj: any, loginRespObj: LoginResponseModel) {
    //console.log("SetCurrentToken: ", tokenObj)
   // console.log("SetCurrentLoginResponse: ", loginRespObj)
    this.currentToken = tokenObj;
    this.currentLoginResponse = loginRespObj;
  }

}
