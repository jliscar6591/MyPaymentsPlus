"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MealStoreActions = require("./../actions/mealStore.actions");
;
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function mealReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case MealStoreActions.LOAD_MEALS: {
            return __assign({}, state, { loading: true });
        }
        case MealStoreActions.LOAD_MEALS_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case MealStoreActions.LOAD_MEALS_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case MealStoreActions.CLEAR_MEALS: {
            return {
                data: {},
                loaded: true,
                loading: false
            };
        }
        default:
            return state;
    }
}
exports.mealReducer = mealReducer;
//# sourceMappingURL=mealStore.reducer.js.map