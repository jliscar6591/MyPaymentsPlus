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
require("rxjs/add/observable/interval");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../shared/services/index");
var index_2 = require("../../../registration/services/index");
var index_3 = require("../services/index");
var multi_district_service_1 = require("../../services/multi-district.service");
var user_context_service_1 = require("../services/user-context.service");
//import { window } from 'rxjs/operators';
//import { clearInterval } from 'timers';
var MealPurchasesComponent = /** @class */ (function () {
    function MealPurchasesComponent(formBuilder, cookieService, utilityService, studentListService, studentMealPurchasesService, dateRangeSelectorService, multiDistrictSvc, userContextSvc, loginStoreSvc) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.studentListService = studentListService;
        this.studentMealPurchasesService = studentMealPurchasesService;
        this.dateRangeSelectorService = dateRangeSelectorService;
        this.multiDistrictSvc = multiDistrictSvc;
        this.userContextSvc = userContextSvc;
        this.loginStoreSvc = loginStoreSvc;
        this.activityPeriodSelection = 7;
        this.isCustom = false;
        this.studentMealPurchaseSearchModel = {
            endDate: '',
            startDate: '',
            student: this.studentModel
        };
        this.isStudentGetting = true;
        this.isStudent = false;
        this.isPurchase = false;
        this.isPurchaseGetting = false;
        this.getPurchaseErr = false;
        this.getPurchaseErrMsg = '';
        this.getStudentErr = false;
        this.getStudentErrMsg = '';
        this.studentCallCount = 0;
        this.studentIndex = 0;
        this.isMultiDistrict = false;
        this.getStudentMealPurchasesCnt = 0;
        this.isSwitching = false;
        //Take the selected index from the clicked tab and get the
        //Student to affix the purchases to.
        //Also, checks for the existence of a previously loaded list
        //and uses this instead of getting a fresh copy from the service. 
        this.processSelection = function (tabChangeEvent) {
            //console.log("Calling ProcessSelection for: ", tabChangeEvent)
            //this.isStudentGetting = true;
            _this.isStudent = true;
            _this.isMultiDistrict = false;
            if (tabChangeEvent.tab) {
                tabChangeEvent.tab.position = tabChangeEvent.tab.origin;
            }
            //this.isPurchaseGetting = true;
            _this.studentIndex = tabChangeEvent.index;
            //console.log(tabChangeEvent.index)
            //console.log(this.studentListService.students[this.studentIndex].studentMealPurchases, this.studentListService.students[this.studentIndex].kaput)
            if (_this.studentListService.students[_this.studentIndex].studentMealPurchases == undefined ||
                _this.studentListService.students[_this.studentIndex].kaput) {
                //Fresh service call
                _this.setPeriod();
                if (_this.activeStudents[_this.studentIndex].isActive) {
                    _this.getStudentMealPurchases(_this.activeStudents[_this.studentIndex]);
                    //console.log('is this happening');
                }
            }
            else {
                _this.isPurchase = _this.studentListService.students[_this.studentIndex].studentMealPurchases.length > 0;
                //console.log("Do we have a list: ", this.studentListService.students[this.studentIndex].studentMealPurchases)
                console.log('isPurchase', _this.isPurchase);
                console.log('ispurchasegetting', _this.isPurchaseGetting);
                //We already have the list just need to change which student from the list we want
                _this.isStudentGetting = false;
                _this.studentMealPurchaseSearchModel.student = _this.activeStudents[_this.studentIndex];
                _this.studentMealPurchaseSearchModel.student.studentMealPurchases = _this.activeStudents[_this.studentIndex].studentMealPurchases;
                _this.isPurchaseGetting = false;
            }
        };
    }
    MealPurchasesComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Session (must be first in the init section )
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.activeStudents = [];
        var i;
        for (i = 0; i < this.studentListService.students.length; i++) {
            if (this.studentListService.students[i].isActive) {
                this.activeStudents.push(this.studentListService.students[i]);
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
            'startDate': new forms_1.FormControl(new Date()),
            'endDate': new forms_1.FormControl(new Date())
        });
        this.setPeriod();
        console.log(this.studentIndex);
        if (this.activeStudents[this.studentIndex].isActive) {
            this.getStudentMealPurchases(this.activeStudents[this.studentIndex]);
        }
        else {
            this.isPurchaseGetting = false;
        }
        var failureMessage = 'No Students to Manage';
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
        this.studentListService.gotStudentList.subscribe(function () {
            if (_this.studentListService.result === true && _this.studentCallCount < 1) {
                console.log("do we have a student List here: ", _this.studentListService.students);
                //  console.log("Is this MultiDistrict: ", this.multiDistrictSvc.multiDistrictFlag)
                //Load student tabs /
                if (_this.isMultiDistrict) {
                    _this.getSelectedDistrctStudents(_this.multiDistrictStudents);
                }
                else {
                    _this.getStudent();
                }
                _this.isStudentGetting = false;
                _this.studentCallCount++;
            }
        });
        this.userContextSvc.gotNewUserContext$.subscribe(function () {
            if (_this.userContextSvc.newTokenResults && _this.userContextSvc.callUserCntxtCnt < 1) {
                _this.loginResponse = _this.loginStoreSvc.cookieStateItem;
                _this.studentListService.subscribeToGetStudentsNew(_this.loginResponse);
                _this.isMultiDistrict = _this.multiDistrictSvc.multiDistrictFlag;
                // console.log("Are we multiDistrict: ", this.isMultiDistrict)
                _this.userContextInterval = setInterval(function () {
                    if (_this.userContextSvc.newTokenResults) {
                        // console.log("this.getStudentMealPurchasesCnt = ", this.userContextSvc.callUserCntxtCnt)
                        // console.log("Are we MultiDistrict: ", this.isMultiDistrict)
                        _this.selectedDistrictStudents(_this.studentListService.students);
                        // console.log("Calling getSelectedDistrctStudents from usercontext subscription: ", this.multiDistrictStudents)
                        _this.getSelectedDistrctStudents(_this.multiDistrictStudents);
                        _this.userContextSvc.callUserCntxtCnt++;
                        _this.isPurchaseGetting = false;
                        _this.userContextSvc.newTokenResults = false;
                        _this.studentCallCount = 0;
                        clearInterval(_this.userContextInterval);
                    }
                }, 500);
            }
        });
        this.studentCallCount = 0;
        //set the default date range to last 7 days /
        this.setPeriod();
        //Load date range selector //
        this.getDateRangeList();
    };
    MealPurchasesComponent.prototype.ngDoCheck = function () {
        //if (this.studentListService.result === false) {
        //  this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        //}
    };
    MealPurchasesComponent.prototype.selectedDistrictStudents = function (studentList) {
        console.log("Do we have the fullList: ", studentList);
        // console.log("do I know the selected District: ", this.loginResponse)
        var selectedDistrict = this.loginResponse.districtName;
        var filteredList = studentList.filter(function (student) { return student.districtName == selectedDistrict; });
        this.multiDistrictStudents = filteredList;
        //  console.log("Did we get a filtered List: ", this.multiDistrictStudents)
    };
    MealPurchasesComponent.prototype.getSelectedDistrctStudents = function (studentList) {
        this.isStudentGetting = true;
        // console.log("About to call getStudentMeal Purchases: ", studentList)
        if (this.activeStudents[0].isActive) {
            this.getStudentMealPurchases(studentList[0]);
        }
    };
    //Get student list //
    MealPurchasesComponent.prototype.getStudent = function () {
        // console.log("Calling GetStudents")
        this.isStudentGetting = true;
        if (this.activeStudents[0].isActive) {
            this.getStudentMealPurchases(this.studentListService.students[0]);
        }
    };
    //Date range list ///
    MealPurchasesComponent.prototype.getDateRangeList = function () {
        var _this = this;
        var subscription = this.dateRangeSelectorService.getDateRangeSelections(this.loginResponse)
            .subscribe(function () {
            if (_this.dateRangeSelectorService.result == true) {
                subscription.unsubscribe();
                if (_this.dateRangeSelectorService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSvc.loadLogin(_this.dateRangeSelectorService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.dateRangeSelectorService.loginResponse);
                }
                else {
                    //enable the state selector.
                    _this.activityPeriodForm.controls['activityPeriodSelector'].enable();
                }
            }
            else {
                ++_this.dateRangeSelectorService.count;
            }
        });
    };
    //Get student purchases /
    MealPurchasesComponent.prototype.getStudentMealPurchases = function (student) {
        var _this = this;
        //console.log("Calling getStudentMealPurchases: ", student)
        this.isPurchaseGetting = true;
        //Search model values ///
        this.studentMealPurchaseSearchModel.student = student;
        //console.log("Subscrining ToGetStudentMealPurchases: ", this.studentMealPurchaseSearchModel)
        if (student.isActive) {
            this.studentMealPurchasesService.subscribeToGetStudentMealPurchases(this.studentMealPurchaseSearchModel, this.loginResponse);
            //window.setTimeout
        }
        this.getStudentPurchasesInterval = setInterval(function () {
            if (_this.studentMealPurchasesService.result == true) {
                if (_this.studentMealPurchasesService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getPurchaseErr = true;
                    _this.getPurchaseErrMsg = _this.studentMealPurchasesService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.studentMealPurchasesService.loginResponse);
                    _this.isPurchase = false;
                }
                else {
                    //Copy this over to the object used for the student list  
                    _this.activeStudents[_this.studentIndex].studentMealPurchases = _this.studentMealPurchaseSearchModel.student.studentMealPurchases;
                    _this.activeStudents[_this.studentIndex].total = _this.studentMealPurchaseSearchModel.student.total;
                    _this.activeStudents[_this.studentIndex].kaput = false;
                    _this.loginStoreSvc.loadLogin(_this.studentMealPurchasesService.loginResponse);
                    //this.studentMealPurchaseSearchModel belongs to this object and the studentMealPurchases for the
                    //selected student has been updated
                    _this.isPurchase = (_this.studentMealPurchaseSearchModel.student.studentMealPurchases != null &&
                        _this.studentMealPurchaseSearchModel.student.studentMealPurchases.length > 0) ? true : false;
                    _this.isPurchaseGetting = false;
                }
                //if (this.studentMealPurchaseSearchModel.student.studentMealPurchases) {
                //  if (this.studentMealPurchaseSearchModel.student.studentMealPurchases.length > 0) {
                //    //this.studentMealPurchaseSearchModel belongs to this object and the studentMealPurchases for the
                //    //selected student has been updated
                //    this.isPurchase = true;
                //    this.studentMealPurchasesService.result = false;
                //  }
                //} else {
                _this.studentPurchasesListInterval = setInterval(function () {
                    if (_this.studentMealPurchaseSearchModel.student.studentMealPurchases) {
                        _this.isPurchase = true;
                        _this.isStudentGetting = false;
                        _this.isStudent = true;
                        _this.studentMealPurchasesService.result = false;
                        clearInterval(_this.studentPurchasesListInterval);
                    }
                }, 500);
                //}
                clearInterval(_this.getStudentPurchasesInterval);
                //console.log("Did we get Purchases: ", this.studentMealPurchaseSearchModel.student.studentMealPurchases)
            }
            else {
                ++_this.studentMealPurchasesService.count;
            }
        }, 500);
        console.log('isPurchase', this.isPurchase);
        console.log('ispurchasegetting', this.isPurchaseGetting);
    };
    //Process the date selector into start and end date /
    //Based on last n days //
    MealPurchasesComponent.prototype.setPeriod = function () {
        var startDate = new Date();
        var today = new Date();
        startDate.setDate(today.getDate() - this.activityPeriodSelection);
        this.studentMealPurchaseSearchModel.endDate = today.toISOString();
        this.studentMealPurchaseSearchModel.startDate = startDate.toISOString();
        //console.log('startdate', this.studentMealPurchaseSearchModel.startDate);
        //console.log('endDate', this.studentMealPurchaseSearchModel.endDate);
        return;
    };
    MealPurchasesComponent.prototype.datePickerSet = function () {
        var startDate = new Date();
        var endDate = new Date();
        this.studentMealPurchaseSearchModel.startDate = this.startDate.toString();
        this.studentMealPurchaseSearchModel.endDate = this.endDate.toString();
        return;
    };
    MealPurchasesComponent.prototype.dateSearch = function () {
        this.isPurchaseGetting = true;
        this.datePickerSet();
        if (this.activeStudents[this.studentIndex].isActive) {
            this.getStudentMealPurchases(this.activeStudents[this.studentIndex]);
        }
    };
    //New date range for search /
    MealPurchasesComponent.prototype.newSearch = function () {
        if (this.activityPeriodSelection === 0) {
            this.isCustom = true;
            this.isPurchaseGetting = true;
        }
        else {
            this.isPurchaseGetting = true;
            this.isCustom = false;
            this.markAsKaput();
            this.setPeriod();
            if (this.activeStudents[this.studentIndex].isActive) {
                this.getStudentMealPurchases(this.activeStudents[this.studentIndex]);
            }
        }
    };
    //When there is ne search criteria all student purchase lists are kaput
    MealPurchasesComponent.prototype.markAsKaput = function () {
        this.studentListService.students.forEach(function (item) {
            item.kaput = true;
        });
    };
    MealPurchasesComponent.prototype.ngOnDestroy = function () {
    };
    MealPurchasesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'meal-purchases.component.html',
            styleUrls: ['meal-purchases.component.less']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            index_1.CookieService,
            index_1.UtilityService,
            index_2.StudentListService,
            index_3.StudentMealPurchasesService,
            index_1.DateRangeSelectorService,
            multi_district_service_1.MultiDistrictService,
            user_context_service_1.UserContextService,
            index_1.LoginStoreService])
    ], MealPurchasesComponent);
    return MealPurchasesComponent;
}());
exports.MealPurchasesComponent = MealPurchasesComponent;
//# sourceMappingURL=meal-purchases.component.js.map