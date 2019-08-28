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
var material_1 = require("@angular/material");
var activities_dialog_component_1 = require("./activities-dialog.component");
var store_1 = require("@ngrx/store");
var picture_dialog_component_1 = require("./picture-dialog.component");
var ActivitiesDetailsComponent = /** @class */ (function () {
    function ActivitiesDetailsComponent(store, dialog) {
        this.store = store;
        this.dialog = dialog;
        this.mobile = false;
        this.activitiesReady = false;
        this.activityStore = store.select(function (state) { return state.activityStore; });
    }
    ActivitiesDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mobile = (window.innerWidth < 960) ? true : false;
        this.activityStore.subscribe(function (c) { return _this.activityState = c; });
        this.activitiesList = this.activityState.data;
        this.activitiesReady = true;
    };
    ActivitiesDetailsComponent.prototype.formatActivityDetails = function () {
        this.openActivityDialog();
    };
    ActivitiesDetailsComponent.prototype.openActivityDialog = function () {
        var dialogRef = this.dialog.open(activities_dialog_component_1.ActivitiesDialogComponent, {
            width: '750px',
            data: this.model,
        });
    };
    ActivitiesDetailsComponent.prototype.openPictureDialog = function () {
        if (this.mobile) {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '300px',
                height: '300px',
                data: this.model.s3UriFull
            });
        }
        else {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '600px',
                data: this.model.s3UriFull
            });
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActivitiesDetailsComponent.prototype, "model", void 0);
    ActivitiesDetailsComponent = __decorate([
        core_1.Component({
            selector: 'activities-details',
            templateUrl: './activities-details.component.html',
            styleUrls: ['./activities-details.component.less']
        }),
        __metadata("design:paramtypes", [store_1.Store,
            material_1.MatDialog])
    ], ActivitiesDetailsComponent);
    return ActivitiesDetailsComponent;
}());
exports.ActivitiesDetailsComponent = ActivitiesDetailsComponent;
//# sourceMappingURL=activities-details.component.js.map