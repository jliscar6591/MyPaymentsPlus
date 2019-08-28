"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feesStore = require("../reducers/FeeStore.reducer");
var cartStore = require("../reducers/cartStore.reducer");
var mealStore = require("../reducers/mealStore.reducer");
var districMealtStore = require("../reducers/districtMealStore.reducer");
var loginStore = require("../reducers/loginStore.reducers");
var cookieStore = require("../reducers/cookieStore.reducer");
;
exports.reducers = {
    fees: feesStore.feeReducer,
    cart: cartStore.cartReducer,
    meals: mealStore.mealReducer,
    districtMeals: districMealtStore.districtMealReducer,
    loginObj: loginStore.loginReducer,
    cookieObj: cookieStore.cookieReducer
};
//# sourceMappingURL=index.js.map