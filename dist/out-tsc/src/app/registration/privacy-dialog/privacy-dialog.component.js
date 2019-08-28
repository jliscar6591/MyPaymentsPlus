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
var PrivacyDialogComponent = /** @class */ (function () {
    function PrivacyDialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    PrivacyDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    PrivacyDialogComponent.prototype.ngOnInit = function () {
    };
    PrivacyDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-privacy-dialog',
            templateUrl: './privacy-dialog.component.html',
            styleUrls: ['./privacy-dialog.component.less']
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef])
    ], PrivacyDialogComponent);
    return PrivacyDialogComponent;
}());
exports.PrivacyDialogComponent = PrivacyDialogComponent;
//# sourceMappingURL=privacy-dialog.component.js.map