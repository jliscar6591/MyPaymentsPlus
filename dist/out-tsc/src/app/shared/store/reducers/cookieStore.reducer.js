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
var CookieStoreActions = require("../actions/cookieStore.actions");
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function cookieReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case CookieStoreActions.LOAD_COOKIE: {
            return __assign({}, state, { loaded: false, loading: true });
        }
        case CookieStoreActions.LOAD_COOKIE_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case CookieStoreActions.LOAD_COOKIE_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case CookieStoreActions.CLEAR_COOKIE: {
            return {
                data: {},
                loaded: true,
                loading: false
            };
        }
    }
}
exports.cookieReducer = cookieReducer;
//# sourceMappingURL=cookieStore.reducer.js.map