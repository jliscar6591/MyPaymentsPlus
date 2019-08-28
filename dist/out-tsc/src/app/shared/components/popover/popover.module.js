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
var popover_component_1 = require("./popover.component");
var popover_password_validator_component_1 = require("./popover-password-validator.component");
var PopoverModule = /** @class */ (function () {
    function PopoverModule() {
    }
    PopoverModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                popover_component_1.PopoverComponent,
                popover_password_validator_component_1.PopoverPasswordValidatorComponent
            ],
            exports: [
                popover_component_1.PopoverComponent,
                popover_password_validator_component_1.PopoverPasswordValidatorComponent
            ]
        })
    ], PopoverModule);
    return PopoverModule;
}());
exports.PopoverModule = PopoverModule;
//# sourceMappingURL=popover.module.js.map