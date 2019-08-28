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
var captcha_component_1 = require("angular2-recaptcha/lib/captcha.component");
//local
var index_1 = require("../../shared/services/index");
var index_2 = require("../model/index");
var app_settings_1 = require("../../app.settings");
var RequestPasswordChangeComponent = /** @class */ (function () {
    function RequestPasswordChangeComponent(router, toasterService, formBuilder, requestPasswordChangeService, validateCookie, cookieService, messageProcessorService, loginStoreService) {
        this.router = router;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.requestPasswordChangeService = requestPasswordChangeService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.messageProcessorService = messageProcessorService;
        this.loginStoreService = loginStoreService;
        this.title = 'My Payments Plus Request Password Change';
        this.requestDetail = { resetEmail: '', application: app_settings_1.Constants.ResetPasswordParent, recaptchatoken: '' };
        this.RecaptchaKey = app_settings_1.Constants.RecaptchaKey;
        this.sendingEmail = false;
        this.showSuccessMessage = false;
        this.showRecaptchaMessage = false;
        this.resetNotPosted = true;
        this.formErrors = {
            'resetEmail': ''
        };
        this.validationMessages = {
            'resetEmail': {
                'required': 'Email Address is required.',
                'pattern': 'Email Address must be a valid.'
            }
        };
    }
    RequestPasswordChangeComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    RequestPasswordChangeComponent.prototype.buildForm = function () {
        var _this = this;
        this.requestPasswordChangeForm = this.formBuilder.group({
            'resetEmail': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100), forms_1.Validators.pattern(app_settings_1.Constants.EmailPattern)]]
        });
        this.requestPasswordChangeForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged(); // (re)set validation messages now
    };
    RequestPasswordChangeComponent.prototype.onValueChanged = function (data) {
        if (!this.requestPasswordChangeForm) {
            return;
        }
        var form = this.requestPasswordChangeForm;
        for (var field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    RequestPasswordChangeComponent.prototype.requestPasswordReset = function () {
        var _this = this;
        this.sendingEmail = true;
        //&& this.requestDetail.recaptchatoken != ''
        if (this.requestPasswordChangeForm.valid && this.requestDetail.recaptchatoken != '') {
            //  let loginResponse: LoginResponseModel = this.validateCookie.validateCookie();
            var loginResponse = this.loginStoreService.cookieStateItem;
            // console.log("Do we have a loginResponse at this point: ", loginResponse)
            if (!loginResponse) {
                loginResponse = new index_2.LoginResponseModel();
                //  console.log("Do we have a loginResponse Now: ", loginResponse)
            }
            //  let subscription =
            this.requestPasswordChangeService.subscribeToRequestPasswordChange(this.requestDetail, loginResponse);
            //.requestPasswordChange(this.requestDetail, loginResponse)
            //.subscribe(() => {
            window.setTimeout(function () {
                if (_this.requestPasswordChangeService.result == true) {
                    if (_this.requestPasswordChangeService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        // subscription.unsubscribe();
                        _this.loginStoreService.loadLogin(_this.requestPasswordChangeService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.requestPasswordChangeService.loginResponse);
                        _this.messageProcessorService.messageHandler();
                        _this.resetNotPosted = false;
                        _this.sendingEmail = false;
                    }
                    else {
                        //  subscription.unsubscribe();
                        _this.captcha.reset();
                        _this.loginStoreService.loadLogin(_this.requestPasswordChangeService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.requestPasswordChangeService.loginResponse);
                        _this.sendingEmail = false;
                        _this.showSuccessMessage = true;
                        _this.resetNotPosted = false;
                        _this.requestDetail.recaptchatoken = '';
                        _this.requestPasswordChangeForm.reset();
                        _this.showRecaptchaMessage = false;
                    }
                }
                else {
                    ++_this.requestPasswordChangeService.count;
                }
            }, 2000);
        }
        else if (this.requestDetail.recaptchatoken === '') {
            this.showRecaptchaMessage = true;
            if (!this.requestPasswordChangeForm.valid) {
                this.requestPasswordChangeForm.controls['resetEmail'].markAsDirty();
                this.onValueChanged();
            }
            this.sendingEmail = false;
        }
        else {
            //There are errors in the form 
            this.requestPasswordChangeForm.controls['resetEmail'].markAsDirty();
            this.onValueChanged();
            this.sendingEmail = false;
        }
    };
    RequestPasswordChangeComponent.prototype.handleCorrectCaptcha = function ($event) {
        var recaptchatoken = $event;
        this.requestDetail.recaptchatoken = recaptchatoken;
    };
    RequestPasswordChangeComponent.prototype.ngAfterViewChecked = function () {
        //Support toast in this component
        this.messageProcessorService.messageHandler();
    };
    __decorate([
        core_1.ViewChild(captcha_component_1.ReCaptchaComponent),
        __metadata("design:type", captcha_component_1.ReCaptchaComponent)
    ], RequestPasswordChangeComponent.prototype, "captcha", void 0);
    RequestPasswordChangeComponent = __decorate([
        core_1.Component({
            templateUrl: './request-password-change.component.html',
            providers: [index_1.RequestPassordChangeService,
                forms_1.FormBuilder,
                index_1.ValidateCookieService,
                index_1.CookieService
            ]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.ToasterService,
            forms_1.FormBuilder,
            index_1.RequestPassordChangeService,
            index_1.ValidateCookieService,
            index_1.CookieService,
            index_1.MessageProcessorService,
            index_1.LoginStoreService])
    ], RequestPasswordChangeComponent);
    return RequestPasswordChangeComponent;
}());
exports.RequestPasswordChangeComponent = RequestPasswordChangeComponent;
//# sourceMappingURL=request-password-change.component.js.map