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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var material_3 = require("@angular/material");
var index_1 = require("../../../../shared/services/index");
var NutrisliceItemsDialogComponent = /** @class */ (function () {
    function NutrisliceItemsDialogComponent(dialogRef, data, dialog, messageProcessorService, loginSrvcStore) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.dialog = dialog;
        this.messageProcessorService = messageProcessorService;
        this.loginSrvcStore = loginSrvcStore;
        this.loginResponse = this.loginSrvcStore.cookieStateItem;
        dialogRef.disableClose = true;
    }
    NutrisliceItemsDialogComponent.prototype.ngOnInit = function () {
    };
    NutrisliceItemsDialogComponent.prototype.onCloseConfirm = function () {
        this.dialogRef.close('Confirm');
    };
    NutrisliceItemsDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close(function (_result) { return 'result'; });
    };
    NutrisliceItemsDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-nutrislice-items-dialog',
            templateUrl: './nutrislice-items-dialog.component.html',
            styleUrls: ['./nutrislice-items-dialog.component.less']
        }),
        __param(1, core_1.Inject(material_3.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_2.MatDialogRef, Object, material_1.MatDialog,
            index_1.MessageProcessorService,
            index_1.LoginStoreService])
    ], NutrisliceItemsDialogComponent);
    return NutrisliceItemsDialogComponent;
}());
exports.NutrisliceItemsDialogComponent = NutrisliceItemsDialogComponent;
//# sourceMappingURL=nutrislice-items-dialog.component.js.map