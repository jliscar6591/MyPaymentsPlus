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
var site_home_component_1 = require("../site-home.component");
var receipt_service_1 = require("../../shared/components/receipt/receipt.service");
var bonus_schedule_service_1 = require("../services/bonus-schedule.service");
var index_1 = require("../services/index");
var store_1 = require("@ngrx/store");
var index_2 = require("../../shared/services/index");
var app_settings_1 = require("../../app.settings");
var material_1 = require("@angular/material");
var user_context_service_1 = require("../account/services/user-context.service");
var core_2 = require("@capacitor/core");
var DashboardHomeComponent = /** @class */ (function () {
    // public showReceiptInterval: any;
    function DashboardHomeComponent(
    // public purchaseBannerService: PurchaseBannerService,
    siteHomeComponent, receiptService, bonusScheduleService, messageProcessorService, addCartItemService, studentMealsService, transferMealsService, dialog, store, feesService, cartCheckoutSrvc, loginStoreSrvc, studentMealsServiceRemote, activitiesService, userContextService) {
        this.siteHomeComponent = siteHomeComponent;
        this.receiptService = receiptService;
        this.bonusScheduleService = bonusScheduleService;
        this.messageProcessorService = messageProcessorService;
        this.addCartItemService = addCartItemService;
        this.studentMealsService = studentMealsService;
        this.transferMealsService = transferMealsService;
        this.dialog = dialog;
        this.store = store;
        this.feesService = feesService;
        this.cartCheckoutSrvc = cartCheckoutSrvc;
        this.loginStoreSrvc = loginStoreSrvc;
        this.studentMealsServiceRemote = studentMealsServiceRemote;
        this.activitiesService = activitiesService;
        this.userContextService = userContextService;
        //= this.validateCookie.validateCookie();
        this.isBonus = false;
        this.isBonusSchedule = false;
        this.receiptCounter = 0;
        this.autoEnrollFeesCounter = 0;
        this.openMeals = false;
        this.showFees = false;
        this.showActivities = false;
        this.openNutrislice = false;
        this.openFeedback = false;
        this.districtHasFees = false;
        this.districtHasActivities = false;
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        this.feeStore = store.select(function (state) { return state.feeStore; });
    }
    DashboardHomeComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.mobile = (window.innerWidth < 960) ? true : false;
                        this.getMealBonusSchedule();
                        // console.log('login response', this.loginResponse);
                        return [4 /*yield*/, this.studentMealsServiceRemote.subscribeToGetMeals(this.loginResponse)];
                    case 1:
                        // console.log('login response', this.loginResponse);
                        _b.sent();
                        if (!this.userContextService.defaultData) {
                            this.userContextService.subscribeToGetDeriveDefaultsNew(this.loginResponse);
                            setTimeout(function () { _this.userContextDefault = _this.userContextService.defaultData; }, 1000);
                        }
                        else {
                            this.userContextDefault = this.userContextService.defaultData;
                            // console.log('default data', this.userContextService.defaultData)
                        }
                        //onsole.log('loginStoreSrvc', this.loginStoreSrvc);
                        this.feeInterval = setInterval(function () {
                            if (_this.feesService.feesList) {
                                if (_this.feesService.feesList.length === 0) {
                                    _this.showFees = false;
                                }
                                else {
                                    _this.showFees = true;
                                }
                            }
                        }, 500);
                        //  console.log("do we have the user Defaults on Dashboard: ", this.userContextService.defaultData);
                        // console.log("about to call subscribeToGetCartCheckoutCartItem - Dashboard1 ")
                        this.cartCheckoutSrvc.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 2:
                        _a.deviceInfo = _b.sent();
                        //console.log(this.deviceInfo);
                        //console.log('default', this.userContextDefault);
                        if (this.deviceInfo.platform === 'web') {
                            this.web = true;
                            if (this.userContextDefault.districtHasFees) {
                                this.districtHasFees = true;
                                this.showFees = true;
                            }
                            if (this.userContextDefault.districtHasActivities) {
                                this.districtHasActivities = true;
                                this.showActivities = true;
                            }
                        }
                        else {
                            //console.log(this.userContextService.defaultData.isMobileMealsOnly);
                            if (this.userContextDefault.districtHasFees) {
                                this.districtHasFees = true;
                            }
                            if (this.userContextDefault.districtHasActivities) {
                                this.districtHasActivities = true;
                            }
                            if (this.userContextDefault.districtHasOrientations) {
                                this.districtHasOrientations = true;
                            }
                            if (this.userContextDefault.districtHasExams) {
                                this.districtHasExams = true;
                            }
                            if (this.userContextService.defaultData.isMobileMealsOnly === true) {
                                this.showFees = false;
                                this.showActivities = false;
                            }
                            else {
                                this.showFees = true;
                                this.showActivities = true;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DashboardHomeComponent.prototype.ngDoCheck = function () {
        var paymentType = this.receiptService.paymentType;
        // console.log("Do we have this cart: ", paymentType);
        if (paymentType == 'userFee') {
            this.receiptService.goToMakeTransfer();
        }
        if (this.mealBonusSchedule) {
            if (this.mealBonusSchedule.length > 0) {
                this.isBonusSchedule = true;
            }
        }
    };
    //setShowReceipt() {
    //  this.showReceipt = this.receiptService.showReceipt;
    //  console.log("setShowReceipt: ", this.showReceipt);
    //}
    DashboardHomeComponent.prototype.getMealBonusSchedule = function () {
        var _this = this;
        var subscription = this.bonusScheduleService.getBonusSchedule(this.loginResponse)
            .subscribe(function () {
            if (_this.bonusScheduleService.result == true) {
                subscription.unsubscribe();
                if (_this.bonusScheduleService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSrvc.loadLogin(_this.bonusScheduleService.loginResponse);
                }
                else {
                    _this.mealBonusSchedule = _this.bonusScheduleService.mealbonusSchedule;
                    _this.loginStoreSrvc.loadLogin(_this.bonusScheduleService.loginResponse);
                }
            }
            else {
                ++_this.bonusScheduleService.count;
            }
        });
    };
    DashboardHomeComponent.prototype.ngOnDestroy = function () {
        // console.log("closed the receipt update Site: ", this.siteHomeComponent.siteMealsRefresh)
        this.siteHomeComponent.siteMealsRefresh = true;
        // this.siteHomeComponent.refeshMeals(true);
        if (this.receiptService.displayReceipt()) {
            this.receiptService.hide();
            this.receiptCounter = 0;
        }
    };
    DashboardHomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'dashboard-home.component.html',
            styleUrls: ['../../app.component.less', './dashboard-home.component.less']
        }),
        __metadata("design:paramtypes", [site_home_component_1.SiteHomeComponent,
            receipt_service_1.ReceiptService,
            bonus_schedule_service_1.BonusScheduleService,
            index_2.MessageProcessorService,
            index_1.AddCartItemService,
            index_1.StudentMealsService,
            index_1.TransfersService,
            material_1.MatDialog,
            store_1.Store,
            index_1.FeesService,
            index_1.CartCheckoutItemsService,
            index_2.LoginStoreService,
            index_1.StudentMealsServiceRemote,
            index_1.ActivitiesService,
            user_context_service_1.UserContextService])
    ], DashboardHomeComponent);
    return DashboardHomeComponent;
}());
exports.DashboardHomeComponent = DashboardHomeComponent;
//# sourceMappingURL=dashboard-home.component.js.map