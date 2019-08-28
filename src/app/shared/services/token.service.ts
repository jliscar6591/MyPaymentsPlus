import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../../login/model/index';





@Injectable()
  //This service ensures that the jwt is formatted correctly befor making an API Call
  //The correct format: "bearer  currentToken" (the space is included)
export class TokenService {
  public currentToken: string;

  constructor() { }


  public getCurrentToken(token) { 
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
      } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    return this.currentToken;
  }



}
