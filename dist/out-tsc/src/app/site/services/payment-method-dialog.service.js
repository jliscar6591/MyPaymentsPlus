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
var payment_method_dialog_component_1 = require("../checkout/review-cart/payment-method-dialog.component");
var PaymentMethodDialogService = /** @class */ (function () {
    function PaymentMethodDialogService(dialog) {
        this.dialog = dialog;
    }
    PaymentMethodDialogService.prototype.open = function (viewContainerRef) {
        var dialogRef;
        var config = new material_1.MatDialogConfig();
        config.panelClass = 'my-class';
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(payment_method_dialog_component_1.PaymentMethodDialogComponent, config);
        return dialogRef.afterClosed();
    };
    PaymentMethodDialogService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], PaymentMethodDialogService);
    return PaymentMethodDialogService;
}());
exports.PaymentMethodDialogService = PaymentMethodDialogService;
//# sourceMappingURL=payment-method-dialog.service.js.map