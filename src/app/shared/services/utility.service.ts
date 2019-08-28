import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
//Local
import { LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import { PaymentMethodModel, AutoPay } from '../../site/account/meal-purchases/model/index';


@Injectable()
export class UtilityService {
  public posCommError: boolean = false;
  clearErrorMessage(serviceResponse: LoginResponseModel) {
    serviceResponse.message = '';
    serviceResponse.messageType = '';
    serviceResponse.messageTitle = '';
    serviceResponse.message = '';
    serviceResponse.status = '';
    serviceResponse.showCloseButton = false;
    serviceResponse.closeHtml = '';
  }

  onValueChanged(form: FormGroup, formErrors: any, validationMessages: any) {
    for (var field in formErrors) {
      let control: any;
      // clear previous error message (if any)
      formErrors[field] = '';
      control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = validationMessages[field];
        for (const key in control.errors) {
          formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  processApiErr(error: any, loginResponse: LoginResponseModel, failureMessage: string) {
    console.log("Did we get an Error: ", error)
    console.log("Our LoginResponse: ", loginResponse);
    if (error["status"]) {
      switch (error["status"]) {
        case 412:
          loginResponse.status = '412';
          loginResponse.message = 'Unable to get purchase history at this time.';
          break;
        case 406:
          //not acceptable
          loginResponse.status = '406';
          loginResponse.message = error["statusText"];
          var errorObj: any = error;
          //JSON.parse(JSON.stringify(error["_body"]).replace(/"\s+|\s+"/g, '"'));
          if (errorObj.length > 0) {
            if (errorObj[0].hasOwnProperty('message')) {
              loginResponse.message = failureMessage + '. ' + errorObj[0].message;
            }
          }
          break;
        case 402:
          loginResponse.status = '402';
          loginResponse.message = error["statusText"];
          var errorObj: any = JSON.parse(error["_body"]);
          if (errorObj.hasOwnProperty('cartResults')) {
            loginResponse.message = failureMessage + '. ' + errorObj.cartResults[0].error;
          }
          break;
        case 409:
          loginResponse.status = '409';
          loginResponse.message = failureMessage + '. ' + error["statusText"];
          break;
        case 424:
          loginResponse.status = '424';
          loginResponse.message = error["statusText"];
          var errorObj: any = JSON.parse(error["_body"]);
          if (errorObj.hasOwnProperty('cartResults')) {
            loginResponse.message = failureMessage + '. ' + errorObj.cartResults[0].error;
          }
          break;
        case 500:
          loginResponse.status = error["status"];
          let errorObject: any = JSON.parse(error["_body"]);
          if (errorObject.incidentId) {
            loginResponse.message = failureMessage + '.  Refer to incident ' + errorObject.incidentId;
          } else {
            loginResponse.message = failureMessage + '.  Http status code ' + "500";
          }
          break;
        case 400:
          loginResponse.status = error["status"];
          loginResponse.message = failureMessage + ".  Please Add All Required Information.";
          break;
        // for development Only
        //case 200:
        //  loginResponse.status = error["status"];
        //  loginResponse.message = failureMessage + ".  There was an error communicating with the POS system. Please refresh to ensure data is up to date.";
        //  this.posCommError = true;
        //  console.log("Error Login Response: ", loginResponse)
        //  break;
        // case 206: - commenting out for development Only
        case 206:
          loginResponse.status = error["status"];
          loginResponse.message = failureMessage + ".  There was an error communicating with the POS system. ";
          this.posCommError = true;
          console.log("Error Login Response: ", loginResponse)
          break;
        default:
          loginResponse.message = failureMessage + '.  Http status code ' + error["status"];
          break;
      }
    } else {
      loginResponse.message = failureMessage;
    }

    loginResponse.showCloseButton = true;
    loginResponse.messageType = Constants.Error;
    loginResponse.messageTitle = 'Message: ';

  }

  isAch(walletKey: string, paymentMethods: PaymentMethodModel[]): boolean {
    let isAch: boolean = false;
    paymentMethods.forEach(a => {
      if (a.walletKey == walletKey) {
        if (a.accountType.toLocaleLowerCase() == 'savings' || a.accountType.toLocaleLowerCase() == 'checking') {
          isAch = true;
        }
      }
    });
    return isAch;
  }


  isAchBlocked(loginResponse: LoginResponseModel): boolean {
    let isAchBlocked: boolean = false;
    //normalize flags
    let userAllowAch: boolean = !loginResponse.isBlockACH;
    let districtAllowAch: boolean = loginResponse.isAchAllowed;

    isAchBlocked = !(userAllowAch && districtAllowAch);

    return isAchBlocked;
  }

  public handleError(error, failureMessage, loginResponse): any {
    this.processApiErr(error, loginResponse, failureMessage);
    console.log(loginResponse.message);
    return Observable.throwError(loginResponse.message);
  }

  public checkLoginResponse(loginResponse: LoginResponseModel, defaultLoginResponse): string {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = defaultLoginResponse;
    }

    return loginResponseObj;
  }
}
