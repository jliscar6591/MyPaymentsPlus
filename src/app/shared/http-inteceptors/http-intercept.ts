import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authenticate.service';
import { CurrentTokenService, LoginStoreService } from '../../shared/services/index';
import { UtilityService } from '../services/utility.service';
import { StudentMealsService, StudentMealsServiceRemote, AddCartItemService, ValidCartCountService } from '../../site/services/index';

@Injectable()

   /*HttpIntercept Class - Intercepts every HttpClient request
   *This function checks the returned jwt and refreshes the jwt
   * if a new one is returned. A new jwt is returned if the current 
   * jwt has expired after approximately 15 mins or the userContext is changed
   * when a new district is selected from the multi-district toggle
   */

export class HttpIntercept implements HttpInterceptor {
 
  constructor(public auth: AuthenticationService,
    private currentTokenSrvc: CurrentTokenService,
    private loginStoreSrvc: LoginStoreService,
    public utilityService: UtilityService,
    public studentMealsServiceRemote: StudentMealsServiceRemote, 
  ) { }

 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 // console.log("You called the Interceptor: ", req);

    let newJWt = req.headers.get('Authorization');
    let reUrl = req.url;
    let currLoginResp;
    if (newJWt) {
      newJWt = newJWt.replace(/bearer/g, "");
      let currentToken = this.currentTokenSrvc.currentToken;
      if (this.currentTokenSrvc.currentLoginResponse) {
        currLoginResp = this.currentTokenSrvc.currentLoginResponse;
      } else {
        currLoginResp = this.loginStoreSrvc.cookieStateItem;
      }
     // console.log("What is the currLoginResp: ", currLoginResp )
      this.auth.refreshAccessToken(newJWt, currentToken, currLoginResp);
    }

    req.clone({
      headers: req.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
        .set('Expires', 'Thu, 01 JAN 1970 00:00:00 GMT')
        .set('If-Modified-Since', '0')

    })

     
    

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
          //for development Only
          if (event.url === 'http://api.mpp.test/profile/api/CafeteriaAccounts/GetRemote') {
            if (event.status == 206) {
              let msg = 'Error';
              console.log("We got a real error: ", event.status)
              this.studentMealsServiceRemote.subscribeToGetMeals(this.loginStoreSrvc.cookieStateItem);
              // this.utilityService.handleError(event, msg, currLoginResp)
              this.utilityService.processApiErr(event, currLoginResp, msg)
              Observable.throwError(currLoginResp.messageType)
            }
            //if (event.status == 200) {
            //  let msg = 'Error';
            //  console.log("We faked an error: ", event.status);
            ////  this.utilityService.handleError(event, msg, currLoginResp)
            //  this.utilityService.processApiErr(event, currLoginResp, msg)
            //  Observable.throwError(currLoginResp.messageType)
            //}
          }

        }
        return event;
      })
    );
  }
}
