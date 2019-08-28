"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_DISTRICTMEALS = '[DISTRICTMEALSTORE] Load District Meals';
exports.LOAD_DISTRICTMEALS_FAIL = '[DISTRICTMEALSTORE] Load District Meals Fail';
exports.LOAD_DISTRICTMEALS_SUCCESS = '[DISTRICTMEALSTORE] LoadDistrict Meals Success';
exports.CLEAR_DISTRICTMEALS = '[DISTRICTMEALSTORE] Clear District Meals';
var LoadDistrictMeals = /** @class */ (function () {
    function LoadDistrictMeals() {
        this.type = exports.LOAD_DISTRICTMEALS;
    }
    return LoadDistrictMeals;
}());
exports.LoadDistrictMeals = LoadDistrictMeals;
var LoadDistrictMealsFail = /** @class */ (function () {
    function LoadDistrictMealsFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_DISTRICTMEALS_FAIL;
    }
    return LoadDistrictMealsFail;
}());
exports.LoadDistrictMealsFail = LoadDistrictMealsFail;
var LoadDistrictMealsSuccess = /** @class */ (function () {
    function LoadDistrictMealsSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_DISTRICTMEALS_SUCCESS;
    }
    return LoadDistrictMealsSuccess;
}());
exports.LoadDistrictMealsSuccess = LoadDistrictMealsSuccess;
var ClearDistrictMeals = /** @class */ (function () {
    function ClearDistrictMeals() {
        this.type = exports.CLEAR_DISTRICTMEALS;
    }
    return ClearDistrictMeals;
}());
exports.ClearDistrictMeals = ClearDistrictMeals;
//# sourceMappingURL=districtMealStore.actions.js.map