import {Injectable} from '@angular/core';

//local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CookieService } from 'ngx-cookie';

@Injectable()

export class ValidateCookieService {
    constructor(private cookieService: CookieService) { }

  validateCookie(): LoginResponseModel {
    if (this.cookieService.get(Constants.AuthCookieName)) {
     // let tempResponse: any = this.cookieService.get(Constants.AuthCookieName);
     // return tempResponse ;
         return JSON.parse(this.cookieService.get(Constants.AuthCookieName));
        } else {
          //If the user does not have a cookie, return an empty LoginResponse
          //Allows the user to access parts of the site that don't require a login
          //EX. Using the Support link to the support page from the Login Screen 
          let emptyLoginResponse = new LoginResponseModel();
          return emptyLoginResponse;
       
        }
    }
}
