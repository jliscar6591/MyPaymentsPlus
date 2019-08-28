import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ChangePasswordService } from '../../../shared/services/index';
import { ChangePasswordModel } from '../../../login/model/index';
import {
  ProfileUserprofileService,
  AuthNewPasswordService,
  ProfileProfileCoreService,
  ProfileRelationshipService,
  ProfileEmailPreferenceService
} from '../services/index';
import { LoginResponseModel } from "../../../login/model/index"
import {
  CookieService,
  ValidateCookieService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Constants } from "../../../app.settings";
import {
  ProfileUserprofileGetModel,
  AuthNewPasswordPutModel,
  ProfileProfileCorePutModel,
  ProfileRelationshipPutModel,
  ProfileEmailPreferencePutModel
} from '../meal-purchases/model/index';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap, first } from 'rxjs/operators';
import { MultiDistrictService } from '../../services/multi-district.service';
//import { setTimeout } from 'timers';

@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent {

  private loginResponse: LoginResponseModel;
  public getProfileErr: boolean = false;
  private getProfileErrMsg: string = '';
  private profileCoreErr: boolean = false;
  private profileCoreErrMsg: string = '';
  private updateProfileForm: FormGroup;
  private profileUserprofileGetModel: ProfileUserprofileGetModel;
  private profileProfileCorePutModel: ProfileProfileCorePutModel =
    {
      'firstName': '',
      'lastName': '',
      'email': '',
      'applicationName': ''
    }
  //email duplication
  private duplicationError: boolean = false;
  private duplicationErrorMessage: string = '';
  public showEditProfile: boolean = false;
  private profileCoreSaving: boolean = false;
  public isProfileGetting: boolean = false;

  private relationshipErr: boolean = false;
  private relationshipErrMsg: string = '';
  private relationshipForm: FormGroup;
  //form validation error
  private relationshipError: boolean = false;
  private relationshipSaving: boolean = false;

  private changePasswordErr: boolean = false;
  private changePasswordErrMsg: string = '';
  public showChangePassword: boolean = false;
  private changePasswordForm: FormGroup;
  private subscription: Subscription;
  private changeDetail: ChangePasswordModel =
    {
      newPassword: '',
      confirmPassword: '',
      resetKey: ''
    };
  private changePasswordSaving: boolean = false;

  private emailPrefSaving: boolean = false;
  private emailPrefErr: boolean = false;
  private emailPrefErrMsg: string = '';
  private emailPrefUpdated: boolean = false;
  private profileEmailPreferencePutModel: ProfileEmailPreferencePutModel =
    {
      "emailUpdates": true
    }

  private showEditRelationship: boolean = false;
  private authNewPasswordPutModel: AuthNewPasswordPutModel =
    {
      'newPassword': ''
    }
  private profileRelationshipPutModel: ProfileRelationshipPutModel =
    {
      isGuest: false,
      isParent: false,
      isStaff: false,
      isStudent: false
    }
  private isProfile: boolean;
  private isLoading: boolean;
  public isMultiDistrict: boolean = true;
  public getUserProfileIntrvl: any;


  constructor(
    private formBuilder: FormBuilder,
    private profileUserprofileService: ProfileUserprofileService,
    private authNewPasswordService: AuthNewPasswordService,
    private profileProfileCoreService: ProfileProfileCoreService,
    private profileRelationshipService: ProfileRelationshipService,
    private profileEmailPreferenceService: ProfileEmailPreferenceService,
    private utilityService: UtilityService,
    private multiDistrictSrvc: MultiDistrictService,
    private loginStoreService: LoginStoreService
  ) { }

  ngOnInit() {

    // console.log('ProfileComponent')

    this.loginResponse = this.loginStoreService.cookieStateItem;
    this.buildUpdateProfileForm();
    this.buildRelationshipForm();
    this.buildChangePasswordForm();
    this.getUserprofile();
  }

  ngDoCheck() {

    this.isMultiDistrict = this.multiDistrictSrvc.multiDistrictFlag;
    //console.log("Ok Maybe Now: ", this.isMultiDistrict);
  }

  buildUpdateProfileForm(): void {
    // console.log("Building Update Profile form")
    this.updateProfileForm = this.formBuilder.group({
      'firstName': ['', [Validators.required, Validators.maxLength(100)]],
      'lastName': ['', [Validators.required, Validators.maxLength(100)]],
      'email': ['', [Validators.required, Validators.maxLength(100)]],
      'emailUpdates': ['']
    });

    this.updateProfileForm.valueChanges
      .subscribe(data => this.onProfileFormValueChanged(data));
    this.onProfileFormValueChanged();
  }

  buildRelationshipForm(): void {
    // console.log("Building Relatoinship form")
    this.relationshipForm = this.formBuilder.group({
      'parent': [''],
      'student': [''],
      'staff': [''],
      'guest': ['']
    }, {
        validator: this.checkboxRequired
      });
  }

  buildChangePasswordForm(): void {
    // console.log("Building Change Password form")
    this.changePasswordForm = this.formBuilder.group({
      'newPassword': ['', [Validators.required, Validators.pattern(Constants.PasswordPattern)]],
      'confirmPassword': ['']
    });

    this.changePasswordForm.valueChanges
      .subscribe(data => this.onchangePasswordFormValueChanged(data));
    this.onchangePasswordFormValueChanged();
  }

  onProfileFormValueChanged(data?: any) {
    if (!this.updateProfileForm) { return; }
    this.onValueChanged(this.updateProfileForm);
  }

  onchangePasswordFormValueChanged(data?: any) {
    if (!this.changePasswordForm) { return; }
    this.onValueChanged(this.changePasswordForm);
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
  }

  formErrors = {
    'newPassword': '',
    'confirmPassword': '',
    'firstName': '',
    'lastName': '',
    'email': '',
    'emailUpdates': ''
  };

  validationMessages = {
    'newPassword': {
      'required': 'Password is required.',
      'pattern': 'Password must meet complexety requirements.'
    },
    'confirmPassword': {
      'required': 'Confirm Password is required.',
      'nomatch': 'Password and Confirm Password must match.'
    },
    'firstName': {
      'required': 'First name is required.',
      'maxLength': 'First name must be less than 100 characters'
    },
    'lastName': {
      'required': 'Last name is required.',
      'maxLength': 'Last name be less than 100 characters'
    },
    'email': {
      'required': 'Email is required.',
      'maxLength': 'Email must be less than 100 characters'
    }
  };

  checkboxRequired(group: FormGroup) {
    for (var name in group.controls) {
      if (group.controls[name].value) {
        return null;
      }
    }
    return true;
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

  //Update Email Preference

  updateEmailCallback() {
    this.emailPrefUpdated = false;
  }

  putEmailPreference() {
    // console.log("calling emial Preference")
    this.emailPrefSaving = true
    this.profileEmailPreferenceService.result = false;
    let subscription = this.profileEmailPreferenceService.putEmailPreference(this.profileEmailPreferencePutModel, this.loginResponse)
      .subscribe(() => {
        this.isLoading = true;
        if (this.profileEmailPreferenceService.result == true) {
          this.isLoading = false;
          subscription.unsubscribe();

          if (this.profileEmailPreferenceService.loginResponse.messageType === Constants.Error) {
            //this.cookieService.putObject(Constants.AuthCookieName, this.profileEmailPreferenceService.loginResponse);
            this.emailPrefErr = true;
            //Inline error message when something goes wrong with the api call.
            this.emailPrefErrMsg = this.profileEmailPreferenceService.loginResponse.message;
            this.utilityService.clearErrorMessage(this.profileEmailPreferenceService.loginResponse);
          } else {
            //When the error is to be displayed on another page stor it in the cookie
            //this.cookieService.putObject(Constants.AuthCookieName, this.profileEmailPreferenceService.loginResponse);
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.emailPrefSaving = false;
                  this.updateEmailCallback();
                }
              });
          }
        } else {
          ++this.profileEmailPreferenceService.count;
        }
      });
  }

  //Update Profile

  cancelUpdateProfile() {
    if (this.updateProfileForm.dirty) {
      this.getUserprofile();
    }
    this.duplicationError = false;
    this.duplicationErrorMessage = '';
    this.updateProfileForm.markAsPristine();
    this.showEditProfile = false;
  }

  putProfileCallback() {
    if (this.duplicationError || this.profileCoreErr) {
      this.showEditProfile = true;
    } else {
      this.showEditProfile = false;
    }
  }

  putProfileCore() {
    // console.log("calling putProfileCore")
    if (this.updateProfileForm.valid && this.updateProfileForm.dirty) {
      this.profileCoreSaving = true;
      this.profileProfileCoreService.result = false;
      //Mapping
      this.profileProfileCorePutModel.firstName = this.profileUserprofileService.profileUserprofileGetModel.firstName;
      this.profileProfileCorePutModel.lastName = this.profileUserprofileService.profileUserprofileGetModel.lastName;
      this.profileProfileCorePutModel.email = this.profileUserprofileService.profileUserprofileGetModel.email;
      this.profileProfileCorePutModel.applicationName = Constants.Application.parent;

      let subscription = this.profileProfileCoreService.putProfileCore(this.profileProfileCorePutModel, this.loginResponse)
        .subscribe(() => {
          if (this.profileProfileCoreService.result == true) {
            subscription.unsubscribe();

            if (this.profileProfileCoreService.loginResponse.messageType === Constants.Error) {
              if (this.profileProfileCoreService.loginResponse.status == "409") {
                this.duplicationError = true;
                this.duplicationErrorMessage =
                  Constants.EmailDuplicationMsg + this.profileProfileCorePutModel.email;
              } else {
                this.profileCoreErr = true;
                this.profileCoreErrMsg = this.profileProfileCoreService.loginResponse.message;
              }
              this.utilityService.clearErrorMessage(this.profileProfileCoreService.loginResponse);
            } else {
              this.duplicationError = false;
              this.profileCoreErr = false;
              this.loginStoreService.loadLogin(this.profileProfileCoreService.loginResponse);

              // this.cookieService.putObject(Constants.AuthCookieName, this.profileProfileCoreService.loginResponse);
            }
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.profileCoreSaving = false;
                  this.putProfileCallback();
                }
              });
          } else {
            ++this.profileProfileCoreService.count;
          }
        });
    }
  }

  //Change Password

  cancelChangePassword() {
    this.changeDetail.confirmPassword = '';
    this.changeDetail.newPassword = '';

    this.changePasswordForm.markAsPristine();
    this.showChangePassword = false;
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      if (!this.passwordMatch()) {
        this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
        this.showChangePassword = true;
      } else {
        this.putPasswordChange();
      }
    }
    else {
      this.showChangePassword = false;
    }
  }

  putPasswordChange() {
    this.changePasswordSaving = true;
    this.authNewPasswordService.result = false;
    this.authNewPasswordPutModel.newPassword = this.changeDetail.newPassword;
    let subscription = this.authNewPasswordService.putPassword(this.authNewPasswordPutModel, this.loginResponse)
      .subscribe(() => {
        this.isLoading = true;
        if (this.authNewPasswordService.result == true) {
          this.isLoading = false;
          subscription.unsubscribe();
          if (this.authNewPasswordService.loginResponse.messageType === Constants.Error) {
            this.changePasswordErr = true;
            this.changePasswordErrMsg = this.authNewPasswordService.loginResponse.message;

            this.utilityService.clearErrorMessage(this.authNewPasswordService.loginResponse);
          } else {
            this.loginStoreService.loadLogin(this.authNewPasswordService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.authNewPasswordService.loginResponse);
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.changePasswordSaving = false;
                  this.cancelChangePassword();
                }
              });

          }
        } else {
          ++this.authNewPasswordService.count;
        }
      });
  }

  //Update District Relationship

  putRelationshipCallback() {
    if (!this.checkboxRequired(this.relationshipForm)) {
      this.relationshipError = false;
      this.showEditRelationship = false;
    }
    else {
      this.relationshipError = true;
    }
  }

  cancelSaveRelationship() {
    if (this.updateProfileForm.dirty) {
      this.getUserprofile();
    }
    this.relationshipForm.markAsPristine();
    this.showEditRelationship = false;
  }

  putRelationship() {
    this.relationshipSaving = true;
    this.profileRelationshipService.result = false;

    this.profileRelationshipPutModel.isGuest = this.profileUserprofileService.profileUserprofileGetModel.isGuest;
    this.profileRelationshipPutModel.isParent = this.profileUserprofileService.profileUserprofileGetModel.isParent;
    this.profileRelationshipPutModel.isStaff = this.profileUserprofileService.profileUserprofileGetModel.isStaff;
    this.profileRelationshipPutModel.isStudent = this.profileUserprofileService.profileUserprofileGetModel.isStudent;

    let subscription = this.profileRelationshipService.putRelationship(this.profileRelationshipPutModel, this.loginResponse)
      .subscribe(() => {
        this.isLoading = true;
        if (this.profileRelationshipService.result == true) {
          this.isLoading = false;
          subscription.unsubscribe();

          if (this.profileRelationshipService.loginResponse.messageType === Constants.Error) {
            this.relationshipErr = true;
            this.relationshipErrMsg = this.profileRelationshipService.loginResponse.message;

            this.utilityService.clearErrorMessage(this.profileRelationshipService.loginResponse);
          } else {
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.relationshipSaving = false;
                  this.putRelationshipCallback();
                }
              });
          }
        } else {
          ++this.profileRelationshipService.count;
        }
      });
  }

  //Get Profile

  getUserprofile() {
    // console.log("Calling getUserProfile")
    this.isProfileGetting = true;
    this.profileUserprofileService.result = false;
    let failureMessage: string = 'Get User Profile Failed';
    let subscription = this.profileUserprofileService.getUserprofileNew(this.loginResponse, failureMessage)

      .subscribe(
        data => {
          this.profileUserprofileService.profileUserprofileGetModel = data
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.profileUserprofileService.result = true;
        },

        () => {
          this.profileUserprofileService.result = true;
          //this.profileUserprofileService.gotProfile$ = new Observable(observer => {
          //  observer.next(true);
          //  observer.complete();
          //});
          //this.profileUserprofileService.gotProfile$.pipe(
          //  first(data => data == true)
          //);

          this.isProfileGetting = false;
          if (this.profileUserprofileService.loginResponse.messageType === Constants.Error) {
            this.getProfileErr = true;
            this.getProfileErrMsg = this.profileUserprofileService.loginResponse.message;
            this.utilityService.clearErrorMessage(this.profileUserprofileService.loginResponse);
            this.isProfile = false;
          } else {
            this.loginStoreService.loadLogin(this.profileUserprofileService.loginResponse);
            this.isProfile = this.profileUserprofileService.profileUserprofileGetModel != null;
            this.isProfile = true;
            // this.isProfileGetting = false;
          }

          subscription.unsubscribe();
          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          seconds.subscribe(
            x => {
              if (x == Constants.SpinnerDelay) {
                this.isProfileGetting = false;
              }
            });
        }
      )
  }
}
