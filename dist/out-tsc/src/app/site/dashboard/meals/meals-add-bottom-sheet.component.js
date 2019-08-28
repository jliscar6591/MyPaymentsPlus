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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
var index_1 = require("../../services/index");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var meals_component_1 = require("./meals.component");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var index_2 = require("../../services/index");
var index_3 = require("../../../shared/services/index");
var store_1 = require("@ngrx/store");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var router_1 = require("@angular/router");
var MealsAddBottomSheetComponent = /** @class */ (function () {
    function MealsAddBottomSheetComponent(data, router, bottomSheetRef, studentRemoteMealsSrvc, addCartItemService, utilityService, cartCheckoutItemsService, mealsComponent, loginStoreSvc, viewContainerRef, store, state, refreshService, dialogService, transfersService, studentService) {
        this.data = data;
        this.router = router;
        this.bottomSheetRef = bottomSheetRef;
        this.studentRemoteMealsSrvc = studentRemoteMealsSrvc;
        this.addCartItemService = addCartItemService;
        this.utilityService = utilityService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.mealsComponent = mealsComponent;
        this.loginStoreSvc = loginStoreSvc;
        this.viewContainerRef = viewContainerRef;
        this.store = store;
        this.state = state;
        this.refreshService = refreshService;
        this.dialogService = dialogService;
        this.transfersService = transfersService;
        this.studentService = studentService;
        this.failedAddCartAmount = false;
        this.failedAddCartAmountMsg = '';
        this.isAddCartAmountSaving = false;
        this.tabIndex = 0;
        this.threshold = app_settings_1.Constants.studentMealBalanceWarningThreshold;
        this.categoryNames = [];
        this.mealSelectedErrMsg = '';
        this.xferStatusCounter = 0;
        this.isXferFeePaid = false;
        this.reply = false;
        this.throwAccountError = false;
        this.changed = new core_1.EventEmitter();
        this.addCartItemMobile = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    MealsAddBottomSheetComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, accounts, selected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //console.log("Does ngONIt have StudentMeals: ", this.studentRemoteMealsSrvc.studentMeals)
                        //console.log('index', this.data.index);
                        // console.log('model', this.data.model);
                        this.student = this.data.model;
                        this.formAmount = new forms_1.FormGroup({
                            amount: new forms_1.FormControl('', forms_1.Validators.required),
                            account: new forms_1.FormControl('', forms_1.Validators.required)
                        });
                        this.depositableAccounts = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.student.mealAccounts.length)) return [3 /*break*/, 4];
                        if (!this.student.mealAccounts[i].isDepositable) return [3 /*break*/, 3];
                        accounts = {
                            account: this.student.mealAccounts[i],
                            index: i
                        };
                        return [4 /*yield*/, this.depositableAccounts.push(accounts)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log(this.depositableAccounts);
                        console.log(this.depositableAccounts[0].index);
                        this.formAmount.controls.account.setValue(0);
                        selected = this.depositableAccounts[0].index;
                        console.log('initially slected account should be first on the despositable list', selected);
                        document.getElementById(selected).style.backgroundColor = '#c5e1a5';
                        document.getElementById(selected).style.color = '#2e7d32';
                        return [2 /*return*/];
                }
            });
        });
    };
    MealsAddBottomSheetComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.xferStatusInterval = setInterval(function () {
            if (_this.transfersService.gotStautsCode) {
                // console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
                _this.reply = _this.transfersService.result;
                _this.isXferFeePaid = _this.transfersService.isXferFeePaid;
                clearInterval(_this.xferStatusInterval);
                // console.log('this.reply: ', this.reply)
                // console.log('this.isXferFeePaid: ', this.isXferFeePaid)
            }
        }, 50);
        this.statusInterval = setInterval(function () {
            _this.availStatus = _this.transfersService.xferLinkStatus;
            clearInterval(_this.statusInterval);
        }, 50);
    };
    MealsAddBottomSheetComponent.prototype.ngDoCheck = function () {
        if (this.availStatus == 2) {
            this.studentService.needGetStudents.emit(true);
            clearInterval(this.statusInterval);
        }
    };
    MealsAddBottomSheetComponent.prototype.update = function (content) {
        this.changed.emit(content);
    };
    MealsAddBottomSheetComponent.prototype.updateCartAmount = function (j) {
        var cartSum = this.student.mealAccounts[j].cartAmount;
        this.student.mealAccounts[j].cartAmount = cartSum + parseInt(this.formAmount.controls.amount.value);
        this.formAmount.controls.amount.reset();
    };
    MealsAddBottomSheetComponent.prototype.updateCartAmountQuick = function (amount, j) {
        var cartSum = this.student.mealAccounts[j].cartAmount;
        this.student.mealAccounts[j].cartAmount = cartSum + amount;
        this.formAmount.controls.amount.reset();
    };
    MealsAddBottomSheetComponent.prototype.listChange = function (event) {
        if (event.isUserInput) {
            if (this.student.mealAccounts[event.source.value].isDepositable) {
                var selected = event.source.value.toString();
                // console.log('selected account - 157', selected);
                var i;
                for (i = 0; i < this.student.mealAccounts.length; i++) {
                    if (i !== event.source.value && this.student.mealAccounts[i].isDepositable) {
                        document.getElementById(i.toString()).style.backgroundColor = 'white';
                        document.getElementById(i.toString()).style.color = 'rgba(0, 0, 0, 0.87)';
                    }
                }
                // console.log('selected account - 165', selected);
                document.getElementById(selected).style.backgroundColor = '#c5e1a5';
                document.getElementById(selected).style.color = '#2e7d32';
            }
            // console.log('#', event.source.value, 'boolean', event.source.selected);
        }
    };
    MealsAddBottomSheetComponent.prototype.addCartItem = function (amount, j) {
        if (j === 0) {
            j = this.depositableAccounts[0].index;
        }
        this.isMealPlanSelected = false;
        var params = {
            valid: true,
            amount: amount,
            outsideIndex: this.data.index,
            insideIndex: j
        };
        this.mealsComponent.addCartItemMobile(params);
        //Client side update cartAmount
        this.updateCartAmountQuick(amount, j);
        this.bottomSheetRef.dismiss();
    };
    MealsAddBottomSheetComponent.prototype.addCartItemCustom = function () {
        //console.log(this.depositableAccounts[this.formAmount.controls.account.value].index);
        this.isMealPlanSelected = false;
        var j = this.depositableAccounts[this.formAmount.controls.account.value].index;
        var params = {
            valid: this.formAmount.valid,
            amount: parseInt(this.formAmount.controls.amount.value),
            outsideIndex: this.data.index,
            insideIndex: j
        };
        this.mealsComponent.addCartItemMobile(params);
        //this.addCartItemMobile.emit({
        //  valid: this.formAmount.valid,
        //  amount: parseInt(this.formAmount.controls.amount.value),
        //  outsideIndex: this.data.index,
        //  insideIndex: parseInt(this.formAmount.controls.account.value)
        //});
        //Client side update cartAmount
        this.updateCartAmount(parseInt(this.depositableAccounts[this.formAmount.controls.account.value].index));
    };
    MealsAddBottomSheetComponent.prototype.getWarnIcon = function (cartBalance) {
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
    MealsAddBottomSheetComponent.prototype.isWarning = function (cartBalance, cartCategory) {
        var catName = this.student.mealAccounts.map(function (b) { return b.categoryName; });
        var myBal = this.student.mealAccounts.map(function (a) { return a.currentBalance; });
        if (cartBalance >= this.threshold) {
            return false;
        }
        else {
            //Make sure flag is not set for Bonus accounts
            var catCheck = this.checkCategory(cartCategory);
            return catCheck;
        }
    };
    MealsAddBottomSheetComponent.prototype.insertAccount = function (insideIndex) {
        var _this = this;
        if (this.student.mealAccounts[insideIndex].isDepositable) {
            this.formAmount.controls.account.setValue(insideIndex, { emitModelToViewChange: true });
            var i;
            for (i = 0; i < this.student.mealAccounts.length; i++) {
                if (i !== insideIndex && this.student.mealAccounts[i].isDepositable) {
                    document.getElementById(i.toString()).style.backgroundColor = 'white';
                    document.getElementById(i.toString()).style.color = 'rgba(0, 0, 0, 0.87)';
                }
            }
            var selected = insideIndex.toString();
            document.getElementById(selected).style.backgroundColor = '#c5e1a5';
            document.getElementById(selected).style.color = '#2e7d32';
            this.throwAccountError = false;
            // console.log(this.formAmount.controls.account);
        }
        else {
            this.throwAccountError = true;
            setTimeout(function () {
                _this.throwAccountError = false;
            }, 2000);
        }
    };
    MealsAddBottomSheetComponent.prototype.viewCart = function () {
        var _this = this;
        // console.log("Calling veiwCart")
        var proceedCart;
        // console.log("about to subscribeToGetCartCheckoutCartItem - SiteHome1:  ", this.cartCheckoutItemsService.cartItem)
        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
        if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
            if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
                if (this.cartStateItems) {
                    proceedCart = this.cartStateItems;
                }
                else {
                    proceedCart = this.cartCheckoutItemsService.cartItem;
                }
                //  console.log("proceedCart: ", proceedCart)
                if (proceedCart && this.router.url !== '/review') {
                    this.tabIndex = null;
                    this.router.navigate(['/checkout']);
                    window.clearInterval(this.checkoutInterval);
                }
            }
        }
        else {
            this.checkoutInterval = window.setInterval(function () {
                if (_this.cartStateItems || _this.cartCheckoutItemsService.cartItem) {
                    if (_this.cartStateItems) {
                        proceedCart = _this.cartStateItems;
                    }
                    else {
                        proceedCart = _this.cartCheckoutItemsService.cartItem;
                    }
                    //  console.log("proceedCart: ", proceedCart)
                    if (proceedCart && _this.router.url !== '/review') {
                        _this.tabIndex = null;
                        _this.router.navigate(['/checkout']);
                        window.clearInterval(_this.checkoutInterval);
                    }
                }
            }, 500);
        }
        this.bottomSheetRef.dismiss();
    };
    MealsAddBottomSheetComponent.prototype.checkCategory = function (category) {
        if (category == 'Bonus') {
            return false;
        }
        else {
            return true;
        }
    };
    MealsAddBottomSheetComponent.prototype.showCategoryDescr = function (insideIndex) {
        // console.log('category index', insideIndex);
        this.dialogService.open("Category Description", this.student.mealAccounts[this.data.index].account[insideIndex].categoryDescription, null, null, this.viewContainerRef);
    };
    MealsAddBottomSheetComponent.prototype.closeSheet = function () {
        this.bottomSheetRef.dismiss();
    };
    MealsAddBottomSheetComponent.prototype.ngOnDestroy = function () {
        this.transfersService.isTransferCallCnt = 0;
        this.transfersService.gotStatusCodeCount = 0;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsAddBottomSheetComponent.prototype, "changed", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsAddBottomSheetComponent.prototype, "addCartItemMobile", void 0);
    MealsAddBottomSheetComponent = __decorate([
        core_1.Component({
            selector: 'app-meals-add-bottom-sheet',
            templateUrl: './meals-add-bottom-sheet.component.html',
            styleUrls: ['./meals-add-bottom-sheet.component.less', './meals.component.less']
        }),
        __param(0, core_1.Inject(material_1.MAT_BOTTOM_SHEET_DATA)),
        __metadata("design:paramtypes", [Object, router_1.Router,
            bottom_sheet_1.MatBottomSheetRef,
            index_1.StudentMealsServiceRemote,
            index_1.AddCartItemService,
            index_3.UtilityService,
            index_1.CartCheckoutItemsService,
            meals_component_1.MealsComponent,
            index_3.LoginStoreService,
            core_1.ViewContainerRef,
            store_1.Store,
            store_1.State,
            refresh_service_1.RefreshService,
            simple_dialog_service_1.SimpleDialogService,
            index_2.TransfersService,
            index_1.StudentMealsService])
    ], MealsAddBottomSheetComponent);
    return MealsAddBottomSheetComponent;
}());
exports.MealsAddBottomSheetComponent = MealsAddBottomSheetComponent;
//# sourceMappingURL=meals-add-bottom-sheet.component.js.map