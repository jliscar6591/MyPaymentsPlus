import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Observable } from 'rxjs';
import { ActivitiesDialogComponent } from './activities-dialog.component';
import { AddCartItemService } from '../services/add-cart-item.service';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import { ActivitiesService } from '../services/activities.service';
import { ActivitiesList, Activities, Categories } from 'app/site/model/activities.model';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as ActivityStoreActions from '../../shared/store/actions/activityStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivityDetails } from 'app/site/activities/activities-details.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.less']
})

export class ActivitiesListComponent implements OnInit {
  @Input() selected: string;
  public search = new FormGroup({
    searchValue: new FormControl()
  });
  public filters = new FormGroup({
    student: new FormControl()
  });
  public sort = new FormGroup({
    sortOptions: new FormControl()
  });
  public mobile: boolean = false;
  private loginResponse: LoginResponseModel;
  public activityCallCount: number = 0;
  public activitiesList: any;
  public categories: Categories;
  public activities: Activities[];
  public activityStore: Observable<ActivitiesList>;
  public activityState: any;
  public activitiesReady: boolean = false;
  public searchList = [];
  public searchResults = [];
  public categoryList = [];
  public categorySearchList = [];
  public studentList : any = [];
  public uniqueStudents = [];
  public searchComplete: boolean = false;
  public noSearchResults: boolean = false;
  public studentsSelected = [];
  public activitiesInCart = [];
  public p: number = 1;
  public startDates = [];
  public endDates = [];
  public uniqueCategories = [];
  public uniqueSearchResults = [];
  public searchCategories: any = [];
  public uniqueSearchCategories: any = [];
  

  constructor(public activitiesService: ActivitiesService,
    private validateCookie: ValidateCookieService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private addCartItemService: AddCartItemService,
    private loginStoreSvc: LoginStoreService,
    private formBuilder: FormBuilder) {
     this.activityStore = store.select(state => state.activityStore); 
    this.createSearchForm();
    this.createFilterForm();
    this.createSearchForm();
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ngOnInit() {
    this.mobile = (window.innerWidth < 600) ? true : false;
    //this.activityStore.subscribe(c => this.activityState = c);
    this.activitiesList = this.activitiesService.activitiesList;
    //console.log('activities list', this.activitiesList);
    this.getSearchActivities();
  }

  ngDoCheck() {
    if (this.addCartItemService.cartResponse) {
      this.getSearchActivities();
    }
  }

  public createSearchForm() {
    this.search = this.formBuilder.group({
      searchValue: '',

    })
  }

  createFilterForm() {
    this.filters = this.formBuilder.group({
      student: '',
      category: ''
    });
  }

  createSortForm() {
    this.sort = this.formBuilder.group({
      sortOptions: ''
    });
  }

  public getSearchActivities() {
    this.activitiesInCart = [];
    var i;
    for (i = 0; i < this.activitiesList.length; i++) {
      if (this.activitiesList[i].accounts.length !== 0 ) {
        this.categoryList.push(this.activitiesList[i].category);
        this.searchCategories.push(this.activitiesList[i]);
      }
      var j;
      for (j = 0; j < this.activitiesList[i].accounts.length; j++) {
        if (!this.studentList.includes(this.activitiesList[i].accounts[j].studentFirstName.toLowerCase())) {
          this.studentList.push(this.activitiesList[i].accounts[j].studentFirstName);
        }
        var k;
        for (k = 0; k < this.activitiesList[i].accounts[j].activities.length; k++) {
          this.searchList.push(this.activitiesList[i].accounts[j].activities[k]);
          if (this.activitiesList[i].accounts[j].activities[k].isInCart) {
            this.activitiesInCart.push(this.activitiesList[i].accounts[j].activities[k]);
          }
        }
      }
      var l;
      for (l = 0; l < this.activitiesList[i].subCategory.length; l++) {
        if (this.activitiesList[i].subCategory.length !== 0) {
          this.categoryList.push(this.activitiesList[i].category);
          this.searchCategories.push(this.activitiesList[i]);
          this.categoryList.push(this.activitiesList[i].subCategory[l].category);
        }
        var m;
        for (m = 0; m < this.activitiesList[i].subCategory[l].accounts.length; m++) {
          if (!this.studentList.includes(this.activitiesList[i].subCategory[l].accounts[m].studentFirstName.toLowerCase())) {
            this.studentList.push(this.activitiesList[i].subCategory[l].accounts[m].studentFirstName);
          }
          var n;
          for (n = 0; n < this.activitiesList[i].subCategory[l].accounts[m].activities.length; n++) {
            this.searchList.push(this.activitiesList[i].subCategory[l].accounts[m].activities[n]);
            if (this.activitiesList[i].subCategory[l].accounts[m].activities[n].isInCart) {
              this.activitiesInCart.push(this.activitiesList[i].subCategory[l].accounts[m].activities[n]);
            }
          }
        }
      }
    }
    this.uniqueStudents = this.studentList.filter(this.getUniqueStudents);
    this.uniqueSearchCategories = this.searchCategories.filter(this.getUniqueSearchCategories);
    this.activitiesReady = true;
    //console.log('searchList', this.searchList);
    //console.log('unique Students', this.uniqueStudents);
    //console.log('this.activities in cart', this.activitiesInCart);
  }

  public getUniqueSearchCategories(value, index, self) {
    return self.indexOf(value) === index;
  }

  public getUniqueStudents(value, index, self) {
    return self.indexOf(value) === index;
  }

  public getUniqueCategories(value, index, self) {
    return self.indexOf(value) === index;
  }

  public getUniqueSearchResults(value, index, self) {
    return self.indexOf(value) === index;
  }

  //searches activities for keyword, students selected & sort option
  public searchActivities() {
    //console.log('search value', this.search.value.searchValue);
    this.searchResults = [];
    this.uniqueSearchResults = [];
    this.studentList = [];
    this.uniqueStudents = [];
    this.uniqueCategories = [];
    this.categorySearchList = [];
    //console.log('selected in filters form', this.filters.value.student);
    //console.log('selected categories in filters form', this.filters.value.category);
    this.studentsSelected = [];

    var i;
    for (i = 0; i < this.searchList.length; i++) {
      if (this.searchList[i].activityName.toLowerCase().includes(this.search.value.searchValue.toLowerCase()) || this.searchList[i].description.toLowerCase().includes(this.search.value.searchValue.toLowerCase()) || this.searchList[i].category.toLowerCase().includes(this.search.value.searchValue.toLowerCase())) {
        if (this.filters.value.student.length > 0 && this.filters.value.category.length > 0) {
          this.studentList.push(this.searchList[i].studentName);
          this.categorySearchList.push(this.searchList[i].category);
          if (this.filters.value.student.includes(this.searchList[i].studentName) && this.filters.value.category.includes(this.searchList[i].category)) {
            //console.log('1');
            this.searchResults.push(this.searchList[i]);
            this.categorySearchList.push(this.searchList[i].category);
          }
        } else if (this.filters.value.student.length === 0 && this.filters.value.category.length > 0) {
          this.studentList.push(this.searchList[i].studentName);
          this.categorySearchList.push(this.searchList[i].category);
          if (this.filters.value.category.includes(this.searchList[i].category)) {
            //console.log('2');
            this.searchResults.push(this.searchList[i]);
            this.categorySearchList.push(this.searchList[i].category);
          }
        } else if (this.filters.value.category.length === 0 && this.filters.value.student.length > 0) {
          this.studentList.push(this.searchList[i].studentName);
          if (this.filters.value.student.includes(this.searchList[i].studentName)) {
            //console.log('3');
            this.searchResults.push(this.searchList[i]);
            this.categorySearchList.push(this.searchList[i].category);
          }
        } else {
          //console.log('4');
          this.studentList.push(this.searchList[i].studentName);
          this.searchResults.push(this.searchList[i]);
          this.categorySearchList.push(this.searchList[i].category);
        }
      }
    }
    this.uniqueSearchResults = this.searchResults.filter(this.getUniqueSearchResults);
    //console.log('unsorted uniqueSearchResults for categories and students selected', this.uniqueSearchResults);
    this.uniqueCategories = this.categorySearchList.filter(this.getUniqueCategories);
    //console.log('unique categories for this search keyword', this.uniqueCategories);
    this.uniqueStudents = this.studentList.filter(this.getUniqueStudents);
    //console.log('unique students for this search keyword', this.uniqueStudents);
    this.searchComplete = true;
    if (this.uniqueSearchResults.length === 0) {
      this.noSearchResults = true;
    }

    for (i = 0; i < this.uniqueStudents.length; i++) {
      this.studentsSelected.push(this.uniqueStudents[i]);
    }

    if (this.sort.value.sortOptions) {
      this.startDates = [];
      this.endDates = [];
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      var dateToCompare = mm + '/' + dd + '/' + yyyy;
      console.log(dateToCompare);
      //console.log('todays date', dateToCompare);
      if (this.sort.value.sortOptions === 2) {
        var i;
        for (i = 0; i < this.uniqueSearchResults.length; i++) {
          this.startDates.push(new Date(this.uniqueSearchResults[i].startDate).valueOf());
          this.uniqueSearchResults.sort((activityA: Activities, activityB: Activities) => {
            if (new Date(activityA.startDate).valueOf() < new Date(activityB.startDate).valueOf()) return -1;
            if (new Date(activityA.startDate).valueOf() > new Date(activityB.startDate).valueOf()) return 1;
            return 0;
          })
        }

      } else if (this.sort.value.sortOptions === 3) {
        var i;
        for (i = 0; i < this.uniqueSearchResults.length; i++) {
          this.endDates.push(new Date(this.uniqueSearchResults[i].endDate).valueOf());
          this.uniqueSearchResults.sort((activityA: Activities, activityB: Activities) => {
            if (new Date(activityA.signupEndDate).valueOf() < new Date(activityB.signupEndDate).valueOf()) return -1;
            if (new Date(activityA.signupEndDate).valueOf() > new Date(activityB.signupEndDate).valueOf()) return 1;
            return 0;
          })
        }
      }

      if (this.startDates) {
        //console.log('hopefully sorted by start date activities', this.uniqueSearchResults);
        //console.log('unsorted startDates', this.startDates);
        this.startDates.sort();
        //console.log('sorted', this.startDates);
      }

      if (this.endDates) {
        //console.log('endDates', this.endDates);
        this.endDates.sort();
        //console.log('sorted endDates', this.endDates);
        //console.log('hopefully sorted by signup deadline activites', this.uniqueSearchResults);
      }
    }

  }

  //called by student selection change and runs through search activities() again with an array of selected students
  public filterStudents() {
    this.searchActivities();
  }

  //called by category selection change and runs through search activities() again with array of selected categories 
  public filterCategories() {
    this.searchActivities();
  }

  //called by the sort option selection and runs back through search activities() with a sort type value
  public sortBy() {
    this.searchActivities();
  }

  //clears search and takes you back to category view
  public clearSearch() {
    this.search.reset();
    this.searchComplete = false;
    this.getSearchActivities();
  }

  public openActivityDialog(activityInCart) {
    const dialogRef = this.dialog.open(ActivitiesDialogComponent, {
      width: '750px',
      data: activityInCart,
    });
  }
}
