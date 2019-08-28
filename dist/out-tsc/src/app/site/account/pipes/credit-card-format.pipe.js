"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CreditCardFormatPipe = /** @class */ (function () {
    function CreditCardFormatPipe() {
    }
    CreditCardFormatPipe.prototype.transform = function (val, args) {
        var newStr = '';
        for (var i = 0; i < (Math.floor(val.length / 4) - 1); i++) {
            newStr = newStr + val.substr(i * 4, 4) + '-';
        }
        return newStr + val.substr(i * 4);
    };
    CreditCardFormatPipe = __decorate([
        core_1.Pipe({ name: 'creditCardFormat' })
    ], CreditCardFormatPipe);
    return CreditCardFormatPipe;
}());
exports.CreditCardFormatPipe = CreditCardFormatPipe;
//# sourceMappingURL=credit-card-format.pipe.js.map