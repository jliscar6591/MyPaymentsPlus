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
    selector: 'fro-start-selector',
    templateUrl: 'fro-start.component.html',
    styleUrls: ['fro-launch.component.less']
})

export class FroStartComponent {
    constructor(
        private router: Router,
        private addCartItemService: AddCartItemService,
        private validateCookie: ValidateCookieService,
        private cookieService: CookieService,
      private utilityService: UtilityService,
      private loginStoreSvc: LoginStoreService
    ) { };

    @Input() model: FroAppAvailabilityModel;
    @Output() startNewFroApp: EventEmitter<any> = new EventEmitter<any>();


  private loginResponse: LoginResponseModel = this.loginStoreSvc.cookieStateItem;
    //this.validateCookie.validateCookie();

    startNew() {
        this.startNewFroApp.emit({
            "action": "Navigate to fro to create new app"
        });
    }
}
