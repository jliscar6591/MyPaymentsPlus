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
var simple_dialog_component_1 = require("./simple-dialog.component");
var simple_dialog_service_1 = require("./simple-dialog.service");
var SimpleDialogModule = /** @class */ (function () {
    function SimpleDialogModule() {
    }
    SimpleDialogModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                material_1.MatCardModule,
                material_1.MatButtonModule,
                material_1.MatIconModule
            ],
            declarations: [
                simple_dialog_component_1.SimpleDialogComponent
            ],
            providers: [
                simple_dialog_service_1.SimpleDialogService
            ],
            exports: [
                simple_dialog_component_1.SimpleDialogComponent
            ],
            entryComponents: [
                simple_dialog_component_1.SimpleDialogComponent
            ]
        })
    ], SimpleDialogModule);
    return SimpleDialogModule;
}());
exports.SimpleDialogModule = SimpleDialogModule;
//# sourceMappingURL=simple-dialog.module.js.map