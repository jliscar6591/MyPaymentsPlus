"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_LOGIN = '[LOGINSTORE] Load Login';
exports.LOAD_LOGIN_FAIL = '[LOGINSTORE] Load Login Fail';
exports.LOAD_LOGIN_SUCCESS = '[LOGINSTORE] Load Login Success';
exports.CLEAR_LOGIN = '[LOGINSTORE] Clear Login';
var LoadLogin = /** @class */ (function () {
    function LoadLogin() {
        this.type = exports.LOAD_LOGIN;
    }
    return LoadLogin;
}());
exports.LoadLogin = LoadLogin;
var LoadLoginFail = /** @class */ (function () {
    function LoadLoginFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_LOGIN_FAIL;
    }
    return LoadLoginFail;
}());
exports.LoadLoginFail = LoadLoginFail;
var LoadLoginSuccess = /** @class */ (function () {
    function LoadLoginSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_LOGIN_SUCCESS;
    }
    return LoadLoginSuccess;
}());
exports.LoadLoginSuccess = LoadLoginSuccess;
var ClearLogin = /** @class */ (function () {
    function ClearLogin() {
        this.type = exports.CLEAR_LOGIN;
    }
    return ClearLogin;
}());
exports.ClearLogin = ClearLogin;
//# sourceMappingURL=loginStore.actions.js.map