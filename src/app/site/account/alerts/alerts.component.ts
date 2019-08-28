import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormGroupDirective, NgForm, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Constants } from '../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { StudentBalanceAlertService } from "../services/index";
import { StudentBalanceAlertModel, StudentBalanceAlertInputModel, BalanceAlert, BalanceAlertInput } from "../meal-purchases/model/index";
import { SuspendPaymentWarningService } from '../../../shared/components/suspend-payment-warning/suspend-payment-warning.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

import {
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';


@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'alerts.component.html',
  styleUrls: ['alert-level.component.less']
})

export class AlertsComponent {
  public studentBalanceAlertForm: FormGroup;
  public loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  private studentAlertInputs: StudentBalanceAlertInputModel[] = [];
  private balanceAlerts: BalanceAlert[] = new Array<BalanceAlert>();
  public hasStudents: boolean = false;
  private inputStudent: StudentBalanceAlertInputModel;
  private balanceAlertInputs: BalanceAlertInput[] = new Array<BalanceAlertInput>();
  public isGettingBalance: boolean = false;
  private savingBalances: boolean = false;
  public getBalanceErr: boolean = false;
  private getBalanceErrMsg: string;
  public saveBalanceErr: boolean = false;
  private saveBalanceErrMsg: string;
  private isSuspendPayment: boolean;
  public showEditAlerts: boolean;
  public studentBalanceAlerts: any;
  alertLevel = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);

  matcher = new MyErrorStateMatcher();
  public alertInterval: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private studentBalanceAlertService: StudentBalanceAlertService,
    private utilityService: UtilityService,
    private suspendPaymentWarningService: SuspendPaymentWarningService,
    private loginStoreService: LoginStoreService

  ) {
    this.loginResponse = this.loginStoreService.cookieStateItem;
    //since login is not required set the 
    this.loginResponse.status = '';
    this.loginResponse.incidentId = '';
    this.loginResponse.message = '';
    this.loginResponse.messageType = 'Success';
    this.loginResponse.messageTitle = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  ngOnInit() {
    this.isGettingBalance = true;
    this.studentBalanceAlertForm = new FormGroup({});
    this.alertInterval = setInterval(async () => {
      //console.log('when do we have this?', this.studentBalanceAlertService.studentBalanceAlerts);
      if (this.studentBalanceAlertService.studentBalanceAlerts) {
        this.studentBalanceAlerts = this.studentBalanceAlertService.studentBalanceAlerts
        await this.getStudentBalanceAlerts();
        this.studentBalanceAlertForm = this.formBuilder.group({});
        await this.getSuspendPayment();
        for (let i = 0; i < this.studentBalanceAlertService.studentBalanceAlerts.length; i++) {
          this.studentBalanceAlertForm.addControl('alertsArray' + i, this.formBuilder.array([]));
          const arrayControl = <FormArray>this.studentBalanceAlertForm.controls['alertsArray' + i];
          for (let alert of this.studentBalanceAlertService.studentBalanceAlerts[i].balanceAlerts) {
            arrayControl.push(this.initListItem());
          }
        }
        // console.log('balance alerts', this.studentBalanceAlertService.studentBalanceAlerts);
        clearInterval(this.alertInterval)
      } else if (this.studentBalanceAlertService.loginResponse.messageType === Constants.Error) {
        this.getBalanceErr = true;
        this.getBalanceErrMsg = this.studentBalanceAlertService.loginResponse.message;
        this.isGettingBalance = false;
        this.hasStudents = false;
        this.utilityService.clearErrorMessage(this.studentBalanceAlertService.loginResponse);
        clearInterval(this.alertInterval)
      }
    }, 50);
  }


  // This calls https://server/profile/api/LowBalanceNotificationConfiguration
  // to get Balance Alerts of the students.
  async getStudentBalanceAlerts() {
    
    this.loginStoreService.loadLogin(this.studentBalanceAlertService.loginResponse);
    // this.cookieService.putObject(Constants.AuthCookieName, this.studentBalanceAlertService.loginResponse);
    this.hasStudents = this.studentBalanceAlertService.studentBalanceAlerts.length > 0;
    // console.log(this.hasStudents);
    this.isGettingBalance = false;
  }

  initListItem() {
    return this.formBuilder.group({
      'accountbalanceId': ['', Validators.compose([Validators.required])],
      'alertLevel': ['', Validators.compose([Validators.required])]
    });
  }

  // This calls https://server/profile/api/LowBalanceNotificationConfiguration
  // to save Balance Alerts of the students.
  saveStudentBalanceAlerts() {
    this.savingBalances = true;

    this.studentBalanceAlertService.result = false;
    let subscription = this.studentBalanceAlertService.saveStudentBalanceAlerts(this.studentBalanceAlertService.studentBalanceAlerts, this.loginResponse)
      .subscribe(() => {
        if (this.studentBalanceAlertService.result == true) {
          subscription.unsubscribe();
          if (this.studentBalanceAlertService.loginResponse.messageType === Constants.Error) {
            this.savingBalances = false;
            this.saveBalanceErr = true;
            this.saveBalanceErrMsg = this.studentBalanceAlertService.loginResponse.message;

            this.utilityService.clearErrorMessage(this.studentBalanceAlertService.loginResponse);
          } else {
            this.loginStoreService.loadLogin(this.studentBalanceAlertService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.studentBalanceAlertService.loginResponse);

            this.savingBalances = false;
            this.toggleEditAlerts();

          }

        } else {
          ++this.studentBalanceAlertService.count;
        }
      });
  }

  clearForm() {
    this.studentBalanceAlertForm.reset();
  }


  setValue(value: number, outsideIndex: number, insideIndex: number) {
    if (value <= 0) {
      //Make cancel and submit buttons hide when form invalid and add Alert text
      document.getElementById("saveLBNTopBtn").style.visibility = "hidden";
      document.getElementById("saveLBNBottomBtn").style.visibility = "hidden";
      document.getElementById("cancelLBNTopBtn").style.visibility = "hidden";
      document.getElementById("cancelLBNBottomBtn").style.visibility = "hidden";
      let alertMessageTop = document.getElementById('alertMsgTop');
      alertMessageTop.innerHTML += 'Amount Cannot Be Negative';
      let alertMessageBtm = document.getElementById('alertMsgBtm');
      alertMessageBtm.innerHTML += 'Amount Cannot Be Negative';
    } if (value >= 0) {
      //Bring buttons back when form valid, remove Alert text, update values
      document.getElementById("saveLBNTopBtn").style.visibility = "initial";
      document.getElementById("saveLBNBottomBtn").style.visibility = "initial";
      document.getElementById("cancelLBNTopBtn").style.visibility = "initial";
      document.getElementById("cancelLBNBottomBtn").style.visibility = "initial";
      let alertMessageTop = document.getElementById('alertMsgTop');
      alertMessageTop.innerHTML = '';
      let alertMessageBtm = document.getElementById('alertMsgBtm');
      alertMessageBtm.innerHTML = '';
      this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].alertLevel = value;
      this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].isActive = this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].alertLevel == 0 ? false : true

    }
  }

  getSuspendPayment(): void {
    let warning: boolean = false;
    let warningMsg: string = '';
    if (!this.loginResponse.isAlertsAllowedDistrict) {
      warningMsg += `Account Balance Alerts are disabled for this account.`;
      warning = true;
    }
    this.isSuspendPayment = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
  }

  toggleEditAlerts() {
    this.showEditAlerts = false;
  }

}
