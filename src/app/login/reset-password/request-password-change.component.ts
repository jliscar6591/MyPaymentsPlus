import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';

//local
import {
  RequestPassordChangeService,
  ToasterService,
  Toast,
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  LoginStoreService
} from '../../shared/services/index';

import { RequestPasswordChangeModel, LoginResponseModel } from '../model/index';
import { Constants } from '../../app.settings';
import { setTimeout } from 'timers';

@Component({
  templateUrl: './request-password-change.component.html',
  providers: [RequestPassordChangeService,
    FormBuilder,
    ValidateCookieService,
    CookieService
  ]
})


export class RequestPasswordChangeComponent implements OnInit {
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  private title: string = 'My Payments Plus Request Password Change';
  public requestPasswordChangeForm: FormGroup;
  public requestDetail: RequestPasswordChangeModel = { resetEmail: '', application: Constants.ResetPasswordParent, recaptchatoken: '' };
  public RecaptchaKey: string = Constants.RecaptchaKey;
  public sendingEmail: boolean = false;
  public showSuccessMessage: boolean = false;
  public showRecaptchaMessage: boolean = false;
  private resetNotPosted: boolean = true;

  constructor(private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private requestPasswordChangeService: RequestPassordChangeService,
    private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private messageProcessorService: MessageProcessorService,
    private loginStoreService: LoginStoreService

  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.requestPasswordChangeForm = this.formBuilder.group({
      'resetEmail': ['', [Validators.required, Validators.maxLength(100), Validators.pattern(Constants.EmailPattern)]]
    });
    this.requestPasswordChangeForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.requestPasswordChangeForm) { return; }
    const form = this.requestPasswordChangeForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'resetEmail': ''
  };

  validationMessages = {
    'resetEmail': {
      'required': 'Email Address is required.',
      'pattern': 'Email Address must be a valid.'
    }
  };


  requestPasswordReset() {
    this.sendingEmail = true;
    //&& this.requestDetail.recaptchatoken != ''
    if (this.requestPasswordChangeForm.valid && this.requestDetail.recaptchatoken != '') {
    //  let loginResponse: LoginResponseModel = this.validateCookie.validateCookie();
      let loginResponse: LoginResponseModel = this.loginStoreService.cookieStateItem;
     // console.log("Do we have a loginResponse at this point: ", loginResponse)
      if (!loginResponse) {
        loginResponse = new LoginResponseModel();
      //  console.log("Do we have a loginResponse Now: ", loginResponse)
      }
     
    //  let subscription =
 
      this.requestPasswordChangeService.subscribeToRequestPasswordChange(this.requestDetail, loginResponse)
        //.requestPasswordChange(this.requestDetail, loginResponse)
        //.subscribe(() => {
     window.setTimeout(() => {
          if (this.requestPasswordChangeService.result == true) {
            if (this.requestPasswordChangeService.loginResponse.messageType === Constants.Error) {
             // subscription.unsubscribe();
              this.loginStoreService.loadLogin(this.requestPasswordChangeService.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.requestPasswordChangeService.loginResponse);
              this.messageProcessorService.messageHandler();
              this.resetNotPosted = false;
              this.sendingEmail = false;
            } else {
            //  subscription.unsubscribe();
              this.captcha.reset();
              this.loginStoreService.loadLogin(this.requestPasswordChangeService.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.requestPasswordChangeService.loginResponse);
              this.sendingEmail = false;
              this.showSuccessMessage = true;
              this.resetNotPosted = false;
              this.requestDetail.recaptchatoken = '';
              this.requestPasswordChangeForm.reset();
              this.showRecaptchaMessage = false;           
            }
          } else {
            ++this.requestPasswordChangeService.count;
          }

        }, 2000);
    } else if (this.requestDetail.recaptchatoken === '') {
      this.showRecaptchaMessage = true;
      if (!this.requestPasswordChangeForm.valid) {
        this.requestPasswordChangeForm.controls['resetEmail'].markAsDirty();
        this.onValueChanged();
      }
      this.sendingEmail = false;
    } else {
      //There are errors in the form 
      this.requestPasswordChangeForm.controls['resetEmail'].markAsDirty();
      this.onValueChanged();
      this.sendingEmail = false;
    }
  }

  handleCorrectCaptcha($event) {
    let recaptchatoken = $event;
    this.requestDetail.recaptchatoken = recaptchatoken;
  }

  ngAfterViewChecked() {
    //Support toast in this component
    this.messageProcessorService.messageHandler();
  }
}
