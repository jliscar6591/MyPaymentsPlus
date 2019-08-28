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
var FeeStoreActions = require("./../actions/feeStore.actions");
;
exports.initialState = {
    data: [],
    loaded: false,
    loading: false
};
function feeReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case FeeStoreActions.LOAD_FEES: {
            return {
                data: [],
                loading: true,
                loaded: false
            };
        }
        case FeeStoreActions.LOAD_FEES_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case FeeStoreActions.LOAD_FEES_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case FeeStoreActions.ADD_FEES_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case FeeStoreActions.ADD_FEES_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        default:
            return state;
    }
}
exports.feeReducer = feeReducer;
//# sourceMappingURL=FeeStore.reducer.js.map