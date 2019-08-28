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
var index_1 = require("./services/index");
var index_2 = require("../shared/services/index");
var RegistrationSetupComponent = /** @class */ (function () {
    function RegistrationSetupComponent(breadcrumbService, districtLoginDerivedService) {
        this.breadcrumbService = breadcrumbService;
        this.districtLoginDerivedService = districtLoginDerivedService;
    }
    RegistrationSetupComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('RegistrationSetupComponent');
        this.breadcrumbService.breadcrumbUpdated.subscribe(function (isGuest) {
            _this.guest = _this.breadcrumbService.getGuestState();
        });
        this.districtLoginDerivedService.deriveDistrict();
    };
    RegistrationSetupComponent = __decorate([
        core_1.Component({
            selector: 'register-setup',
            templateUrl: './registration-setup.component.html',
            styleUrls: ['./registration-setup.component.css']
        }),
        __metadata("design:paramtypes", [index_1.RegistrationBreadcrumbsService,
            index_2.DistrictLoginDerivedService])
    ], RegistrationSetupComponent);
    return RegistrationSetupComponent;
}());
exports.RegistrationSetupComponent = RegistrationSetupComponent;
//# sourceMappingURL=registration-setup.component.js.map