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
var core_2 = require("@capacitor/core");
//local
var index_1 = require("../../shared/services/index");
var index_2 = require("../model/index");
var app_settings_1 = require("../../app.settings");
var ChangePasswordComponent = /** @class */ (function () {
    function ChangePasswordComponent(router, toasterService, formBuilder, changePassordChangeService, cookieService, validateCookie, route, messageProccessor, loginStoreService) {
        this.router = router;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.changePassordChangeService = changePassordChangeService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.route = route;
        this.messageProccessor = messageProccessor;
        this.loginStoreService = loginStoreService;
        this.title = 'My Payments Plus Change Password';
        this.changeDetail = { newPassword: '', confirmPassword: '', resetKey: '' };
        this.changePutDetail = { newPassword: '', resetKey: '' };
        this.id = '';
        this.resetSuccesful = false;
        this.resetFailed = false;
        this.formErrors = {
            'newPassword': '',
            'confirmPassword': ''
        };
        this.validationMessages = {
            'newPassword': {
                'required': 'Password is required.',
                'pattern': 'Password must meet complexity requirements.'
            },
            'confirmPassword': {
                'required': 'Confirm Password is required.',
                'nomatch': 'Password and Confirm Password must match.'
            }
        };
        this.id = this.route.queryParams['value']['id'];
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.buildForm();
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChangePasswordComponent.prototype.buildForm = function () {
        var _this = this;
        this.changePasswordForm = this.formBuilder.group({
            'newPassword': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.PasswordPattern)]],
            'confirmPassword': ['']
        });
        this.changePasswordForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    ChangePasswordComponent.prototype.onValueChanged = function (data) {
        if (!this.changePasswordForm) {
            return;
        }
        var form = this.changePasswordForm;
        for (var field in this.formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            this.formErrors[field] = '';
            control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ChangePasswordComponent.prototype.passwordOnBlur = function () {
        if (!this.passwordMatch()) {
            this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
        }
    };
    ChangePasswordComponent.prototype.passwordOnFocus = function () {
        this.formErrors.confirmPassword = '';
    };
    ChangePasswordComponent.prototype.passwordMatch = function () {
        if (this.changePasswordForm.controls['confirmPassword'].value == this.changePasswordForm.controls['newPassword'].value) {
            return true;
        }
        else {
            return false;
        }
    };
    ChangePasswordComponent.prototype.changePassword = function () {
        var _this = this;
        if (this.changePasswordForm.valid) {
            if (!this.passwordMatch()) {
                this.formErrors.confirmPassword = this.validationMessages.confirmPassword.nomatch;
            }
            else {
                //submit password change
                var loginResponse = this.loginStoreService.cookieStateItem;
                if (!loginResponse) {
                    loginResponse = new index_2.LoginResponseModel();
                }
                //this.validateCookie.validateCookie();
                this.changeDetail.resetKey = this.route.queryParams['value']['id'];
                //Map to not-convenient api
                this.changePutDetail.newPassword = this.changeDetail.newPassword;
                this.changePutDetail.resetKey = this.changeDetail.resetKey;
                //  let subscription = this.changePassordChangeService.changePassword(this.changePutDetail, loginResponse)
                //.subscribe(() => {
                this.changePassordChangeService.subscribeToChangeNewPasswordNew(this.changePutDetail, loginResponse);
                this.restPassInterval = window.setInterval(function () {
                    //console.log("this.changePassordChangeService: ", this.changePassordChangeService.result)
                    //console.log(" this.changePassordChangeService.loginResponse.status: ", this.changePassordChangeService.loginResponse.status)
                    if (_this.changePassordChangeService.result === true) {
                        //console.log("We should be going back to log in")
                        _this.resetFailed = false;
                        _this.resetSuccesful = true;
                        window.setTimeout(function () {
                            window.clearInterval(_this.restPassInterval);
                            var link = ['welcome'];
                            _this.router.navigate(link);
                        }, 2000);
                    }
                    else {
                        _this.resetFailed = true;
                        window.setTimeout(function () {
                            window.clearInterval(_this.restPassInterval);
                            var link = ['reset-password'];
                            _this.router.navigate(link);
                        }, 2000);
                        ++_this.changePassordChangeService.count;
                    }
                }, 1000);
            }
        }
    };
    ChangePasswordComponent = __decorate([
        core_1.Component({
            selector: 'change-password',
            templateUrl: './change-password.component.html',
            providers: [index_1.ChangePasswordService,
                forms_1.FormBuilder,
                index_1.ValidateCookieService
            ]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.ToasterService,
            forms_1.FormBuilder,
            index_1.ChangePasswordService,
            index_1.CookieService,
            index_1.ValidateCookieService,
            router_1.ActivatedRoute,
            index_1.MessageProcessorService,
            index_1.LoginStoreService])
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());
exports.ChangePasswordComponent = ChangePasswordComponent;
//# sourceMappingURL=change-password.component.js.map