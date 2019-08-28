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
var index_1 = require("../../shared/services/index");
var activities_service_1 = require("../services/activities.service");
var store_1 = require("@ngrx/store");
var ActivitiesFilterComponent = /** @class */ (function () {
    function ActivitiesFilterComponent(store, activitiesService, validateCookie, loginStoreSvc, formBuilder) {
        this.store = store;
        this.activitiesService = activitiesService;
        this.validateCookie = validateCookie;
        this.loginStoreSvc = loginStoreSvc;
        this.formBuilder = formBuilder;
        this.activityCallCount = 0;
        this.activitiesReady = false;
        this.filters = new forms_1.FormGroup({
            student: new forms_1.FormControl()
        });
        this.mobile = false;
        this.createFilterForm();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ActivitiesFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mobile = (window.innerWidth < 960) ? true : false;
        this.activityStore.subscribe(function (c) { return _this.activityState = c; });
        this.activitiesList = this.activityState.data;
        this.activitiesReady = true;
        //console.log('students', this.activitiesList[0].accounts);
        this.activityCallCount = 0;
    };
    ActivitiesFilterComponent.prototype.ngDoCheck = function () {
        if (this.activitiesService.result == true && this.activityCallCount == 0) {
            this.activitiesService.result = false;
            this.activityCallCount = 1;
        }
    };
    ActivitiesFilterComponent.prototype.createFilterForm = function () {
        this.filters = this.formBuilder.group({
            student: ''
        });
    };
    ActivitiesFilterComponent.prototype.studentSelection = function () {
        //console.log('studentsSelected', this.filters.value.student.value);
        this.studentsSelected.push(this.filters.value.student.value);
        //console.log('students selected', this.studentsSelected);
    };
    ActivitiesFilterComponent.prototype.removeStudent = function () {
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ActivitiesFilterComponent.prototype, "selected", void 0);
    ActivitiesFilterComponent = __decorate([
        core_1.Component({
            selector: 'app-activities-filter',
            templateUrl: './activities-filter.component.html',
            styleUrls: ['./activities-filter.component.less']
        }),
        __metadata("design:paramtypes", [store_1.Store,
            activities_service_1.ActivitiesService,
            index_1.ValidateCookieService,
            index_1.LoginStoreService,
            forms_1.FormBuilder])
    ], ActivitiesFilterComponent);
    return ActivitiesFilterComponent;
}());
exports.ActivitiesFilterComponent = ActivitiesFilterComponent;
//# sourceMappingURL=activities-filter.component.js.map