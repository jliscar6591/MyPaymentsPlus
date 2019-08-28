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
var forms_1 = require("@angular/forms");
var MyErrorStateMatcher = /** @class */ (function () {
    function MyErrorStateMatcher() {
    }
    MyErrorStateMatcher.prototype.isErrorState = function (control, form) {
        var isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    };
    return MyErrorStateMatcher;
}());
exports.MyErrorStateMatcher = MyErrorStateMatcher;
var AlertLevelComponent = /** @class */ (function () {
    function AlertLevelComponent() {
        this.changed = new core_1.EventEmitter();
        this.alertLevel = new forms_1.FormControl('', [
            forms_1.Validators.required,
            forms_1.Validators.pattern(/^\d+$/),
        ]);
        this.matcher = new MyErrorStateMatcher();
    }
    AlertLevelComponent.prototype.ngOnInit = function () {
    };
    AlertLevelComponent.prototype.update = function (content) {
        this.changed.emit(content);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], AlertLevelComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], AlertLevelComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], AlertLevelComponent.prototype, "index", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AlertLevelComponent.prototype, "changed", void 0);
    AlertLevelComponent = __decorate([
        core_1.Component({
            selector: 'alert-level-selector',
            templateUrl: 'alert-level.component.html',
            styleUrls: ['alert-level.component.less']
        })
    ], AlertLevelComponent);
    return AlertLevelComponent;
}());
exports.AlertLevelComponent = AlertLevelComponent;
//# sourceMappingURL=alert-level.component.js.map