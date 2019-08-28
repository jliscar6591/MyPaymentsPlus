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
var feedback_dialog_service_1 = require("../../services/feedback-dialog.service");
var index_1 = require("../../../shared/services/index");
var app_settings_1 = require("../../../app.settings");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var core_2 = require("@capacitor/core");
var FeedbackComponent = /** @class */ (function () {
    function FeedbackComponent(feedbackDialogService, viewContainerRef, validateCookie, cookieService, pageLoadingService, loginStoreSvc) {
        this.feedbackDialogService = feedbackDialogService;
        this.viewContainerRef = viewContainerRef;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.pageLoadingService = pageLoadingService;
        this.loginStoreSvc = loginStoreSvc;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    FeedbackComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.isOldExperienceAllowed = this.loginResponse.isOldExperienceAllowed;
                        this.mobile = (window.innerWidth < 960) ? true : false;
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        if (this.deviceInfo.platform === 'web') {
                            this.isWeb = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FeedbackComponent.prototype.showFeedbackDialog = function () {
        //open feedback dialog, false boolean is for whether or not this dialog is suppose to return to classic mpp
        this.feedbackDialogService.open(false, this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                //feedback sent!
            }
        });
    };
    FeedbackComponent.prototype.showReturnToClassicDialog = function () {
        var _this = this;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //JSON.parse(this.cookieService.get(Constants.AuthCookieName));
        //check if feedback was already provided in the past
        //
        if (this.cookieService.get(app_settings_1.Constants.FeedbackCookieName) !== undefined) {
            //if feedback provided then skip dialog and go straight to classic site
            if (this.isOldExperienceAllowed == true) {
                this.pageLoadingService.show("Returning to Classic MyPaymentsPlus");
                this.returnToClassic();
            }
            else {
                return;
            }
        }
        else {
            //open feedback dialog, true boolean is for whether or not this dialog is suppose to return to classic mpp
            this.feedbackDialogService.open(true, this.viewContainerRef)
                .subscribe(function (result) {
                if (result) {
                    //feedback sent!
                    //show page loading overlay
                    _this.pageLoadingService.show("Returning to Classic MyPaymentsPlus");
                    _this.returnToClassic();
                }
            });
        }
    };
    FeedbackComponent.prototype.returnToClassic = function () {
        console.log("Calling Return to classic");
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //this.validateCookie.validateCookie();
        var cleanToken = this.loginResponse.access_token.trim();
        console.log("do we have a clean token: ", cleanToken);
        window.location.href = app_settings_1.Constants.ParentPaymentsUrl + '?id=' + cleanToken;
    };
    FeedbackComponent = __decorate([
        core_1.Component({
            selector: 'feedback',
            templateUrl: './feedback.component.html',
            styleUrls: ['./feedback.component.less']
        }),
        __metadata("design:paramtypes", [feedback_dialog_service_1.FeedbackDialogService,
            core_1.ViewContainerRef,
            index_1.ValidateCookieService,
            index_1.CookieService,
            page_loading_service_1.PageLoadingService,
            index_1.LoginStoreService])
    ], FeedbackComponent);
    return FeedbackComponent;
}());
exports.FeedbackComponent = FeedbackComponent;
//# sourceMappingURL=feedback.component.js.map