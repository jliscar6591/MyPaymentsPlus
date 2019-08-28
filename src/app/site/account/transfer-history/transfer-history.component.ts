import { Component, OnInit } from '@angular/core';
import { TransfersService } from "../../services/index";
import { NgClass } from '@angular/common';
import { LoginResponseModel } from '../../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from '../../../app.settings';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { LowerCasePipe } from '@angular/common';
//import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.less']
})
export class TransferHistoryComponent implements OnInit {

  public isTransferHistory: boolean;
  public transferData: any;
  private loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  private getTransferErr: boolean = false;
  private getTransferErrMsg: string;
  public xferHistoryData: any;
  //table variables
  public displayedColumns = ['requestDate', 'from', 'to', 'status', 'amount', 'requestID'] || [];
  public dataSource = this.xferHistoryData || [];

  constructor(private transferService: TransfersService,
              private validateCookie: ValidateCookieService,
              private cookieService: CookieService,
    private utilityService: UtilityService,
    private loginStoreService: LoginStoreService
  ) {
    this.loginResponse =  this.loginStoreService.cookieStateItem;
  }

 
  
  
  ngOnInit() {
    this.xferHistoryData = this.getXferHistory();
    this.dataSource = this.xferHistoryData;
     this.transferHistoryStatus();
}

  transferHistoryStatus(): boolean {
    /*Using because server is down
      Will need to use commented code
      Once testing is completed*/
    //if (this.transferData) {
    //  this.isTransferHistory = true;
    //} else {
    //  this.isTransferHistory = false;
    //  }
    this.isTransferHistory = true;
    return this.isTransferHistory;
  }

 getXferHistory(): any {
    let subscription = this.transferService.getTransferHistory(this.loginResponse)
      .subscribe(() => {
        if (this.transferService.result == true) {
          subscription.unsubscribe();
          if (this.transferService.loginResponse.messageType === Constants.Error) {
            this.getTransferErrMsg = this.transferService.loginResponse.message;
            this.getTransferErr = true;
            this.utilityService.clearErrorMessage(this.transferService.loginResponse);
          } else {
            this.loginStoreService.loadLogin(this.transferService.loginResponse)
            //this.cookieService.putObject(Constants.AuthCookieName, this.transferService.loginResponse);
            if (this.transferService.xferHistoryObj == undefined) {
              this.isTransferHistory = false;
            } else if (this.transferService.xferHistoryObj) {
              this.isTransferHistory = true;
            }
          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == 1) {
                  this.isTransferHistory = false;
                }
                this.xferHistoryData = this.transferService.xferHistoryObj;
                this.isTransferHistory = true;
              }
            )

          }
        }
      });

    return this.xferHistoryData;
  }
  

}


