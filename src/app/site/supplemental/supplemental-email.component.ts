import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Constants } from '../../app.settings';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { DistrictViewModel } from '../../shared/model/index';
import { ContactOfflineViewModel, SupportRequestDetailModel } from '../supplemental/model/index';
import {
  StateProvinceListService,
  DistrictListService,
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  MessageProcessorService,
  SupportRequestService,
  LoginStoreService
} from '../../shared/services/index';

@Component({
  selector: 'supplemental-email',
  templateUrl: './supplemental-email.component.html',
  styleUrls: ['./supplemental-email.component.css', './supplemental.component.less']
})

export class SupplementalEmailComponent {
  public contactOfflineForm: FormGroup;
  private stateLoading: boolean = true;
  private loginResponse: LoginResponseModel = this.loginStoreSvc.cookieStateItem;
    //this.validateCookie.validateCookie();
  public contactOfflineView: ContactOfflineViewModel = { category: '', diagnostics: '', district: '', email: '', ids: '', message: '', names: '', schools: '', state: '' };
  private supportRequestDetail: SupportRequestDetailModel = { Category: '', Diagnostics: '', DistrictName: '', Email: '', Message: '', SchoolName: '', StudentId: '', StudentName: '' };
  public showDistrictDdl: boolean = false;
  public showNoDistrictWarning: boolean = false;
  public isSendingEmail: boolean = false;
  public categoryList: any = [
    { "value": "Account Balances", "text": "Account Balances" },
    { "value": "Payment", "text": "Payment" },
    { "value": "Purchase History", "text": "Purchase History" },
    { "value": "Registration", "text": "Registration" },
    { "value": "Fees and Activities", "text": "Fees and Activities" },
    { "value": "Sign In", "text": "Sign In" },
    { "value": "Student ID", "text": "Student ID" },
    { "value": "Other", "text": "Other" },
    { "value": "Cancel Account", "text": "Cancel Account" }
  ]

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public stateProvinceListService: StateProvinceListService,
    private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private districtListService: DistrictListService,
    private messageProcessorService: MessageProcessorService,
    private supportRequestService: SupportRequestService,
    private loginStoreSvc: LoginStoreService,
  ) {

    //since login is not required 
    this.loginResponse.status = '';
    this.loginResponse.incidentId = '';
    this.loginResponse.message = '';
    this.loginResponse.messageType = Constants.Success;
    this.loginResponse.messageTitle = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  ngOnInit(): void {
    this.buildForm();
    this.getState();
    this.cookieService.removeAll();
  }

  buildForm(): void {
    this.contactOfflineForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.pattern(Constants.EmailPattern)]],
      'state': ['', Validators.required],
      'district': ['', Validators.required],
      'schools': [''],
      'names': [''],
      'ids': [''],
      'category': ['', Validators.required],
      'message': ['', Validators.required]
    });

    this.contactOfflineForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.contactOfflineForm) { return; }
    const form = this.contactOfflineForm;
    for (const field in this.formErrors) {
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
  }

  formErrors = {
    'email': '',
    'state': '',
    'district': '',
    'schools': '',
    'names': '',
    'ids': '',
    'category': '',
    'message': '',
  };

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email must be valid.'
    },
    'state': {
      'required': 'State is required.'
    },
    'district': {
      'required': 'District is required.'
    },
    'schools': {},
    'names': {},
    'ids': {},
    'category': {
      'required': 'Subject Category is required.',
    },
    'message': {
      'required': 'Message is required.'
    }
  };

  getDistrictName(selectedDistrictValue): string {
    for (var x = 0; x < this.districtListService.districtList.length; x++) {
      if (this.districtListService.districtList[x].districtKey === selectedDistrictValue) {
        break;
      }
    }
    return this.districtListService.districtList[x].districtName;
  }


  submitForm() {
    if (this.contactOfflineForm.valid) {
      this.isSendingEmail = true;
      //Mapping
      this.supportRequestDetail.Category = this.contactOfflineView.category;
      this.supportRequestDetail.Diagnostics = "";
      this.supportRequestDetail.DistrictName = this.getDistrictName(this.contactOfflineView.district);
      this.supportRequestDetail.Email = this.contactOfflineView.email;
      this.supportRequestDetail.Message = this.contactOfflineView.message;
      this.supportRequestDetail.SchoolName = this.contactOfflineView.schools;
      this.supportRequestDetail.StudentId = this.contactOfflineView.ids;
      this.supportRequestDetail.StudentName = this.contactOfflineView.names;


      this.supportRequestService.result = false;
      let subscription = this.supportRequestService.requestSupport(this.supportRequestDetail, this.loginResponse)
        .subscribe(() => {
          if (this.supportRequestService.result == true) {

            subscription.unsubscribe();


            if (this.supportRequestService.loginResponse.messageType === Constants.Error) {
              this.loginStoreSvc.loadLogin(this.supportRequestService.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.supportRequestService.loginResponse);
              this.messageProcessorService.messageHandler();
              this.clearErrorMessage()
              this.isSendingEmail = false;


            } else {
              this.clearForm();
              this.isSendingEmail = false;
              this.loginStoreSvc.loadLogin(this.supportRequestService.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.supportRequestService.loginResponse);
              this.messageProcessorService.messageHandler();
            }

          } else {
            ++this.supportRequestService.count;
          }
        });

    } else {
      //show the error of my ways
      for (const control in this.contactOfflineForm.controls) {
        this.contactOfflineForm.controls[control].markAsDirty();
        this.onValueChanged();
      }
    }
  }

  getState() {
    this.stateLoading = true;
    let subscription = this.stateProvinceListService.getState(this.loginResponse)
      .subscribe(() => {
        if (this.stateProvinceListService.result == true) {
          subscription.unsubscribe();
          if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSvc.loadLogin(this.stateProvinceListService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);

          } else {
            //processing the successful response
            this.stateLoading = false;
            //enable the state selector.
            this.contactOfflineForm.controls['state'].enable();
          }
        } else {
          ++this.stateProvinceListService.count;
        }
      });
  }

  getDistrict(stateId: string) {
    //let districtViewModel: DistrictViewModel = { stateId: 'GA' };
    this.showNoDistrictWarning = true;

    let districtViewModel: DistrictViewModel = { stateId: stateId };
    this.districtListService.result = false;

    let subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
      .subscribe(() => {
        if (this.districtListService.result == true) {
          subscription.unsubscribe();
          if (this.districtListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSvc.loadLogin(this.districtListService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
            this.messageProcessorService.messageHandler();
            this.clearErrorMessage()

          } else {
            //processing the successful response
            this.showDistrictDdl = this.districtListService.districtList.length > 0;
          }
        } else {
          ++this.districtListService.count;
        }
      });
  }

  clearErrorMessage() {
    this.loginResponse.message = '';
    this.loginResponse.messageType = '';
    this.loginResponse.messageTitle = '';
    this.loginResponse.message = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  clearForm() {
    for (const control in this.contactOfflineForm.controls) {
      this.contactOfflineForm.controls[control].reset();
    }
  }

}
