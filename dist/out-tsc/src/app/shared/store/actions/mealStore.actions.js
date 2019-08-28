"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_MEALS = '[MEALSTORE] Load Meals';
exports.LOAD_MEALS_FAIL = '[MEALSTORE] Load Meals Fail';
exports.LOAD_MEALS_SUCCESS = '[MEALSTORE] Load Meals Success';
exports.CLEAR_MEALS = '[MEALSTORE] Clear Meals';
var LoadMeals = /** @class */ (function () {
    function LoadMeals() {
        this.type = exports.LOAD_MEALS;
    }
    return LoadMeals;
}());
exports.LoadMeals = LoadMeals;
var LoadMealsFail = /** @class */ (function () {
    function LoadMealsFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_MEALS_FAIL;
    }
    return LoadMealsFail;
}());
exports.LoadMealsFail = LoadMealsFail;
var LoadMealsSuccess = /** @class */ (function () {
    function LoadMealsSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_MEALS_SUCCESS;
    }
    return LoadMealsSuccess;
}());
exports.LoadMealsSuccess = LoadMealsSuccess;
var ClearMeals = /** @class */ (function () {
    function ClearMeals() {
        this.type = exports.CLEAR_MEALS;
    }
    return ClearMeals;
}());
exports.ClearMeals = ClearMeals;
//# sourceMappingURL=mealStore.actions.js.map