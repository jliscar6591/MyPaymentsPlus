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
var ShowErrorsComponent = /** @class */ (function () {
    function ShowErrorsComponent() {
    }
    ShowErrorsComponent_1 = ShowErrorsComponent;
    ShowErrorsComponent.prototype.ngOnInit = function () {
    };
    ShowErrorsComponent.prototype.shouldShowErrors = function () {
        return this.control &&
            this.control.errors &&
            (this.control.dirty || this.control.touched);
    };
    ShowErrorsComponent.prototype.listOfErrors = function () {
        var _this = this;
        return Object.keys(this.control.errors)
            .map(function (field) { return _this.getMessage(field, _this.control.errors[field]); });
    };
    ShowErrorsComponent.prototype.getMessage = function (type, params) {
        return ShowErrorsComponent_1.errorMessages[type](params);
    };
    var ShowErrorsComponent_1;
    ShowErrorsComponent.errorMessages = {
        'required': function () { return 'This field is required'; },
        'minlength': function (params) { return 'The min number of characters is ' + params.requiredLength; },
        'maxlength': function (params) { return 'The max allowed number of characters is ' + params.requiredLength; },
        'pattern': function (params) { return 'The required pattern is: ' + params.requiredPattern; },
        'validMoney': function (params) { return params.message; },
        'validTransfer': function (params) { return params.message; }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShowErrorsComponent.prototype, "control", void 0);
    ShowErrorsComponent = ShowErrorsComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-show-errors',
            templateUrl: './show-errors.component.html',
            styleUrls: ['./show-errors.component.less']
        }),
        __metadata("design:paramtypes", [])
    ], ShowErrorsComponent);
    return ShowErrorsComponent;
}());
exports.ShowErrorsComponent = ShowErrorsComponent;
//# sourceMappingURL=show-errors.component.js.map