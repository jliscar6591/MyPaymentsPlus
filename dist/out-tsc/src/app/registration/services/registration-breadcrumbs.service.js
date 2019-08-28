"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RegistrationBreadcrumbsService = /** @class */ (function () {
    function RegistrationBreadcrumbsService() {
        this.isGuest = false;
        this.relationshipActive = false;
        this.breadcrumbUpdated = new core_1.EventEmitter();
    }
    RegistrationBreadcrumbsService.prototype.setGuestState = function (state) {
        this.isGuest = state;
        this.breadcrumbUpdated.emit(this.isGuest);
    };
    RegistrationBreadcrumbsService.prototype.getGuestState = function () {
        return this.isGuest;
    };
    RegistrationBreadcrumbsService.prototype.setRelationshipState = function (state) {
        this.relationshipActive = state;
        this.breadcrumbUpdated.emit(this.relationshipActive);
    };
    RegistrationBreadcrumbsService.prototype.getRelationshipState = function () {
        return this.relationshipActive;
    };
    RegistrationBreadcrumbsService = __decorate([
        core_1.Injectable()
    ], RegistrationBreadcrumbsService);
    return RegistrationBreadcrumbsService;
}());
exports.RegistrationBreadcrumbsService = RegistrationBreadcrumbsService;
//# sourceMappingURL=registration-breadcrumbs.service.js.map