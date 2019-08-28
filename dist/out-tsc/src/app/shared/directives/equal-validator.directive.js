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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
//Cool approach that uses an inline approach to define the parameters
//for the comparison elements definition. 
//We have implemented the form model pattern that applies validation
//within the typescript file along with the form definition
//and the rest of the validation. 
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var EqualValidatorDirective = /** @class */ (function () {
    function EqualValidatorDirective(validateEqual) {
        this.validateEqual = validateEqual;
    }
    EqualValidatorDirective_1 = EqualValidatorDirective;
    EqualValidatorDirective.prototype.validate = function (c) {
        // self value
        var v = c.value;
        // control value
        var e = c.root.get(this.validateEqual);
        // value not equal
        if (e && v !== e.value) {
            return {
                validateEqual: false
            };
        }
        return null;
    };
    var EqualValidatorDirective_1;
    EqualValidatorDirective = EqualValidatorDirective_1 = __decorate([
        core_1.Directive({
            selector: '[validateEqual]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return EqualValidatorDirective_1; }), multi: true }
            ]
        }),
        __param(0, core_1.Attribute('validateEqual')),
        __metadata("design:paramtypes", [String])
    ], EqualValidatorDirective);
    return EqualValidatorDirective;
}());
exports.EqualValidatorDirective = EqualValidatorDirective;
//# sourceMappingURL=equal-validator.directive.js.map