"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PopoverPasswordValidatorComponent = /** @class */ (function () {
    function PopoverPasswordValidatorComponent() {
    }
    PopoverPasswordValidatorComponent.prototype.ngOnInit = function () {
        this.showPopover = false;
    };
    PopoverPasswordValidatorComponent.prototype.change = function (event) {
        var value = event.toString();
        this.lengthValid = (value.length > 6) ? true : false;
        this.containsNumber = (/\d/).test(value) ? true : false;
        this.containsLetter = (/[a-z]/i).test(value) ? true : false;
    };
    PopoverPasswordValidatorComponent.prototype.show = function (event) {
        this.showPopover = true;
    };
    PopoverPasswordValidatorComponent.prototype.hide = function (event) {
        this.showPopover = false;
    };
    PopoverPasswordValidatorComponent = __decorate([
        core_1.Component({
            selector: "popover-password-validator",
            templateUrl: './popover-password-validator.component.html',
            styleUrls: ['./popover-password-validator.component.css']
        })
    ], PopoverPasswordValidatorComponent);
    return PopoverPasswordValidatorComponent;
}());
exports.PopoverPasswordValidatorComponent = PopoverPasswordValidatorComponent;
//# sourceMappingURL=popover-password-validator.component.js.map