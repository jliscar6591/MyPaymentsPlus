import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';



import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { Constants } from '../../../app.settings';
import { PaymentHistoryService } from '../services/index';
import { UserPaymentSearchModel } from '../meal-purchases/model/index';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';

import {
  CookieService,
  ValidateCookieService,
  UtilityService,
  DateRangeSelectorService,
  LoginStoreService
} from '../../../shared/services/index';
import { MultiDistrictService } from '../../services/multi-district.service';
import { UserContextService } from '../services/user-context.service';
import { window } from 'rxjs-compat/operator/window';
//import { clearInterval, setInterval } from 'timers';

@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'payment-history.component.html',
  styleUrls: ['payment-history.component.less']

})


//List the payments that have been made by the user using MPP 
//according to the selected date range.
export class PaymentHistoryComponent {
  @Input() displayHistoryReceipt;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private utilityService: UtilityService,
    public dateRangeSelectorService: DateRangeSelectorService,
    private paymentHistoryService: PaymentHistoryService,
    private receiptService: ReceiptService,
    private multiDistrictSvc: MultiDistrictService,
    private userContextSvc: UserContextService,
    private loginStoreService: LoginStoreService

  ) { }

  private userPaymentSearchModel: UserPaymentSearchModel =
    {
      endDate: '',
      startDate: ''
    }

  public isHistory: boolean = false;
  public isHistoryGetting: boolean = false;
  public isCustom: boolean = false;
  public getHistoryErr: boolean = false;
  private getHistoryErrMsg: string = '';
  public showReceipt: boolean = this.receiptService.displayHistoryReceipt();
  public subscriptionR;
  public receiptDetails: any;
  public showSpinner: boolean = false;
  public isMultiDistrict: boolean = false;
  public loadPaymentHistoryInterval: any;
  private loginResponse: LoginResponseModel;
  public userPaymentModel: any;
  //date widget
  public activityPeriodForm: FormGroup;
  public activityPeriodSelection: number = 7;

  public dateRangeForm: FormGroup;
  public startDate: Date;
  public endDate: Date;

  public p: number = 1;
  public paymentHistoryInterval: any;
  public openReceiptInterval: any;

  ngOnInit() {
    //Session (must be first in the init section /
    this.loginResponse = this.loginStoreService.cookieStateItem;
    //this.validateCookie.validateCookie();
    //Date selector form
    this.activityPeriodForm = this.formBuilder.group({
      'activityPeriodSelector': new FormControl(new Date())
    });
    //type in date range form
    this.dateRangeForm = this.formBuilder.group({
      'startDate': new FormControl(new Date()),
      'endDate': new FormControl(new Date())
    })
    //Load date range selector ////
    this.getDateRangeList();
    this.isHistoryGetting = true;
    //Load payment history /
    this.setPeriod(this.userPaymentSearchModel);
    this.paymentHistoryService.subscribeTogetPaymentHistory(this.userPaymentSearchModel, this.loginResponse);
    this.loadPaymentHistoryInterval = setInterval(() => {
      if (this.paymentHistoryService.result == true) {
        this.loginStoreService.loadLogin(this.paymentHistoryService.loginResponse);
        //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentHistoryService.loginResponse);
        this.isHistory = this.paymentHistoryService.userPaymentModel != null &&
          this.paymentHistoryService.userPaymentModel.length > 0;
        this.isHistoryGetting = false;
        // console.log("We got a userPaymentModel: ", this.paymentHistoryService.userPaymentModel);
        this.userPaymentModel = this.paymentHistoryService.userPaymentModel;
        clearInterval(this.loadPaymentHistoryInterval);
      }
    }, 200);
    // console.log(this.dateRangeSelectorService);
  }

  ngDoCheck() {

  }


  //Date range list //
  getDateRangeList() {
    let subscription = this.dateRangeSelectorService.getDateRangeSelections(this.loginResponse)
      .subscribe(() => {
        if (this.dateRangeSelectorService.result == true) {
          subscription.unsubscribe();
          if (this.dateRangeSelectorService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.dateRangeSelectorService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.dateRangeSelectorService.loginResponse);

          } else {
            //enable the state selector.
            this.activityPeriodForm.controls['activityPeriodSelector'].enable();
          }
        } else {
          ++this.dateRangeSelectorService.count;
        }
      });
  }

  getPaymentHistory(userPaymentSearchModel: UserPaymentSearchModel) {
    //Search model values ////
    this.isHistoryGetting = true;
    this.paymentHistoryService.result = false;
    //  let subscription = this.paymentHistoryService.getPaymentHistory(userPaymentSearchModel, this.loginResponse)
    let failureMessage: string = 'Get Payment History Failed';
    this.paymentHistoryService.subscribeTogetPaymentHistory(this.userPaymentSearchModel, this.loginResponse);
    //.subscribe(
    //  data => {

    //    this.paymentHistoryService.userPaymentModel = data
    //  },
    //  error => {
    //    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    //    this.paymentHistoryService.result = true;
    //  },
    //  () => {
    //    //processing the successful response

    //    //Fake filter JSON includes AccountBalanceId ////////////////////////////
    //    //studentMealPurchaseSearchModel.student.studentMealPurchases =
    //    //    studentMealPurchaseSearchModel.student.studentMealPurchases.filter(
    //    //    x => x.accountBalanceId.toUpperCase() === studentMealPurchaseSearchModel.student.accountBalanceId.toUpperCase());
    //    //Comment out for fake //////////////////////////////////////////////////

    //    this.paymentHistoryService.result = true;
    //  });
    // .subscribe(() => {
    this.paymentHistoryInterval = setInterval(() => {
      // console.log("did we get a result: ", this.paymentHistoryService.userPaymentModel)
      if (this.paymentHistoryService.userPaymentModel) {
        // subscription.unsubscribe();

        if (this.paymentHistoryService.loginResponse.messageType === Constants.Error) {
          this.getHistoryErr = true;
          this.getHistoryErrMsg = this.paymentHistoryService.loginResponse.message;

          this.utilityService.clearErrorMessage(this.paymentHistoryService.loginResponse);
          this.isHistory = false;
        } else {
          this.userPaymentModel = this.paymentHistoryService.userPaymentModel;
          this.loginStoreService.loadLogin(this.paymentHistoryService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentHistoryService.loginResponse);
          this.isHistory = this.paymentHistoryService.userPaymentModel != null &&
            this.paymentHistoryService.userPaymentModel.length > 0;
          this.isHistoryGetting = false;
        }
        clearInterval(this.paymentHistoryInterval);
      } else {
        ++this.paymentHistoryService.count;
      }

    }, 200)
    // console.log('user payment model', this.userPaymentModel);

  }

  //New date range for search //
  newSearch() {
    if (this.activityPeriodSelection === 0) {
      this.isCustom = true;
    } else {
      this.isCustom = false;
      this.setPeriod(this.userPaymentSearchModel);
      this.getPaymentHistory(this.userPaymentSearchModel);
    }
  }

  dateSearch() {
    this.datePickerSet(this.userPaymentSearchModel);
    this.getPaymentHistory(this.userPaymentSearchModel);
  }

  //Process the date selector into start and end date ///
  //Based on last n days //
  setPeriod(searchCriteria: any) {
    var startDate: Date = new Date();
    var today: Date = new Date();
    var date: Date = new Date();
    startDate.setDate(today.getDate() - this.activityPeriodSelection);
    searchCriteria.endDate = today.toISOString();
    searchCriteria.startDate = startDate.toISOString();
    searchCriteria.date = date.toISOString();
    return;
  }

  datePickerSet(searchCriteria: any) {
    var startDate: Date = new Date();
    var endDate: Date = new Date();
    searchCriteria.startDate = this.startDate;
    searchCriteria.endDate = this.endDate;
    return;
  }

  openReceipt(confirmNumber) {
    // console.log('confirmNumber', confirmNumber);
    this.subscriptionR = this.receiptService.subscribeToGetHistoryReceipt(confirmNumber, this.loginResponse)
    this.openReceiptInterval = setInterval(() => {
      if (this.receiptService.receiptDetail) {
        this.receiptChange(this.receiptService.displayHistoryReceipt())
        clearInterval(this.openReceiptInterval);
      }
    }, 200);
  }

  receiptChange(event): boolean {
    // console.log("Called ReceiptChange")

    if (this.subscriptionR) {
      //console.log("Unsubscribing")
      //Unsubscribe to make sure subscription is current every time called
      this.subscriptionR.unsubscribe();
    }
    this.showSpinner = true;

    setTimeout(() => {
      this.showReceipt = event;
      this.showSpinner = false;
    }, 500);
    return this.showReceipt


  }

  ngOnDestroy() {
    this.receiptChange(this.receiptService.displayHistoryReceipt());
    if (this.subscriptionR) {
      this.subscriptionR.unsubscribe();
    }



  }

}
