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
var operators_1 = require("rxjs/operators");
var router_1 = require("@angular/router");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var index_1 = require("../../../site/services/index");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var index_2 = require("../../../shared/services/index");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../store/actions/cartStore.actions");
var ReceiptService = /** @class */ (function () {
    function ReceiptService(router, http, utilityService, cartCheckoutService, cartCheckoutItemsService, transferService, currTokenServ, tokenService, zone, httpC, studentMealsService, multiDistrictSvc, pageLoadingService, refreshService, store) {
        this.router = router;
        this.http = http;
        this.utilityService = utilityService;
        this.cartCheckoutService = cartCheckoutService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.transferService = transferService;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.zone = zone;
        this.httpC = httpC;
        this.studentMealsService = studentMealsService;
        this.multiDistrictSvc = multiDistrictSvc;
        this.pageLoadingService = pageLoadingService;
        this.refreshService = refreshService;
        this.store = store;
        //show receipt flag
        this.showReceipt = false;
        //True when http call returns
        this.result = false;
        this.transactions = [];
        this.receiptUpdate = new core_1.EventEmitter();
        this.clearCart = false;
        this.howManyClearCarts = 0;
        this.processedPayment = new core_1.EventEmitter();
        this.refreshDash = false;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    ReceiptService.prototype.getReceiptMod = function (confirmation, loginResponse, paymentType) {
        var _this = this;
        // console.log("Getting Receipt: ", loginResponse)
        this.receiptType = 'purchase';
        //Confirmation number is the same per transaction, just need the first one in the list
        var token = loginResponse.access_token;
        // console.log("Receipt Data token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmation;
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        // tap(data => console.log("We got Receipt Data: ", data))
        // map(data => testJwt = data['headers']),
        //tap(testJwt => console.log("Did we get any testJWt: ", testJwt))
        );
    };
    ReceiptService.prototype.subscribeGetReceipt = function (confirmation, loginResponse, paymentType) {
        var _this = this;
        var failureMessage = 'Transaction Failed';
        if (!this.result) {
            this.subscription =
                this.getReceiptMod(confirmation, loginResponse, paymentType)
                    .subscribe(function (data) {
                    // newJwt = data.headers;
                    _this.receiptDetail = data;
                    _this.result = true;
                }, function (error) {
                    _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                    _this.showReceipt = false;
                }, function () {
                    _this.transactions.push(_this.receiptDetail);
                    //console.log('transactions Length', this.transactions.length);
                    //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
                    if (_this.result == true && _this.transactions.length === _this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                        //console.log("Show receipt now: ", this.result)
                        _this.receiptUpdate.emit(true);
                        _this.processedPayment.emit(true);
                        _this.showReceipt = _this.result;
                        _this.cartCheckoutService.saleTransactionResponse.cartResults = [];
                    }
                    if (_this.receiptDetail && _this.receiptDetail.areas[0]['area'] == 'USERFEE') {
                        _this.receiptDetail['convenienceFee'] = 0;
                        _this.receiptDetail['totalAmount'] = _this.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                    }
                    // console.log("What district is getting the Receipt: ", loginResponse);
                    _this.multiDistrictSvc.processedDistrict = loginResponse.districtName;
                    //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);
                });
        }
    };
    ReceiptService.prototype.getHistoryReceiptMod = function (confirmation, loginResponse) {
        var _this = this;
        this.receiptType = 'history';
        this.receiptUpdate.emit(true);
        var confirmNum = confirmation;
        this.showReceipt = true;
        //Confirmation number is the same per transaction, just need the first one in the list
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmNum;
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        newJwt = headers.get('Authorization');
        this.loginResponse.access_token = newJwt;
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        // tap(data => console.log("We got Receipt Data: ", data))
        );
    };
    ReceiptService.prototype.subscribeToGetHistoryReceipt = function (confirmation, loginResponse) {
        var _this = this;
        var failureMessage = 'Record Not Found';
        this.getHistoryReceiptMod(confirmation, loginResponse)
            .subscribe(function (data) {
            _this.receiptDetail = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
            _this.showReceipt = false;
        }, function () {
            //processing the successful response
            _this.result = true;
            _this.transactions.push(_this.receiptDetail);
            // console.log('receipt details', this.receiptDetail);
            _this.showReceipt = true;
            if (_this.receiptDetail && _this.receiptDetail.areas[0]['area'] == 'USERFEE') {
                _this.receiptDetail['convenienceFee'] = 0;
                _this.receiptDetail['totalAmount'] = _this.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                _this.receiptDetail['bonusTotal'] = 0;
            }
        });
    };
    ReceiptService.prototype.getHistoryReceipt = function (confirmation, loginResponse) {
        var _this = this;
        this.receiptType = 'history';
        var confirmNum = confirmation;
        this.showReceipt = true;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmNum;
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.subscription = this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.receiptDetail = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
            _this.showReceipt = false;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
            if (_this.result == true) {
                _this.receiptUpdate.emit(_this.showReceipt);
            }
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    ReceiptService.prototype.displayReceipt = function () {
        return this.showReceipt;
    };
    ReceiptService.prototype.displayHistoryReceipt = function () {
        return this.showReceipt;
    };
    ReceiptService.prototype.hide = function () {
        //console.log("Go hide");
        //If the receipt was generated by a transfer we need to change the liteItemType so all other payments process correctly
        //This may be revisited as we begin to process other types of fees and payments
        if (this.transferService.feeCartItem) {
            if (this.transferService.feeCartItem.liteItemType == 'userFee') {
                this.transferService.feeCartItem['liteItemType'] = 'meal';
                this.transferService.feeCartCount = 0;
            }
        }
        this.showReceipt = false;
        //If a checkout has processed a clear cart event has occured
        if (this.cartCheckoutService.result == true) {
            this.cartCheckoutService.result = false;
            this.clearCart = true;
            this.howManyClearCarts += 1;
        }
        else {
            this.cartHasCleared();
            this.howManyClearCarts = 0;
        }
        //  this.studentMealsService.subscribeToGetMeals(this.loginResponse);
        if (!this.refreshDash) {
            this.store.dispatch(new CartStoreActions.ClearCart());
        }
        this.store.dispatch(new CartStoreActions.ClearCart());
        this.refreshService.refreshCart();
        //console.log('going to dashboard')
        this.router.navigate(['/dashboard']);
        return this.showReceipt;
    };
    ReceiptService.prototype.hideHistory = function () {
        //console.log("Go hide");
        //If the receipt was generated by a transfer we need to change the liteItemType so all other payments process correctly
        //This may be revisited as we begin to process other types of fees and payments
        if (this.transferService.feeCartItem) {
            if (this.transferService.feeCartItem.liteItemType == 'userFee') {
                this.transferService.feeCartItem['liteItemType'] = 'meal';
                this.transferService.feeCartCount = 0;
            }
        }
        this.showReceipt = false;
        //If a checkout has processed a clear cart event has occured
        if (this.cartCheckoutService.result == true) {
            this.cartCheckoutService.result = false;
            this.clearCart = true;
            this.howManyClearCarts += 1;
        }
        else {
            this.cartHasCleared();
            this.howManyClearCarts = 0;
        }
        //  this.studentMealsService.subscribeToGetMeals(this.loginResponse);
        if (!this.refreshDash) {
            this.store.dispatch(new CartStoreActions.ClearCart());
        }
        this.store.dispatch(new CartStoreActions.ClearCart());
        this.refreshService.refreshCart();
        return this.showReceipt;
    };
    ReceiptService.prototype.cartHasCleared = function () {
        this.clearCart = true;
        this.result = false;
        return this.clearCart;
    };
    ReceiptService.prototype.getReceiptUpdateEvent = function () {
        return this.receiptUpdate;
    };
    ReceiptService.prototype.goToMakeTransfer = function () {
        var _this = this;
        this.zone.run(function () { return _this.router.navigate(['/make-transfer']); });
        this.paymentType = null;
    };
    ReceiptService.prototype.openTabReceipt = function (html) {
        // console.log("did we get any HTML: ", html)
    };
    ReceiptService.prototype.handleError = function (error, failureMessage) {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    ReceiptService.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.cartCheckoutItemsService.destroy$.next(true);
        this.cartCheckoutItemsService.destroy$.unsubscribe();
        this.result = false;
        this.clearCart = false;
    };
    ReceiptService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            index_2.UtilityService,
            index_1.CartCheckoutService,
            index_1.CartCheckoutItemsService,
            index_1.TransfersService,
            index_2.CurrentTokenService,
            index_2.TokenService,
            core_1.NgZone,
            http_2.HttpClient,
            index_1.StudentMealsService,
            index_1.MultiDistrictService,
            page_loading_service_1.PageLoadingService,
            refresh_service_1.RefreshService,
            store_1.Store])
    ], ReceiptService);
    return ReceiptService;
}());
exports.ReceiptService = ReceiptService;
//# sourceMappingURL=receipt.service.js.map