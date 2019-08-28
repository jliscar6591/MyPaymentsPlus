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
var fees_service_1 = require("../../services/fees.service");
var index_1 = require("../../../shared/services/index");
var FeesListComponent = /** @class */ (function () {
    function FeesListComponent(feesService, 
    // private cookieService: CookieService,
    // private validateCookie: ValidateCookieService,
    loginStoreSvc) {
        this.feesService = feesService;
        this.loginStoreSvc = loginStoreSvc;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    FeesListComponent.prototype.ngOnInit = function () {
        //this.feesService.subscribeToGetFees(this.loginResponse);
    };
    FeesListComponent.prototype.ngDoCheck = function () {
        if (this.feesService.result === true) {
            this.feesList = this.feesService.feesList;
        }
    };
    FeesListComponent.prototype.ngAfterContentInit = function () {
    };
    FeesListComponent = __decorate([
        core_1.Component({
            selector: 'fees-list',
            templateUrl: './fees-list.component.html',
            styleUrls: ['./fees-list.component.less']
        }),
        __metadata("design:paramtypes", [fees_service_1.FeesService,
            index_1.LoginStoreService])
    ], FeesListComponent);
    return FeesListComponent;
}());
exports.FeesListComponent = FeesListComponent;
//# sourceMappingURL=fees-list.component.js.map