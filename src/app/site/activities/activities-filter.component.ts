import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Observable } from 'rxjs';
import { ActivitiesListComponent } from '../activities/activities-list.component';
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
import { ActivitiesList, Categories, Accounts, Activities } from 'app/site/model/activities.model';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as ActivityStoreActions from '../../shared/store/actions/activityStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';


@Component({
  selector: 'app-activities-filter',
  templateUrl: './activities-filter.component.html',
  styleUrls: ['./activities-filter.component.less']
})
export class ActivitiesFilterComponent implements OnInit {
  @Input() selected: string;
  private loginResponse: LoginResponseModel;
  public activityCallCount: number = 0;
  public activitiesList: ActivitiesList[];
  public accounts: Accounts[];
  public categories: Categories[];
  public activityStore: Observable<ActivitiesList>;
  public activityState: any;
  public activitiesReady: boolean = false;
  public filters = new FormGroup({
    student: new FormControl()
  });
  public mobile: boolean = false;
  public studentsSelected: [''];
  public categoriesSelected: any;
  public studentsSearch: [''];

  constructor(
    private store: Store<AppState>,
    public activitiesService: ActivitiesService,
    private validateCookie: ValidateCookieService,
    private loginStoreSvc: LoginStoreService,
    private formBuilder: FormBuilder,
  ) {
    this.createFilterForm();
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.activityStore.subscribe(c => this.activityState = c);
    this.activitiesList = this.activityState.data;
    this.activitiesReady = true;
    //console.log('students', this.activitiesList[0].accounts);
    this.activityCallCount = 0;
  }

  ngDoCheck() {
    if (this.activitiesService.result == true && this.activityCallCount == 0) {
      this.activitiesService.result = false;
      this.activityCallCount = 1;
    }
  }

  createFilterForm() {
    this.filters = this.formBuilder.group({
      student: ''
    });
  }

  public studentSelection() {
    //console.log('studentsSelected', this.filters.value.student.value);
    this.studentsSelected.push(this.filters.value.student.value);
    //console.log('students selected', this.studentsSelected);

  }

  public removeStudent() {

  }

}
