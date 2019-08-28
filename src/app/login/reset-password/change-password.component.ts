import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

//local
import {
  ChangePasswordService,
  ToasterService,
  Toast,
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  LoginStoreService
} from '../../shared/services/index';

import { ChangePasswordPutModel, ChangePasswordModel, LoginResponseModel } from '../model/index';
import { Constants } from '../../app.settings';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  providers: [ChangePasswordService,
    FormBuilder,
    ValidateCookieService
  ]
})

export class ChangePasswordComponent implements OnInit {
  private title: string = 'My Payments Plus Change Password';
  public changePasswordForm: FormGroup;
  public changeDetail: ChangePasswordModel = { newPassword: '', confirmPassword: '', resetKey: '' };
  private changePutDetail: ChangePasswordPutModel = { newPassword: '', resetKey: '' };
  private id: string = '';
  public resetSuccesful: boolean = false;
  private restPassInterval: any;
  public resetFailed: boolean = false;
  public deviceInfo: any;

  constructor(private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private changePassordChangeService: ChangePasswordService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private route: ActivatedRoute,
    private messageProccessor: MessageProcessorService,
    private loginStoreService: LoginStoreService
  ) {
    this.id = this.route.queryParams['value']['id'];
  }

  async ngOnInit() {
    this.buildForm();
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
  }

  buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      'newPassword': ['', [Validators.required, Validators.pattern(Constants.PasswordPattern)]],
      'confirmPassword': ['']
    });

    this.changePasswordForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.changePasswordForm) { return; }
    const form = this.changePasswordForm;
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
    'newPassword': '',
    'confirmPassword': ''
  };

  validationMessages = {
    'newPassword': {
      'required': 'Password is required.',
      'pattern': 'Password must meet complexity requirements.'
    },
    'confirmPassword': {
      'required': 'Confirm Password is required.',
      'nomatch': 'Password and Confirm Password must match.'
    }
  }


  passwordOnBlur() {
    if (!this.passwordMatch()) {
      this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
    }
  }

  passwordOnFocus() {
    this.formErrors.confirmPassword = '';
  }

  passwordMatch() {
    if (this.changePasswordForm.controls['confirmPassword'].value == this.changePasswordForm.controls['newPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      if (!this.passwordMatch()) {
        this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
      } else {
        //submit password change
        let loginResponse: LoginResponseModel = this.loginStoreService.cookieStateItem;
        if (!loginResponse) {
          loginResponse = new LoginResponseModel();
        }
        //this.validateCookie.validateCookie();
        this.changeDetail.resetKey = this.route.queryParams['value']['id'];

        //Map to not-convenient api
        this.changePutDetail.newPassword = this.changeDetail.newPassword;
        this.changePutDetail.resetKey = this.changeDetail.resetKey
        //  let subscription = this.changePassordChangeService.changePassword(this.changePutDetail, loginResponse)
        //.subscribe(() => {
        this.changePassordChangeService.subscribeToChangeNewPasswordNew(this.changePutDetail, loginResponse)
        this.restPassInterval = window.setInterval(() => {
          //console.log("this.changePassordChangeService: ", this.changePassordChangeService.result)
          //console.log(" this.changePassordChangeService.loginResponse.status: ", this.changePassordChangeService.loginResponse.status)
          if (this.changePassordChangeService.result === true) {
            //console.log("We should be going back to log in")


            this.resetFailed = false;
            this.resetSuccesful = true;
            window.setTimeout(() => {
              window.clearInterval(this.restPassInterval);
              let link = ['welcome'];
              this.router.navigate(link);
            }, 2000);


          } else {
            this.resetFailed = true;

            window.setTimeout(() => {
              window.clearInterval(this.restPassInterval);
              let link = ['reset-password'];
              this.router.navigate(link);
            }, 2000);
            ++this.changePassordChangeService.count;
          }
        }, 1000);
      }
    }
  }
}
