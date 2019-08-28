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
var icon_1 = require("@angular/material/icon");
var material_1 = require("@angular/material");
//Local
var receipt_component_1 = require("../../../shared/components/receipt/receipt.component");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var page_loading_module_1 = require("../../../shared/components/page-loading/page-loading.module");
var ReceiptModule = /** @class */ (function () {
    function ReceiptModule() {
    }
    ReceiptModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                icon_1.MatIconModule,
                page_loading_module_1.PageLoadingModule,
                material_1.MatCardModule
            ],
            declarations: [
                receipt_component_1.ReceiptComponent
            ],
            exports: [
                receipt_component_1.ReceiptComponent
            ],
            providers: [
                receipt_service_1.ReceiptService
            ],
            entryComponents: [
                receipt_component_1.ReceiptComponent
            ]
        })
    ], ReceiptModule);
    return ReceiptModule;
}());
exports.ReceiptModule = ReceiptModule;
//# sourceMappingURL=receipt.module.js.map