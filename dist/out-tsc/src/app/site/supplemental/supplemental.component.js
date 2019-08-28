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
var SupplementalComponent = /** @class */ (function () {
    function SupplementalComponent(validateCookie, messageProcessorService, cookieService, router, loginStoreSvc) {
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.cookieService = cookieService;
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
    }
    SupplementalComponent.prototype.ngOnInit = function () {
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //this.validateCookie.validateCookie();
        //this.getAuthStatus(this.loginResponse);
        //Checks whether to show the sign in card inline
        this.sidenavState = (window.innerWidth < 599) ? false : true;
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
    SupplementalComponent.prototype.nav = function () {
        this.router.navigate(['/welcome']);
    };
    SupplementalComponent.prototype.onResize = function (event) {
        this.sidenavState = (window.innerWidth < 599) ? false : true;
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SupplementalComponent.prototype, "onResize", null);
    SupplementalComponent = __decorate([
        core_1.Component({
            selector: 'supplemental-home',
            templateUrl: './supplemental.component.html',
            styleUrls: ['./supplemental.component.less']
        }),
        __metadata("design:paramtypes", [index_1.ValidateCookieService,
            index_1.MessageProcessorService,
            index_1.CookieService,
            router_1.Router,
            index_1.LoginStoreService])
    ], SupplementalComponent);
    return SupplementalComponent;
}());
exports.SupplementalComponent = SupplementalComponent;
//# sourceMappingURL=supplemental.component.js.map