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
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var index_1 = require("../../../shared/services/index");
var index_2 = require("../../services/index");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var FeedbackDialogComponent = /** @class */ (function () {
    function FeedbackDialogComponent(dialogRef, formBuilder, utilityService, feedbackService, validateCookie, cookieService, loginStoreSvc) {
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.utilityService = utilityService;
        this.feedbackService = feedbackService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.loginStoreSvc = loginStoreSvc;
        this.formErrors = {
            'message': ''
        };
        this.validationMessages = {
            'message': {
                'required': 'Feedback is required.'
            }
        };
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    FeedbackDialogComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    FeedbackDialogComponent.prototype.buildForm = function () {
        var _this = this;
        this.feedbackForm = this.formBuilder.group({
            'message': ['']
        });
        //if send us feedback & NOT return to classic, then make the message a required field
        if (!this.returnToClassic) {
            this.feedbackForm.get('message').setValidators([forms_1.Validators.required]);
            this.feedbackForm.get('message').updateValueAndValidity();
            this.feedbackForm.valueChanges.subscribe(function (data) { return _this.onValueChangedData(data); });
        }
    };
    FeedbackDialogComponent.prototype.onValueChangedData = function (data) {
        if (!this.feedbackForm) {
            return;
        }
        this.utilityService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages);
    };
    FeedbackDialogComponent.prototype.send = function () {
        var _this = this;
        if (this.feedbackForm.valid) {
            var messageObj = { message: '', feedbackSource: null };
            messageObj.message = this.feedbackForm.controls['message'].value;
            messageObj.feedbackSource = this.returnToClassic ? 2 : 1;
            //if the message is not blank
            if (messageObj.message !== '') {
                var subscription_1 = this.feedbackService.postFeedback(messageObj, this.loginResponse)
                    .subscribe(function () {
                    if (_this.feedbackService.result == true) {
                        subscription_1.unsubscribe();
                        //if error with posting feedback
                        if (_this.feedbackService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.sendingFeedbackError = true;
                            _this.sendingFeedbackErrorMsg = _this.feedbackService.loginResponse.message;
                            _this.utilityService.clearErrorMessage(_this.feedbackService.loginResponse);
                        }
                        else {
                            //if successful, update cookie
                            _this.loginStoreSvc.loadLogin(_this.feedbackService.loginResponse);
                            // this.cookieService.putObject(Constants.AuthCookieName, this.feedbackService.loginResponse);
                            //if feedback is sent via the return to classic option, then remeber that feedback was provided 
                            if (messageObj.feedbackSource == 2) {
                                //  this.loginStoreSvc.loadLogin(this.feedbackService.loginResponse);
                                _this.cookieService.putObject(app_settings_1.Constants.FeedbackCookieName, 1);
                            }
                            //close dialog
                            _this.dialogRef.close(true);
                        }
                        var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                        seconds.subscribe(function (x) {
                            if (x == app_settings_1.Constants.SpinnerDelay) {
                                _this.sendingFeedback = false;
                            }
                        });
                    }
                    else {
                        ++_this.feedbackService.count;
                    }
                });
            }
            //if the feedback message is blank
            else {
                //create cookie to not show me the dialog when i want to return to classic
                if (messageObj.feedbackSource == 2) {
                    this.cookieService.putObject(app_settings_1.Constants.FeedbackCookieName, 1);
                }
                this.loginStoreSvc.loadLogin(this.loginResponse);
                //this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                //close dialog
                this.dialogRef.close(true);
            }
        }
        else {
            //show the errors of my ways 
            for (var control in this.feedbackForm.controls) {
                this.feedbackForm.controls[control].markAsDirty();
                this.utilityService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages);
            }
        }
    };
    FeedbackDialogComponent = __decorate([
        core_1.Component({
            selector: 'feedback-dialog',
            templateUrl: './feedback-dialog.component.html',
            styleUrls: ['./feedback-dialog.component.less']
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef,
            forms_1.FormBuilder,
            index_1.UtilityService,
            index_2.FeedbackService,
            index_1.ValidateCookieService,
            index_1.CookieService,
            index_1.LoginStoreService])
    ], FeedbackDialogComponent);
    return FeedbackDialogComponent;
}());
exports.FeedbackDialogComponent = FeedbackDialogComponent;
//# sourceMappingURL=feedback-dialog.component.js.map