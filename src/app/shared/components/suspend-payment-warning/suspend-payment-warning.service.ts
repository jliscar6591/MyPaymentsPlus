import { Injectable } from '@angular/core';
import { LoginResponseModel } from "../../../login/model/index";
import { SuspendPaymentWarningComponent } from './suspend-payment-warning.component';

@Injectable()
export class SuspendPaymentWarningService {
 
    public showWarning: boolean = false;
    public warningMsg: string = '';

  constructor() { }

  

  public show(): void {
   // console.log("Calling Suspend Service show");
        this.showWarning = true;
    }

  public hide(): void {
   // console.log("Calling Suspend Service hide");
        this.showWarning = false;
    }

  public getWarning(warning: boolean, warningMsg: string): boolean {
    //console.log("Calling Suspend Service getWarning");
        this.warningMsg = warningMsg;
        this.showWarning = warning;
        return warning;
    }
}
