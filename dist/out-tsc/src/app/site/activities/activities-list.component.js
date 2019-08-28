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
var activities_dialog_component_1 = require("./activities-dialog.component");
var add_cart_item_service_1 = require("../services/add-cart-item.service");
var index_1 = require("../../shared/services/index");
var material_1 = require("@angular/material");
var activities_service_1 = require("../services/activities.service");
var store_1 = require("@ngrx/store");
var ActivitiesListComponent = /** @class */ (function () {
    function ActivitiesListComponent(activitiesService, validateCookie, store, dialog, addCartItemService, loginStoreSvc, formBuilder) {
        this.activitiesService = activitiesService;
        this.validateCookie = validateCookie;
        this.store = store;
        this.dialog = dialog;
        this.addCartItemService = addCartItemService;
        this.loginStoreSvc = loginStoreSvc;
        this.formBuilder = formBuilder;
        this.search = new forms_1.FormGroup({
            searchValue: new forms_1.FormControl()
        });
        this.filters = new forms_1.FormGroup({
            student: new forms_1.FormControl()
        });
        this.sort = new forms_1.FormGroup({
            sortOptions: new forms_1.FormControl()
        });
        this.mobile = false;
        this.activityCallCount = 0;
        this.activitiesReady = false;
        this.searchList = [];
        this.searchResults = [];
        this.categoryList = [];
        this.categorySearchList = [];
        this.studentList = [];
        this.uniqueStudents = [];
        this.searchComplete = false;
        this.noSearchResults = false;
        this.studentsSelected = [];
        this.activitiesInCart = [];
        this.p = 1;
        this.startDates = [];
        this.endDates = [];
        this.uniqueCategories = [];
        this.uniqueSearchResults = [];
        this.searchCategories = [];
        this.uniqueSearchCategories = [];
        this.activityStore = store.select(function (state) { return state.activityStore; });
        this.createSearchForm();
        this.createFilterForm();
        this.createSearchForm();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ActivitiesListComponent.prototype.ngOnInit = function () {
        this.mobile = (window.innerWidth < 600) ? true : false;
        //this.activityStore.subscribe(c => this.activityState = c);
        this.activitiesList = this.activitiesService.activitiesList;
        //console.log('activities list', this.activitiesList);
        this.getSearchActivities();
    };
    ActivitiesListComponent.prototype.ngDoCheck = function () {
        if (this.addCartItemService.cartResponse) {
            this.getSearchActivities();
        }
    };
    ActivitiesListComponent.prototype.createSearchForm = function () {
        this.search = this.formBuilder.group({
            searchValue: '',
        });
    };
    ActivitiesListComponent.prototype.createFilterForm = function () {
        this.filters = this.formBuilder.group({
            student: '',
            category: ''
        });
    };
    ActivitiesListComponent.prototype.createSortForm = function () {
        this.sort = this.formBuilder.group({
            sortOptions: ''
        });
    };
    ActivitiesListComponent.prototype.getSearchActivities = function () {
        this.activitiesInCart = [];
        var i;
        for (i = 0; i < this.activitiesList.length; i++) {
            if (this.activitiesList[i].accounts.length !== 0) {
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
    };
    ActivitiesListComponent.prototype.getUniqueSearchCategories = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    ActivitiesListComponent.prototype.getUniqueStudents = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    ActivitiesListComponent.prototype.getUniqueCategories = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    ActivitiesListComponent.prototype.getUniqueSearchResults = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    //searches activities for keyword, students selected & sort option
    ActivitiesListComponent.prototype.searchActivities = function () {
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
                }
                else if (this.filters.value.student.length === 0 && this.filters.value.category.length > 0) {
                    this.studentList.push(this.searchList[i].studentName);
                    this.categorySearchList.push(this.searchList[i].category);
                    if (this.filters.value.category.includes(this.searchList[i].category)) {
                        //console.log('2');
                        this.searchResults.push(this.searchList[i]);
                        this.categorySearchList.push(this.searchList[i].category);
                    }
                }
                else if (this.filters.value.category.length === 0 && this.filters.value.student.length > 0) {
                    this.studentList.push(this.searchList[i].studentName);
                    if (this.filters.value.student.includes(this.searchList[i].studentName)) {
                        //console.log('3');
                        this.searchResults.push(this.searchList[i]);
                        this.categorySearchList.push(this.searchList[i].category);
                    }
                }
                else {
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
                    this.uniqueSearchResults.sort(function (activityA, activityB) {
                        if (new Date(activityA.startDate).valueOf() < new Date(activityB.startDate).valueOf())
                            return -1;
                        if (new Date(activityA.startDate).valueOf() > new Date(activityB.startDate).valueOf())
                            return 1;
                        return 0;
                    });
                }
            }
            else if (this.sort.value.sortOptions === 3) {
                var i;
                for (i = 0; i < this.uniqueSearchResults.length; i++) {
                    this.endDates.push(new Date(this.uniqueSearchResults[i].endDate).valueOf());
                    this.uniqueSearchResults.sort(function (activityA, activityB) {
                        if (new Date(activityA.signupEndDate).valueOf() < new Date(activityB.signupEndDate).valueOf())
                            return -1;
                        if (new Date(activityA.signupEndDate).valueOf() > new Date(activityB.signupEndDate).valueOf())
                            return 1;
                        return 0;
                    });
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
    };
    //called by student selection change and runs through search activities() again with an array of selected students
    ActivitiesListComponent.prototype.filterStudents = function () {
        this.searchActivities();
    };
    //called by category selection change and runs through search activities() again with array of selected categories 
    ActivitiesListComponent.prototype.filterCategories = function () {
        this.searchActivities();
    };
    //called by the sort option selection and runs back through search activities() with a sort type value
    ActivitiesListComponent.prototype.sortBy = function () {
        this.searchActivities();
    };
    //clears search and takes you back to category view
    ActivitiesListComponent.prototype.clearSearch = function () {
        this.search.reset();
        this.searchComplete = false;
        this.getSearchActivities();
    };
    ActivitiesListComponent.prototype.openActivityDialog = function (activityInCart) {
        var dialogRef = this.dialog.open(activities_dialog_component_1.ActivitiesDialogComponent, {
            width: '750px',
            data: activityInCart,
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ActivitiesListComponent.prototype, "selected", void 0);
    ActivitiesListComponent = __decorate([
        core_1.Component({
            selector: 'app-activities-list',
            templateUrl: './activities-list.component.html',
            styleUrls: ['./activities-list.component.less']
        }),
        __metadata("design:paramtypes", [activities_service_1.ActivitiesService,
            index_1.ValidateCookieService,
            store_1.Store,
            material_1.MatDialog,
            add_cart_item_service_1.AddCartItemService,
            index_1.LoginStoreService,
            forms_1.FormBuilder])
    ], ActivitiesListComponent);
    return ActivitiesListComponent;
}());
exports.ActivitiesListComponent = ActivitiesListComponent;
//# sourceMappingURL=activities-list.component.js.map