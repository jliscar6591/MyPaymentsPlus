'use strict';
import { ApplicationModel, ApiUrlModel, UeOptionsModel } from "./shared/model/index";
import { environment } from "../environments/environment"
import 'rxjs/add/observable/interval';

export class Constants {
    public static get FroAppStatus() {
        return {
            "inProcess":
            {
                "value": "inprocess",
                "display": "In Process"
            },
            "pending":
            {
                "value": "pending",
                "display":"Pending"
            },
            "processed":
            {
                "value": "processed",
                "display": "Processed"
            }
        };
    }

    public static get externalNavRequest() {
        return {
            "login": "login",
            "register":"register"
        }
    }

    public static get Application(): ApplicationModel {
        return {
            "parent": "parent",
            "admin": "admin"
        };
    }

    //Spinner (ProgressCircle) minimum visibility time in seconds when SpinnerDelayIncrement is 1000
    public static get SpinnerDelay(): number {
        return 1;
    }

    //Spinner (ProgressCircle) minimum visibility 1000 = 1 second
    public static get SpinnerDelayIncrement(): number {
        return 500;
    }


    //api urls
    public static get FroAppStartUrl() {
        //need one of these for each api
        return {
            "FroAppStartUrl": environment.froAppStartUrl,
        };
    }


    //api urls
    public static get WebApiUrl(): ApiUrlModel {
        //need one of these for each api
        return {
            "Auth": environment.apiUrl + "/auth/api",
            "Profile": environment.apiUrl + "/profile/api",
            "Wallet": environment.apiUrl + "/wallet/api",
            "Sale": environment.apiUrl + "/Sale/api",
            "Xfer": environment.apiUrl + "/Xfer/api"
        };
    }

    public static get AuthCookieName(): string {
        return 'HorizonAuthenticationCookie';
    }

    public static get FeedbackCookieName(): string {
        return 'FeedbackCookie';
    }


    //Use for toaster and any place that needs the key word error
    public static get Error(): string {
        return 'error';
    }

    //Use for toaster and any place that needs the key word success
    public static get Success(): string {
        return 'success';
    }

    //Reset password application, Used by the api to reset for the parent or admin web application
    public static get ResetPasswordParent(): string {
        return 'parent';
    }

    //Reset password application, Used by the api to reset for the parent or admin web application
    public static get ResetPasswordAdmin(): string {
        return 'Admin';
    }

    //Async polling interval in milliseconds
    public static get PollingInterval(): number {
        return 50;
    }


    //Redirect to parent payments page
    public static get ParentPaymentsUrl(): string {
            return environment.ParentPaymentsUrl;
    }

    // Recaptcha Key for Reset Password page
    public static get RecaptchaKey(): string {
        return environment.RecaptchaKey;
    }

    //Recaptcha verification URL
    public static get RecaptchaVerifyUrl(): string {
        return environment.RecaptchaVerifyUrl;
        //Artemis server
        //Stage web server
        //Prod web server
    }

    //Password complexity
    public static get PasswordPattern(): string {
        return '^.*(?=.{7,})(?=.*\\d)(?=.*[A-Za-z]).*$';
    }

    //Email validation
    public static get EmailPattern(): string {
        return "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}";
    }

    //Zip code validation
    public static get ZipcodePattern(): string {
        return "(^\\d{5}$)|(^\\d{5}-\\d{4}$)";
    }

    //Bank Account validation
    public static get BankAccountPattern(): string {
        return "^\\d{5,17}$";
    }

    //Routing Number validation
    public static get RoutingPattern(): string {
        return "^\\d{9}$";
    }

    //Credit Card validation
    public static get CreditCardPattern(): string {
        //supported card type prefix 4,2,5 or 6
        return "^(2|3|4|5|6)[0-9]*$";
        //return "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$";
    }

    //Card Code validation
    public static get CardCodePattern(): string {
        return "^\\d{3,5}$";
    }

    //Decimal validation
    public static get DecimalPattern(): string {
        return "^[0-9]*?[.]??[0-9]*$";
    }

    //Email duplication message
    public static get EmailDuplicationMsg(): string {
        return "An account already exists for ";
    }

  //Select List validation
    public static get SelectListPattern(): string {
      return "[a-zA-Z ]*";
    }


    public static get BankAccount(): any {
        return {
            "checking": "checking",
            "savings": "savings"
        };
    }

    public static get CreditCard(): any {
        return {
            "visa": "visa",
            "mastercard": "mastercard",
            "discover": "discover",
            "card": "card"
        };
    }
    public static get CartItemDefaults(): any {
        return {
            "itemName": "Cafeteria Sales Item",
            "liteItemType": "meal"
        };
    }
    public static get studentMealBalanceWarningThreshold(): number {
        return 5;
    }

    public static get UeOptions(): UeOptionsModel {
        return {
            phase: 2 //Use to make the dashboard call to redirect to the old parent site
        };
    }
}















