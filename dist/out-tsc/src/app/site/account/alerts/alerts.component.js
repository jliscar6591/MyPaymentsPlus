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
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../services/index");
var suspend_payment_warning_service_1 = require("../../../shared/components/suspend-payment-warning/suspend-payment-warning.service");
var MyErrorStateMatcher = /** @class */ (function () {
    function MyErrorStateMatcher() {
    }
    MyErrorStateMatcher.prototype.isErrorState = function (control, form) {
        var isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    };
    return MyErrorStateMatcher;
}());
exports.MyErrorStateMatcher = MyErrorStateMatcher;
var index_2 = require("../../../shared/services/index");
require("rxjs/add/observable/interval");
var AlertsComponent = /** @class */ (function () {
    function AlertsComponent(router, formBuilder, studentBalanceAlertService, utilityService, suspendPaymentWarningService, loginStoreService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.studentBalanceAlertService = studentBalanceAlertService;
        this.utilityService = utilityService;
        this.suspendPaymentWarningService = suspendPaymentWarningService;
        this.loginStoreService = loginStoreService;
        //= this.validateCookie.validateCookie();
        this.studentAlertInputs = [];
        this.balanceAlerts = new Array();
        this.hasStudents = false;
        this.balanceAlertInputs = new Array();
        this.isGettingBalance = false;
        this.savingBalances = false;
        this.getBalanceErr = false;
        this.saveBalanceErr = false;
        this.alertLevel = new forms_1.FormControl('', [
            forms_1.Validators.required,
            forms_1.Validators.pattern(/^\d+$/),
        ]);
        this.matcher = new MyErrorStateMatcher();
        this.loginResponse = this.loginStoreService.cookieStateItem;
        //since login is not required set the 
        this.loginResponse.status = '';
        this.loginResponse.incidentId = '';
        this.loginResponse.message = '';
        this.loginResponse.messageType = 'Success';
        this.loginResponse.messageTitle = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    }
    AlertsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isGettingBalance = true;
        this.studentBalanceAlertForm = new forms_1.FormGroup({});
        this.alertInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var i, arrayControl, _i, _a, alert_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.studentBalanceAlertService.studentBalanceAlerts) return [3 /*break*/, 3];
                        this.studentBalanceAlerts = this.studentBalanceAlertService.studentBalanceAlerts;
                        return [4 /*yield*/, this.getStudentBalanceAlerts()];
                    case 1:
                        _b.sent();
                        this.studentBalanceAlertForm = this.formBuilder.group({});
                        return [4 /*yield*/, this.getSuspendPayment()];
                    case 2:
                        _b.sent();
                        for (i = 0; i < this.studentBalanceAlertService.studentBalanceAlerts.length; i++) {
                            this.studentBalanceAlertForm.addControl('alertsArray' + i, this.formBuilder.array([]));
                            arrayControl = this.studentBalanceAlertForm.controls['alertsArray' + i];
                            for (_i = 0, _a = this.studentBalanceAlertService.studentBalanceAlerts[i].balanceAlerts; _i < _a.length; _i++) {
                                alert_1 = _a[_i];
                                arrayControl.push(this.initListItem());
                            }
                        }
                        // console.log('balance alerts', this.studentBalanceAlertService.studentBalanceAlerts);
                        clearInterval(this.alertInterval);
                        return [3 /*break*/, 4];
                    case 3:
                        if (this.studentBalanceAlertService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            this.getBalanceErr = true;
                            this.getBalanceErrMsg = this.studentBalanceAlertService.loginResponse.message;
                            this.isGettingBalance = false;
                            this.hasStudents = false;
                            this.utilityService.clearErrorMessage(this.studentBalanceAlertService.loginResponse);
                            clearInterval(this.alertInterval);
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }, 50);
    };
    // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to get Balance Alerts of the students.
    AlertsComponent.prototype.getStudentBalanceAlerts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.loginStoreService.loadLogin(this.studentBalanceAlertService.loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, this.studentBalanceAlertService.loginResponse);
                this.hasStudents = this.studentBalanceAlertService.studentBalanceAlerts.length > 0;
                // console.log(this.hasStudents);
                this.isGettingBalance = false;
                return [2 /*return*/];
            });
        });
    };
    AlertsComponent.prototype.initListItem = function () {
        return this.formBuilder.group({
            'accountbalanceId': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'alertLevel': ['', forms_1.Validators.compose([forms_1.Validators.required])]
        });
    };
    // This calls https://server/profile/api/LowBalanceNotificationConfiguration
    // to save Balance Alerts of the students.
    AlertsComponent.prototype.saveStudentBalanceAlerts = function () {
        var _this = this;
        this.savingBalances = true;
        this.studentBalanceAlertService.result = false;
        var subscription = this.studentBalanceAlertService.saveStudentBalanceAlerts(this.studentBalanceAlertService.studentBalanceAlerts, this.loginResponse)
            .subscribe(function () {
            if (_this.studentBalanceAlertService.result == true) {
                subscription.unsubscribe();
                if (_this.studentBalanceAlertService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.savingBalances = false;
                    _this.saveBalanceErr = true;
                    _this.saveBalanceErrMsg = _this.studentBalanceAlertService.loginResponse.message;
                    _this.utilityService.clearErrorMessage(_this.studentBalanceAlertService.loginResponse);
                }
                else {
                    _this.loginStoreService.loadLogin(_this.studentBalanceAlertService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.studentBalanceAlertService.loginResponse);
                    _this.savingBalances = false;
                    _this.toggleEditAlerts();
                }
            }
            else {
                ++_this.studentBalanceAlertService.count;
            }
        });
    };
    AlertsComponent.prototype.clearForm = function () {
        this.studentBalanceAlertForm.reset();
    };
    AlertsComponent.prototype.setValue = function (value, outsideIndex, insideIndex) {
        if (value <= 0) {
            //Make cancel and submit buttons hide when form invalid and add Alert text
            document.getElementById("saveLBNTopBtn").style.visibility = "hidden";
            document.getElementById("saveLBNBottomBtn").style.visibility = "hidden";
            document.getElementById("cancelLBNTopBtn").style.visibility = "hidden";
            document.getElementById("cancelLBNBottomBtn").style.visibility = "hidden";
            var alertMessageTop = document.getElementById('alertMsgTop');
            alertMessageTop.innerHTML += 'Amount Cannot Be Negative';
            var alertMessageBtm = document.getElementById('alertMsgBtm');
            alertMessageBtm.innerHTML += 'Amount Cannot Be Negative';
        }
        if (value >= 0) {
            //Bring buttons back when form valid, remove Alert text, update values
            document.getElementById("saveLBNTopBtn").style.visibility = "initial";
            document.getElementById("saveLBNBottomBtn").style.visibility = "initial";
            document.getElementById("cancelLBNTopBtn").style.visibility = "initial";
            document.getElementById("cancelLBNBottomBtn").style.visibility = "initial";
            var alertMessageTop = document.getElementById('alertMsgTop');
            alertMessageTop.innerHTML = '';
            var alertMessageBtm = document.getElementById('alertMsgBtm');
            alertMessageBtm.innerHTML = '';
            this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].alertLevel = value;
            this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].isActive = this.studentBalanceAlertService.studentBalanceAlerts[outsideIndex].balanceAlerts[insideIndex].alertLevel == 0 ? false : true;
        }
    };
    AlertsComponent.prototype.getSuspendPayment = function () {
        var warning = false;
        var warningMsg = '';
        if (!this.loginResponse.isAlertsAllowedDistrict) {
            warningMsg += "Account Balance Alerts are disabled for this account.";
            warning = true;
        }
        this.isSuspendPayment = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
    };
    AlertsComponent.prototype.toggleEditAlerts = function () {
        this.showEditAlerts = false;
    };
    AlertsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'alerts.component.html',
            styleUrls: ['alert-level.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.StudentBalanceAlertService,
            index_2.UtilityService,
            suspend_payment_warning_service_1.SuspendPaymentWarningService,
            index_2.LoginStoreService])
    ], AlertsComponent);
    return AlertsComponent;
}());
exports.AlertsComponent = AlertsComponent;
//# sourceMappingURL=alerts.component.js.map