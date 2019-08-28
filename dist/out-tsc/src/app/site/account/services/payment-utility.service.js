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
var PaymentUtilityService = /** @class */ (function () {
    function PaymentUtilityService() {
    }
    PaymentUtilityService.prototype.monthNumber = function () {
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    };
    PaymentUtilityService.prototype.yearNumber = function () {
        var currentDate = new Date();
        var year = new Array();
        for (var i = 0; i < 15; i++) {
            year.push((currentDate.getFullYear() + i).toString());
        }
        return year;
    };
    PaymentUtilityService.prototype.currencyList = function () {
        return [10, 20, 30, 40, 50];
    };
    PaymentUtilityService.prototype.autoPayAmountList = function () {
        return [25, 50, 75, 100];
    };
    PaymentUtilityService.prototype.autoPayMinBalList = function () {
        return [10, 20, 30, 40, 50];
    };
    PaymentUtilityService.prototype.paymentList = function () {
        return ['25', '50', '75', '100'];
    };
    PaymentUtilityService.prototype.balanceList = function () {
        return ['20', '30', '40', '50'];
    };
    PaymentUtilityService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], PaymentUtilityService);
    return PaymentUtilityService;
}());
exports.PaymentUtilityService = PaymentUtilityService;
//# sourceMappingURL=payment-utility.service.js.map