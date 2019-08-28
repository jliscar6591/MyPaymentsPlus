"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAD_FEES = '[FEES] Load Fees';
exports.LOAD_FEES_FAIL = '[FEES] Load Fees Fail';
exports.LOAD_FEES_SUCCESS = '[FEES] Load Fees Success';
exports.ADD_FEES_SUCCESS = '[FEES] Add Fees Success';
exports.ADD_FEES_FAIL = '[FEES] Add Fees Fail';
var LoadFees = /** @class */ (function () {
    function LoadFees() {
        this.type = exports.LOAD_FEES;
    }
    return LoadFees;
}());
exports.LoadFees = LoadFees;
var LoadFeesFail = /** @class */ (function () {
    function LoadFeesFail(payload) {
        this.payload = payload;
        this.type = exports.LOAD_FEES_FAIL;
    }
    return LoadFeesFail;
}());
exports.LoadFeesFail = LoadFeesFail;
var LoadFeesSuccess = /** @class */ (function () {
    function LoadFeesSuccess(payload) {
        this.payload = payload;
        this.type = exports.LOAD_FEES_SUCCESS;
    }
    return LoadFeesSuccess;
}());
exports.LoadFeesSuccess = LoadFeesSuccess;
var AddFeesSuccess = /** @class */ (function () {
    function AddFeesSuccess(payload) {
        this.payload = payload;
        this.type = exports.ADD_FEES_SUCCESS;
    }
    return AddFeesSuccess;
}());
exports.AddFeesSuccess = AddFeesSuccess;
var AddFeesFail = /** @class */ (function () {
    function AddFeesFail(payload) {
        this.payload = payload;
        this.type = exports.ADD_FEES_FAIL;
    }
    return AddFeesFail;
}());
exports.AddFeesFail = AddFeesFail;
//# sourceMappingURL=feeStore.actions.js.map