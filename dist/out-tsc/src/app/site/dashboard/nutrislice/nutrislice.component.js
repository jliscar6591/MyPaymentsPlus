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
var nutrislice_items_dialog_component_1 = require("./nutrislice-items-dialog/nutrislice-items-dialog.component");
var NutrisliceComponent = /** @class */ (function () {
    function NutrisliceComponent(dialog) {
        this.dialog = dialog;
    }
    NutrisliceComponent.prototype.ngOnInit = function () {
        this.mobile = (window.innerWidth < 960) ? true : false;
    };
    NutrisliceComponent.prototype.openNutrisliceMealItems = function () {
        var _this = this;
        var dialogRef = this.dialog.open(nutrislice_items_dialog_component_1.NutrisliceItemsDialogComponent, {
            width: '750px',
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.dialogResult = result;
        });
    };
    NutrisliceComponent = __decorate([
        core_1.Component({
            selector: 'app-nutrislice',
            templateUrl: './nutrislice.component.html',
            styleUrls: ['./nutrislice.component.less']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], NutrisliceComponent);
    return NutrisliceComponent;
}());
exports.NutrisliceComponent = NutrisliceComponent;
//# sourceMappingURL=nutrislice.component.js.map