'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environments/environment");
require("rxjs/add/observable/interval");
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "FroAppStatus", {
        get: function () {
            return {
                "inProcess": {
                    "value": "inprocess",
                    "display": "In Process"
                },
                "pending": {
                    "value": "pending",
                    "display": "Pending"
                },
                "processed": {
                    "value": "processed",
                    "display": "Processed"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "externalNavRequest", {
        get: function () {
            return {
                "login": "login",
                "register": "register"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "Application", {
        get: function () {
            return {
                "parent": "parent",
                "admin": "admin"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "SpinnerDelay", {
        //Spinner (ProgressCircle) minimum visibility time in seconds when SpinnerDelayIncrement is 1000
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "SpinnerDelayIncrement", {
        //Spinner (ProgressCircle) minimum visibility 1000 = 1 second
        get: function () {
            return 500;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "FroAppStartUrl", {
        //api urls
        get: function () {
            //need one of these for each api
            return {
                "FroAppStartUrl": environment_1.environment.froAppStartUrl,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "WebApiUrl", {
        //api urls
        get: function () {
            //need one of these for each api
            return {
                "Auth": environment_1.environment.apiUrl + "/auth/api",
                "Profile": environment_1.environment.apiUrl + "/profile/api",
                "Wallet": environment_1.environment.apiUrl + "/wallet/api",
                "Sale": environment_1.environment.apiUrl + "/Sale/api",
                "Xfer": environment_1.environment.apiUrl + "/Xfer/api"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "AuthCookieName", {
        get: function () {
            return 'HorizonAuthenticationCookie';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "FeedbackCookieName", {
        get: function () {
            return 'FeedbackCookie';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "Error", {
        //Use for toaster and any place that needs the key word error
        get: function () {
            return 'error';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "Success", {
        //Use for toaster and any place that needs the key word success
        get: function () {
            return 'success';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "ResetPasswordParent", {
        //Reset password application, Used by the api to reset for the parent or admin web application
        get: function () {
            return 'parent';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "ResetPasswordAdmin", {
        //Reset password application, Used by the api to reset for the parent or admin web application
        get: function () {
            return 'Admin';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "PollingInterval", {
        //Async polling interval in milliseconds
        get: function () {
            return 50;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "ParentPaymentsUrl", {
        //Redirect to parent payments page
        get: function () {
            return environment_1.environment.ParentPaymentsUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "RecaptchaKey", {
        // Recaptcha Key for Reset Password page
        get: function () {
            return environment_1.environment.RecaptchaKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "RecaptchaVerifyUrl", {
        //Recaptcha verification URL
        get: function () {
            return environment_1.environment.RecaptchaVerifyUrl;
            //Artemis server
            //Stage web server
            //Prod web server
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "PasswordPattern", {
        //Password complexity
        get: function () {
            return '^.*(?=.{7,})(?=.*\\d)(?=.*[A-Za-z]).*$';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "EmailPattern", {
        //Email validation
        get: function () {
            return "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "ZipcodePattern", {
        //Zip code validation
        get: function () {
            return "(^\\d{5}$)|(^\\d{5}-\\d{4}$)";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "BankAccountPattern", {
        //Bank Account validation
        get: function () {
            return "^\\d{5,17}$";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "RoutingPattern", {
        //Routing Number validation
        get: function () {
            return "^\\d{9}$";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "CreditCardPattern", {
        //Credit Card validation
        get: function () {
            //supported card type prefix 4,2,5 or 6
            return "^(2|3|4|5|6)[0-9]*$";
            //return "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "CardCodePattern", {
        //Card Code validation
        get: function () {
            return "^\\d{3,5}$";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "DecimalPattern", {
        //Decimal validation
        get: function () {
            return "^[0-9]*?[.]??[0-9]*$";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "EmailDuplicationMsg", {
        //Email duplication message
        get: function () {
            return "An account already exists for ";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "SelectListPattern", {
        //Select List validation
        get: function () {
            return "[a-zA-Z ]*";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "BankAccount", {
        get: function () {
            return {
                "checking": "checking",
                "savings": "savings"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "CreditCard", {
        get: function () {
            return {
                "visa": "visa",
                "mastercard": "mastercard",
                "discover": "discover",
                "card": "card"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "CartItemDefaults", {
        get: function () {
            return {
                "itemName": "Cafeteria Sales Item",
                "liteItemType": "meal"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "studentMealBalanceWarningThreshold", {
        get: function () {
            return 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "UeOptions", {
        get: function () {
            return {
                phase: 2 //Use to make the dashboard call to redirect to the old parent site
            };
        },
        enumerable: true,
        configurable: true
    });
    return Constants;
}());
exports.Constants = Constants;
//# sourceMappingURL=app.settings.js.map