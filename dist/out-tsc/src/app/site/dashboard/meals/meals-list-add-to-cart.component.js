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
var index_1 = require("../../services/index");
var index_2 = require("../../services/index");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var app_settings_1 = require("../../../app.settings");
var site_home_component_1 = require("../../site-home.component");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var index_3 = require("../../../shared/services/index");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var store_1 = require("@ngrx/store");
//import { clearInterval, setTimeout, setInterval } from 'timers';
//import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions'
var MealsListAddToCartComponent = /** @class */ (function () {
    function MealsListAddToCartComponent(router, addCartItemService, validateCookie, cookieService, utilityService, dialogService, viewContainerRef, transfersService, receiptService, multiDistrictSrvc, studentService, studentRemoteService, siteHomeComponent, loginStoreSvc, store, state, refreshService) {
        this.router = router;
        this.addCartItemService = addCartItemService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.dialogService = dialogService;
        this.viewContainerRef = viewContainerRef;
        this.transfersService = transfersService;
        this.receiptService = receiptService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.studentService = studentService;
        this.studentRemoteService = studentRemoteService;
        this.siteHomeComponent = siteHomeComponent;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.state = state;
        this.refreshService = refreshService;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.threshold = app_settings_1.Constants.studentMealBalanceWarningThreshold;
        this.isNewDistrict = this.multiDistrictSrvc.newDistrictSelected;
        this.xFerLinkCounter = 0;
        this.xferStatusCounter = 0;
        this.mealsListRefreshCounter = 0;
        this.mealRefreshCounter = 0;
        this.didSwitchCounter = 0;
        this.modelCounter = 0;
        this.isAddCartAmountSaving = false;
        this.changed = new core_1.EventEmitter();
        this.addCartItemDesktop = new core_1.EventEmitter();
        this.formErrors = {
            'addAmount': ''
        };
        this.validationMessages = {
            'addAmount': {
                'pattern': 'Only numbers are allowed.'
            },
        };
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    ;
    // @Output()
    MealsListAddToCartComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //  console.log("Calling Meal-List-Add-To-Cart")
                        //console.log(this.transfersService);
                        // console.log(this.transfersService.availableStatus.status);
                        this.mealStore.subscribe(function (c) { return _this.mealState = c; });
                        if (!this.model) {
                            if (this.mealState) {
                                this.model = this.mealState.data;
                                // console.log("Do we have a model: ", this.model);
                            }
                        }
                        this.formInterval = setInterval(function () {
                            if (_this.form) {
                                clearInterval(_this.formInterval);
                                //Validation reporting
                                _this.form.valueChanges
                                    .subscribe(function (data) { return _this.utilityService.onValueChanged(_this.form, _this.formErrors, _this.validationMessages); });
                            }
                        }, 50);
                        _a = this;
                        return [4 /*yield*/, setInterval(function () {
                                // console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
                                _this.reply = _this.transfersService.result;
                                // console.log(this.transfersService.availableStatus);
                                if (_this.transfersService.availableStatus) {
                                    if (_this.transfersService.availableStatus.status === 4) {
                                        _this.isXferFeePaid = false;
                                    }
                                    else if (_this.transfersService.availableStatus.status === 3) {
                                        _this.isXferFeePaid = true;
                                    }
                                    // console.log('this.reply: ', this.reply)
                                    //console.log('this.isXferFeePaid: ', this.isXferFeePaid)
                                    clearInterval(_this.xferStatusInterval);
                                }
                            }, 50)];
                    case 1:
                        _a.xferStatusInterval = _b.sent();
                        this.firstName = this.account.firstName;
                        this.balDate = this.account.balanceDate;
                        //console.log('availableStatus: ', this.transfersService.xferLinkStatus)
                        //if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
                        //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem);
                        //  // this.transfersService.subscribeToGetPendingRequests(this.loginStoreSvc.cookieStateItem);
                        //  // console.log("transferService Meals-list-add-to-cart subscribeToGetMeals ")
                        //  // this.studentService.subscribeToGetMeals(this.loginStoreSvc.cookieStateItem)
                        //  this.xferStatusCounter++;
                        //}
                        this.refreshService.multiDistrictEvent$.subscribe(function () {
                            if (_this.refreshService.multiDistrictRefresh) {
                                _this.model = [];
                                _this.studentService.studentMeals = _this.refreshService.multiDistrictMealRefresh();
                                // if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
                                //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem);
                                //this.transfersService.subscribeToGetTransferFeeStatusNew(this.loginStoreSvc.cookieStateItem);
                                _this.loginStoreSvc.loadLogin(_this.loginStoreSvc.cookieStateItem);
                                _this.transfersService.gotStautsCode = true;
                                // console.log("did the subscribe complete: ", this.xferStatusCode)
                                _this.transfersService.gotStatusCodeCount++;
                                // if (this.transfersService.gotStautsCode == true && (this.transfersService.isTransferCallCnt < this.transfersService.gotStatusCodeCount)) {
                                //window.clearInterval(this.getXferInterval);
                                _this.transfersService.xferLinkStatus = _this.transfersService.xferStatusCode;
                                (_this.xferLinkStatus) ? _this.transfersService.isTransfer(_this.transfersService.xferLinkStatus) : _this.transfersService.reply = false;
                                if (_this.studentService.studentMeals) {
                                    _this.model = _this.studentService.studentMeals;
                                }
                                else {
                                    _this.model = _this.studentRemoteService.studentMeals;
                                }
                                _this.refreshService.multiDistrictRefresh = false;
                            }
                        });
                        this.refreshService.mealsListEvent$.subscribe(function () {
                            if (_this.refreshService.mealsListRefresh === true) {
                                _this.mealStore.subscribe(function (c) { return _this.mealState = c; });
                                if (_this.mealState) {
                                    _this.model = _this.mealState.data;
                                }
                                else {
                                    _this.model = _this.studentRemoteService.studentMeals;
                                }
                                // console.log("the model: ", this.model)
                                _this.refreshService.mealsListRefresh = false;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MealsListAddToCartComponent.prototype.ngDoCheck = function () {
        this.availStatus = this.transfersService.xferLinkStatus;
        if (this.availStatus == 2) {
            this.studentService.needGetStudents.emit(true);
        }
    };
    MealsListAddToCartComponent.prototype.ngAfterContentChecked = function () {
    };
    MealsListAddToCartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        //  console.log("Callinf Meals List Add ngAfterViewInit: ", this.model)
        setTimeout(function () {
            // console.log("Do we see the NEW MODEL NOW: ", this.model);
            //  console.log("Or NOW from StudentService: ", this.studentService.studentMeals);
            if (_this.refreshService.multiDistrictRefresh && _this.siteHomeComponent.siteMealsRefresh === true) {
                var testMeals = _this.studentService.studentMeals.map(function (a) { return a.mealAccounts; });
                for (var i = 0; i < testMeals.length; i++) {
                    _this.model.push(testMeals[i]);
                }
                _this.refreshService.multiDistrictRefresh = false;
                //  console.log("Our new Model: ", this.model)
            }
            if (_this.account) {
                _this.account.mealAccounts.reverse();
            }
        }, 100);
        //Makes sure the most cuurent status code is being used in case any transfers were processed or became pending
        // this.doWeHaveStatus = this.transfersService.gotStautsCode;
        if (this.didSwitchCounter < 1) {
            this.multiDistrictSrvc.didSwitchDistrict.subscribe(function () {
                if (_this.multiDistrictSrvc.newDistrictSelected) {
                    _this.multiDistrictSrvc.newDistrictSelected = false;
                }
            });
            this.didSwitchCounter++;
        }
        else {
            if (this.didSwitchCounter < 3) {
                this.didSwitchCounter++;
            }
        }
    };
    MealsListAddToCartComponent.prototype.isMealAccounts = function () {
        if (this.account) {
            return this.account.mealAccounts.length > 0;
        }
        else {
            return false;
        }
    };
    MealsListAddToCartComponent.prototype.update = function (content) {
        this.changed.emit(content);
        //  console.log("Do we have a Pending Amount: ", this.model[this.insideIndex].mealAccounts[this.outsideIndex].cartAmount);
    };
    //Update cart amount on the client side.
    MealsListAddToCartComponent.prototype.updateCartAmount = function (j) {
        var _this = this;
        // console.log("Updating this Account: ", this.account.mealAccounts[j])
        var cartSum = this.account.mealAccounts[j].cartAmount;
        // console.log("What is CartSum: ", cartSum)
        // console.log("do we have a addAmount: ", this.account.mealAccounts[j].addAmount);
        this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
        this.studentService.needGetStudents.emit(true);
        this.addCartItemService.cartUpdate.emit(true);
        this.form.reset();
        this.model[j].isAddCartAmountSaving = (this.account.mealAccounts[j].cartAmount < 0) ? true : false;
        setTimeout(function () {
            _this.isAddCartAmountSaving = (_this.account.mealAccounts[j].cartAmount < 0) ? true : false;
            _this.account['isAddCartAmountSaving'] = (_this.account.mealAccounts[j].cartAmount < 0) ? true : false;
            // console.log("Are you still Saving: ", this.account['isAddCartAmountSaving'])
        }, 500);
    };
    //Determine the color of warning icon
    //concatenate a string of classes to 
    //render the warning icon with the
    //desired color.
    MealsListAddToCartComponent.prototype.getWarnIcon = function (cartBalance) {
        var classes = " material-icons ";
        if (cartBalance < 0) {
            classes += " warnRed ";
        }
        if (cartBalance < this.threshold) {
            classes += " warn ";
        }
        return classes + " meals-amount-warning ";
    };
    //Determine when the warning triangle is to be displayed
    MealsListAddToCartComponent.prototype.isWarning = function (cartBalance, cartCategory) {
        var catName = this.account.mealAccounts.map(function (b) { return b.categoryName; });
        var myBal = this.account.mealAccounts.map(function (a) { return a.currentBalance; });
        if (cartBalance >= this.threshold) {
            return false;
        }
        else {
            //Make sure flag is not set for Bonus accounts
            var catCheck = this.checkCategory(cartCategory);
            return catCheck;
        }
    };
    MealsListAddToCartComponent.prototype.addCartItem = function (i, j) {
        // console.log("Calling addCartITEM: ", this.model[j]);
        this.isAddCartAmountSaving = true;
        this.model[j].isAddCartAmountSaving = true;
        this.account['isAddCartAmountSaving'] = this.model[j].isAddCartAmountSaving;
        //console.log("Is Cart amount Saving: ", this.account['isAddCartAmountSaving'])
        this.addCartItemDesktop.emit({
            valid: this.form.valid,
            outsideIndex: i,
            insideIndex: j
        });
        this.siteHomeComponent.fixCartFlag = true;
        //Client side update cartAmount
        this.updateCartAmount(j);
    };
    MealsListAddToCartComponent.prototype.showCategoryDescr = function (insideIndex) {
        this.dialogService.open("Category Description", this.model[insideIndex].categoryDescription, null, null, this.viewContainerRef);
    };
    MealsListAddToCartComponent.prototype.checkCategory = function (category) {
        if (category == 'Bonus') {
            return false;
        }
        else {
            return true;
        }
    };
    MealsListAddToCartComponent.prototype.ngOnDestroy = function () {
        // console.log("Destroy Now");
        this.transfersService.gotStautsCode = false;
        this.doWeHaveStatus = this.transfersService.gotStautsCode;
        this.didSwitchCounter = 0;
        this.modelCounter = 0;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MealsListAddToCartComponent.prototype, "addAmountValidation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], MealsListAddToCartComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], MealsListAddToCartComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MealsListAddToCartComponent.prototype, "insideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MealsListAddToCartComponent.prototype, "outsideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MealsListAddToCartComponent.prototype, "account", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], MealsListAddToCartComponent.prototype, "isSuspendPayment", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], MealsListAddToCartComponent.prototype, "mealModel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], MealsListAddToCartComponent.prototype, "cartItemDetailModel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MealsListAddToCartComponent.prototype, "feeFristName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MealsListAddToCartComponent.prototype, "feeLastName", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsListAddToCartComponent.prototype, "changed", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsListAddToCartComponent.prototype, "addCartItemDesktop", void 0);
    MealsListAddToCartComponent = __decorate([
        core_1.Component({
            selector: 'add-amount-selector',
            templateUrl: 'meals-list-add-to-cart.component.html',
            styleUrls: ['meals.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.AddCartItemService,
            index_3.ValidateCookieService,
            index_3.CookieService,
            index_3.UtilityService,
            simple_dialog_service_1.SimpleDialogService,
            core_1.ViewContainerRef,
            index_2.TransfersService,
            receipt_service_1.ReceiptService,
            index_2.MultiDistrictService,
            index_1.StudentMealsService,
            index_1.StudentMealsServiceRemote,
            site_home_component_1.SiteHomeComponent,
            index_3.LoginStoreService,
            store_1.Store,
            store_1.State,
            refresh_service_1.RefreshService])
    ], MealsListAddToCartComponent);
    return MealsListAddToCartComponent;
}());
exports.MealsListAddToCartComponent = MealsListAddToCartComponent;
//# sourceMappingURL=meals-list-add-to-cart.component.js.map