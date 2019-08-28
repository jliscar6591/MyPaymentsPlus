import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StudentMeal, MealAccount } from '../../model/index';
import { AddCartItemService } from '../../services/index';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem } from '../../model/index';
import { Observable } from 'rxjs';

import { FroAppAvailabilityModel, FroAppStatusModel } from '../meal-purchases/model/index'

import {
    CookieService,
    ValidateCookieService,
    MessageProcessorService,
  UtilityService,
    LoginStoreService
} from '../../../shared/services/index';


@Component({
    selector: 'fro-status-selector',
    templateUrl: 'fro-status.component.html',
    styleUrls: ['fro-launch.component.less']
})

export class FroStatusComponent {
    constructor(
        private router: Router,
        private addCartItemService: AddCartItemService,
        private validateCookie: ValidateCookieService,
        private cookieService: CookieService,
      private utilityService: UtilityService,
        private loginStoreSvc: LoginStoreService
    ) { };

    @Input() model: FroAppStatusModel;
    //Stubs for action that can be taken on status
    @Output() continue: EventEmitter<any> = new EventEmitter<any>();
    @Output() determination: EventEmitter<any> = new EventEmitter<any>();
    @Output() download: EventEmitter<any> = new EventEmitter<any>();


  private loginResponse: LoginResponseModel = this.loginStoreSvc.cookieStateItem;
    //= this.validateCookie.validateCookie();

    displayStatus(status: string): string {
        switch (status.toLowerCase()) {
            case Constants.FroAppStatus.inProcess.value:
                return Constants.FroAppStatus.inProcess.display
            case Constants.FroAppStatus.pending.value :
                return Constants.FroAppStatus.pending.display
            case Constants.FroAppStatus.processed.value:
                return Constants.FroAppStatus.processed.display
            default:
                return status
        }
    }

    //Stubs for action that can be taken on status
    continueApp() {
        //this.model.status.toLowerCase
        this.continue.emit({
            "action": "Continue making app entries"
        });
    }

    eligibilityDetermination() {
        this.determination.emit({
            "action": "How the eligibility was determined"
        });
    }

    downloadApplication() {
        this.download.emit({
            "action": "Download the application"
        });
    }
}
