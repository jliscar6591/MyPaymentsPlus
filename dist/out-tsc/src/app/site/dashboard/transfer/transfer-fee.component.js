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
var router_1 = require("@angular/router");
var index_1 = require("../../services/index");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var index_2 = require("../../../shared/services/index");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var TransferFeeComponent = /** @class */ (function () {
    function TransferFeeComponent(router, transferService, validateCookie, cartCheckoutItmServc, receiptService, utilityService, cookieService, messageProcessorService, loginStoreSrvc, store, state) {
        this.router = router;
        this.transferService = transferService;
        this.validateCookie = validateCookie;
        this.cartCheckoutItmServc = cartCheckoutItmServc;
        this.receiptService = receiptService;
        this.utilityService = utilityService;
        this.cookieService = cookieService;
        this.messageProcessorService = messageProcessorService;
        this.loginStoreSrvc = loginStoreSrvc;
        this.store = store;
        this.state = state;
        this.addCartItemDesktop = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        this.getTransferErr = false;
        this.hasTransferInfo = true;
        this.stopChecking = false;
        this.cartCallCount = 0;
        this.throwTransferFeeError = false;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    TransferFeeComponent.prototype.ngOnInit = function () {
        this.hasPaidTransFee = true;
        this.isValid = false;
        this.throwTransferFeeError = false;
        this.setExpirationDate();
        this.getGuestAccoount();
        this.getTransferUserInfo();
        this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.loginResponse);
    };
    //ngDoCheck() {
    //  if (this.cartCheckoutItmServc.cartResults && this.stopChecking == false ) {
    //    this.stopChecking = true;
    //  }
    //}
    TransferFeeComponent.prototype.getGuestAccoount = function () {
        //console.log("Calling 65 Guest Account"); 
        this.transferService.subscribeTogetTransferAccount(this.loginResponse);
    };
    TransferFeeComponent.prototype.btnClick = function () {
        this.router.navigateByUrl('/dashboard');
    };
    TransferFeeComponent.prototype.isTransferPaid = function () {
        if (this.hasPaidTransFee === true) {
            return false;
        }
        else {
            return true;
        }
    };
    TransferFeeComponent.prototype.setExpirationDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear() + 1;
        //Sets the expiration date back one day if the current date is 02/29/XXXX of a leap year
        if (dd == 29 && mm == 2) {
            dd = dd - 1;
        }
        if (dd < 10) {
            var x = '0' + dd;
            dd = parseInt(x);
        }
        if (mm < 10) {
            var x = '0' + mm;
            mm = parseInt(x);
        }
        this.feeExpiresDate = mm + '/' + dd + '/' + yyyy;
        return this.feeExpiresDate;
    };
    TransferFeeComponent.prototype.feeAccepted = function () {
        // console.log("You accepted the fee");
        var _this = this;
        if (this.isValid == true) {
            this.isValid = false;
        }
        else {
            this.isValid = true;
        }
        if (this.receiptService.howManyClearCarts = 1) {
            this.receiptService.howManyClearCarts = 0;
        }
        console.log(this.cartCheckoutItmServc.cartItem.items.length);
        console.log(this.throwTransferFeeError);
        if (this.cartCheckoutItmServc.cartItem.items.length > 0 && this.throwTransferFeeError === false) {
            console.log('does this happen when i click the3 yes button');
            this.throwTransferFeeError = true;
        }
        else if (this.throwTransferFeeError === true) {
            console.log('does this happen when i click the yes button');
            this.throwTransferFeeError = false;
            this.transferService.addFeeToCart(this.transferService.transferAccount, this.transferService.districtXferFeeObj);
            this.updateCart();
            if (this.transferService.feeCartItem) {
                this.cartFeeInterval = window.setInterval(function () {
                    if (_this.transferService.transferFeeCartItem) {
                        _this.cartStore.subscribe(function (c) { return _this.tempCartState = c; });
                        if (_this.tempCartState) {
                            _this.cartState = _this.tempCartState.data;
                            if (_this.cartState && !_this.cartState.items) {
                                var temptState = void 0;
                                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.transferService.transferFeeCartItem));
                                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                temptState = _this.cartState;
                                _this.transferService.transferFeeCartItem = temptState.data;
                            }
                        }
                        else {
                            var temptState = void 0;
                            _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.transferService.transferFeeCartItem));
                            _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                            temptState = _this.cartState;
                            _this.transferService.transferFeeCartItem = temptState.data;
                        }
                    }
                    else {
                        var temptState = void 0;
                        _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                        if (_this.cartState) {
                            temptState = _this.cartState;
                            _this.transferService.transferFeeCartItem = temptState.data;
                        }
                    }
                    window.clearInterval(_this.cartFeeInterval);
                }, 2000);
            }
        }
        else if (this.cartCheckoutItmServc.cartItem.items.length === 0 && this.throwTransferFeeError === false) {
            console.log('does this happen when i click the yes button');
            this.throwTransferFeeError = false;
            this.transferService.addFeeToCart(this.transferService.transferAccount, this.transferService.districtXferFeeObj);
            this.updateCart();
            if (this.transferService.feeCartItem) {
                this.cartFeeInterval = window.setInterval(function () {
                    if (_this.transferService.transferFeeCartItem) {
                        _this.cartStore.subscribe(function (c) { return _this.tempCartState = c; });
                        if (_this.tempCartState) {
                            _this.cartState = _this.tempCartState.data;
                            if (_this.cartState && !_this.cartState.items) {
                                var temptState = void 0;
                                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.transferService.transferFeeCartItem));
                                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                temptState = _this.cartState;
                                _this.transferService.transferFeeCartItem = temptState.data;
                            }
                        }
                        else {
                            var temptState = void 0;
                            _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.transferService.transferFeeCartItem));
                            _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                            temptState = _this.cartState;
                            _this.transferService.transferFeeCartItem = temptState.data;
                        }
                    }
                    else {
                        var temptState = void 0;
                        _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                        if (_this.cartState) {
                            temptState = _this.cartState;
                            _this.transferService.transferFeeCartItem = temptState.data;
                        }
                    }
                    window.clearInterval(_this.cartFeeInterval);
                }, 2000);
            }
            return this.isValid;
        }
    };
    TransferFeeComponent.prototype.updateCart = function () {
        this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.transferService.requestLogModel);
        this.goCheckout();
    };
    TransferFeeComponent.prototype.goCheckout = function () {
        var _this = this;
        // console.log("GO Go checkout");
        var i = this.transferService.feeIndex;
        var j = this.transferService.feeIndex;
        this.addCartItemDesktop.emit({
            valid: true,
            outsideIndex: i,
            insideIndex: j
        });
        this.loginResponse.cartItemCount = 1;
        this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.transferService.requestLogModel);
        this.cartCheckoutItmServc.subscribeTopostCartCheckoutReviewItems(this.transferService.requestLogModel);
        this.hasPaidTransFee = this.isTransferPaid();
        this.checkCartResults = window.setInterval(function () { return _this.goToCheckOut(); }, 3000);
    };
    TransferFeeComponent.prototype.goToCheckOut = function () {
        if (this.cartCheckoutItmServc.cartResults) {
            window.clearInterval(this.checkCartResults);
            this.router.navigate(['/checkout']);
        }
    };
    //Retrieves the User Transfer Fee Info and sets the transferFee price
    TransferFeeComponent.prototype.getTransferUserInfo = function () {
        var _this = this;
        this.transferService.subscribeTogetTransferUserFee(this.loginResponse);
        var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
        seconds.subscribe(function (x) {
            if (x == 1) {
                _this.xFerAccountInfo = _this.transferService.districtXferFeeObj;
                if (_this.xFerAccountInfo) {
                    _this.transferFeePrice = _this.xFerAccountInfo.price;
                }
            }
        });
    };
    TransferFeeComponent.prototype.getGuestAccount = function () {
        var _this = this;
        //console.log("Calling 207 Gurest Account");
        var subscription = this.transferService.getTransferAccount(this.loginResponse)
            .subscribe(function () {
            if (_this.transferService.result == true) {
                subscription.unsubscribe();
                if (_this.transferService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getTransferErrMsg = _this.transferService.loginResponse.message;
                    _this.getTransferErr = true;
                    _this.utilityService.clearErrorMessage(_this.transferService.loginResponse);
                }
                else {
                    _this.loginStoreSrvc.loadLogin(_this.transferService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.transferService.loginResponse);
                    if (_this.transferService.availableAccount == undefined) {
                        _this.hasTransferInfo = false;
                    }
                    else if (_this.transferService.availableAccount) {
                        //   let gAccountTest = this.transferService.availableAccount;
                        _this.hasTransferInfo = true;
                    }
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == 1) {
                            _this.hasPaidTransFee = false;
                        }
                        _this.guestAccount = _this.transferService.availableAccount;
                    });
                }
            }
        });
    };
    TransferFeeComponent.prototype.ngOnDestroy = function () {
        this.stopChecking = false;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], TransferFeeComponent.prototype, "addCartItemDesktop", void 0);
    TransferFeeComponent = __decorate([
        core_1.Component({
            selector: 'app-transfer-fee',
            templateUrl: './transfer-fee.component.html',
            styleUrls: ['./transfer-fee.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.TransfersService,
            index_2.ValidateCookieService,
            index_1.CartCheckoutItemsService,
            receipt_service_1.ReceiptService,
            index_2.UtilityService,
            index_2.CookieService,
            index_2.MessageProcessorService,
            index_2.LoginStoreService,
            store_1.Store,
            store_1.State])
    ], TransferFeeComponent);
    return TransferFeeComponent;
}());
exports.TransferFeeComponent = TransferFeeComponent;
//# sourceMappingURL=transfer-fee.component.js.map