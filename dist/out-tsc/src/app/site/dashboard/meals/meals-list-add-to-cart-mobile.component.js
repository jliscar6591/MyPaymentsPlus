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
var forms_1 = require("@angular/forms");
var index_1 = require("../../services/index");
var app_settings_1 = require("../../../app.settings");
var meals_component_1 = require("./meals.component");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var index_2 = require("../../services/index");
var index_3 = require("../../../shared/services/index");
var store_1 = require("@ngrx/store");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var MealsListAddToCartMobileComponent = /** @class */ (function () {
    function MealsListAddToCartMobileComponent(addCartItemService, utilityService, mealsComponent, loginStoreSvc, studentRemoteService, store, state, refreshService, dialogService, transfersService, studentService) {
        this.addCartItemService = addCartItemService;
        this.utilityService = utilityService;
        this.mealsComponent = mealsComponent;
        this.loginStoreSvc = loginStoreSvc;
        this.studentRemoteService = studentRemoteService;
        this.store = store;
        this.state = state;
        this.refreshService = refreshService;
        this.dialogService = dialogService;
        this.transfersService = transfersService;
        this.studentService = studentService;
        this.failedAddCartAmount = false;
        this.failedAddCartAmountMsg = '';
        this.isAddCartAmountSaving = false;
        this.threshold = app_settings_1.Constants.studentMealBalanceWarningThreshold;
        this.categoryNames = [];
        this.mealSelectedErrMsg = '';
        this.xferStatusCounter = 0;
        this.isXferFeePaid = false;
        this.reply = false;
        this.changed = new core_1.EventEmitter();
        this.addCartItemMobile = new core_1.EventEmitter();
        this.formErrors = {
            'addAmountMobile': '',
            'mealSelectMobile': ''
        };
        this.validationMessages = {
            'addAmountMobile': {
                'pattern': 'Only numbers are allowed.'
            },
            'mealSelectMobile': {
                'pattern': 'No Meal Plan selected.'
            }
        };
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    ;
    MealsListAddToCartMobileComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Loading Meals Mobile: ", this.model);
        console.log("Meals MObile: ", this.account);
        this.isMealPlanSelected = false;
        //initialize the category dropdown list with the bonus filtered out
        this.categoryNames[this.outsideIndex] = this.filterBonus(this.account.mealAccounts);
        this.formInterval = setInterval(function () {
            clearInterval(_this.formInterval);
            _this.formAmount.valueChanges
                .subscribe(function (data) { return _this.utilityService.onValueChanged(_this.formAmount, _this.formErrors, _this.validationMessages); });
        }, 50);
        this.firstName = this.account.firstName;
        //console.log(this.mealsComponent.addCartAmountMobileForm)
        //if (!this.transfersService.availableStatus && this.xferStatusCounter < 2) {
        ////console.log("what is availableStatus: ", this.transfersService.availableStatus)
        //  this.transfersService.getTransferLinkStatus(this.loginStoreSvc.cookieStateItem)
        //  this.xferStatusCounter++;
        //  }
        this.refreshService.mealsListEvent$.subscribe(function () {
            if (_this.refreshService.mealsListRefresh === true) {
                _this.mealStore.subscribe(function (c) { return _this.mealState = c; });
                if (_this.mealState) {
                    _this.model = _this.mealState.data;
                }
                else {
                    var testList = _this.studentRemoteService.studentMeals;
                    _this.model = testList;
                }
                _this.refreshService.mealsListRefresh = false;
                // console.log("Refreshed the model: ", this.model)
            }
        });
    };
    MealsListAddToCartMobileComponent.prototype.ngAfterViewInit = function () {
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
    MealsListAddToCartMobileComponent.prototype.ngDoCheck = function () {
        if (this.availStatus == 2) {
            this.studentService.needGetStudents.emit(true);
            clearInterval(this.statusInterval);
        }
    };
    MealsListAddToCartMobileComponent.prototype.update = function (content) {
        this.changed.emit(content);
    };
    //Update cart amount on the client side.
    MealsListAddToCartMobileComponent.prototype.updateCartAmount = function (j) {
        var cartSum = this.account.mealAccounts[j].cartAmount;
        this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
        this.formAmount.reset();
    };
    //We need to know when the line item is a bonus
    //amounts can not be added in this case
    //and other special provisions may be required
    //Currently the only indicator is the category name
    MealsListAddToCartMobileComponent.prototype.filterBonus = function (mealAccounts) {
        var categoryNames = [{
                categoryName: ''
            },
            {
                categoryIndex: 0
            }];
        var i = 0;
        var j = 0;
        mealAccounts.forEach(function (item) {
            if (item.isDepositable) {
                categoryNames[i].categoryName = item.categoryName;
                categoryNames[i].categoryIndex = j;
                i++;
            }
            j++;
        });
        return categoryNames;
    };
    MealsListAddToCartMobileComponent.prototype.addCartItem = function (amount, i, j) {
        if (j == undefined) {
            this.isMealPlanSelected = true;
            this.mealSelectedErrMsg = this.validationMessages.mealSelectMobile.pattern;
        }
        else {
            this.isMealPlanSelected = false;
            this.addCartItemMobile.emit({
                valid: this.formAmount.valid,
                amount: amount,
                outsideIndex: i,
                insideIndex: j
            });
            //Client side update cartAmount
            this.updateCartAmount(j);
        }
    };
    MealsListAddToCartMobileComponent.prototype.getWarnIcon = function (cartBalance) {
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
    MealsListAddToCartMobileComponent.prototype.isWarning = function (cartBalance, cartCategory) {
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
    //public showCategoryDescr(insideIndex: number) {
    //  this.dialogService.open("Category Description", this.model[insideIndex].categoryDescription, null, null, this.viewContainerRef)
    //}
    MealsListAddToCartMobileComponent.prototype.checkCategory = function (category) {
        if (category == 'Bonus') {
            return false;
        }
        else {
            return true;
        }
    };
    MealsListAddToCartMobileComponent.prototype.ngOnDestroy = function () {
        this.transfersService.isTransferCallCnt = 0;
        this.transfersService.gotStatusCodeCount = 0;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], MealsListAddToCartMobileComponent.prototype, "formAmount", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], MealsListAddToCartMobileComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MealsListAddToCartMobileComponent.prototype, "outsideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MealsListAddToCartMobileComponent.prototype, "account", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MealsListAddToCartMobileComponent.prototype, "insideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], MealsListAddToCartMobileComponent.prototype, "isSuspendPayment", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsListAddToCartMobileComponent.prototype, "changed", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MealsListAddToCartMobileComponent.prototype, "addCartItemMobile", void 0);
    MealsListAddToCartMobileComponent = __decorate([
        core_1.Component({
            selector: 'add-amount-selector-mobile',
            templateUrl: 'meals-list-add-to-cart-mobile.component.html',
            styleUrls: ['meals.component.less']
        }),
        __metadata("design:paramtypes", [index_1.AddCartItemService,
            index_3.UtilityService,
            meals_component_1.MealsComponent,
            index_3.LoginStoreService,
            index_1.StudentMealsServiceRemote,
            store_1.Store,
            store_1.State,
            refresh_service_1.RefreshService,
            simple_dialog_service_1.SimpleDialogService,
            index_2.TransfersService,
            index_1.StudentMealsService])
    ], MealsListAddToCartMobileComponent);
    return MealsListAddToCartMobileComponent;
}());
exports.MealsListAddToCartMobileComponent = MealsListAddToCartMobileComponent;
//# sourceMappingURL=meals-list-add-to-cart-mobile.component.js.map