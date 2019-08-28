"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var index_1 = require("../services/index");
var index_2 = require("../../../shared/services/index");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var multi_district_service_1 = require("../../services/multi-district.service");
//import { setTimeout } from 'timers';
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(formBuilder, profileUserprofileService, authNewPasswordService, profileProfileCoreService, profileRelationshipService, profileEmailPreferenceService, utilityService, multiDistrictSrvc, loginStoreService) {
        this.formBuilder = formBuilder;
        this.profileUserprofileService = profileUserprofileService;
        this.authNewPasswordService = authNewPasswordService;
        this.profileProfileCoreService = profileProfileCoreService;
        this.profileRelationshipService = profileRelationshipService;
        this.profileEmailPreferenceService = profileEmailPreferenceService;
        this.utilityService = utilityService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.loginStoreService = loginStoreService;
        this.getProfileErr = false;
        this.getProfileErrMsg = '';
        this.profileCoreErr = false;
        this.profileCoreErrMsg = '';
        this.profileProfileCorePutModel = {
            'firstName': '',
            'lastName': '',
            'email': '',
            'applicationName': ''
        };
        //email duplication
        this.duplicationError = false;
        this.duplicationErrorMessage = '';
        this.showEditProfile = false;
        this.profileCoreSaving = false;
        this.isProfileGetting = false;
        this.relationshipErr = false;
        this.relationshipErrMsg = '';
        //form validation error
        this.relationshipError = false;
        this.relationshipSaving = false;
        this.changePasswordErr = false;
        this.changePasswordErrMsg = '';
        this.showChangePassword = false;
        this.changeDetail = {
            newPassword: '',
            confirmPassword: '',
            resetKey: ''
        };
        this.changePasswordSaving = false;
        this.emailPrefSaving = false;
        this.emailPrefErr = false;
        this.emailPrefErrMsg = '';
        this.emailPrefUpdated = false;
        this.profileEmailPreferencePutModel = {
            "emailUpdates": true
        };
        this.showEditRelationship = false;
        this.authNewPasswordPutModel = {
            'newPassword': ''
        };
        this.profileRelationshipPutModel = {
            isGuest: false,
            isParent: false,
            isStaff: false,
            isStudent: false
        };
        this.isMultiDistrict = true;
        this.formErrors = {
            'newPassword': '',
            'confirmPassword': '',
            'firstName': '',
            'lastName': '',
            'email': '',
            'emailUpdates': ''
        };
        this.validationMessages = {
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
    }
    ProfileComponent.prototype.ngOnInit = function () {
        // console.log('ProfileComponent')
        this.loginResponse = this.loginStoreService.cookieStateItem;
        this.buildUpdateProfileForm();
        this.buildRelationshipForm();
        this.buildChangePasswordForm();
        this.getUserprofile();
    };
    ProfileComponent.prototype.ngDoCheck = function () {
        this.isMultiDistrict = this.multiDistrictSrvc.multiDistrictFlag;
        //console.log("Ok Maybe Now: ", this.isMultiDistrict);
    };
    ProfileComponent.prototype.buildUpdateProfileForm = function () {
        var _this = this;
        // console.log("Building Update Profile form")
        this.updateProfileForm = this.formBuilder.group({
            'firstName': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            'lastName': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            'email': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            'emailUpdates': ['']
        });
        this.updateProfileForm.valueChanges
            .subscribe(function (data) { return _this.onProfileFormValueChanged(data); });
        this.onProfileFormValueChanged();
    };
    ProfileComponent.prototype.buildRelationshipForm = function () {
        // console.log("Building Relatoinship form")
        this.relationshipForm = this.formBuilder.group({
            'parent': [''],
            'student': [''],
            'staff': [''],
            'guest': ['']
        }, {
            validator: this.checkboxRequired
        });
    };
    ProfileComponent.prototype.buildChangePasswordForm = function () {
        var _this = this;
        // console.log("Building Change Password form")
        this.changePasswordForm = this.formBuilder.group({
            'newPassword': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.PasswordPattern)]],
            'confirmPassword': ['']
        });
        this.changePasswordForm.valueChanges
            .subscribe(function (data) { return _this.onchangePasswordFormValueChanged(data); });
        this.onchangePasswordFormValueChanged();
    };
    ProfileComponent.prototype.onProfileFormValueChanged = function (data) {
        if (!this.updateProfileForm) {
            return;
        }
        this.onValueChanged(this.updateProfileForm);
    };
    ProfileComponent.prototype.onchangePasswordFormValueChanged = function (data) {
        if (!this.changePasswordForm) {
            return;
        }
        this.onValueChanged(this.changePasswordForm);
    };
    ProfileComponent.prototype.onValueChanged = function (form) {
        for (var field in this.formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            this.formErrors[field] = '';
            control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ProfileComponent.prototype.checkboxRequired = function (group) {
        for (var name in group.controls) {
            if (group.controls[name].value) {
                return null;
            }
        }
        return true;
    };
    ProfileComponent.prototype.passwordOnBlur = function () {
        if (!this.passwordMatch()) {
            this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
        }
    };
    ProfileComponent.prototype.passwordOnFocus = function () {
        this.formErrors.confirmPassword = '';
    };
    ProfileComponent.prototype.passwordMatch = function () {
        if (this.changePasswordForm.controls['confirmPassword'].value == this.changePasswordForm.controls['newPassword'].value) {
            return true;
        }
        else {
            return false;
        }
    };
    //Update Email Preference
    ProfileComponent.prototype.updateEmailCallback = function () {
        this.emailPrefUpdated = false;
    };
    ProfileComponent.prototype.putEmailPreference = function () {
        var _this = this;
        // console.log("calling emial Preference")
        this.emailPrefSaving = true;
        this.profileEmailPreferenceService.result = false;
        var subscription = this.profileEmailPreferenceService.putEmailPreference(this.profileEmailPreferencePutModel, this.loginResponse)
            .subscribe(function () {
            _this.isLoading = true;
            if (_this.profileEmailPreferenceService.result == true) {
                _this.isLoading = false;
                subscription.unsubscribe();
                if (_this.profileEmailPreferenceService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    //this.cookieService.putObject(Constants.AuthCookieName, this.profileEmailPreferenceService.loginResponse);
                    _this.emailPrefErr = true;
                    //Inline error message when something goes wrong with the api call.
                    _this.emailPrefErrMsg = _this.profileEmailPreferenceService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.profileEmailPreferenceService.loginResponse);
                }
                else {
                    //When the error is to be displayed on another page stor it in the cookie
                    //this.cookieService.putObject(Constants.AuthCookieName, this.profileEmailPreferenceService.loginResponse);
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.emailPrefSaving = false;
                            _this.updateEmailCallback();
                        }
                    });
                }
            }
            else {
                ++_this.profileEmailPreferenceService.count;
            }
        });
    };
    //Update Profile
    ProfileComponent.prototype.cancelUpdateProfile = function () {
        if (this.updateProfileForm.dirty) {
            this.getUserprofile();
        }
        this.duplicationError = false;
        this.duplicationErrorMessage = '';
        this.updateProfileForm.markAsPristine();
        this.showEditProfile = false;
    };
    ProfileComponent.prototype.putProfileCallback = function () {
        if (this.duplicationError || this.profileCoreErr) {
            this.showEditProfile = true;
        }
        else {
            this.showEditProfile = false;
        }
    };
    ProfileComponent.prototype.putProfileCore = function () {
        var _this = this;
        // console.log("calling putProfileCore")
        if (this.updateProfileForm.valid && this.updateProfileForm.dirty) {
            this.profileCoreSaving = true;
            this.profileProfileCoreService.result = false;
            //Mapping
            this.profileProfileCorePutModel.firstName = this.profileUserprofileService.profileUserprofileGetModel.firstName;
            this.profileProfileCorePutModel.lastName = this.profileUserprofileService.profileUserprofileGetModel.lastName;
            this.profileProfileCorePutModel.email = this.profileUserprofileService.profileUserprofileGetModel.email;
            this.profileProfileCorePutModel.applicationName = app_settings_1.Constants.Application.parent;
            var subscription_1 = this.profileProfileCoreService.putProfileCore(this.profileProfileCorePutModel, this.loginResponse)
                .subscribe(function () {
                if (_this.profileProfileCoreService.result == true) {
                    subscription_1.unsubscribe();
                    if (_this.profileProfileCoreService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        if (_this.profileProfileCoreService.loginResponse.status == "409") {
                            _this.duplicationError = true;
                            _this.duplicationErrorMessage =
                                app_settings_1.Constants.EmailDuplicationMsg + _this.profileProfileCorePutModel.email;
                        }
                        else {
                            _this.profileCoreErr = true;
                            _this.profileCoreErrMsg = _this.profileProfileCoreService.loginResponse.message;
                        }
                        _this.utilityService.clearErrorMessage(_this.profileProfileCoreService.loginResponse);
                    }
                    else {
                        _this.duplicationError = false;
                        _this.profileCoreErr = false;
                        _this.loginStoreService.loadLogin(_this.profileProfileCoreService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.profileProfileCoreService.loginResponse);
                    }
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.profileCoreSaving = false;
                            _this.putProfileCallback();
                        }
                    });
                }
                else {
                    ++_this.profileProfileCoreService.count;
                }
            });
        }
    };
    //Change Password
    ProfileComponent.prototype.cancelChangePassword = function () {
        this.changeDetail.confirmPassword = '';
        this.changeDetail.newPassword = '';
        this.changePasswordForm.markAsPristine();
        this.showChangePassword = false;
    };
    ProfileComponent.prototype.changePassword = function () {
        if (this.changePasswordForm.valid) {
            if (!this.passwordMatch()) {
                this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
                this.showChangePassword = true;
            }
            else {
                this.putPasswordChange();
            }
        }
        else {
            this.showChangePassword = false;
        }
    };
    ProfileComponent.prototype.putPasswordChange = function () {
        var _this = this;
        this.changePasswordSaving = true;
        this.authNewPasswordService.result = false;
        this.authNewPasswordPutModel.newPassword = this.changeDetail.newPassword;
        var subscription = this.authNewPasswordService.putPassword(this.authNewPasswordPutModel, this.loginResponse)
            .subscribe(function () {
            _this.isLoading = true;
            if (_this.authNewPasswordService.result == true) {
                _this.isLoading = false;
                subscription.unsubscribe();
                if (_this.authNewPasswordService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.changePasswordErr = true;
                    _this.changePasswordErrMsg = _this.authNewPasswordService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.authNewPasswordService.loginResponse);
                }
                else {
                    _this.loginStoreService.loadLogin(_this.authNewPasswordService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.authNewPasswordService.loginResponse);
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.changePasswordSaving = false;
                            _this.cancelChangePassword();
                        }
                    });
                }
            }
            else {
                ++_this.authNewPasswordService.count;
            }
        });
    };
    //Update District Relationship
    ProfileComponent.prototype.putRelationshipCallback = function () {
        if (!this.checkboxRequired(this.relationshipForm)) {
            this.relationshipError = false;
            this.showEditRelationship = false;
        }
        else {
            this.relationshipError = true;
        }
    };
    ProfileComponent.prototype.cancelSaveRelationship = function () {
        if (this.updateProfileForm.dirty) {
            this.getUserprofile();
        }
        this.relationshipForm.markAsPristine();
        this.showEditRelationship = false;
    };
    ProfileComponent.prototype.putRelationship = function () {
        var _this = this;
        this.relationshipSaving = true;
        this.profileRelationshipService.result = false;
        this.profileRelationshipPutModel.isGuest = this.profileUserprofileService.profileUserprofileGetModel.isGuest;
        this.profileRelationshipPutModel.isParent = this.profileUserprofileService.profileUserprofileGetModel.isParent;
        this.profileRelationshipPutModel.isStaff = this.profileUserprofileService.profileUserprofileGetModel.isStaff;
        this.profileRelationshipPutModel.isStudent = this.profileUserprofileService.profileUserprofileGetModel.isStudent;
        var subscription = this.profileRelationshipService.putRelationship(this.profileRelationshipPutModel, this.loginResponse)
            .subscribe(function () {
            _this.isLoading = true;
            if (_this.profileRelationshipService.result == true) {
                _this.isLoading = false;
                subscription.unsubscribe();
                if (_this.profileRelationshipService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.relationshipErr = true;
                    _this.relationshipErrMsg = _this.profileRelationshipService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.profileRelationshipService.loginResponse);
                }
                else {
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.relationshipSaving = false;
                            _this.putRelationshipCallback();
                        }
                    });
                }
            }
            else {
                ++_this.profileRelationshipService.count;
            }
        });
    };
    //Get Profile
    ProfileComponent.prototype.getUserprofile = function () {
        var _this = this;
        // console.log("Calling getUserProfile")
        this.isProfileGetting = true;
        this.profileUserprofileService.result = false;
        var failureMessage = 'Get User Profile Failed';
        var subscription = this.profileUserprofileService.getUserprofileNew(this.loginResponse, failureMessage)
            .subscribe(function (data) {
            _this.profileUserprofileService.profileUserprofileGetModel = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.profileUserprofileService.result = true;
        }, function () {
            _this.profileUserprofileService.result = true;
            //this.profileUserprofileService.gotProfile$ = new Observable(observer => {
            //  observer.next(true);
            //  observer.complete();
            //});
            //this.profileUserprofileService.gotProfile$.pipe(
            //  first(data => data == true)
            //);
            _this.isProfileGetting = false;
            if (_this.profileUserprofileService.loginResponse.messageType === app_settings_1.Constants.Error) {
                _this.getProfileErr = true;
                _this.getProfileErrMsg = _this.profileUserprofileService.loginResponse.message;
                _this.utilityService.clearErrorMessage(_this.profileUserprofileService.loginResponse);
                _this.isProfile = false;
            }
            else {
                _this.loginStoreService.loadLogin(_this.profileUserprofileService.loginResponse);
                _this.isProfile = _this.profileUserprofileService.profileUserprofileGetModel != null;
                _this.isProfile = true;
                // this.isProfileGetting = false;
            }
            subscription.unsubscribe();
            var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            seconds.subscribe(function (x) {
                if (x == app_settings_1.Constants.SpinnerDelay) {
                    _this.isProfileGetting = false;
                }
            });
        });
    };
    ProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'profile.component.html',
            styleUrls: ['profile.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            index_1.ProfileUserprofileService,
            index_1.AuthNewPasswordService,
            index_1.ProfileProfileCoreService,
            index_1.ProfileRelationshipService,
            index_1.ProfileEmailPreferenceService,
            index_2.UtilityService,
            multi_district_service_1.MultiDistrictService,
            index_2.LoginStoreService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map