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
var index_1 = require("../../shared/services/index");
var activities_service_1 = require("../services/activities.service");
var store_1 = require("@ngrx/store");
var ActivitiesComponent = /** @class */ (function () {
    function ActivitiesComponent(activitiesService, store, loginStoreSvc) {
        this.activitiesService = activitiesService;
        this.store = store;
        this.loginStoreSvc = loginStoreSvc;
        this.mobile = false;
        this.activityCallCount = 0;
        this.activitiesReady = false;
        this.activityStore = store.select(function (state) { return state.activityStore; });
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ActivitiesComponent.prototype.ngOnInit = function () {
        this.mobile = (window.innerWidth < 960) ? true : false;
        this.activitiesService.result = false;
        this.activitiesService.subscribeToGetActivities(this.loginResponse);
        this.activityCallCount = 0;
    };
    ActivitiesComponent.prototype.ngDoCheck = function () {
        if (this.activitiesService.result == true && this.activityCallCount == 0) {
            this.activitiesService.result = false;
            //this.activitiesList = this.activitiesService.activitiesList;
            //this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
            //this.activityStore.subscribe(c => this.activityState = c);
            //this.activitiesList = this.activityState.data;
            this.activitiesReady = true;
            this.activityCallCount = 1;
        }
    };
    ActivitiesComponent = __decorate([
        core_1.Component({
            selector: 'app-activities',
            templateUrl: './activities.component.html',
            styleUrls: ['./activities.component.less']
        }),
        __metadata("design:paramtypes", [activities_service_1.ActivitiesService,
            store_1.Store,
            index_1.LoginStoreService])
    ], ActivitiesComponent);
    return ActivitiesComponent;
}());
exports.ActivitiesComponent = ActivitiesComponent;
//# sourceMappingURL=activities.component.js.map