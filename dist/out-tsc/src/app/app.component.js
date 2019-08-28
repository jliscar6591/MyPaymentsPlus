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
exports.browserRefresh = false;
var login_store_service_1 = require("../app/shared/services/login-store.service");
var AppComponent = /** @class */ (function () {
    function AppComponent(router, loginStoreSvc) {
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
        this.title = 'app';
    }
    AppComponent.prototype.ngOnInit = function () {
        //console.log("Calling app component")
        //this.subscription = this.router.events.subscribe((event) => {
        //  if (event instanceof NavigationStart) {
        //    browserRefresh = !this.router.navigated;
        //    console.log("What is browserRefresh: ", browserRefresh);
        //  }
        //  if (browserRefresh == true) {
        //    let data = sessionStorage.getItem(Constants.AuthCookieName);
        //    console.log("Did we get a sessionStorageItem: ", data)
        //    if (data) {
        //      this.loginStoreSvc.loadLogin(data);
        //      grantAccess = true;
        //     let link = ['/dashboard'];
        //    this.router.navigate(link);
        //    }
        //   // this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        //    console.log("We are true: ", this.loginStoreSvc.cookieStateItem)
        // //   grantAccess = true;
        //    // let link = ['/dashboard'];
        //    // this.router.navigate(link);
        //  } else {
        //    //grantAccess = false;
        //   // let link = ['/welcome'];
        //   // this.router.navigate(link);
        //  }
        //});
    };
    AppComponent.prototype.ngDoCheck = function () {
        //window.onbeforeunload = function (e) {
        //  var e = e || window.event;
        //  // For IE and Firefox
        //  if (e) {
        //    e.returnValue = 'Leaving the page';
        //  }
        //  // For Safari
        //  return 'Leaving the page';
        //};
    };
    AppComponent.prototype.ngOnDestroy = function () {
        //console.log("CallingngOnDestroy")
        var destroyTest = this.loginStoreSvc.getLoginResponse();
        // console.log("Destroying the store: ", destroyTest);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: '<router-outlet></router-outlet>',
            styleUrls: ['./app.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            login_store_service_1.LoginStoreService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map