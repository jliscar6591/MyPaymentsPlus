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
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var FroStartComponent = /** @class */ (function () {
    function FroStartComponent(router, addCartItemService, validateCookie, cookieService, utilityService, loginStoreSvc) {
        this.router = router;
        this.addCartItemService = addCartItemService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.loginStoreSvc = loginStoreSvc;
        this.startNewFroApp = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ;
    //this.validateCookie.validateCookie();
    FroStartComponent.prototype.startNew = function () {
        this.startNewFroApp.emit({
            "action": "Navigate to fro to create new app"
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FroStartComponent.prototype, "model", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FroStartComponent.prototype, "startNewFroApp", void 0);
    FroStartComponent = __decorate([
        core_1.Component({
            selector: 'fro-start-selector',
            templateUrl: 'fro-start.component.html',
            styleUrls: ['fro-launch.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.AddCartItemService,
            index_2.ValidateCookieService,
            index_2.CookieService,
            index_2.UtilityService,
            index_2.LoginStoreService])
    ], FroStartComponent);
    return FroStartComponent;
}());
exports.FroStartComponent = FroStartComponent;
//# sourceMappingURL=fro-start.component.js.map