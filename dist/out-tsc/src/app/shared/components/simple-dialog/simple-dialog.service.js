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
var simple_dialog_component_1 = require("./simple-dialog.component");
var SimpleDialogService = /** @class */ (function () {
    function SimpleDialogService(dialog) {
        this.dialog = dialog;
    }
    SimpleDialogService.prototype.open = function (title, content, primaryActionDescription, error, viewContainerRef) {
        var dialogRef;
        var config = new material_1.MatDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(simple_dialog_component_1.SimpleDialogComponent, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.content = content;
        dialogRef.componentInstance.primaryActionDescription = primaryActionDescription;
        dialogRef.componentInstance.error = error;
        return dialogRef.afterClosed();
    };
    SimpleDialogService.prototype.close = function () {
        var dialogRef;
        dialogRef.close();
    };
    SimpleDialogService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], SimpleDialogService);
    return SimpleDialogService;
}());
exports.SimpleDialogService = SimpleDialogService;
//# sourceMappingURL=simple-dialog.service.js.map