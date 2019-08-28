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
var student_meals_service_remote_1 = require("../../site/services/student-meals.service-remote");
var store_1 = require("@ngrx/store");
var MealStoreActions = require("../store/actions/mealStore.actions");
var user_context_service_1 = require("../../site/account/services/user-context.service");
var cart_checkout_items_service_1 = require("../../site/services/cart-checkout-items.service");
var CartStoreActions = require("../../shared/store/actions/cartStore.actions");
var RefreshService = /** @class */ (function () {
    function RefreshService(store, state, studentMealsServiceRemote, router, userContextService, cartCheckoutItemsService) {
        this.store = store;
        this.state = state;
        this.studentMealsServiceRemote = studentMealsServiceRemote;
        this.router = router;
        this.userContextService = userContextService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.mealRefresh = false;
        this.mealEvent$ = new core_1.EventEmitter();
        this.cartRefresh = false;
        this.cartEvent$ = new core_1.EventEmitter();
        this.mealRefreshCounter = 0;
        this.xferRefresh = false;
        this.xferEvent$ = new core_1.EventEmitter();
        this.siteRefreshNow = false;
        this.multiDistrictRefresh = false;
        this.multiDistrictEvent$ = new core_1.EventEmitter();
        this.mealsListRefresh = false;
        this.mealsListEvent$ = new core_1.EventEmitter();
        this.errorRefreshCnt = 0;
        this.refreshFeesCnter = 0;
        this.mealStore = store.select(function (state) { return state.mealStore; });
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    RefreshService.prototype.refreshMeals = function () {
        var _this = this;
        // console.log("Refresh Meals is Clearing the Meal Store")
        this.store.dispatch(new MealStoreActions.ClearMeals());
        this.mealStore.subscribe(function (c) { return _this.mealState = c; });
        //For testing ClearMeals
        // if (this.mealState) {
        // console.log("Meal Store Should B Empty: ", this.mealState)
        // }
        this.mealRefresh = true;
        this.mealEvent$.emit(this.mealRefresh);
        this.mealRefreshCounter++;
    };
    RefreshService.prototype.stopRefreshMeals = function () {
        this.mealRefreshCounter = 1;
        this.mealRefresh = false;
        this.mealEvent$.emit(this.mealRefresh);
        // this.mealRefreshCounter = 0;
    };
    RefreshService.prototype.refreshCart = function () {
        var _this = this;
        // console.log("Refreshing the Cart")
        if (this.userContextService.defaultData) {
            this.store.dispatch(new CartStoreActions.ClearCart());
            // this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
            if (this.cartCheckoutItemsService.cartItem) {
                this.cartCheckoutItemsService.count = this.userContextService.defaultData.cartItemCount;
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem));
            }
        }
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        this.cartRefresh = true;
        this.cartEvent$.emit(this.cartRefresh);
    };
    RefreshService.prototype.stopCartRefresh = function () {
        this.cartRefresh = false;
        this.cartEvent$.emit(this.cartRefresh);
    };
    RefreshService.prototype.refreshTransfers = function () {
        console.log("Calling Refresh transfers");
        this.xferRefresh = true;
        this.siteRefreshNow = true;
        //is.mealRefresh = true;
        this.xferEvent$.emit(this.xferRefresh);
    };
    RefreshService.prototype.stopTransferRefresh = function () {
        this.xferRefresh = false;
        this.siteRefreshNow = false;
        this.xferEvent$.emit(this.xferRefresh);
    };
    RefreshService.prototype.multiDistrictMealRefresh = function () {
        var _this = this;
        this.mealStore.subscribe(function (c) { return _this.mealState = c; });
        //console.log("Meal State from multiDistrictMealRefresh: ", this.mealState.data);
        this.multiDistrictRefresh = false;
        return this.mealState.data;
    };
    RefreshService.prototype.refreshMealsList = function (loginResponse) {
        var _this = this;
        console.log("Refresh MealsList subscribeToGetMeals ");
        this.studentMealsServiceRemote.subscribeToGetMeals(loginResponse);
        // window.setTimeout(() => {
        if (this.studentMealsServiceRemote.result === true) {
            var newMealList = this.studentMealsServiceRemote.studentMeals;
            if (newMealList) {
                this.store.dispatch(new MealStoreActions.ClearMeals());
                this.store.dispatch(new MealStoreActions.LoadMealsSuccess(newMealList));
                this.mealStore.subscribe(function (c) { return _this.mealState = c; });
                //For testing ClearMeals
                if (this.mealState) {
                    //   console.log("Meal Store Should B Empty: ", this.mealState)
                }
            }
            this.mealsListRefresh = true;
            this.mealsListEvent$.emit(this.mealsListRefresh);
        }
        //  }, 0)
        window.setTimeout(function () {
            //  console.log("Going to Dashboard")
            _this.router.navigate(['/dashboard']);
        }, 2000);
    };
    RefreshService.prototype.stopMealsListRefresh = function () {
        this.mealsListRefresh = false;
        this.mealsListEvent$.emit(this.mealsListRefresh);
    };
    RefreshService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [store_1.Store,
            store_1.State,
            student_meals_service_remote_1.StudentMealsServiceRemote,
            router_1.Router,
            user_context_service_1.UserContextService,
            cart_checkout_items_service_1.CartCheckoutItemsService])
    ], RefreshService);
    return RefreshService;
}());
exports.RefreshService = RefreshService;
//# sourceMappingURL=refresh.service.js.map