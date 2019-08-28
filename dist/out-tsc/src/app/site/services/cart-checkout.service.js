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
require("rxjs/add/operator/do");
require("rxjs/add/observable/throw");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var CartCheckoutService = /** @class */ (function () {
    function CartCheckoutService(utilityService, httpC, currTokenServ, loginStoreSvc
    // private transferService: TransfersService
    ) {
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.loginStoreSvc = loginStoreSvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        this.cartProcessed = new core_1.EventEmitter();
        this.isPayPosted = false;
        this.saleProcessed = new core_1.EventEmitter();
    }
    CartCheckoutService.prototype.putCartItemNew = function (cartItemDetail, loginResponse) {
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
        var failureMessage = 'Add Cart Item Failed';
        this.loginResponse = loginResponse;
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
        var body = cartItemDetail;
        //JSON.stringify(cartItemDetail);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handlePostSalesError(error, failureMessage); })
        // ,
        // tap(data => console.log("What is Put Cart Item: ", data))
        );
    };
    CartCheckoutService.prototype.subscribeToputCartItemNew = function (cartItemDetail, loginResponse) {
        var _this = this;
        var failureMessage = 'Add Cart Item Failed';
        var successMessage = '';
        // console.log("What is the loginResponse sent to putCartItem: ", loginResponse);
        // let subscription =
        this.subscription =
            this.putCartItemNew(cartItemDetail, loginResponse)
                .subscribe(function (data) {
                _this.cartResponse = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = false;
            }, function () {
                //processing the successful response
                _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
                _this.loginResponse.messageType = app_settings_1.Constants.Success;
                _this.loginResponse.messageTitle = 'Message: ';
                _this.loginResponse.message = successMessage;
                _this.result = true;
                //console.log("What is the LoginResponse After putting Item In Cart: ", this.loginResponse);
            });
    };
    CartCheckoutService.prototype.postSaleTransactionNew = function (payment, loginResponse) {
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
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/saleTransaction'; // URL to web API
        var body = payment;
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var errHeader = {
            _body: '',
            status: ''
        };
        var headers = new http_1.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //Saving for debugging purposes
        //console.log("URL: ",Url)
        //console.log("SaleTransaction Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handlePostSalesError(error, failureMessage); })
        //  ,
        // tap(data => console.log("What is Post Sale: ", data))
        );
    };
    CartCheckoutService.prototype.subscribeToPostSaleTransactionNew = function (payment, loginResponse) {
        var _this = this;
        // console.log("subscribeToPostSaleTransactionNew - loginResponse: ", loginResponse)
        //  console.log("Do we have a Store Cookie: ", this.loginStoreSvc.cookieStateItem)
        if (loginResponse.cartItemCount == undefined) {
            loginResponse.cartItemCount = 1;
            this.loginStoreSvc.loadLogin(loginResponse);
        }
        var failureMessage = 'Transaction Failed';
        this.subscription =
            this.postSaleTransactionNew(payment, loginResponse)
                .subscribe(function (data) {
                _this.saleTransactionResponse = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, loginResponse, failureMessage);
                _this.postSaleResult = true;
                _this.saleProcessed.emit(_this.postSaleResult);
            }, function () {
                //  console.log("Does this call complete: ", loginResponse)
                _this.isPayPosted = true;
                _this.postSaleResult = true;
                _this.saleProcessed.emit(_this.postSaleResult);
                //this.subscription.unsubscribe();
            });
    };
    CartCheckoutService.prototype.getCartProcessedEvent = function () {
        // console.log("Get Cart Processed Event: ", this.cartProcessed);
        return this.cartProcessed;
    };
    CartCheckoutService.prototype.handleError = function (error, failureMessage) {
        this.result = false;
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    CartCheckoutService.prototype.handlePostSalesError = function (error, failureMessage) {
        //console.log("We got an Error: ", error);
        this.postSaleResult = false;
        this.isPayPosted = false;
        //console.log("Was pay Posted: ", this.isPayPosted);
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    CartCheckoutService.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe;
    };
    CartCheckoutService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.UtilityService,
            http_1.HttpClient,
            index_1.CurrentTokenService,
            index_1.LoginStoreService
            // private transferService: TransfersService
        ])
    ], CartCheckoutService);
    return CartCheckoutService;
}());
exports.CartCheckoutService = CartCheckoutService;
//# sourceMappingURL=cart-checkout.service.js.map