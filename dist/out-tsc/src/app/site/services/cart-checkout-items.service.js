"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/interval");
require("rxjs/add/operator/takeUntil");
var store_1 = require("@ngrx/store");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var CartStoreActions = require("../../shared/store/actions/cartStore.actions");
var CartCheckoutItemsService = /** @class */ (function () {
    function CartCheckoutItemsService(
    //private http: Http,
    utilityService, currTokenServ, httpC, loginStoreSvc, store, state) {
        this.utilityService = utilityService;
        this.currTokenServ = currTokenServ;
        this.httpC = httpC;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.state = state;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        //Used to let other components know when cart is updated
        this.cartUpdate = new core_1.EventEmitter();
        //Used to let other components know when cart is valid
        this.cartValid = new core_1.EventEmitter();
        this.destroy$ = new Subject_1.Subject();
        this.newCartItem$ = new core_1.EventEmitter();
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    //Returns a cartCheckoutItem
    //The cartItem will need to be set once the checkoutItem is set
    CartCheckoutItemsService.prototype.postCartCheckoutReviewItemsNew = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var successMessage = '';
        var failureMessage = 'Get Cart Checkout Items Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/checkoutSummary'; // URL to web API
        var body = JSON.stringify([{ "validationToken": '' }]);
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.currentToken,
        });
        var options = { headers: headers };
        // console.log("URL: ", Url)
        // console.log("The Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        //  tap(data => console.log("I think we got a CartCheckoutItem: ", data))
        );
    };
    //Returns a checkoutItem
    CartCheckoutItemsService.prototype.subscribeTopostCartCheckoutReviewItems = function (loginResponse) {
        var _this = this;
        // console.log("subscribeing to Post Cart Checkout Review Items")
        var loginResponseObj;
        this.isGettingCheckOutItems = true;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.postCartCheckoutReviewItemsNew(loginResponseObj)
            .subscribe(function (data) {
            _this.checkOutItem = data;
        }, function (error) {
            // console.log("Error: No Checkout Item: ", this.checkOutItem);
            if (_this.checkOutItem) {
                _this.loginStoreSvc.loadLogin(_this.loginResponse);
                _this.isGettingCheckOutItems = _this.checkOutItem.merchants.length > 0;
                _this.checkoutResults = true;
                _this.cartUpdate.emit(true);
            }
            else {
                _this.checkoutResults = false;
            }
        }, function () {
            _this.loginStoreSvc.loadLogin(_this.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            _this.isGettingCheckOutItems = _this.checkOutItem.merchants.length > 0;
            _this.checkoutResults = true;
            _this.cartUpdate.emit(true);
        });
    };
    //Returns a Cart Item
    CartCheckoutItemsService.prototype.getCartCheckoutCartItem = function (loginResponse) {
        // console.log("Did we get a loginResponse: ", loginResponse)
        // console.log("Did we get a accesToken: ", loginResponse.access_token)
        // console.log("Do we have the loginSrvc: ", this.loginStoreSvc.fixedLoginResponse)
        var _this = this;
        if (this.loginStoreSvc.fixedLoginResponse) {
            this.loginResponse = this.loginStoreSvc.fixedLoginResponse;
        }
        else {
            this.loginResponse = loginResponse;
        }
        var token = this.loginResponse.access_token;
        this.currentToken = token;
        // console.log("this.currentToken: ", this.currentToken)
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        //console.log("final currentToken: ", this.currentToken)
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var successMessage = '';
        var failureMessage = 'Get Student Meals Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/Cart'; // URL to web API
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        //tap(data => console.log("I think we got CartcheckoutCartItems: ", data))
        );
    };
    CartCheckoutItemsService.prototype.subscribeToGetCartCheckoutCartItem = function (loginResponse) {
        var _this = this;
        //console.log("subscribeToGetCartcheckoutCartItem")
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        // console.log("The loginResponseObj: ", loginResponseObj);
        this.getCartCheckoutCartItem(loginResponseObj)
            //.takeUntil(this.destroy$)
            .subscribe(function (data) {
            _this.cartItem = data;
        }, function (error) {
            console.log("Error: No Transfer Account: ", error);
            _this.cartResults = false;
        }, function () {
            _this.cartResults = true;
            if (_this.cartStateItems) {
                _this.store.dispatch(new CartStoreActions.ClearCart());
            }
            if (_this.cartItem) {
                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartItem));
                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                // console.log("do we have a cartItem: ", this.cartState)
                if (_this.cartState) {
                    _this.cartStateItems = _this.cartState.data.items;
                    //console.log("cartStateItems: ", this.cartStateItems)
                }
            }
        });
    };
    CartCheckoutItemsService.prototype.updateCartCheckoutItemsNew = function (cartItems, loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Updating Cart Failed';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/Cart';
        var body = JSON.stringify(cartItems);
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        //tap(data => console.log("I think we got CartcheckoutCartItems: ", data))
        );
    };
    CartCheckoutItemsService.prototype.subscribeToUpdateCartCheckOutItemsNew = function (cartItems, loginResponse) {
        var _this = this;
        //console.log("subscribeToUpdateCartCheckoutItem: ", cartItems)
        var loginResponseObj;
        var failureMessage = 'Updating Cart Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.updateCart$ = this.updateCartCheckoutItemsNew(cartItems, loginResponse)
            .subscribe(function (data) {
            _this.cartItem = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.cartResults = true;
        }, function () {
            //processing the successful response
            _this.cartResults = true;
            _this.cartUpdate.emit(true);
            _this.newCartItem$.emit(true);
        });
    };
    CartCheckoutItemsService.prototype.cartValidity = function (valid) {
        //console.log("calling cartValidity")
        this.cartValid.emit(valid);
    };
    CartCheckoutItemsService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    CartCheckoutItemsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.UtilityService,
            index_1.CurrentTokenService,
            http_1.HttpClient,
            index_1.LoginStoreService,
            store_1.Store,
            store_1.State])
    ], CartCheckoutItemsService);
    return CartCheckoutItemsService;
}());
exports.CartCheckoutItemsService = CartCheckoutItemsService;
//# sourceMappingURL=cart-checkout-items.service.js.map