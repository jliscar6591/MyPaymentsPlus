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
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var refresh_service_1 = require("../../shared/services/refresh.service");
var AddCartItemService = /** @class */ (function () {
    function AddCartItemService(http, utilityService, httpC, currTokenServ, cookieService, refreshService, tokenService, loginStoreSvc) {
        this.http = http;
        this.utilityService = utilityService;
        this.httpC = httpC;
        this.currTokenServ = currTokenServ;
        this.cookieService = cookieService;
        this.refreshService = refreshService;
        this.tokenService = tokenService;
        this.loginStoreSvc = loginStoreSvc;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
        //Used to let other components know when cart is updated
        this.cartUpdate = new core_1.EventEmitter();
        this.itemRemoved = false;
        this.deleteResult = false;
        this.addedToCart = false;
        this.feeDialog = false;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ////Creates a Meal Item to be added to the cart
    AddCartItemService.prototype.preProcessAddAmount = function (cartItem, accountBalanceID, studentName) {
        var cartItemDetail = {
            liteItemType: app_settings_1.Constants.CartItemDefaults.liteItemType,
            itemKey: null,
            districtKey: this.loginResponse.districtKey,
            accountBalanceID: accountBalanceID,
            itemName: cartItem.categoryName,
            itemAmount: parseFloat(cartItem.addAmount),
            amountInCart: parseFloat(cartItem.addAmount),
            mealCategoryKey: cartItem.categoryKey,
            studentName: studentName,
            extendedAmount: 0,
            netAmount: 0,
            categoryName: cartItem.categoryName,
            bonusAmount: 5,
            minimumPayment: null,
            isPartialPayEligible: null,
            quantity: null,
            isQuantity: null,
            formResponse: null,
            activityFormId: null,
            s3UriFull: null,
            s3URIThumb: null,
            isAutoEnrolled: null,
            amountRemaining: null
        };
        this.broadCastCartItem(cartItemDetail);
        return cartItemDetail;
    };
    //Emits the CartItemDetail to SiteHome to help track changes to the cart count
    AddCartItemService.prototype.broadCastCartItem = function (cartItemDetail) {
        this.broadCastDetail = cartItemDetail;
        return this.broadCastDetail;
    };
    //Creates a FeeItem to be added to the cart
    AddCartItemService.prototype.preProcessAddFeeAmount = function (cartItem, studentKey, name) {
        //console.log('is this being called');
        var cartFeeDetail = {
            liteItemType: 'fee',
            itemKey: cartItem.feeTransactionKey,
            districtKey: this.loginResponse.districtKey,
            accountBalanceID: studentKey,
            itemName: cartItem.feeName,
            itemAmount: cartItem.amount,
            amountInCart: cartItem.amountInCart,
            amountToPay: cartItem.amount - cartItem.amountInCart,
            studentName: name,
            isPartialPayEligible: cartItem.supportsPartialPay,
            partialPayDue: cartItem.partialPayDue,
            minimumPayment: cartItem.minimumPayment
        };
        this.broadCastCartFeeItem(cartFeeDetail);
        return cartFeeDetail;
    };
    AddCartItemService.prototype.broadCastCartFeeItem = function (cartFeeDetail) {
        this.broadCastDetail = cartFeeDetail;
        return this.broadCastDetail;
    };
    AddCartItemService.prototype.preProcessActivityAddAmount = function (cartItem, studentKey, studentName) {
        var cartActivityDetail = {
            liteItemType: 'activity',
            itemKey: cartItem.activityKey,
            districtKey: this.loginResponse.districtKey,
            accountBalanceID: cartItem.studentKey,
            itemName: cartItem.activityName,
            itemAmount: cartItem.amount,
            studentName: cartItem.studentName,
            isPartialPayEligible: cartItem.isPartialPay,
            partialPayDue: cartItem.partialPayDue,
            minimumPayment: cartItem.minimumPayment,
            amountInCart: cartItem.amountInCart,
            quantity: cartItem.quantity,
            formResponse: cartItem.formResponse,
            activityFormId: cartItem.activityFormId,
        };
        this.broadCastCartActivityItem(cartActivityDetail);
        return cartActivityDetail;
    };
    AddCartItemService.prototype.broadCastCartActivityItem = function (cartActivityDetail) {
        this.broadCastDetail = cartActivityDetail;
        return this.broadCastDetail;
    };
    AddCartItemService.prototype.putCartItemNew = function (account, params, loginResponse) {
        var _this = this;
        //console.log("Putting Cart in Item: ", loginResponse)
        var i = params.outsideIndex;
        var j = params.insideIndex;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Add Cart Item Failed';
        var errHeader = {
            _body: '',
            status: ''
        };
        //Map to add cart Put signature
        var cartItemDetail = this.preProcessAddAmount(account[i].mealAccounts[j], account[i].accountBalanceID, account[i].firstName);
        var token = loginResponse.access_token;
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
        var body = JSON.stringify(cartItemDetail);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        //console.log("The Url: ", Url)
        //console.log("Da Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); }), operators_1.tap(function (data) { return _this.cartResponse = data; }));
    };
    //called by Fee details when you add a fee to cart
    AddCartItemService.prototype.putCartFeeNew = function (account, params, loginResponse) {
        var _this = this;
        var newJwt;
        var i = params.outsideIndex;
        var j = params.insideIndex;
        this.loginResponse = loginResponse;
        //Map to add cart Put signature
        var cartFeeDetail = this.preProcessAddFeeAmount(account.fees[j], account.studentKey, account.name);
        //console.log('cart fee detail ', cartFeeDetail);
        var token = this.loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Add Cart Item Failed';
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
        var body = JSON.stringify(cartFeeDetail);
        var headers = new http_1.Headers({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        this.http.put(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.cartResponse = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
            _this.count = _this.loginResponse.cartItemCount;
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
            _this.cartUpdate.emit(true);
            //console.log('cartResponse', this.cartResponse);
        });
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    AddCartItemService.prototype.putCartActivityNew = function (account, loginResponse) {
        var _this = this;
        // console.log('account', account);
        // console.log('is in cart', account.isInCart);
        // account.amountInCart = account.amount;
        if (!account.isInCart) {
            //console.log("Putting Activity in cart")
            this.loginResponse = loginResponse;
            var cartActivityDetail = this.preProcessActivityAddAmount(account, account.studentKey, account.studentName);
            var token = loginResponse.access_token;
            this.currentToken = token;
            var successMessage = '';
            var failureMessage_1 = 'Add Cart Item Failed';
            var errHeader = {
                _body: '',
                status: ''
            };
            this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
            var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
            var body = JSON.stringify(cartActivityDetail);
            var headers = new http_2.HttpHeaders({
                'Content-Type': 'application/JSON',
                'Authorization': 'bearer ' + token
            });
            var options = { headers: headers };
            return this.httpC.put(Url, body, options)
                .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage_1); }), operators_1.tap(function (data) { return _this.cartResponse = data; }));
        }
        else {
            //console.log("Putting Activity in cart")
            this.loginResponse = loginResponse;
            var cartActivityDetail = this.preProcessActivityAddAmount(account, account.studentKey, account.studentName);
            var token = loginResponse.access_token;
            this.currentToken = token;
            var successMessage = '';
            var failureMessage_2 = 'Add Cart Item Failed';
            var errHeader = {
                _body: '',
                status: ''
            };
            this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
            var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
            var body = JSON.stringify(cartActivityDetail);
            //console.log('body on activity api call', body);
            var headers = new http_2.HttpHeaders({
                'Content-Type': 'application/JSON',
                'Authorization': 'bearer ' + token
            });
            var options = { headers: headers };
            return this.httpC.put(Url, body, options)
                .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage_2); }), operators_1.map(function (data) {
                if (!data) {
                    console.log("NO item Added: ", data);
                }
            }), operators_1.tap(function (data) { return _this.cartResponse = data; }));
        }
    };
    //Add multiple items at once to cart
    AddCartItemService.prototype.putCartGroupNew = function (group, loginResponse) {
        var _this = this;
        var newJwt;
        //console.log('group', group);
        this.cartGroupDetail = [];
        //console.log("Putting Group in cart")
        this.loginResponse = loginResponse;
        var i;
        for (i = 0; i < group.length; i++) {
            if (group[i].feeTransactionKey) {
                var cartFeeDetail = this.preProcessAddFeeAmount(group[i], group[i].studentKey, group[i].name);
                if (cartFeeDetail !== undefined) {
                    this.cartGroupDetail.push(cartFeeDetail);
                }
            }
            else if (group[i].activityKey) {
                var cartActivityDetail = this.preProcessActivityAddAmount(group[i], group[i].studentKey, group[i].studentName);
                if (cartActivityDetail !== undefined) {
                    cartActivityDetail.formResponse = [];
                    this.cartGroupDetail.push(cartActivityDetail);
                }
            }
        }
        //console.log('cartGroupDetail', this.cartGroupDetail);
        var token = loginResponse.access_token;
        this.currentToken = token;
        var successMessage = '';
        var failureMessage = 'Add Cart Item Failed';
        var errHeader = {
            _body: '',
            status: ''
        };
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/Cart';
        var body = JSON.stringify(this.cartGroupDetail);
        //console.log('body on activity api call', body);
        var headers = new http_1.Headers({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        this.http.post(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.cartResponse = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
            _this.count = _this.loginResponse.cartItemCount;
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
            //console.log('cartResponse', this.cartResponse);
        });
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    AddCartItemService.prototype.subscribeToPostCartGroup = function (group, loginResponse) {
        var _this = this;
        var failureMessage = 'Transaction Failed';
        if (this.result === true) {
            this.result = false;
        }
        this.subscription =
            this.putCartGroupNew(group, loginResponse)
                .subscribe(function (data) {
                _this.cartResponse = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = false;
            }, function () {
                //processing the successful response
                _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
                _this.count = _this.loginResponse.cartItemCount;
                _this.result = true;
                //console.log("The this.addCartItemService.result is: ", this.result);
                //console.log('cartResponse', this.cartResponse);
            });
    };
    AddCartItemService.prototype.deleteCartItemNew = function (itemKey, accountBalanceId, loginResponse) {
        var _this = this;
        var newJwt;
        //console.log("Delete Cart Item New")
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Remove Cart Item Failed';
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem/Delete';
        var body = {
            'itemKey': itemKey,
            'accountBalanceId': accountBalanceId
        };
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        //console.log('url for api', Url);
        //console.log('body for delete', body);
        var headers = new http_1.Headers({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        this.http.post(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.cartResponse = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
            _this.count = _this.loginResponse.cartItemCount;
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.deleteResult = true;
            _this.result = true;
            //this.cartUpdate.emit(true);
            _this.itemRemoved = true;
            //console.log('cartResponse', this.cartResponse);
        });
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    AddCartItemService.prototype.subscribeTodeleteCartItemNew = function (itemKey, accountBalanceID, loginResponse) {
        var _this = this;
        var failureMessage = 'Transaction Failed';
        if (this.result === true) {
            this.result = false;
        }
        this.subscription =
            this.deleteCartItemNew(itemKey, accountBalanceID, loginResponse)
                .subscribe(function (data) {
                _this.cartResponse = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = false;
            }, function () {
                //processing the successful response
                _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
                _this.count = _this.loginResponse.cartItemCount;
                _this.deleteResult = true;
                // console.log("do we have a deleteResult: ", this.deleteResult);
                _this.result = true;
                //console.log("The this.addCartItemService.result is: ", this.result);
                _this.cartUpdate.emit(true);
                _this.itemRemoved = true;
                //console.log('cartResponse', this.cartResponse);
            });
    };
    AddCartItemService.prototype.putCartFeeItem = function (cartFeeDetails, loginResponse) {
        var _this = this;
        // console.log("Put cart Fee Item Details: ", cartFeeDetails);
        this.loginResponse = loginResponse;
        var newJwt;
        var token = loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Add Cart Item Failed';
        this.loginResponse = loginResponse;
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
        var body = JSON.stringify(cartFeeDetails);
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.put(Url, body, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.cartResponse = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
            _this.cartUpdate.emit(true);
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    AddCartItemService.prototype.putTransferFeeItem = function (cartFeeDetails, loginResponse) {
        //
        var _this = this;
        // console.log("putTransferFeeItem Login Resp: ", loginResponse);
        var failureMessage = 'Add Cart Item Failed';
        var token = loginResponse.access_token;
        this.currentToken = token;
        //console.log("This.CurrentToken: ", this.currentToken);
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var errHeader = {
            _body: '',
            status: ''
        };
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/CartItem';
        var body = JSON.stringify(cartFeeDetails);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //console.log("URL: ", Url)
        // console.log("CartItem Body: ", body)
        //console.log("Options: ", options)
        return this.httpC.put(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        // tap(data => console.log("I think we added a Cart Item: ", data))
        );
    };
    AddCartItemService.prototype.subscribeToPutTransferFee = function (cartFeeDetails, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var successMessage = '';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.putTransferFeeItem(cartFeeDetails, loginResponseObj)
            .subscribe(function (data) {
            _this.cartResponse = data;
            _this.feeCartResponse = data;
        }, function (error) {
            //console.log("Error: Failed to Add Item: ", this.feeCartResponse);
            _this.result = true;
        }, function () {
            loginResponseObj.cartItemCount = _this.feeCartResponse.itemCount;
            loginResponseObj.messageType = app_settings_1.Constants.Success;
            loginResponseObj.messageTitle = 'Message: ';
            loginResponseObj.message = successMessage;
            _this.loginResponse = loginResponseObj;
            _this.loginStoreSvc.loadLogin(_this.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            _this.result = true;
            _this.cartUpdate.emit(true);
        });
    };
    AddCartItemService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    AddCartItemService.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    AddCartItemService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            http_2.HttpClient,
            index_1.CurrentTokenService,
            index_1.CookieService,
            refresh_service_1.RefreshService,
            index_1.TokenService,
            index_1.LoginStoreService])
    ], AddCartItemService);
    return AddCartItemService;
}());
exports.AddCartItemService = AddCartItemService;
//# sourceMappingURL=add-cart-item.service.js.map