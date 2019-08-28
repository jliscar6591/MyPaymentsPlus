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
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var app_settings_1 = require("../app.settings");
var index_1 = require("../login/model/index");
var index_2 = require("./services/index");
var privacy_dialog_component_1 = require("./privacy-dialog/privacy-dialog.component");
var terms_dialog_component_1 = require("./terms-dialog/terms-dialog.component");
//local
var index_3 = require("../shared/services/index");
var RegistrationFormComponent = /** @class */ (function () {
    function RegistrationFormComponent(router, toasterService, formBuilder, districtListService, stateProvinceListService, cookieService, validateCookie, messageProcessorService, userDuplicationCheckService, userCreateService, dialog, loginStoreService) {
        this.router = router;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.districtListService = districtListService;
        this.stateProvinceListService = stateProvinceListService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.userDuplicationCheckService = userDuplicationCheckService;
        this.userCreateService = userCreateService;
        this.dialog = dialog;
        this.loginStoreService = loginStoreService;
        this.loginResponse = new index_1.LoginResponseModel();
        this.registrationView = {
            district: '',
            email: '',
            firstName: '',
            lastName: '',
            newPassword: '',
            state: ''
        };
        this.registrationDetail = {
            application: '', districtKey: '', email: '', firstName: '', lastName: '', plaintextPassword: '', segmentation: [1]
        };
        this.duplicationError = false;
        this.userDuplication = { application: '', email: '' };
        this.duplicationErrorMessage = '';
        this.stateLoading = true;
        this.showDistrictDdl = false;
        this.showNoDistrictWarning = false;
        this.isLoading = false;
        //Make an object that contains the form field names as the key
        //That we can add the error messages to
        this.formErrors = {
            'state': '',
            'district': '',
            'firstName': '',
            'lastName': '',
            'email': '',
            'newPassword': '',
            'confirmPassword': ''
        };
        this.validationMessages = {
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
    }
    RegistrationFormComponent.prototype.ngOnInit = function () {
        this.buildForm();
        this.getState();
        // this.cookieService.removeAll();
    };
    RegistrationFormComponent.prototype.buildForm = function () {
        var _this = this;
        this.registrationForm = this.formBuilder.group({
            'state': [{ value: '', disabled: true }, forms_1.Validators.required],
            'district': ['', forms_1.Validators.required],
            'firstName': ['', forms_1.Validators.required],
            'lastName': ['', forms_1.Validators.required],
            'email': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.EmailPattern)]],
            'newPassword': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.PasswordPattern)]],
            'confirmPassword': ['']
        });
        this.registrationForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    RegistrationFormComponent.prototype.onValueChanged = function (data) {
        if (!this.registrationForm) {
            return;
        }
        var form = this.registrationForm;
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
                var nested = form.get(field).get('password');
                if (nested && nested.dirty && !nested.valid) {
                    this.formErrors['password'] += this.validationMessages['password'].required + ' ';
                }
                nested = form.get(field).get('confirmPassword');
                if (nested && nested.dirty && !nested.valid) {
                    for (var key in nested.errors) {
                        if (messages[key]) {
                            this.formErrors['confirmPassword'] += messages[key] + ' ';
                        }
                    }
                }
            }
            else {
                var control_1 = void 0;
                // clear previous error message (if any)
                this.formErrors[field] = '';
                control_1 = form.get(field);
                if (control_1 && control_1.dirty && !control_1.valid) {
                    var messages = this.validationMessages[field];
                    for (var key in control_1.errors) {
                        this.formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    };
    RegistrationFormComponent.prototype.passwordOnBlur = function () {
        if (!this.passwordMatch()) {
            this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
        }
    };
    RegistrationFormComponent.prototype.passwordOnFocus = function () {
        this.formErrors.confirmPassword = '';
    };
    RegistrationFormComponent.prototype.passwordMatch = function () {
        if (this.registrationForm.controls['confirmPassword'].value == this.registrationForm.controls['newPassword'].value) {
            return true;
        }
        else {
            return false;
        }
    };
    RegistrationFormComponent.prototype.checkDup = function () {
        var _this = this;
        var control = this.registrationForm.get('email');
        if (control && control.dirty && control.valid) {
            this.userDuplication.application = app_settings_1.Constants.ResetPasswordParent;
            this.userDuplication.email = this.registrationView.email;
            //console.log(this.loginResponse)
            var subscription_1 = this.userDuplicationCheckService.getCheckDuplication(this.userDuplication, this.loginResponse, this.userDuplicationResponse)
                .subscribe(function () {
                if (_this.userDuplicationCheckService.result == true) {
                    subscription_1.unsubscribe();
                    if (_this.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.duplicationError = true;
                        _this.duplicationErrorMessage = app_settings_1.Constants.EmailDuplicationMsg + _this.registrationView.email;
                        _this.userDuplicationResponse.isUsed = false;
                        _this.loginStoreService.loadLogin(_this.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                    }
                    else {
                        //processing the successful response
                        _this.userDuplicationResponse = _this.userDuplicationCheckService.userDuplicationResponse;
                        if (_this.userDuplicationResponse.isUsed == true) {
                            //Lets add the email that was entered to the error message.
                            //so we can clear the email field. If this is not
                            //cleared and the valid but duplicated email left
                            //The blur event will return duplicate and re-focus to this
                            //field effectively locking you in place
                            _this.duplicationErrorMessage = 'Email address ' + _this.registrationView.email + ' is already in use. ';
                            _this.userDuplicationResponse.isUsed = false;
                            _this.duplicationError = true;
                        }
                        else {
                            _this.duplicationErrorMessage = '';
                            _this.duplicationError = false;
                        }
                    }
                }
                else {
                    ++_this.userDuplicationCheckService.count;
                }
            });
        }
    };
    RegistrationFormComponent.prototype.createUser = function () {
        var _this = this;
        if (this.duplicationError == true || !this.registrationForm.valid) {
            //show the error of my ways
            for (var control in this.registrationForm.controls) {
                this.registrationForm.controls[control].markAsDirty();
                this.onValueChanged();
            }
        }
        else {
            if (!this.passwordMatch()) {
                this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
            }
            else {
                this.isLoading = true;
                //mapping
                this.registrationDetail.application = app_settings_1.Constants.ResetPasswordParent;
                this.registrationDetail.districtKey = this.registrationView.district;
                this.registrationDetail.email = this.registrationView.email;
                this.registrationDetail.firstName = this.registrationView.firstName;
                this.registrationDetail.lastName = this.registrationView.lastName;
                this.registrationDetail.plaintextPassword = this.registrationView.newPassword;
                this.registrationDetail.segmentation[0] = 1;
                var subscription_2 = this.userCreateService.postCreateUser(this.registrationDetail, this.loginResponse)
                    .subscribe(function () {
                    if (_this.userCreateService.result == true) {
                        subscription_2.unsubscribe();
                        if (_this.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.loginStoreService.loadLogin(_this.loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                            _this.isLoading = false;
                            //console.log(this.loginResponse)
                        }
                        else {
                            //Add to blue
                            //alert(this.loginResponse.access_token);
                            _this.loginStoreService.loadLogin(_this.loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                            var link = ['/setup/relationship'];
                            _this.router.navigate(link);
                            _this.isLoading = false;
                        }
                    }
                    else {
                        ++_this.userCreateService.count;
                    }
                });
            }
        }
    };
    RegistrationFormComponent.prototype.getDistrict = function (stateId) {
        var _this = this;
        var districtViewModel = { stateId: stateId };
        this.districtListService.result = false;
        if (stateId) {
            var subscription_3 = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
                .subscribe(function () {
                if (_this.districtListService.result == true) {
                    subscription_3.unsubscribe();
                    if (_this.districtListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.loginStoreService.loadLogin(_this.districtListService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
                        _this.messageProcessorService.messageHandler();
                        _this.clearErrorMessage();
                    }
                    else {
                        //processing the successful response
                        _this.showDistrictDdl = _this.districtListService.districtList.length > 0;
                        _this.showNoDistrictWarning = !_this.showDistrictDdl;
                    }
                }
                else {
                    ++_this.districtListService.count;
                }
            });
        }
    };
    RegistrationFormComponent.prototype.clearErrorMessage = function () {
        this.loginResponse.message = '';
        this.loginResponse.messageType = '';
        this.loginResponse.messageTitle = '';
        this.loginResponse.message = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    };
    RegistrationFormComponent.prototype.getState = function () {
        var _this = this;
        this.stateLoading = true;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.stateProvinceListService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
                }
                else {
                    //processing the successful response
                    _this.stateLoading = false;
                    //enable the state selector.
                    _this.registrationForm.controls['state'].enable();
                }
            }
            else {
                ++_this.stateProvinceListService.count;
            }
        });
    };
    RegistrationFormComponent.prototype.openPrivacyDialog = function () {
        var dialogRef = this.dialog.open(privacy_dialog_component_1.PrivacyDialogComponent, {});
    };
    RegistrationFormComponent.prototype.openTermsDialog = function () {
        var dialogRef = this.dialog.open(terms_dialog_component_1.TermsDialogComponent, {});
    };
    RegistrationFormComponent = __decorate([
        core_1.Component({
            selector: 'register-form',
            templateUrl: './registration-form.component.html',
            styleUrls: ['../app.component.less', './registration-form.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_3.ToasterService,
            forms_1.FormBuilder,
            index_3.DistrictListService,
            index_3.StateProvinceListService,
            index_3.CookieService,
            index_3.ValidateCookieService,
            index_3.MessageProcessorService,
            index_2.UserDuplicationCheckService,
            index_2.UserCreateService,
            material_1.MatDialog,
            index_3.LoginStoreService])
    ], RegistrationFormComponent);
    return RegistrationFormComponent;
}());
exports.RegistrationFormComponent = RegistrationFormComponent;
//# sourceMappingURL=registration-form.component.js.map