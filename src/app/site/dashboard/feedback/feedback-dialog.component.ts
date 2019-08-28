import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import {
    UtilityService,
    ValidateCookieService,
  CookieService,
  LoginStoreService
} from '../../../shared/services/index';
import { FeedbackService } from '../../services/index';
import { Feedback } from '../../model/index';
import { LoginResponseModel } from '../../../login/model/index';
import { Constants } from '../../../app.settings';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.less']
})

export class FeedbackDialogComponent implements OnInit {
    public returnToClassic: boolean;
    public feedbackForm: FormGroup;
  private loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();
    public sendingFeedbackError: boolean;
    private sendingFeedbackErrorMsg: string;
    public sendingFeedback: boolean;

    constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>,
        private formBuilder: FormBuilder,
        private utilityService: UtilityService,
        private feedbackService: FeedbackService,
        private validateCookie: ValidateCookieService,
      private cookieService: CookieService,
      private loginStoreSvc: LoginStoreService
    ) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.feedbackForm = this.formBuilder.group({
            'message': ['']
        });

        //if send us feedback & NOT return to classic, then make the message a required field
        if (!this.returnToClassic) {
            this.feedbackForm.get('message').setValidators([Validators.required]);
            this.feedbackForm.get('message').updateValueAndValidity();

            this.feedbackForm.valueChanges.subscribe(data => this.onValueChangedData(data));
        }
    }

    onValueChangedData(data?: any) {
        if (!this.feedbackForm) { return; }
        this.utilityService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages);
    }

    formErrors = {
        'message': ''
    }

    validationMessages = {
        'message': {
            'required': 'Feedback is required.'
        }
    }

    send() {
        if (this.feedbackForm.valid) {
            var messageObj: Feedback = { message: '', feedbackSource: null };
            messageObj.message = this.feedbackForm.controls['message'].value;
            messageObj.feedbackSource = this.returnToClassic ? 2 : 1;

            //if the message is not blank
            if (messageObj.message !== '') {
                let subscription = this.feedbackService.postFeedback(messageObj, this.loginResponse)
                    .subscribe(() => {
                        if (this.feedbackService.result == true) {
                            subscription.unsubscribe();
                            //if error with posting feedback
                            if (this.feedbackService.loginResponse.messageType === Constants.Error) {
                                this.sendingFeedbackError = true;
                                this.sendingFeedbackErrorMsg = this.feedbackService.loginResponse.message;
                                this.utilityService.clearErrorMessage(this.feedbackService.loginResponse);
                            } else {
                                //if successful, update cookie
                              this.loginStoreSvc.loadLogin(this.feedbackService.loginResponse);
                               // this.cookieService.putObject(Constants.AuthCookieName, this.feedbackService.loginResponse);

                                //if feedback is sent via the return to classic option, then remeber that feedback was provided 
                              if (messageObj.feedbackSource == 2) {
                              //  this.loginStoreSvc.loadLogin(this.feedbackService.loginResponse);
                                    this.cookieService.putObject(Constants.FeedbackCookieName, 1);
                                }

                                //close dialog
                                this.dialogRef.close(true);
                            }
                            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
                            seconds.subscribe(
                                x => {
                                    if (x == Constants.SpinnerDelay) {
                                        this.sendingFeedback = false;
                                    }
                                });
                        } else {
                            ++this.feedbackService.count;
                        }
                    });
            }
            //if the feedback message is blank
            else {
                //create cookie to not show me the dialog when i want to return to classic
                if (messageObj.feedbackSource == 2) {
                    this.cookieService.putObject(Constants.FeedbackCookieName, 1);
                }
              this.loginStoreSvc.loadLogin(this.loginResponse);
                //this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);

                //close dialog
                this.dialogRef.close(true);
            }
        }
        else {
            //show the errors of my ways 
            for (const control in this.feedbackForm.controls) {
                this.feedbackForm.controls[control].markAsDirty();
                this.utilityService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages);
            }
        }
    }

}
