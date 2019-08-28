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
var CartStoreActions = require("./../actions/cartStore.actions");
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function cartReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case CartStoreActions.LOAD_CART:
            return __assign({}, state, { loaded: false, loading: true });
        case CartStoreActions.LOAD_CART_SUCCESS:
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        case CartStoreActions.LOAD_CART_FAIL:
            return __assign({}, state, { loading: false, loaded: false });
        case CartStoreActions.CLEAR_CART: {
            return {
                data: {},
                loaded: true,
                loading: false
            };
        }
    }
}
exports.cartReducer = cartReducer;
//# sourceMappingURL=cartStore.reducer.js.map