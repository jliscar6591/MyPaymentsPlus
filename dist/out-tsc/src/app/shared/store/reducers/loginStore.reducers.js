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
var LoginStoreActions = require("../actions/loginStore.actions");
exports.initialState = {
    data: {},
    loaded: false,
    loading: false
};
function loginReducer(state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case LoginStoreActions.LOAD_LOGIN: {
            return __assign({}, state, { loaded: false, loading: true });
        }
        case LoginStoreActions.LOAD_LOGIN_SUCCESS: {
            return {
                data: action.payload,
                loading: false,
                loaded: true
            };
        }
        case LoginStoreActions.LOAD_LOGIN_FAIL: {
            return __assign({}, state, { loading: false, loaded: false });
        }
        case LoginStoreActions.CLEAR_LOGIN: {
            return {
                data: {},
                loaded: true,
                loading: false
            };
        }
    }
}
exports.loginReducer = loginReducer;
//# sourceMappingURL=loginStore.reducers.js.map