"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var material_1 = require("@angular/material");
var suspend_payment_warning_component_1 = require("./suspend-payment-warning.component");
var suspend_payment_warning_service_1 = require("./suspend-payment-warning.service");
var SuspendPaymentWarningModule = /** @class */ (function () {
    function SuspendPaymentWarningModule() {
    }
    SuspendPaymentWarningModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_1.MatCardModule,
                material_1.MatButtonModule,
                material_1.MatIconModule
            ],
            declarations: [
                suspend_payment_warning_component_1.SuspendPaymentWarningComponent
            ],
            providers: [
                suspend_payment_warning_service_1.SuspendPaymentWarningService
            ],
            exports: [
                suspend_payment_warning_component_1.SuspendPaymentWarningComponent
            ],
            entryComponents: [
                suspend_payment_warning_component_1.SuspendPaymentWarningComponent
            ]
        })
    ], SuspendPaymentWarningModule);
    return SuspendPaymentWarningModule;
}());
exports.SuspendPaymentWarningModule = SuspendPaymentWarningModule;
//# sourceMappingURL=suspend-payment-warning.module.js.map