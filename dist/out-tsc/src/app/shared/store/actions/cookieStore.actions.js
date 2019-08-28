"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_COOKIE = '[COOKIESTORE] Load Cookie';
exports.LOAD_COOKIE_FAIL = '[COOKIESTORE] Load Cookie Fail';
exports.LOAD_COOKIE_SUCCESS = '[COOKIESTORE] Load Cookie Success';
exports.CLEAR_COOKIE = '[COOKIESTORE] Clear Cookie';
var LoadCookie = /** @class */ (function () {
    function LoadCookie() {
        this.type = exports.LOAD_COOKIE;
    }
    return LoadCookie;
}());
exports.LoadCookie = LoadCookie;
var LoadCookieFail = /** @class */ (function () {
    function LoadCookieFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_COOKIE_FAIL;
    }
    return LoadCookieFail;
}());
exports.LoadCookieFail = LoadCookieFail;
var LoadCookieSuccess = /** @class */ (function () {
    function LoadCookieSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_COOKIE_SUCCESS;
    }
    return LoadCookieSuccess;
}());
exports.LoadCookieSuccess = LoadCookieSuccess;
var ClearCookie = /** @class */ (function () {
    function ClearCookie() {
        this.type = exports.CLEAR_COOKIE;
    }
    return ClearCookie;
}());
exports.ClearCookie = ClearCookie;
//# sourceMappingURL=cookieStore.actions.js.map