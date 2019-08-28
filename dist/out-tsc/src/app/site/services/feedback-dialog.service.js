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
var feedback_dialog_component_1 = require("../dashboard/feedback/feedback-dialog.component");
var FeedbackDialogService = /** @class */ (function () {
    function FeedbackDialogService(dialog) {
        this.dialog = dialog;
    }
    FeedbackDialogService.prototype.open = function (returnToClassic, viewContainerRef) {
        var dialogRef;
        var config = new material_1.MatDialogConfig();
        config.viewContainerRef = viewContainerRef;
        config.panelClass = 'center-width-dialog';
        dialogRef = this.dialog.open(feedback_dialog_component_1.FeedbackDialogComponent, config);
        dialogRef.componentInstance.returnToClassic = returnToClassic;
        return dialogRef.afterClosed();
    };
    FeedbackDialogService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], FeedbackDialogService);
    return FeedbackDialogService;
}());
exports.FeedbackDialogService = FeedbackDialogService;
//# sourceMappingURL=feedback-dialog.service.js.map