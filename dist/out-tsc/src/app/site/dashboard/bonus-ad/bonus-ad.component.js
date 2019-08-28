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
var bonus_ad_dialog_component_1 = require("./bonus-ad-dialog/bonus-ad-dialog.component");
var BonusAdComponent = /** @class */ (function () {
    function BonusAdComponent(dialog) {
        this.dialog = dialog;
        this.dialogResult = "";
    }
    BonusAdComponent.prototype.ngOnInit = function () {
    };
    BonusAdComponent.prototype.showBonusAdDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(bonus_ad_dialog_component_1.BonusAdDialogComponent, {});
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('Dialog Closed: ${result}');
            _this.dialogResult = result;
        });
    };
    BonusAdComponent = __decorate([
        core_1.Component({
            selector: 'app-bonus-ad',
            templateUrl: './bonus-ad.component.html',
            styleUrls: ['./bonus-ad.component.less']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], BonusAdComponent);
    return BonusAdComponent;
}());
exports.BonusAdComponent = BonusAdComponent;
//# sourceMappingURL=bonus-ad.component.js.map