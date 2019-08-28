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
var page_loading_service_1 = require("./page-loading.service");
var PageLoadingComponent = /** @class */ (function () {
    function PageLoadingComponent(pageLoadingService) {
        this.pageLoadingService = pageLoadingService;
        this.showLoading = false;
    }
    PageLoadingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pageLoadingService.showLoading.subscribe(function (value) {
            _this.showLoading = value.show;
            if (value.show) {
                _this.message = value.message;
            }
        });
    };
    PageLoadingComponent = __decorate([
        core_1.Component({
            selector: 'page-loading',
            templateUrl: './page-loading.component.html',
            styleUrls: ['./page-loading.component.less']
        }),
        __metadata("design:paramtypes", [page_loading_service_1.PageLoadingService])
    ], PageLoadingComponent);
    return PageLoadingComponent;
}());
exports.PageLoadingComponent = PageLoadingComponent;
//# sourceMappingURL=page-loading.component.js.map