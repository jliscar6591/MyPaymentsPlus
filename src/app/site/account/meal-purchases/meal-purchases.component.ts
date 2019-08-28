import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/observable/interval';



import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { Constants } from '../../../app.settings';
import {
  CookieService,
  ValidateCookieService,
  UtilityService,
  DateRangeSelectorService,
  LoginStoreService
} from '../../../shared/services/index';
import { StudentListService } from '../../../registration/services/index';
import { StudentModel } from '../../../registration/model/index';
import { StudentMealPurchaseSearchModel, StudentMealPurchaseModel } from './model/index';
import { StudentMealPurchasesService } from '../services/index';
import { MealAccount } from '../../../site/model/index';
import { MultiDistrictService } from '../../services/multi-district.service';
import { UserContextService } from '../services/user-context.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
//import { window } from 'rxjs/operators';
//import { clearInterval } from 'timers';



@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'meal-purchases.component.html',
  styleUrls: ['meal-purchases.component.less']

})

export class MealPurchasesComponent {
  //date widget ///
  private activityPeriodForm: FormGroup;
  private activityPeriodSelection: number = 7;
  public isCustom: boolean = false;


  private studentModel: StudentModel
  private studentMealPurchaseSearchModel: StudentMealPurchaseSearchModel =
    {
      endDate: '',
      startDate: '',
      student: this.studentModel
    }


  public isStudentGetting: boolean = true;
  public isStudent: boolean = false;
  private isPurchase: boolean = false;
  private isPurchaseGetting: boolean = false;
  private getPurchaseErr: boolean = false;
  private getPurchaseErrMsg: string = '';
  private getStudentErr: boolean = false;
  private getStudentErrMsg: string = '';

  private loginResponse: LoginResponseModel;
  public dateRangeForm: FormGroup;
  public startDate: Date;
  public endDate: Date;
  public studentCallCount: number = 0;
  private studentIndex = 0;
  public isMultiDistrict: boolean = false;
  public multiDistrictStudents: StudentModel;
  public getStudentMealPurchasesCnt: number = 0;
  private getStudentPurchasesInterval: any;
  private studentPurchasesListInterval: any;
  private userContextInterval: any;
  public isSwitching: boolean = false;
  public studentList: any;
  public activeStudents: any;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private utilityService: UtilityService,
    private studentListService: StudentListService,
    private studentMealPurchasesService: StudentMealPurchasesService,
    private dateRangeSelectorService: DateRangeSelectorService,
    private multiDistrictSvc: MultiDistrictService,
    private userContextSvc: UserContextService,
    private loginStoreSvc: LoginStoreService
  ) { }

  ngOnInit() {
    //Session (must be first in the init section )
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.activeStudents = [];
    var i;
    for (i = 0; i < this.studentListService.students.length; i++) {
      if (this.studentListService.students[i].isActive) {
        this.activeStudents.push(this.studentListService.students[i])
      }
      console.log(this.activeStudents);
    }
    //console.log("Student Meal Purchases: ", this.loginResponse)
    //Date range selector form //
    this.activityPeriodForm = this.formBuilder.group({
      'activityPeriodSelector': ['']
    });
    //type in date range form
    this.dateRangeForm = this.formBuilder.group({
      'startDate': new FormControl(new Date()),
      'endDate': new FormControl(new Date())
    });
    this.setPeriod()
    console.log(this.studentIndex);
    if (this.activeStudents[this.studentIndex].isActive) {
      this.getStudentMealPurchases(this.activeStudents[this.studentIndex])
    } else {
      this.isPurchaseGetting = false;
    }
    let failureMessage: string = 'No Students to Manage';
    if (this.studentListService.students) {
      this.studentListService.result = true;
      this.studentListService.gotStudentList.emit(this.studentListService.result);
      this.isStudentGetting = false;
      this.getStudentErr = false;
      this.studentList = this.studentListService.students;
      // console.log('studentlist', this.studentList);
      this.isStudent = (this.studentList.length > 0) ? true : false;
    }
    this.isMultiDistrict = this.multiDistrictSvc.multiDistrictFlag;
    if (this.isMultiDistrict) {
      // console.log("Are we MultiDistrict: ", this.isMultiDistrict)
      this.selectedDistrictStudents(this.studentListService.students);
    }

    this.studentListService.gotStudentList.subscribe(() => {
      if (this.studentListService.result === true && this.studentCallCount < 1) {
        console.log("do we have a student List here: ", this.studentListService.students)
        //  console.log("Is this MultiDistrict: ", this.multiDistrictSvc.multiDistrictFlag)

        //Load student tabs /

        if (this.isMultiDistrict) {

          this.getSelectedDistrctStudents(this.multiDistrictStudents)

        } else {
          this.getStudent();
        }
        this.isStudentGetting = false;
        this.studentCallCount++;

      }
    })

    this.userContextSvc.gotNewUserContext$.subscribe(() => {
      if (this.userContextSvc.newTokenResults && this.userContextSvc.callUserCntxtCnt < 1) {
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        this.isMultiDistrict = this.multiDistrictSvc.multiDistrictFlag;
        // console.log("Are we multiDistrict: ", this.isMultiDistrict)
        this.userContextInterval = setInterval(() => {
          if (this.userContextSvc.newTokenResults) {
            // console.log("this.getStudentMealPurchasesCnt = ", this.userContextSvc.callUserCntxtCnt)
            // console.log("Are we MultiDistrict: ", this.isMultiDistrict)
            this.selectedDistrictStudents(this.studentListService.students);
            // console.log("Calling getSelectedDistrctStudents from usercontext subscription: ", this.multiDistrictStudents)
            this.getSelectedDistrctStudents(this.multiDistrictStudents);
            this.userContextSvc.callUserCntxtCnt++;
            this.isPurchaseGetting = false;
            this.userContextSvc.newTokenResults = false;
            this.studentCallCount = 0;
            clearInterval(this.userContextInterval);
          }

        }, 500)

      }

    })

    this.studentCallCount = 0;
    //set the default date range to last 7 days /
    this.setPeriod();
    //Load date range selector //
    this.getDateRangeList();


  }

  ngDoCheck() {
    //if (this.studentListService.result === false) {
    //  this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
    //}



  }

  public selectedDistrictStudents(studentList) {
    console.log("Do we have the fullList: ", studentList)
    // console.log("do I know the selected District: ", this.loginResponse)
    let selectedDistrict = this.loginResponse.districtName;
    const filteredList = studentList.filter(student => student.districtName == selectedDistrict);
    this.multiDistrictStudents = filteredList;
    //  console.log("Did we get a filtered List: ", this.multiDistrictStudents)

  }

  public getSelectedDistrctStudents(studentList) {
    this.isStudentGetting = true;
    // console.log("About to call getStudentMeal Purchases: ", studentList)
    if (this.activeStudents[0].isActive) {
      this.getStudentMealPurchases(studentList[0]);
    }
  }

  //Get student list //
  public getStudent() {
    // console.log("Calling GetStudents")
    this.isStudentGetting = true;
    if (this.activeStudents[0].isActive) {
      this.getStudentMealPurchases(this.studentListService.students[0]);
    }
  }


  //Date range list ///
  getDateRangeList() {
    let subscription = this.dateRangeSelectorService.getDateRangeSelections(this.loginResponse)
      .subscribe(() => {
        if (this.dateRangeSelectorService.result == true) {
          subscription.unsubscribe();
          if (this.dateRangeSelectorService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSvc.loadLogin(this.dateRangeSelectorService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.dateRangeSelectorService.loginResponse);

          } else {
            //enable the state selector.
            this.activityPeriodForm.controls['activityPeriodSelector'].enable();
          }
        } else {
          ++this.dateRangeSelectorService.count;
        }
      });
  }

  //Take the selected index from the clicked tab and get the
  //Student to affix the purchases to.
  //Also, checks for the existence of a previously loaded list
  //and uses this instead of getting a fresh copy from the service. 
  public processSelection = (tabChangeEvent: MatTabChangeEvent): void => {
    //console.log("Calling ProcessSelection for: ", tabChangeEvent)
    //this.isStudentGetting = true;
    this.isStudent = true;
    this.isMultiDistrict = false;
    if (tabChangeEvent.tab) {
      tabChangeEvent.tab.position = tabChangeEvent.tab.origin;
    }
    //this.isPurchaseGetting = true;
    this.studentIndex = tabChangeEvent.index;
    //console.log(tabChangeEvent.index)
    //console.log(this.studentListService.students[this.studentIndex].studentMealPurchases, this.studentListService.students[this.studentIndex].kaput)
    if (this.studentListService.students[this.studentIndex].studentMealPurchases == undefined ||
      this.studentListService.students[this.studentIndex].kaput
    ) {
      //Fresh service call
      this.setPeriod()
      if (this.activeStudents[this.studentIndex].isActive) {
        this.getStudentMealPurchases(this.activeStudents[this.studentIndex])
        //console.log('is this happening');
      }
    } else {
      this.isPurchase = this.studentListService.students[this.studentIndex].studentMealPurchases.length > 0;
      //console.log("Do we have a list: ", this.studentListService.students[this.studentIndex].studentMealPurchases)
      console.log('isPurchase', this.isPurchase);
      console.log('ispurchasegetting', this.isPurchaseGetting);
      //We already have the list just need to change which student from the list we want
      this.isStudentGetting = false;
      this.studentMealPurchaseSearchModel.student = this.activeStudents[this.studentIndex];
      this.studentMealPurchaseSearchModel.student.studentMealPurchases = this.activeStudents[this.studentIndex].studentMealPurchases;
      this.isPurchaseGetting = false;
    }
  }

  //Get student purchases /
  public getStudentMealPurchases(student: StudentModel) {
    //console.log("Calling getStudentMealPurchases: ", student)
    this.isPurchaseGetting = true;
    //Search model values ///
    this.studentMealPurchaseSearchModel.student = student;
    //console.log("Subscrining ToGetStudentMealPurchases: ", this.studentMealPurchaseSearchModel)
    if (student.isActive) {
      this.studentMealPurchasesService.subscribeToGetStudentMealPurchases(this.studentMealPurchaseSearchModel, this.loginResponse)
      //window.setTimeout
    }
    this.getStudentPurchasesInterval = setInterval(() => {
      if (this.studentMealPurchasesService.result == true) {
        if (this.studentMealPurchasesService.loginResponse.messageType === Constants.Error) {
          this.getPurchaseErr = true;
          this.getPurchaseErrMsg = this.studentMealPurchasesService.loginResponse.message;

          this.utilityService.clearErrorMessage(this.studentMealPurchasesService.loginResponse);
          this.isPurchase = false;
        } else {
          //Copy this over to the object used for the student list  
          this.activeStudents[this.studentIndex].studentMealPurchases = this.studentMealPurchaseSearchModel.student.studentMealPurchases;
          this.activeStudents[this.studentIndex].total = this.studentMealPurchaseSearchModel.student.total;
          this.activeStudents[this.studentIndex].kaput = false;

          this.loginStoreSvc.loadLogin(this.studentMealPurchasesService.loginResponse)


          //this.studentMealPurchaseSearchModel belongs to this object and the studentMealPurchases for the
          //selected student has been updated
          this.isPurchase = (this.studentMealPurchaseSearchModel.student.studentMealPurchases != null &&
            this.studentMealPurchaseSearchModel.student.studentMealPurchases.length > 0) ? true : false;
          this.isPurchaseGetting = false;
        }
        //if (this.studentMealPurchaseSearchModel.student.studentMealPurchases) {
        //  if (this.studentMealPurchaseSearchModel.student.studentMealPurchases.length > 0) {

        //    //this.studentMealPurchaseSearchModel belongs to this object and the studentMealPurchases for the
        //    //selected student has been updated
        //    this.isPurchase = true;
        //    this.studentMealPurchasesService.result = false;
        //  }
        //} else {
        this.studentPurchasesListInterval = setInterval(() => {
          if (this.studentMealPurchaseSearchModel.student.studentMealPurchases) {
            this.isPurchase = true;
            this.isStudentGetting = false;
            this.isStudent = true;
            this.studentMealPurchasesService.result = false;
            clearInterval(this.studentPurchasesListInterval);
          }
        }, 500)
        //}
        clearInterval(this.getStudentPurchasesInterval);
        //console.log("Did we get Purchases: ", this.studentMealPurchaseSearchModel.student.studentMealPurchases)
      } else {
        ++this.studentMealPurchasesService.count;
      }
    }, 500)
    console.log('isPurchase', this.isPurchase);
    console.log('ispurchasegetting', this.isPurchaseGetting);
  }

  //Process the date selector into start and end date /
  //Based on last n days //
  public setPeriod() {
    var startDate: Date = new Date();
    var today: Date = new Date();
    startDate.setDate(today.getDate() - this.activityPeriodSelection);
    this.studentMealPurchaseSearchModel.endDate = today.toISOString();
    this.studentMealPurchaseSearchModel.startDate = startDate.toISOString();
    //console.log('startdate', this.studentMealPurchaseSearchModel.startDate);
    //console.log('endDate', this.studentMealPurchaseSearchModel.endDate);
    return;
  }

  public datePickerSet() {
    var startDate: Date = new Date();
    var endDate: Date = new Date();
    this.studentMealPurchaseSearchModel.startDate = this.startDate.toString();
    this.studentMealPurchaseSearchModel.endDate = this.endDate.toString();
    return;
  }

  public dateSearch() {
    this.isPurchaseGetting = true;
    this.datePickerSet();
    if (this.activeStudents[this.studentIndex].isActive) {
      this.getStudentMealPurchases(this.activeStudents[this.studentIndex]);
    }

  }

  //New date range for search /
  public newSearch() {
    if (this.activityPeriodSelection === 0) {
      this.isCustom = true;
      this.isPurchaseGetting = true;
    } else {
      this.isPurchaseGetting = true;
      this.isCustom = false;
      this.markAsKaput();
      this.setPeriod();
      if (this.activeStudents[this.studentIndex].isActive) {
        this.getStudentMealPurchases(this.activeStudents[this.studentIndex]);
      }
    }
  }

  //When there is ne search criteria all student purchase lists are kaput
  public markAsKaput() {
    this.studentListService.students.forEach(function (item) {
      item.kaput = true;
    })
  }

  public ngOnDestroy() {

  }
}
