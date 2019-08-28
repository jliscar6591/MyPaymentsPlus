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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var index_1 = require("../../shared/services/index");
var index_2 = require("../model/index");
var page_loading_service_1 = require("../../shared/components/page-loading/page-loading.service");
var login_store_service_1 = require("../../shared/services/login-store.service");
var login_component_1 = require("./login.component");
var ngx_device_detector_1 = require("ngx-device-detector");
var core_2 = require("@capacitor/core");
var LoginHomeComponent = /** @class */ (function () {
    //Support toast in this component
    function LoginHomeComponent(router, messageProcessorService, activatedRoute, pageLoadingService, loginComponent, deviceService, loginStoreService) {
        this.router = router;
        this.messageProcessorService = messageProcessorService;
        this.activatedRoute = activatedRoute;
        this.pageLoadingService = pageLoadingService;
        this.loginComponent = loginComponent;
        this.deviceService = deviceService;
        this.loginStoreService = loginStoreService;
        this.title = 'My Payments Plus Login';
        this.isSimulate = false;
        this.isModal = false;
    }
    //No toast support in this component
    //constructor() { }
    LoginHomeComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var SplashScreen, Device, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        SplashScreen = core_2.Plugins.SplashScreen;
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        //  console.log('What is the device from Login-Home: ', this.deviceInfo)
                        this.loginStoreService.deviceModel = this.deviceInfo.model;
                        this.loginStoreService.devicePlatform = this.deviceInfo.platform;
                        this.loginStoreService.deviceManufact = this.deviceInfo.manufacturer;
                        //var google = require('googleapis');
                        //var urlshortener = google.urlshortener('v1');
                        if (this.deviceInfo.platform === 'web') {
                            this.isMobileApp = false;
                        }
                        else {
                            this.isMobileApp = true;
                            SplashScreen.hide();
                        }
                        this.activatedRoute.queryParams.subscribe(function (params) {
                            var jwt = params['id'];
                            if (jwt) {
                                //this.pageLoadingService.show("Loading the flux capacitor");
                                _this.loginComponent.authenticationService.loginResponse = new index_2.LoginResponseModel();
                                _this.loginComponent.authenticationService.loginResponse.access_token = jwt;
                                _this.isSimulate = true;
                                //this.loginComponent.getDefaults(this.loginComponent.authenticationService.loginResponse);
                                _this.loginComponent.getDefaultsNew(_this.loginComponent.authenticationService.loginResponse);
                            }
                            else {
                                //this.showLogin = true;
                            }
                        });
                        //Checks whether to show the sign in card inline
                        this.signInAvailable = (window.innerWidth < 960) ? false : true;
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginHomeComponent.prototype.ngAfterViewChecked = function () {
        //Support toast in this component
        // this.messageProcessorService.messageHandler();
    };
    //Checks on whether or not to show the sign in card inline
    LoginHomeComponent.prototype.onResize = function (event) {
        if (window.innerWidth > 960) {
            this.signInAvailable = (window.innerWidth < 960) ? false : true;
        }
    };
    LoginHomeComponent.prototype.showSignIn = function (status) {
        this.signInAvailable = status;
        if (this.isModal === false) {
            this.isModal = true;
        }
        else {
            this.isModal = false;
        }
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], LoginHomeComponent.prototype, "onResize", null);
    LoginHomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: './login-home.component.html',
            styleUrls: ['./login-home.component.less', './login.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.MessageProcessorService,
            router_1.ActivatedRoute,
            page_loading_service_1.PageLoadingService,
            login_component_1.LoginComponent,
            ngx_device_detector_1.DeviceDetectorService,
            login_store_service_1.LoginStoreService])
    ], LoginHomeComponent);
    return LoginHomeComponent;
}());
exports.LoginHomeComponent = LoginHomeComponent;
//# sourceMappingURL=login-home.component.js.map