import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DashboardDistrictMessageService } from '../../../services/index';
import { BonusScheduleService } from '../../../services/bonus-schedule.service';
import { Constants } from '../../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../../login/model/index';
import { MatTableModule } from '@angular/material/table';



import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../../shared/services/index';
import { mealBonusSchedule } from '../../../model/meal-bonus-schedule.model';
import { genBonusSchedule } from '../../../model/gen-bonus-schedule.model';
import { forEach } from '@angular/router/src/utils/collection';




@Component({
  selector: 'app-bonus-ad-dialog',
  templateUrl: './bonus-ad-dialog.component.html',
  styleUrls: ['./bonus-ad-dialog.component.less']
})
export class BonusAdDialogComponent implements OnInit {
  private loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
  private districtName;
  public BonusSchedule: mealBonusSchedule[];
  

  constructor(
    public thisDialogRef: MatDialogRef<BonusAdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    public dashboardDistrictMessageService: DashboardDistrictMessageService,
    private districtLoginDerivedService: DistrictLoginDerivedService,
    public bonusScheduleService: BonusScheduleService,
    private loginSrvcStore: LoginStoreService
  ) {
    this.loginResponse = this.loginSrvcStore.cookieStateItem;
  }

  ngOnInit() {
    this.getDistrictName();
    this.getBonusSchedule();
  }


  onCloseConfirm() {
    this.thisDialogRef.close('Confirm');
  }

  getDistrictName() {
    let subscription = this.dashboardDistrictMessageService.getName(this.loginResponse)
      .subscribe(() => {
        if (this.dashboardDistrictMessageService.result == true) {
          subscription.unsubscribe();

          if (this.dashboardDistrictMessageService.loginResponse.messageType === Constants.Error) {
            this.loginSrvcStore.loadLogin(this.dashboardDistrictMessageService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
            this.messageProcessorService.messageHandler();
          } else {
            this.dashboardDistrictMessageService.districtName;
            this.loginSrvcStore.loadLogin(this.dashboardDistrictMessageService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.dashboardDistrictMessageService.loginResponse);
          }
        } else {
          ++this.dashboardDistrictMessageService.count;
        }
      });
  }

  getBonusSchedule() {
    let subscription = this.bonusScheduleService.getBonusSchedule(this.loginResponse)
      .subscribe(() => {
        if (this.bonusScheduleService.result == true) {
          subscription.unsubscribe();

          if (this.bonusScheduleService.loginResponse.messageType === Constants.Error) {
            this.loginSrvcStore.loadLogin(this.bonusScheduleService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.bonusScheduleService.loginResponse);
          } else { 
            this.BonusSchedule = this.bonusScheduleService.mealbonusSchedule;
            this.loginSrvcStore.loadLogin(this.bonusScheduleService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.bonusScheduleService.loginResponse)
          }
        } else {
          ++this.bonusScheduleService.count;
        }
      });
  }
}
