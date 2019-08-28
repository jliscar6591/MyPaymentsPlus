import { Component, OnInit, AfterViewChecked, Inject } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { Constants } from '../app.settings';
import { LoginModel, LoginResponseModel } from '../login/model/index';
import { RegistrationViewModel, RegistrationDetailModel, UserDuplicationModel, UserDuplicationResponseModel } from './model/index';
import { UserDuplicationCheckService, UserCreateService } from './services/index';
import { DistrictViewModel } from '../shared/model/index';
import { PrivacyDialogComponent } from './privacy-dialog/privacy-dialog.component';
import { TermsDialogComponent } from './terms-dialog/terms-dialog.component';

//local
import {
  StateProvinceListService,
  DistrictListService,
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  MessageProcessorService,
  LoginStoreService
} from '../shared/services/index';


@Component({
  selector: 'register-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['../app.component.less', './registration-form.component.less']
})

export class RegistrationFormComponent implements OnInit {
  public registrationForm: FormGroup;
  private districtViewModel: DistrictViewModel;
  private loginResponse: LoginResponseModel = new LoginResponseModel();
  public registrationView: RegistrationViewModel = {
    district: '',
    email: '',
    firstName: '',
    lastName: '',
    newPassword: '',
    state: ''
  };
  private registrationDetail: RegistrationDetailModel = {
    application: '', districtKey: '', email: '', firstName: '', lastName: '', plaintextPassword: '', segmentation: [1]
  }
  public duplicationError: boolean = false;
  private userDuplication: UserDuplicationModel = { application: '', email: '' };
  private userDuplicationResponse: UserDuplicationResponseModel;
  public duplicationErrorMessage: string = '';
  public stateLoading: boolean = true;
  public showDistrictDdl: boolean = false;
  public showNoDistrictWarning: boolean = false;

  public isLoading: boolean = false;

  constructor(private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private districtListService: DistrictListService,
    public stateProvinceListService: StateProvinceListService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    private userDuplicationCheckService: UserDuplicationCheckService,
    private userCreateService: UserCreateService,
    public dialog: MatDialog,
    private loginStoreService: LoginStoreService
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getState();
   // this.cookieService.removeAll();
  }

  buildForm(): void {
    this.registrationForm = this.formBuilder.group({
      'state': [{ value: '', disabled: true }, Validators.required],
      'district': ['', Validators.required],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', [Validators.required, Validators.pattern(Constants.EmailPattern)]],
      'newPassword': ['', [Validators.required, Validators.pattern(Constants.PasswordPattern)]],
      'confirmPassword': ['']
    });

    this.registrationForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.registrationForm) { return; }
    const form = this.registrationForm;
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

        let nested: any = form.get(field).get('password');
        if (nested && nested.dirty && !nested.valid) {
          this.formErrors['password'] += this.validationMessages['password'].required + ' ';
        }

        nested = form.get(field).get('confirmPassword');

        if (nested && nested.dirty && !nested.valid) {

          for (const key in nested.errors) {
            if (messages[key]) {
              this.formErrors['confirmPassword'] += messages[key] + ' ';
            }
          }
        }

      } else {
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
  }

  //Make an object that contains the form field names as the key
  //That we can add the error messages to

  formErrors = {
    'state': '',
    'district': '',
    'firstName': '',
    'lastName': '',
    'email': '',
    'newPassword': '',
    'confirmPassword': ''
  };

  validationMessages = {
    'state': {
      'required': 'State is required.'
    },
    'district': {
      'required': 'District is required.'
    },
    'firstName': {
      'required': 'First name is required.'
    },
    'lastName': {
      'required': 'Last name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email must be valid.',
      'duplicated': 'Email address is already in use.  <a routerLink="/reset-password" routerLinkActive="active" class="link">Forgot Password?</a>'
    },
    'newPassword': {
      'required': 'Password is required.',
      'pattern': 'Password must meet complexity requirements.'
    },
    'confirmPassword': {
      'required': 'Confirm Password is required.',
      'nomatch': 'Password and Confirm Password must match.'
    }
  };

  passwordOnBlur() {
    if (!this.passwordMatch()) {
      this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
    }
  }

  passwordOnFocus() {
    this.formErrors.confirmPassword = '';
  }

  passwordMatch() {
    if (this.registrationForm.controls['confirmPassword'].value == this.registrationForm.controls['newPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  checkDup() {
    const control = this.registrationForm.get('email');
    if (control && control.dirty && control.valid) {

      this.userDuplication.application = Constants.ResetPasswordParent;
      this.userDuplication.email = this.registrationView.email;

      //console.log(this.loginResponse)

      let subscription = this.userDuplicationCheckService.getCheckDuplication(this.userDuplication, this.loginResponse, this.userDuplicationResponse)
        .subscribe(() => {
          if (this.userDuplicationCheckService.result == true) {
            subscription.unsubscribe();
            if (this.loginResponse.messageType === Constants.Error) {
              this.duplicationError = true;
              this.duplicationErrorMessage = Constants.EmailDuplicationMsg + this.registrationView.email;
              this.userDuplicationResponse.isUsed = false;
              this.loginStoreService.loadLogin(this.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            } else {
              //processing the successful response
              this.userDuplicationResponse = this.userDuplicationCheckService.userDuplicationResponse;
              if (this.userDuplicationResponse.isUsed == true) {
                //Lets add the email that was entered to the error message.
                //so we can clear the email field. If this is not
                //cleared and the valid but duplicated email left
                //The blur event will return duplicate and re-focus to this
                //field effectively locking you in place
                this.duplicationErrorMessage = 'Email address ' + this.registrationView.email + ' is already in use. ';
                this.userDuplicationResponse.isUsed = false;
                this.duplicationError = true;
              } else {
                this.duplicationErrorMessage = '';
                this.duplicationError = false;
              }
            }
          } else {
            ++this.userDuplicationCheckService.count;
          }
        });
    }
  }

  createUser() {
    if (this.duplicationError == true || !this.registrationForm.valid) {
      //show the error of my ways

      for (const control in this.registrationForm.controls) {
        this.registrationForm.controls[control].markAsDirty();
        this.onValueChanged();
      }
    } else {
      if (!this.passwordMatch()) {
        this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
      } else {

        this.isLoading = true;
        //mapping
        this.registrationDetail.application = Constants.ResetPasswordParent;
        this.registrationDetail.districtKey = this.registrationView.district;
        this.registrationDetail.email = this.registrationView.email;
        this.registrationDetail.firstName = this.registrationView.firstName;
        this.registrationDetail.lastName = this.registrationView.lastName;
        this.registrationDetail.plaintextPassword = this.registrationView.newPassword;
        this.registrationDetail.segmentation[0] = 1;

        let subscription = this.userCreateService.postCreateUser(this.registrationDetail, this.loginResponse)
          .subscribe(() => {
            if (this.userCreateService.result == true) {
              subscription.unsubscribe();
              if (this.loginResponse.messageType === Constants.Error) {
                this.loginStoreService.loadLogin(this.loginResponse);
               // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                this.isLoading = false;

                //console.log(this.loginResponse)


              } else {
                //Add to blue

                //alert(this.loginResponse.access_token);
                this.loginStoreService.loadLogin(this.loginResponse);
               // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                let link = ['/setup/relationship'];
                this.router.navigate(link);
                this.isLoading = false;
              }
            } else {
              ++this.userCreateService.count;
            }
          });
      }

    }
  }

  getDistrict(stateId: string) {
    let districtViewModel: DistrictViewModel = { stateId: stateId };
    this.districtListService.result = false;

    if (stateId) {

      let subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
        .subscribe(() => {
          if (this.districtListService.result == true) {
            subscription.unsubscribe();
            if (this.districtListService.loginResponse.messageType === Constants.Error) {
              this.loginStoreService.loadLogin(this.districtListService.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
              this.messageProcessorService.messageHandler();
              this.clearErrorMessage()

            } else {
              //processing the successful response
              this.showDistrictDdl = this.districtListService.districtList.length > 0;
              this.showNoDistrictWarning = !this.showDistrictDdl;
            }
          } else {
            ++this.districtListService.count;
          }
        });
    }
  }

  clearErrorMessage() {
    this.loginResponse.message = '';
    this.loginResponse.messageType = '';
    this.loginResponse.messageTitle = '';
    this.loginResponse.message = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  getState() {
    this.stateLoading = true;
    let subscription = this.stateProvinceListService.getState(this.loginResponse)
      .subscribe(() => {
        if (this.stateProvinceListService.result == true) {
          subscription.unsubscribe();
          if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.stateProvinceListService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);

          } else {
            //processing the successful response
            this.stateLoading = false;
            //enable the state selector.
            this.registrationForm.controls['state'].enable();
          }
        } else {
          ++this.stateProvinceListService.count;
        }
      });
  }

  openPrivacyDialog(): void {
    let dialogRef = this.dialog.open(PrivacyDialogComponent, {

    });

  }

  openTermsDialog(): void {
    let dialogRef = this.dialog.open(TermsDialogComponent, {

    });

  }
}
