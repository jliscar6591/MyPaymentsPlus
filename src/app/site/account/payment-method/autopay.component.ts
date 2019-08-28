import { Component, ViewContainerRef, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Constants } from '../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { PaymentMethodComponent } from './payment-method.component';
import { SuspendPaymentWarningService } from '../../../shared/components/suspend-payment-warning/suspend-payment-warning.service';


import { PaymentAutoPayService, PaymentMethodService, PaymentUtilityService } from "../services/index";
import { StudentAutoPayModel, AutopaySetupModel, AutopayStudent, AutoPay, PaymentMethodModel } from "../meal-purchases/model/index";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';
import { MultiDistrictService } from '../../../site/services/multi-district.service';
import {
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
//import { setTimeout, clearInterval } from 'timers';
import { AutopayFeeService } from '../../account/services/autopay-fee.service';
import { AutoPayRate } from '../../account/model/autopay-rate.model';

@Component({
  moduleId: module.id,
  selector: 'autopay',
  templateUrl: './autopay.component.html',
  styleUrls: ['./autopay.component.less'],
  providers: [PaymentMethodComponent]
})

export class AutopayComponent implements DoCheck {
  public paymentSelector: boolean = false;
  private studentIdx: number = 0;
  private planIdx: number = 0;
  private autopayForm: FormGroup;
  public setupAutopay: boolean = false;
  public isgettingAutoPay: boolean = false;
  private loginResponse: LoginResponseModel;
  private getAutoPayErrMsg: string;
  private getAutoPayErr: boolean = false;
  public hasAutoPay: boolean;
  private localAutoPayDtls: StudentAutoPayModel[];
  private hasWallets: boolean;
  private autopaysetup: AutopaySetupModel = new AutopaySetupModel();
  private autoPayStudents: AutopayStudent[];
  private failedtoAddMsg: string;
  private isAdding: boolean;
  private failedtoAdd: boolean;
  public editAutopay: boolean;
  private isSaving: boolean;
  private failedtoSave: boolean;
  private failedtoSaveMsg: string;
  private autoPayAmountList: number[];
  private autoPayMinBalList: number[];
  private failedtoDelete: boolean;
  private delautopayAccount: string;
  private delwalletName: string;
  private failedtoDeleteMsg: string;
  public isDeleting: boolean;
  public isSuspendPayment: boolean;
  private paymentMethodsFiltered: PaymentMethodModel[];
  public AbstractControl: any;
  private abcontrol: AbstractControl;
  public autoPayDetailsList: any;
  public autoPayStudent: any;
  public studentList: any;
  public autoPayAddedCntr: number = 0;
  public autoPayUpdatedCnter: number = 0;
  public autoPayDeletedCnter: number = 0;
  public autopayRate: AutoPayRate;
  public autopayFee: any;
  public showFee: boolean;
  public ratePlanCatch: boolean;
  public autoPayInterval: any;
  public autoPayDetails: any;
  public deleteInterval: any;
  public setUpInterval: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    public paymentAutoPayService: PaymentAutoPayService,
    private utilityService: UtilityService,
    private paymentutiltity: PaymentUtilityService,
    private paymentMethodService: PaymentMethodService,
    private dialogService: SimpleDialogService,
    private viewContainerRef: ViewContainerRef,
    private paymentMethodComponent: PaymentMethodComponent,
    private suspendPaymentWarningService: SuspendPaymentWarningService,
    private multiDistrictSrvc: MultiDistrictService,
    private pageLoadingService: PageLoadingService,
    private loginStoreSrvc: LoginStoreService,
    private autopayFeeService: AutopayFeeService,

  ) {
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
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
    //  console.log('AutopayComponent')

    this.buildForm();
    this.getAutoPayDetails();
    this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
    this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
    this.getSuspendPayment();
    // console.log("Do we have a payment Amount: ", this.paymentAutoPayService.autopayDetails)
    this.autopayFeeService.subscribetoGetAutoPayFee(this.loginResponse);
    // console.log('feeRate', this.autopayFeeService.autopayRate);
    if (this.autopayFeeService.autopayRate) {
      this.autopayRate = this.autopayFeeService.autopayRate;
    } else {
      this.ratePlanCatch = false;
    }
    if (this.paymentAutoPayService.autopayDetails) {
      this.autoPayDetailsList = this.setAutoPayDeatialsList(this.paymentAutoPayService.autopayDetails);
      this.hasAutoPay = true;
    }
  }

  ngDoCheck() {
    //console.log('isgettingAutoPay', this.isgettingAutoPay);
    //console.log('hasAutoPAy', this.hasAutoPay);
    //console.log('isdeleting', this.isDeleting);
    this.multiDistrictSrvc.upDatePaymentMethod$.subscribe(() => {
      // console.log("We changed districts on Paqyments: ", this.multiDistrictSrvc.updateAutoPay);
      if (this.multiDistrictSrvc.updateAutoPay === true && this.multiDistrictSrvc.autoPayCounter < 2) {
        window.setTimeout(() => {
          this.buildForm();
          this.getAutoPayDetails();
          this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
          this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
          this.getSuspendPayment();
          this.multiDistrictSrvc.updateAutoPay = false;
          this.pageLoadingService.hide();
          this.multiDistrictSrvc.upDatePaymentMethod$.emit(false);

        }, 500)

        this.multiDistrictSrvc.autoPayCounter++;

      }
    })
    //Listens for a new Auto Pay Being Added
    this.paymentAutoPayService.autoPayAdded$.subscribe(() => {
      if (this.paymentAutoPayService.postResults === true && this.autoPayAddedCntr < 2) {
        window.setTimeout(() => {
          this.buildForm();
          this.getAutoPayDetails();
          this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
          this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
          this.paymentAutoPayService.postResults = false;

        }, 500)
        this.autoPayAddedCntr++;
      }

    });
    //Listens for a new Auto Pay Being Updated
    this.paymentAutoPayService.autoPayUpdated$.subscribe(() => {
      if (this.paymentAutoPayService.updateResults === true && this.autoPayUpdatedCnter < 2) {
        window.setTimeout(() => {
          this.buildForm();
          this.getAutoPayDetails();
          this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
          this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
          this.paymentAutoPayService.updateResults = false;

        }, 500)
        this.autoPayUpdatedCnter++;
      }

    });

    // //Listens for a new Auto Pay Being Deleted
    this.paymentAutoPayService.autoPayDeleted$.subscribe(() => {
      if (this.paymentAutoPayService.deleteResults === true && this.autoPayDeletedCnter < 1) {
        window.setTimeout(() => {
          this.buildForm();
          this.getAutoPayDetails();
          this.autoPayAmountList = this.paymentutiltity.autoPayAmountList();
          this.autoPayMinBalList = this.paymentutiltity.autoPayMinBalList();
          this.paymentAutoPayService.deleteResults = false;
           //console.log('does this just keep going?');
        }, 1000)
        this.autoPayDeletedCnter++;

      }
    });

    if (this.autopayForm.controls.paymentAmount.touched) {
      this.calculateFee();
    } else {

    }

    if (this.ratePlanCatch === false) {
      if (this.autopayFeeService.autopayRate) {
        this.autopayRate = this.autopayFeeService.autopayRate;
        this.ratePlanCatch = true;
      }
    }

    //if (this.studentList.paymentAmount) {
    //  console.log('amount', this.studentList.paymentAmount);
    //}


  }

  public calculateFee() {
    if (this.autopayForm.controls.paymentAmount.value < this.autopayRate.tippingPoint || this.autopayRate.tippingPoint < 0) {
      //console.log('paymentAmount', this.autopayForm.controls.paymentAmount.value);
      //console.log('autopayRate', this.autopayRate);
      if (this.autopayRate.consumerModel === 'Flat') {
        this.autopayFee = this.autopayRate.consumerRate
      } else if (this.autopayRate.consumerModel === 'Percent') {
        this.autopayFee = this.autopayForm.controls.paymentAmount.value * (this.autopayRate.consumerRate / 100);
      }
      //console.log('autopayFee', this.autopayFee);
      this.showFee = true;
    } else {
      this.autopayFee = 0;
      this.showFee = true;
    }
  }

  paymentDisplay(studentIdx: number, planIdx: number): string {
    let result: string
    if (this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount) {
      result = this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount.toString();
      if (result == '0') {
        result = '*';
      }
      //console.log("paymentDisplay Results: ", result)
    }
    return result
  }

  togglePaymentSelector() {
    this.paymentSelector = !this.paymentSelector;
  }
  updatePayment(value: number, studentIdx: number, planIdx: number) {
    this.paymentAutoPayService.autopayDetails[0].students[studentIdx].settings[planIdx].paymentAmount = value;
    this.togglePaymentSelector();

  }
  updatePaymentCustom(studentIdx: number, planIdx: number) {
    this.togglePaymentSelector();
  }

  buildForm(): void {
    this.autopayForm = this.formBuilder.group({
      'walletKey': ['', [Validators.required]],
      'paymentAmount': ['', [Validators.required, Validators.pattern(Constants.DecimalPattern)]],
      'minBalance': ['', [Validators.required, Validators.pattern(Constants.DecimalPattern)]]
    });

    this.autopayForm.valueChanges
      .subscribe(data => this.onValueChangedData(data));
  }

  onValueChanged(form: FormGroup) {
    for (var field in this.formErrors) {
      let control: any;
      // clear previous error message (if any)
      this.formErrors[field] = '';
      control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
    this.calculateFee();
  }


  showFormErrors() {
    for (const control in this.autopayForm.controls) {
      this.autopayForm.controls[control].markAsDirty();
      this.onValueChanged(this.autopayForm);
    }
  }


  onValueChangedData(data?: any) {
    if (!this.autopayForm) { return; }
    this.onValueChanged(this.autopayForm);
  }

  formErrors = {
    'walletKey': '',
    'paymentAmount': '',
    'minBalance': ''
  };

  validationMessages = {
    'walletKey': {
      'required': 'Payments will be made using is required Field.'
    },
    'paymentAmount': {
      'required': 'Make an automatic payment of is required Field.',
      'pattern': 'Amount must be valid.'
    },
    'minBalance': {
      'required': 'When balance falls below is required.',
      'pattern': 'Amount must be valid.'

    }
  }


  setCommon() {
    this.autoPayAddedCntr = 0;
    // console.log("What are the AutoPayDetails: ", this.paymentAutoPayService.autopayDetails)

    // console.log("What is the: ", this.loginStoreSrvc.storeLoginResponse);

    // console.log("What are the AutoPayDetails: ", this.paymentAutoPayService.autopayDetails)

    // console.log("What is the: ", this.loginStoreSrvc.storeLoginResponse);
    if (this.loginStoreSrvc.storeLoginResponse) {
      for (let i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
        if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[0].districtKey) {
          this.autopaysetup.studentName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].firstName + ' ' +
            this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].lastName;
          this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
          this.autopaysetup.categoryName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryName;
          this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
        }

      }

    } else {
      this.autopaysetup.studentName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].firstName + ' ' +
        this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].lastName;
      this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
      this.autopaysetup.categoryName = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryName;
      this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
    }

  }

  filterPaymentMethods() {
    if (this.utilityService.isAchBlocked(this.loginResponse)) {
      this.paymentMethodsFiltered = this.paymentMethodService.paymentMethods.filter(a =>
        a.accountType.toLocaleLowerCase() != 'checking' && a.accountType.toLocaleLowerCase() != 'savings'
      );
    } else {
      this.paymentMethodsFiltered = this.paymentMethodService.paymentMethods;
    }

  }
  setuppay(studentIdx: number, planIdx: number) {
    this.filterPaymentMethods();
    this.studentIdx = studentIdx;
    this.planIdx = planIdx;

    this.autopaysetup.isActive = true;
    this.setupAutopay = true;
    this.studentList = this.paymentAutoPayService.autopayDetails;
    //this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx];

    // console.log("The setupStudentList: ", this.studentList)

    //.students[this.studentIdx].settings[this.planIdx]
    // So the ddl will show the placeholder
    if (this.loginStoreSrvc.storeLoginResponse) {
      for (let i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
        if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[i].districtKey) {
          // this.paymentAutoPayService.autopayDetails[i].students[this.studentIdx].settings[this.planIdx].paymentAmount = null;
          this.studentList.paymentAmount = null;
          // this.paymentAutoPayService.autopayDetails[i].students[this.studentIdx].settings[this.planIdx].accountMinBalance = null;
          this.studentList.accountMinBalance = null;


        }
      }
    } else {
      this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount = null;
      this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance = null;
    }


    //Ensures form is marked clean when attempting multiple autopays
    if (this.autopayForm.pristine == false) {
      // this.autopayForm.controls[abcontrol]
      this.autopayForm.reset();
      this.autopayForm.markAsPristine();
      this.autopayForm.controls.markAsPristine;
    } else {
      //console.log("This form is Crystal Clear");
    }
  }

  editpay(studentIdx: number, planIdx: number) {
    // console.log("Does edit have the studentList: ", this.paymentAutoPayService.autopayDetails)
    console.log(studentIdx);
    console.log(planIdx)
    this.studentList = this.paymentAutoPayService.autopayDetails
    // console.log("Does edit have the studentList: ", this.studentList)
    this.filterPaymentMethods();
    this.studentIdx = studentIdx;
    this.planIdx = planIdx;

    this.autopaysetup.isActive = true;
    this.editAutopay = true
  }

  getAutoPayDetails() {
    // console.log("Calling getAutoPayDetails")
    this.isgettingAutoPay = true;
    // console.log("CurrentLoginResponse sent to getAutoPay: ", this.loginResponse)
    setTimeout(async () => {
      // console.log("Do we have a result: ", this.paymentAutoPayService.autopayDetails)

      if (this.paymentAutoPayService.result) {
        // console.log("Do we have Details: ", this.paymentAutoPayService.autopayDetails)
        if (this.paymentAutoPayService.loginResponse.messageType === Constants.Error) {
          this.getAutoPayErrMsg = this.paymentAutoPayService.loginResponse.message;
          this.getAutoPayErr = true;
          this.hasAutoPay = false;
          this.isgettingAutoPay = false;
          this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
        } else {
          this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse);
          //If multi-district use the current district autoPayDetails
          if (this.loginStoreSrvc.storeLoginResponse) {
            for (let i = 0; i < this.paymentAutoPayService.autopayDetails.length; i++) {
              if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.paymentAutoPayService.autopayDetails[i].districtKey) {
                if (this.paymentAutoPayService.autopayDetails[i]) {
                  this.hasAutoPay = this.paymentAutoPayService.autopayDetails[i].students.length > 0;
                  // console.log("Can we get Students: ", this.paymentAutoPayService.autopayDetails[i].students)
                  // console.log("this hasAutoPay: ", this.hasAutoPay)
                }
              }
            }
          } else {
            if (this.paymentAutoPayService.autopayDetails[0]) {
              this.hasAutoPay = this.paymentAutoPayService.autopayDetails[0].students.length > 0;
              //console.log("this hasAutoPay: ", this.hasAutoPay)
            }
          }
          //console.log("What is: ", this.paymentAutoPayService.autopayDetails)
          this.autoPayDetailsList = this.paymentAutoPayService.autopayDetails;
          //console.log("Can we get Students: ", this.autoPayDetailsList)
          this.isDeleting = false;
          this.hasAutoPay = true;
          this.setupAutopay = false;
          this.editAutopay = false;
          //console.log('result', this.paymentAutoPayService.result);
          //console.log("hasAutoPAy: ", this.hasAutoPay)
          this.isgettingAutoPay = false;

        }
      } else {
        ++this.paymentAutoPayService.count;
      }
      //clearInterval(this.autoPayInterval);
    }, 1000)
  }


  private setAutoPayDeatialsList(autopayDetails: any) {
    //console.log("calling setAutoPayDeatialsList with details: ", autopayDetails)
    // console.log("What is the loginResponse: ", this.loginResponse)
    let loginObj: any = this.loginResponse
    //for(let )
    let formatedList: any[] = [];
    for (let i = 0; i < autopayDetails.length; i++) {
      if (autopayDetails[i].districtKey === loginObj.districtKey) {
        // console.log("Pushing thiese details: ", autopayDetails[i])
        formatedList = [autopayDetails[i]];
      }
    }

    //console.log("Did we get a formated List: ", formatedList)


    return formatedList;
  }

  //Add new autoPay
  setupstudentAutopay() {
    //console.log("Calling setupstudentAutopay: ", this.loginStoreSrvc.storeLoginResponse)
    //console.log("the studentList: ", this.studentList)
    //console.log("Saving with this obj: ", this.paymentAutoPayService.autopayDetails)
    if (this.loginStoreSrvc.storeLoginResponse) {
      for (let i = 0; i < this.studentList.students.length; i++) {
        if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
          // console.log("Do we have a value: ", this.paymentAutoPayService.autopayDetails)
          if (!this.studentList.accountMinBalance) {
            this.autopayForm.get('minBalance').setErrors({ "required": true });
          }
          //this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount
          if (!this.studentList.paymentAmount) {
            this.autopayForm.get('paymentAmount').setErrors({ "required": true });
          }

        }
      }
    } else {
      if (!this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance) {
        this.autopayForm.get('minBalance').setErrors({ "required": true });
      }
      if (!this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount) {
        this.autopayForm.get('paymentAmount').setErrors({ "required": true });
      }
    }

    // console.log("Is the form valid: ", this.autopayForm)

    if (this.autopayForm.valid) {
      this.isAdding = true;
      //this.setupAutopay = false;
      this.paymentAutoPayService.result = false;
      //Mapping
      this.setCommon();

      if (this.loginStoreSrvc.storeLoginResponse) {
        for (let i = 0; i < this.studentList.students.length; i++) {
          if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
            // console.log("do we have autopaysetup.accountBalanaceId: ", this.studentList.students[this.studentIdx].accountBalanceID)
            this.autopaysetup.accountBalanaceId = this.studentList.students[this.studentIdx].accountBalanceID;
            //  console.log("do we have autopaysetup.accountBalanaceId: ", this.autopaysetup.accountBalanaceId)
            this.autopaysetup.walletKey = this.studentList.walletKey;
            this.autopaysetup.accountMinBalance = this.studentList.accountMinBalance;
            this.autopaysetup.paymentAmount = this.studentList.paymentAmount;
            this.autopaysetup.categoryKey = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryKey;
            this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
            // console.log(this.autopaysetup.studentName);
            this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;

          }
        }
      } else {
        // console.log("do we have autopaysetup.accountBalanaceId2: ", this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID)
        this.autopaysetup.accountBalanaceId = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].accountBalanceID;
        //  console.log("do we have autopaysetup.accountBalanaceId2: ", this.autopaysetup.accountBalanaceId)
        this.autopaysetup.walletKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletKey;
        this.autopaysetup.accountMinBalance = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance;
        this.autopaysetup.paymentAmount = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount;
        this.autopaysetup.categoryKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].categoryKey;
        this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
        this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
      }

      //console.log("this.autopaysetup: ", this.autopaysetup);


      this.paymentAutoPayService.subscribeToSetupStudentAutoPay(this.autopaysetup, this.loginResponse)
      this.setUpInterval = setInterval(() => {
        if (this.paymentAutoPayService.result === true) {
          // subscription.unsubscribe();
          if (this.paymentAutoPayService.loginResponse.messageType === Constants.Error) {
            this.failedtoAddMsg = this.paymentAutoPayService.loginResponse.message;
            this.isAdding = false;
            this.failedtoAdd = true;
            this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
          } else {
            this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse)
            // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            //Client side -- set hasAutopay flag
            //this.paymentMethodService.paymentMethods.forEach(a => {
            //    if (a.walletKey == this.autopaysetup.walletKey) {
            //        a.hasAutopay = true;
            //    }
            //});
            //Call api -- to get updated hasAutopay flag
            this.paymentMethodComponent.getPaymentMethods();
            this.isAdding = false;
            this.setupAutopay = false
            //console.log('does this keep going');
            this.failedtoAdd = false;

          }
          clearInterval(this.setUpInterval);
        } else {
          ++this.paymentAutoPayService.count;
        }
      }, 500)

      //});
    } else {
      //  console.log("does this form have errors: ", this.autopayForm);
      this.showFormErrors();
    }
  }

  //Edit autoPay
  updateAutopay() {
    if (this.autopayForm.valid) {
      this.autoPayAddedCntr = 0;
      this.isSaving = true;
      this.autoPayUpdatedCnter = 0;
      //Mapping
      this.setCommon()
      // console.log("Do we have studentList value: ", this.studentList)
      //this.paymentAutoPayService.autopayDetails.students
      if (this.loginStoreSrvc.storeLoginResponse) {
        for (let i = 0; i < this.studentList.students.length; i++) {
          // console.log("Do update have paymentAutoPayService.autopayDetails: ", this.paymentAutoPayService.autopayDetails)
          if (this.loginStoreSrvc.storeLoginResponse.districtKey == this.studentList.districtKey) {
            this.autopaysetup.paymentAmount = this.studentList.paymentAmount;
            this.autopaysetup.accountMinBalance = this.studentList.accountMinBalance;
            this.autopaysetup.walletKey = this.studentList.walletKey;
            this.autopaysetup.autoPaySettingsKey = this.studentList.students[this.studentIdx].settings[this.planIdx].autoPaySettingsKey;
            this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
            // console.log(this.autopaysetup.studentName);
            this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;
            // console.log(this.autopaysetup.categoryName);
          }
        }
      } else {
        this.autopaysetup.walletNickname = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletNickname;
        this.autopaysetup.paymentAmount = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].paymentAmount;
        this.autopaysetup.accountMinBalance = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].accountMinBalance;
        this.autopaysetup.walletKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletKey;
        this.autopaysetup.autoPaySettingsKey = this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].autoPaySettingsKey;
        this.autopaysetup.studentName = this.studentList.students[this.studentIdx].firstName;
        this.autopaysetup.categoryName = this.studentList.students[this.studentIdx].settings[this.planIdx].categoryName;

        //  console.log("do we have autopaysetup.walletNickname: ", this.paymentAutoPayService.autopayDetails[0].students[this.studentIdx].settings[this.planIdx].walletNickname)

        //  console.log("do we have autopaysetup.walletNickname2: ", this.autopaysetup.walletNickname)

      }

      this.paymentAutoPayService.subscribeToUpdatePaymentAutoPay(this.autopaysetup, this.loginResponse);
      window.setTimeout(() => {
        if (this.paymentAutoPayService.result == true) {
          if (this.paymentAutoPayService.loginResponse.messageType === Constants.Error) {
            this.failedtoSaveMsg = this.paymentAutoPayService.loginResponse.message;
            this.isSaving = false;
            this.failedtoSave = true;
            this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
          } else {
            this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse);
            //  this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            //Call api -- to get updated hasAutopay flag
            this.paymentMethodComponent.getPaymentMethods();

            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.editAutopay = false
                  this.isSaving = false;
                  this.failedtoSave = false;
                  this.isgettingAutoPay = false;
                }
              });
          }
        } else {
          ++this.paymentAutoPayService.count;
        }
      }, 1000)

      // });
    } else {
      this.showFormErrors();
    }
  }

  //Delete autoPay
  async deleteAutopay(delautopayAccount: string) {
    this.isDeleting = true;
    this.failedtoDelete = false;
    this.autoPayDeletedCnter = 0;
    // console.log('does this just keep going?');
    // let subscription = this.paymentAutoPayService.deleteAutopay(delautopayAccount, this.loginResponse)
    // .subscribe(() => {
    await this.paymentAutoPayService.subscribeToDeleteAutoPay(delautopayAccount, this.loginResponse)

    if (this.paymentAutoPayService.result === true) {
      // subscription.unsubscribe();
      if (this.paymentAutoPayService.loginResponse.messageType === Constants.Error) {
        this.failedtoDeleteMsg = this.paymentAutoPayService.loginResponse.message;
        this.failedtoDelete = true;
        this.isDeleting = false;
        this.utilityService.clearErrorMessage(this.paymentAutoPayService.loginResponse);
        ;
      } else {
        this.loginStoreSrvc.loadLogin(this.paymentAutoPayService.loginResponse);
        // this.cookieService.putObject(Constants.AuthCookieName, this.paymentAutoPayService.loginResponse);
        //this.buildForm();
        //this.getAutoPayDetails();
        this.deleteInterval = setInterval(async () => {
          //this.autoPayDetailsList = this.paymentAutoPayService.autopayDetails;
        //  if (this.autoPayDetailsList) {
           await this.setAutoPayDeatialsList(this.paymentAutoPayService.autopayDetails);
        //    this.hasAutoPay = true;
        //this.failedtoDelete = false;
        //    console.log('does it get here')
        //    this.isgettingAutoPay = false;
        //this.isDeleting = false;
        //      this.getAutoPayDetails();
        //    this.setupAutopay = false;
        //    this.editAutopay = false;
        //    //Call api -- to get updated hasAutopay flag
        //    this.paymentMethodComponent.getPaymentMethods();
          //clearInterval(this.deleteInterval);
          console.log(this.paymentAutoPayService.autopayDetails);
        //  }
        }, 5000)
      }

    } else {
      ++this.paymentAutoPayService.count;
    }


  }

  cancelAddorEdit() {
    this.setupAutopay = false;
    this.editAutopay = false;
    this.autopaysetup.paymentAmount = 0;
    this.autopaysetup.accountMinBalance = 0;
    this.getAutoPayDetails();
  }

  showDeleteDialog(plan) {
    var dialogContent = '<p>Please confirm that you would like to delete the following Autopay:</p>';
    if (plan.walletNickname == '') {
      dialogContent += '<p><b>Account* ' + plan.accountTail + '</b></p>';
    }
    else {
      dialogContent += '<p><b>' + plan.walletNickname + '</b> (Account *' + plan.accountTail + ')</p>';
    }
    this.dialogService.open("Delete Autopay", dialogContent, 'Delete', null, this.viewContainerRef)
      .subscribe(result => {
        if (result) {
          this.deleteAutopay(plan.autoPaySettingsKey)
        };
      });

  }

  getSuspendPayment(): void {
    let warning: boolean = false;
    let warningMsg: string = '';

    if (this.loginResponse.isBlockPayments) {
      warningMsg += `Payments are disabled for this account.`;
      warning = true;
    }
    else if (this.loginResponse.allPaymentsSuspended) {
      warningMsg += `All payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate +
        `. Autopay settings will not process during this time.`
      warning = true;
    } else if (this.loginResponse.mealPaymentsSuspended) {
      warningMsg += `Meal payments are suspended at your district and
                           scheduled to resume on ` + this.loginResponse.allPaymentsResumeDate +
        `. Autopay settings will not process during this time.`
      warning = true;
    }
    this.isSuspendPayment = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
  }

  parseWalletNickname(plan: AutoPay): string {
    if (plan.walletNickname || (plan.walletNickname != '')) {
      return plan.walletNickname.toString();
    } else {
      return 'account ending in ' + plan.accountTail;
    }
  }
}
