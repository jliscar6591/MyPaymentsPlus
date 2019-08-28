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
var DistrictMealStoreActions = require("./../actions/districtMealStore.actions");
;
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function districtMealReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case DistrictMealStoreActions.LOAD_DISTRICTMEALS: {
            return __assign({}, state, { loading: true });
        }
        case DistrictMealStoreActions.LOAD_DISTRICTMEALS_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case DistrictMealStoreActions.LOAD_DISTRICTMEALS_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case DistrictMealStoreActions.CLEAR_DISTRICTMEALS: {
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
exports.districtMealReducer = districtMealReducer;
//# sourceMappingURL=districtMealStore.reducer.js.map