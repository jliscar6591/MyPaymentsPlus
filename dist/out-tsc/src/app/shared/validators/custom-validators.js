"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomValidators = /** @class */ (function () {
    function CustomValidators() {
    }
    CustomValidators.validMoney = function (c) {
        var isValidMoney = /^\d+(?:\.\d{0,2})$/.test(c.value);
        var message = {
            'validMoney': {
                'message': 'The Entered Amount must be a number'
            }
        };
        return isValidMoney ? null : message;
    };
    CustomValidators.validTransfer = function (c, b) {
        var isValidTransfer = c.value < b.value;
        var message = {
            'validTransfer': {
                'message': 'Entered Transfer amount will result in a negative balance'
            }
        };
        return isValidTransfer ? null : message;
    };
    return CustomValidators;
}());
exports.CustomValidators = CustomValidators;
//# sourceMappingURL=custom-validators.js.map