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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var index_1 = require("../../site/account/services/index");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var login_store_service_1 = require("../../shared/services/login-store.service");
var ngx_device_detector_1 = require("ngx-device-detector");
var ngx_clipboard_1 = require("ngx-clipboard");
var core_2 = require("@capacitor/core");
//local
var index_2 = require("../../shared/services/index");
var index_3 = require("../model/index");
var app_settings_1 = require("../../app.settings");
var page_loading_service_1 = require("../../shared/components/page-loading/page-loading.service");
var multi_district_service_1 = require("../../site/services/multi-district.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, 
    //private toasterService: ToasterService,
    formBuilder, authenticationService, cookieService, messageProcessorService, userContextService, utilityService, activatedRoute, pageLoadingService, multiDistrictSvc, loginStoreService, deviceService, _clipboardService) {
        var _this = this;
        this.router = router;
        this.formBuilder = formBuilder;
        this.authenticationService = authenticationService;
        this.cookieService = cookieService;
        this.messageProcessorService = messageProcessorService;
        this.userContextService = userContextService;
        this.utilityService = utilityService;
        this.activatedRoute = activatedRoute;
        this.pageLoadingService = pageLoadingService;
        this.multiDistrictSvc = multiDistrictSvc;
        this.loginStoreService = loginStoreService;
        this.deviceService = deviceService;
        this._clipboardService = _clipboardService;
        this.title = 'My Payments Plus Login';
        this.loginDetail = { username: '', password: '' };
        this.isLoading = false;
        this.showLogin = false;
        this.enableerrormsg = false;
        this.inlineLoginFailMessage = '';
        this.isGetDefaultsErr = false;
        this.isGetDefaultsMsg = '';
        //= new LoginResponseModel();
        this.loginCounter = 0;
        this.deviceInfo = null;
        this.isIE = false;
        this.formErrors = {
            'username': '',
            'password': ''
        };
        this.validationMessages = {
            'username': {
                'required': 'Email Address is required.'
            },
            'password': {
                'required': 'Password is required.'
            }
        };
        //this.toasterService = toasterService;
        //Validation using form builder
        this.loginForm = this.formBuilder.group({
            'username': ['', [forms_1.Validators.required, forms_1.Validators.maxLength(100)]],
            'password': ['', forms_1.Validators.required]
        });
        this.loginForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
        this.loginResponse = new index_3.LoginResponseModel();
    }
    LoginComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, Storage, _a, ret, login;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Device = core_2.Plugins.Device, Storage = core_2.Plugins.Storage;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        if (!(this.deviceInfo.platform !== 'web')) return [3 /*break*/, 3];
                        return [4 /*yield*/, Storage.get({ key: 'login' })];
                    case 2:
                        ret = _b.sent();
                        login = JSON.parse(ret.value);
                        if (login) {
                            this.loginDetail.username = login.username;
                            this.loginDetail.password = login.password;
                        }
                        _b.label = 3;
                    case 3:
                        //console.log('What is the device: ', this.deviceInfo)
                        this.loginStoreService.deviceModel = this.deviceInfo.model;
                        this.loginStoreService.devicePlatform = this.deviceInfo.platform;
                        this.loginStoreService.deviceManufact = this.deviceInfo.manufacturer;
                        this.activatedRoute.queryParams.subscribe(function (params) {
                            //console.log('login.component ngOnInit: ', params);
                            //console.log(params)
                            //console.log(params['districtId'])
                            var nav = params['nav'];
                            if (nav == app_settings_1.Constants.externalNavRequest.login) {
                                _this.loginResponse.externalNavRequest = nav;
                                _this.loginStoreService.loadLogin(_this.loginResponse);
                            }
                            var jwt = params['id'];
                            if (jwt) {
                                _this.authenticationService.loginResponse.access_token = jwt;
                                if (!_this.userContextService.result) {
                                    _this.getDefaultsNew(_this.authenticationService.loginResponse);
                                }
                            }
                            else {
                                _this.showLogin = true;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.onValueChanged = function (data) {
        if (!this.loginForm) {
            return;
        }
        var form = this.loginForm;
        for (var field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                    this.enableerrormsg = false;
                    this.inlineLoginFailMessage = '';
                }
            }
        }
    };
    LoginComponent.prototype.checkforErrors = function () {
        if (!this.loginForm) {
            return;
        }
        var form = this.loginForm;
        for (var field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.inlineLoginFailMessage = '';
        this.checkforErrors();
        if (this.loginForm.valid) {
            if (this.deviceInfo.platform !== 'web') {
                this.setObject(this.loginDetail);
            }
            this.isLoading = true;
            this.enableerrormsg = false;
            this.authenticationService.subscribeToAuthenticate(this.loginDetail, this.loginResponse);
            var subscription_1 = window.setInterval(function () {
                if (_this.authenticationService.result == true) {
                    if (_this.authenticationService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.isLoading = false;
                        //Override Toast messaging
                        _this.enableerrormsg = true;
                        _this.inlineLoginFailMessage = _this.authenticationService.loginResponse.message;
                        _this.authenticationService.loginResponse.message = '';
                        _this.loginStoreService.loadLogin(_this.authenticationService.loginResponse);
                    }
                    else {
                        //Get the defaults
                        _this.getDefaultsNew(_this.authenticationService.loginResponse);
                    }
                    window.clearInterval(subscription_1);
                }
                else {
                    ++_this.authenticationService.count;
                }
                ;
            }, 2000);
        }
        else {
            //show the error of my ways
            for (var control in this.loginForm.controls) {
                this.loginForm.controls[control].markAsDirty();
                this.onValueChanged();
            }
        }
    };
    LoginComponent.prototype.setObject = function (loginDetail) {
        return __awaiter(this, void 0, void 0, function () {
            var Storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Storage = core_2.Plugins.Storage;
                        return [4 /*yield*/, Storage.set({
                                key: 'login',
                                value: JSON.stringify({
                                    username: loginDetail.username,
                                    password: loginDetail.password
                                })
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.getDefaults = function (loginResponse) {
        var _this = this;
        var status = false;
        var subscription = this.userContextService.deriveDefaults(loginResponse)
            .subscribe(function () {
            if (_this.userContextService.result == true) {
                subscription.unsubscribe();
                if (_this.authenticationService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.isGetDefaultsMsg = _this.authenticationService.loginResponse.message;
                    _this.isGetDefaultsErr = true;
                    _this.isLoading = false;
                    _this.utilityService.clearErrorMessage(_this.authenticationService.loginResponse);
                }
                else {
                    //Navigate to the old asp horizon site
                    _this.loginStoreService.loadLogin(_this.authenticationService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.authenticationService.loginResponse);
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.isLoading = false;
                            if (_this.authenticationService.loginResponse.requiresRelationship === true) {
                                var link = ['/setup/relationship'];
                                _this.router.navigate(link);
                            }
                            else {
                                if (_this.authenticationService.loginResponse.isNewExperience || _this.deviceInfo.platform !== 'web') {
                                    if (_this.authenticationService.loginResponse.externalNavRequest == app_settings_1.Constants.externalNavRequest.login) {
                                        var link = ['account/fro-launch'];
                                        _this.router.navigate(link);
                                    }
                                    else {
                                        var link = ['dashboard'];
                                        _this.router.navigate(link);
                                    }
                                }
                                else if (!_this.authenticationService.loginResponse.isNewExperience && _this.deviceInfo.platform === 'web') {
                                    var cleanToken = _this.authenticationService.loginResponse.access_token.trim();
                                    window.location.href = app_settings_1.Constants.ParentPaymentsUrl + '?id=' + cleanToken;
                                }
                            }
                        }
                    });
                }
            }
            else {
                ++_this.userContextService.count;
            }
        });
        return status;
    };
    LoginComponent.prototype.getDefaultsNew = function (loginResponse) {
        var _this = this;
        var status = false;
        var tempLogo = new index_3.LoginResponseModel();
        tempLogo.access_token = loginResponse.access_token;
        tempLogo.cartItemCount = loginResponse.cartItemCount;
        tempLogo.districtKey = loginResponse.districtKey;
        tempLogo.districtName = loginResponse.districtName;
        tempLogo.isNewExperience = loginResponse.isNewExperience;
        tempLogo.isOldExperienceAllowed = false;
        this.userContextService.subscribeToGetDeriveDefaultsNew(loginResponse);
        var subscription = window.setInterval(function () {
            if (_this.userContextService.result) {
                window.clearInterval(subscription);
                if (_this.authenticationService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.isGetDefaultsMsg = _this.authenticationService.loginResponse.message;
                    _this.isGetDefaultsErr = true;
                    _this.isLoading = false;
                    _this.utilityService.clearErrorMessage(_this.authenticationService.loginResponse);
                }
                else {
                    //Navigate to the old asp horizon site
                    _this.loginStoreService.loadLogin(_this.authenticationService.loginResponse);
                    _this.loginStoreService.createLoginObj(_this.userContextService.defaultData, _this.loginStoreService.cookieStateItem);
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == app_settings_1.Constants.SpinnerDelay) {
                            _this.isLoading = false;
                            if (_this.authenticationService.loginResponse.requiresRelationship === true) {
                                var link = ['/setup/relationship'];
                                _this.router.navigate(link);
                            }
                            else {
                                if (_this.authenticationService.loginResponse.isNewExperience || _this.deviceInfo.platform !== 'web') {
                                    if (_this.authenticationService.loginResponse.externalNavRequest == app_settings_1.Constants.externalNavRequest.login) {
                                        var link = ['account/fro-launch'];
                                        _this.router.navigate(link);
                                    }
                                    else {
                                        var link = ['dashboard'];
                                        _this.router.navigate(link);
                                    }
                                }
                                else if (!_this.authenticationService.loginResponse.isNewExperience && _this.deviceInfo.platform === 'web') {
                                    window.location.href = app_settings_1.Constants.ParentPaymentsUrl + '?id=' + _this.authenticationService.loginResponse.access_token;
                                }
                            }
                        }
                    });
                }
            }
            else {
                ++_this.userContextService.count;
            }
        }, 2000);
        return status;
    };
    LoginComponent.prototype.copy = function (text) {
        // console.log("calling Copy: ", text)
        this._clipboardService.copyFromContent(text);
    };
    LoginComponent.prototype.copyUrl = function () {
        // console.log("Calling copyUrl");
        var url = window.location.href;
        this.copy(url);
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.less'],
            providers: [index_2.AuthenticationService,
                index_2.CookieService,
                forms_1.FormBuilder
            ]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_2.AuthenticationService,
            index_2.CookieService,
            index_2.MessageProcessorService,
            index_1.UserContextService,
            index_2.UtilityService,
            router_1.ActivatedRoute,
            page_loading_service_1.PageLoadingService,
            multi_district_service_1.MultiDistrictService,
            login_store_service_1.LoginStoreService,
            ngx_device_detector_1.DeviceDetectorService,
            ngx_clipboard_1.ClipboardService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map