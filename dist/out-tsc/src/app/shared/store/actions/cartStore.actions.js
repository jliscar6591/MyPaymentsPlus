"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_CART = '[CARTSTORE] Load Cart';
exports.LOAD_CART_FAIL = '[CARTSTORE] Load Cart Fail';
exports.LOAD_CART_SUCCESS = '[CARTSTORE] Load Cart Success';
exports.CLEAR_CART = '[CARTSTORE] Clear Cart';
var LoadCart = /** @class */ (function () {
    function LoadCart() {
        this.type = exports.LOAD_CART;
    }
    return LoadCart;
}());
exports.LoadCart = LoadCart;
var LoadCartFail = /** @class */ (function () {
    function LoadCartFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_CART_FAIL;
    }
    return LoadCartFail;
}());
exports.LoadCartFail = LoadCartFail;
var LoadCartSuccess = /** @class */ (function () {
    function LoadCartSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_CART_SUCCESS;
    }
    return LoadCartSuccess;
}());
exports.LoadCartSuccess = LoadCartSuccess;
var ClearCart = /** @class */ (function () {
    function ClearCart() {
        this.type = exports.CLEAR_CART;
    }
    return ClearCart;
}());
exports.ClearCart = ClearCart;
//# sourceMappingURL=cartStore.actions.js.map