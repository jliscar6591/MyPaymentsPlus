"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SupplementalSupportComponent = /** @class */ (function () {
    function SupplementalSupportComponent() {
    }
    SupplementalSupportComponent.prototype.ngOnInit = function () {
        //check if support is available 
        var currentDate = new Date();
        var currentDay = currentDate.getDay();
        this.supportAvailable = (currentDay > 0 && currentDay < 6) ? true : false;
        if (this.supportAvailable) {
            var currentTime = currentDate.getHours();
            var startSupportHours = new Date();
            startSupportHours.setHours(7, 30, 0); // 7:30 am
            var endSupportHours = new Date();
            endSupportHours.setHours(17, 30, 0); // 5.30 pm
            this.supportAvailable = (currentDate >= startSupportHours && currentDate <= endSupportHours) ? true : false;
        }
    };
    SupplementalSupportComponent = __decorate([
        core_1.Component({
            selector: 'supplemental-support',
            templateUrl: './supplemental-support.component.html',
            styleUrls: ['./supplemental.component.less']
        })
    ], SupplementalSupportComponent);
    return SupplementalSupportComponent;
}());
exports.SupplementalSupportComponent = SupplementalSupportComponent;
//# sourceMappingURL=supplemental-support.component.js.map