"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_ACTIVITIES = '[ACTIVITIESSTORE] Load Activities';
exports.LOAD_ACTIVITIES_FAIL = '[ACTIVITIESSTORE] Load Activities Fail';
exports.LOAD_ACTIVITIES_SUCCESS = '[ACTIVITIESSTORE] Load Activities Success';
var LoadActivities = /** @class */ (function () {
    function LoadActivities() {
        this.type = exports.LOAD_ACTIVITIES;
    }
    return LoadActivities;
}());
exports.LoadActivities = LoadActivities;
var LoadActivitiesFail = /** @class */ (function () {
    function LoadActivitiesFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_ACTIVITIES_FAIL;
    }
    return LoadActivitiesFail;
}());
exports.LoadActivitiesFail = LoadActivitiesFail;
var LoadActivitiesSuccess = /** @class */ (function () {
    function LoadActivitiesSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_ACTIVITIES_SUCCESS;
    }
    return LoadActivitiesSuccess;
}());
exports.LoadActivitiesSuccess = LoadActivitiesSuccess;
//# sourceMappingURL=activityStore.actions.js.map