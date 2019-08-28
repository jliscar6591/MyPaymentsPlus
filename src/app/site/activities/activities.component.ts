import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Observable } from 'rxjs';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import { ActivitiesService } from '../services/activities.service';
import { ActivitiesList } from 'app/site/model/activities.model';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as ActivityStoreActions from '../../shared/store/actions/activityStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.less']
})
export class ActivitiesComponent implements OnInit {
  public mobile: boolean = false;
  public loginResponse: LoginResponseModel;
  public activityCallCount: number = 0;
  public activitiesList: ActivitiesList;
  public activityStore: Observable<ActivitiesList>;
  public activityState: any;
  public activitiesReady: boolean = false;

  constructor(
    public activitiesService: ActivitiesService,
    private store: Store<AppState>,
    private loginStoreSvc: LoginStoreService
  ) {
    this.activityStore = store.select(state => state.activityStore);
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.activitiesService.result = false;
    this.activitiesService.subscribeToGetActivities(this.loginResponse);
    this.activityCallCount = 0;
  }

  ngDoCheck() {
    if (this.activitiesService.result == true && this.activityCallCount == 0) {
      this.activitiesService.result = false;
      //this.activitiesList = this.activitiesService.activitiesList;
      //this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
      //this.activityStore.subscribe(c => this.activityState = c);
      //this.activitiesList = this.activityState.data;
      this.activitiesReady = true;
      this.activityCallCount = 1;
    }
  }

}
