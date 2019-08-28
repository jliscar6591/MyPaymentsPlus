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
var ActivityStoreActions = require("../actions/activityStore.actions");
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function activityReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case ActivityStoreActions.LOAD_ACTIVITIES: {
            return __assign({}, state, { loading: true });
        }
        case ActivityStoreActions.LOAD_ACTIVITIES_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case ActivityStoreActions.LOAD_ACTIVITIES_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        default:
            return state;
    }
}
exports.activityReducer = activityReducer;
//# sourceMappingURL=activityStore.reducer.js.map