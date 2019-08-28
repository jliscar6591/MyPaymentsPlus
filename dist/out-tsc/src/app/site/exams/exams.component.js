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
var router_1 = require("@angular/router");
var index_1 = require("../../shared/services/index");
var material_1 = require("@angular/material");
var ExamsComponent = /** @class */ (function () {
    function ExamsComponent(router, loginStoreSvc, snackBar) {
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
        this.snackBar = snackBar;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ExamsComponent.prototype.ngOnInit = function () {
        this.isMobile = (window.innerWidth < 960) ? true : false;
    };
    ExamsComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    ExamsComponent.prototype.nextStep = function () {
        this.step++;
    };
    ExamsComponent.prototype.prevStep = function () {
        this.step--;
    };
    ExamsComponent = __decorate([
        core_1.Component({
            selector: 'app-exams',
            templateUrl: './exams.component.html',
            styleUrls: ['./exams.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.LoginStoreService,
            material_1.MatSnackBar])
    ], ExamsComponent);
    return ExamsComponent;
}());
exports.ExamsComponent = ExamsComponent;
//# sourceMappingURL=exams.component.js.map