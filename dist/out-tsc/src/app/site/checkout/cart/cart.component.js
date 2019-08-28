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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var MealStoreActions = require("../../../shared/store/actions/mealStore.actions");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var discount_service_1 = require("../../services/discount.service");
var CartComponent = /** @class */ (function () {
    function CartComponent(router, formBuilder, cartCheckoutItemsService, utilityService, addCartItemService, studentMealsService, discountService, transferService, refreshService, loginStoreSvc, pageLoadingService, store, state) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.utilityService = utilityService;
        this.addCartItemService = addCartItemService;
        this.studentMealsService = studentMealsService;
        this.discountService = discountService;
        this.transferService = transferService;
        this.refreshService = refreshService;
        this.loginStoreSvc = loginStoreSvc;
        this.pageLoadingService = pageLoadingService;
        this.store = store;
        this.state = state;
        this.isCartItemsGetting = false;
        this.getCartItemsErr = false;
        this.getCartItemsErrMsg = '';
        this.mobile = false;
        this.checkMobile = new core_1.EventEmitter();
        this.failedToUpdate = false;
        this.isReview = false;
        //private clearIntervalInstance: any;
        this.isChekoutItemsGetting = false;
        this.getChekoutItemsErr = false;
        this.getChekoutErrMsg = '';
        this.isDelete = false;
        this.cartCallCount = 0;
        this.testcount = 0;
        this.cartStateCounter = 0;
        this.discountCall = 0;
        this.remove = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.cartStore = store.select(function (state) { return state.cartStore; });
        this.mealStore = store.select(function (state) { return state.mealStore; });
    }
    CartComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var temptState;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.discountService.result = false;
                        //console.log("Loading Cart Component: ", this.cartItem)
                        console.log("do we have a Service CartItem Here: ", this.cartCheckoutItemsService.cartItem);
                        this.editCartAmountForm = this.formBuilder.group({});
                        if (!(this.router.url == '/checkout')) return [3 /*break*/, 2];
                        if (!this.cartItem && !this.cartCheckoutItemsService.cartItem) {
                            //console.log("About to subscribeToGetCartCheckoutCartItem - Cart1 ")
                            this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                        }
                        if (this.cartCallCount < 4) {
                            this.getCartList();
                        }
                        return [4 /*yield*/, this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
                                .subscribe(function (data) {
                                _this.cartCheckoutItemsService.checkOutItem = data;
                            }, function (error) {
                                // console.log("Error: No Checkout Item: ", this.checkOutItem);
                                if (_this.cartCheckoutItemsService.checkOutItem) {
                                    _this.loginStoreSvc.loadLogin(_this.loginResponse);
                                    _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                    _this.cartCheckoutItemsService.checkoutResults = true;
                                    _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                }
                                else {
                                    _this.cartCheckoutItemsService.checkoutResults = false;
                                }
                            }, function () {
                                _this.loginStoreSvc.loadLogin(_this.loginResponse);
                                // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                                _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                _this.cartCheckoutItemsService.checkoutResults = true;
                                _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                if (_this.cartItem.items) {
                                    _this.haveCartItems = (_this.cartItem.items.length > 0) ? true : false;
                                    _this.showCartItems = true;
                                    _this.showCheckOutItems = false;
                                    _this.isCartItemsGetting = true;
                                    _this.isReview = false;
                                    _this.cartItem = _this.cartCheckoutItemsService.cartItem;
                                    // console.log("Do we have cartItem: ", this.cartItem);
                                    //console.log("Do we have CheckOut Items: ", this.cartCheckoutItemsService.checkOutItem)
                                    // if (this.cartItem) {
                                    _this.cartStore.subscribe(function (c) { return _this.tempCartState = c; });
                                    if (_this.tempCartState) {
                                        if (_this.tempCartState.data == undefined) {
                                            var temptState = void 0;
                                            _this.cartState = _this.cartItem;
                                            if (_this.cartItem.items == undefined) {
                                                _this.cartItem.items.length = 0;
                                            }
                                            _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartItem));
                                            _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                            temptState = _this.cartState;
                                            _this.cartItem = temptState.data;
                                        }
                                        else {
                                            _this.cartState = _this.tempCartState.data;
                                            //  this.cartItem = this.cartState;
                                        }
                                        //  console.log("tempCartState B4 Error on length: ", this.cartState)
                                        if (_this.cartState.items !== undefined) {
                                            if (_this.cartState.items.length == 0) {
                                                var temptState = void 0;
                                                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartItem));
                                                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                                temptState = _this.cartState;
                                                _this.cartItem = temptState.data;
                                                console.log("Do we have a State CartItems: ", _this.cartItem);
                                            }
                                        }
                                        _this.haveCartItems = (_this.cartItem.items.length > 0) ? true : false;
                                    }
                                }
                                else {
                                    var temptState = void 0;
                                    _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                    if (_this.cartState) {
                                        temptState = _this.cartState;
                                        _this.cartItem = temptState.data;
                                        _this.haveCartItems = (_this.cartItem.items.length > 0) ? true : false;
                                    }
                                    console.log("Do we have a Else State CartItems: ", _this.cartItem);
                                }
                            } //End of Complete
                            )
                            // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                            // }
                        ];
                    case 1:
                        _a.sent();
                        // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                        // }
                        if (this.cartItem && this.cartItem.items.length > 0) {
                            if (this.cartItem.items[0].liteItemType == "userFee") {
                                this.cartItem.consumerFeeTotal = 0;
                            }
                        }
                        _a.label = 2;
                    case 2:
                        if (this.router.url === '/review') {
                            //Calls the checkoutItem
                            // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                            //Calls for the CartItem
                            if (!this.cartItem) {
                                temptState = void 0;
                                this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                if (this.cartState) {
                                    temptState = this.cartState;
                                    this.cartItem = temptState.data;
                                }
                                else {
                                    // console.log("About to subscribeToGetCartCheckoutCartItem - Cart2 ")
                                    this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                                    setTimeout(function () {
                                        if (_this.cartCheckoutItemsService.cartItem) {
                                            _this.store.dispatch(new CartStoreActions.ClearCart());
                                            _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartCheckoutItemsService.cartItem));
                                            var temptState_1;
                                            _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                            if (_this.cartState) {
                                                temptState_1 = _this.cartState;
                                                _this.cartItem = temptState_1.data;
                                                // console.log("Review has a cartIyem: ", this.cartItem)
                                            }
                                        }
                                    }, 1000);
                                }
                            }
                            //checkOutItem
                            this.isReview = true;
                            this.showCheckOutItems = true;
                            this.showCartItems = false;
                            this.isDelete = false;
                            this.showSpinner = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CartComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        this.tempCartState = this.cartState;
        if (this.tempCartState) {
            this.cartItem = this.tempCartState.data;
        }
        this.cartGettingInterval = setInterval(function () {
            if (_this.cartItem.items || _this.cartCheckoutItemsService.checkOutItem) {
                _this.isCartItemsGetting = false;
                clearInterval(_this.cartGettingInterval);
            }
        }, 500);
    };
    CartComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.discountService.result === true && this.discountCall === 0) {
            setTimeout(function () {
                if (_this.discountService.CheckoutItem.discountTotal === 0) {
                    _this.cartItem = _this.cartCheckoutItemsService.cartItem;
                }
                else {
                    //  console.log('discount response', this.discountService.CheckoutItem);
                    _this.checkoutItems = _this.discountService.CheckoutItem;
                    _this.cartItem.subTotal = _this.discountService.CheckoutItem.subTotal;
                    _this.cartItem.consumerFeeTotal = _this.discountService.CheckoutItem.consumerFeeTotal;
                    _this.cartItem.total = _this.discountService.CheckoutItem.total;
                    _this.checkoutItems.totalTax = _this.discountService.CheckoutItem.totalTax;
                    _this.discountCall = 1;
                }
            }, 1000);
        }
        if (this.cartCallCount < 2 && this.cartCheckoutItemsService.checkoutResults) {
            // console.log("Do we have cartResults: ", this.cartCheckoutItemsService.checkoutResults)
            this.cartItem = this.cartCheckoutItemsService.cartItem;
            var tempCart = void 0;
            tempCart = this.addCartItemService.cartResponse;
            if (!this.cartItem) {
                this.cartItem = tempCart;
            }
            this.getCartList();
            this.cartCheckoutItemsService.cartResults = false;
            this.checkoutItems = this.cartCheckoutItemsService.checkOutItem;
            setTimeout(function () { _this.isChekoutItemsGetting = true; }, 1000);
            if (this.checkoutItems) {
                this.cartCheckoutItemsService.cartResults = (this.checkoutItems.merchants.length > 0) ? true : false;
                this.cartCallCount++;
            }
            else {
                this.cartCheckoutItemsService.cartResults = false;
            }
            this.checkoutItems = this.cartCheckoutItemsService.checkOutItem;
            if (this.checkoutItems.itemCount > 0) {
                //console.log("What is the checkoutItems: ", this.checkoutItems)
                this.isChekoutItemsGetting = (this.checkoutItems.merchants.length > 0) ? true : false;
                this.cartCallCount++;
            }
            else {
                this.checkChecOutItems();
            }
            setTimeout(function () { _this.isChekoutItemsGetting = true; }, 1000);
            if (this.cartItem) {
                //If we have a cartItem we must have a storeItem,
                this.cartStore.subscribe(function (c) { return _this.tempCartState = c; });
                //  console.log("What is tempCartState: ", this.tempCartState);
                //sometimes tempCartState has tempCartState.data.items other times it is just temptCartState.items.
                //TODO: Make tempCartState consistent
                if (this.tempCartState) {
                    // console.log("Do we have a tempState: ", this.tempCartState)
                    if (this.tempCartState.data !== undefined) {
                        this.cartState = this.tempCartState.data;
                    }
                    else {
                        this.cartState = this.tempCartState;
                    }
                    // console.log("What is CartState: ", this.cartState)
                    // console.log("What is Cart State for Transfer FEE: ", this.cartState);
                    if (this.cartState.items.length > 0) {
                        if (this.cartState.items[0].liteItemType == 'userFee') {
                            this.cartState.total = this.cartState.items[0].amountInCart;
                            var upDateCartState = this.cartState;
                            // console.log("Did we update Our State: ", upDateCartState);
                            this.store.dispatch(new CartStoreActions.LoadCartSuccess(upDateCartState));
                            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                            this.tempCartState = this.cartState;
                            this.cartItem = this.tempCartState.data;
                            //  console.log("Do we have a CartState After passing the Update: ", this.cartState);
                        }
                    }
                    else {
                        var testState = this.cartState;
                        if (testState.liteItemType == 'userFee') {
                            this.cartState.total = testState.amountInCart;
                            var upDateCartState = this.cartState;
                            // console.log("Did we update Our State: ", upDateCartState);
                            this.store.dispatch(new CartStoreActions.LoadCartSuccess(upDateCartState));
                            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                            this.tempCartState = this.cartState;
                            this.cartItem = this.tempCartState.data;
                            this.cartCallCount++;
                            //  console.log("Do we have a CartState After passing the Update: ", this.cartState);
                        }
                    }
                }
                else {
                    this.cartState = undefined;
                }
                //If the Cart Store is empty load this.cartItem into the store
                //if (!this.cartState || this.cartState == undefined) {
                //  this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))
                //  this.cartStore.subscribe(c => this.cartState = c);
                //  this.tempCartState = this.cartState;
                //  this.cartItem = this.tempCartState.data;
                //} else {
                //  this.tempCartState = this.cartState;
                //  if (this.tempCartState.data == undefined) {
                //    this.cartItem = this.tempCartState;
                //  } else {
                //    this.cartItem = this.tempCartState.data;
                //  }
                //  if (this.router.url == '/review' && this.cartItem.items[0].liteItemType != 'userFee') {
                //    // console.log("Do we have Checkout-CartITMES: ", this.cartItem);
                //    //console.log("Do we have CheckoutItems2: ", this.cartCheckoutItemsService.checkOutItem);
                //    this.cartItem.subTotal = this.checkoutItems.subTotal;
                //    this.cartItem['consumerFeeTotal'] = this.checkoutItems.consumerFeeTotal;
                //    this.cartItem.total = this.checkoutItems.total;
                //  }
                //  if (this.cartItem.items !== undefined) {
                //    if (this.cartItem && this.cartItem.items.length > 0) {
                //      if (this.cartItem.items[0].liteItemType == "userFee") {
                //        this.cartItem.consumerFeeTotal = 0;
                //        this.cartItem.subTotal = this.cartItem.total;
                //        this.cartItem.items[0].amountInCart = this.cartItem.total;
                //      }
                //    }
                //  }
                //}
                this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
                this.isCartItemsGetting = false;
                this.showSpinner = false;
                this.isUpdating = false;
            }
            //if (this.addCartItemService.result == true && this.testcount < 4) {
            //  // this.removeItem;
            //  let temptState: any;
            //  this.cartStore.subscribe(c => this.cartState = c);
            //  if (this.cartState) {
            //    temptState = this.cartState;
            //    this.cartItem = temptState.data;
            //    this.testcount++;
            //    // console.log("update Cart Component: ", this.cartItem)
            //  }
            //  this.isUpdating = false;
            //  this.isCartItemsGetting = false;
            //}
        }
        //
        if (this.addCartItemService.itemRemoved === true) {
            // console.log("Calling  this.removeItem ", this.cartCheckoutItemsService.cartItem);
            this.removeItem(this.cartCheckoutItemsService.cartItem);
        }
        if (this.cartCheckoutItemsService.updateCart$) {
            this.cartCheckoutItemsService.newCartItem$.subscribe(function () {
                if (_this.cartCheckoutItemsService.cartResults == true) {
                    //  console.log("Did we get an update: ", this.cartCheckoutItemsService.cartResults)
                    //  console.log("The cartItem: ", this.cartCheckoutItemsService.cartItem);
                    if (_this.cartCheckoutItemsService.cartItem) {
                        _this.store.dispatch(new CartStoreActions.ClearCart());
                        var tempUpdatedCart = _this.updateCartList(_this.cartItem, _this.cartCheckoutItemsService.cartItem);
                        _this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempUpdatedCart));
                        _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                        _this.tempCartState = _this.cartState;
                        _this.cartItem = _this.tempCartState.data;
                        _this.getCartList();
                        _this.isUpdating = false;
                        //console.log("Do we have a new CartItem: ", this.cartItem);
                    }
                    //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse)
                    // console.log("Do we have a value: ", this.cartCheckoutItemsService.updateCart$);
                    _this.cartCheckoutItemsService.cartResults = false;
                    _this.cartCheckoutItemsService.newCartItem$.emit(false);
                    _this.cartCheckoutItemsService.updateCart$.unsubscribe();
                }
            });
        }
    };
    CartComponent.prototype.initListItem = function () {
        // console.log("Building Cart Form")
        return this.formBuilder.group({
            'editAmount': [null, [forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern), this.minimumAmount()]]
        });
    };
    CartComponent.prototype.updateCartOnDelete = function () {
        var _this = this;
        /*if (this.addCartItemService.cartResponse && this.addCartItemService.deleteResult === true || this.cartCheckoutItemsService.cartItem && this.addCartItemService.deleteResult === true)*/ {
            this.cartItem.items = this.cartCheckoutItemsService.cartItem.items;
            //console.log('list', this.cartCheckoutItemsService.cartItem.items);
            this.deleteInterval = setInterval(function () {
                if (_this.cartCheckoutItemsService.cartItem) {
                    _this.cartItem = _this.cartCheckoutItemsService.cartItem;
                    _this.isUpdating = false;
                    _this.addCartItemService.deleteResult = false;
                    clearInterval(_this.deleteInterval);
                }
            }, 1000);
        }
    };
    CartComponent.prototype.getCartList = function () {
        var _this = this;
        // console.log  ("Creating the cart list")
        this.cartCallCount++;
        //  console.log("Do we have a cartCallCount: ", this.cartCallCount)
        if (!this.isUpdating) {
            this.isCartItemsGetting = false;
        }
        if (this.cartCheckoutItemsService.cartResults === true && this.cartCheckoutItemsService.cartItem.items) {
            // console.log("GetCartList CartItem: ", this.cartCheckoutItemsService.cartItem)
            if (this.addCartItemService.deleteResult === true) {
                var tempCartItem = this.addCartItemService.cartResponse;
                this.cartCheckoutItemsService.cartItem = tempCartItem;
                // console.log("Did we fix cartItem: ", this.cartCheckoutItemsService.cartItem);
            }
            this.cartCheckoutItemsService.cartItem.subTotal = this.cartCheckoutItemsService.cartItem.total;
            //Build up form
            for (var i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
                //For use with the mobile version
                this.editCartAmountForm.addControl('editAmountGroup' + i, this.initListItem());
            }
            // console.log("do we have a oginResponse:  ", this.loginStoreSvc.fixedLoginResponse);
            if (this.loginStoreSvc.fixedLoginResponse) {
                this.cartCheckoutItemsService.loginResponse = this.loginStoreSvc.fixedLoginResponse;
            }
            if (this.cartCheckoutItemsService.loginResponse.messageType === app_settings_1.Constants.Error) {
                this.isCartItems = true;
                this.getCartItemsErr = true;
                this.getCartItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
                this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
            }
            else {
                // console.log("Creating a cookie: ", this.cartCheckoutItemsService.loginResponse)
                this.loginStoreSvc.loadLogin(this.cartCheckoutItemsService.loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, this.cartCheckoutItemsService.loginResponse);
                this.isCartItems = this.cartCheckoutItemsService.cartItem.items.length > 0;
            }
            var seconds_1 = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            this.cartItem = this.cartCheckoutItemsService.cartItem;
            //console.log(this.cartItem);
            this.stopSoon = setInterval(function () {
                seconds_1.subscribe(function (x) {
                    if (x == app_settings_1.Constants.SpinnerDelay) {
                        _this.isCartItemsGetting = false;
                        _this.isUpdating = false;
                        if (_this.router.url == '/checkout') {
                            _this.isReview = false;
                        }
                        else {
                            _this.isReview = true;
                        }
                    }
                    if (_this.checkoutItems) {
                        if (_this.checkoutItems.items && _this.isReview) {
                            if (_this.cartItem.items[0].liteItemType == 'userFee') {
                                _this.cartItem.subTotal = _this.cartItem.items[0].amountInCart;
                                _this.cartItem.consumerFeeTotal = 0;
                                _this.cartItem.total = _this.cartItem.subTotal;
                                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartItem));
                            }
                            else {
                                _this.cartItem.consumerFeeTotal = _this.checkoutItems.consumerFeeTotal;
                                _this.cartItem.total = _this.checkoutItems.total;
                                _this.isUpdating = false;
                            }
                        }
                        else {
                            _this.cartItem.consumerFeeTotal = 0;
                            _this.addCartItemService.itemRemoved = false;
                        }
                        clearInterval(_this.stopSoon);
                    }
                });
            }, 1000);
        }
        else {
            ++this.cartCheckoutItemsService.count;
        }
    };
    //index
    CartComponent.prototype.removeItem = function (value) {
        //   console.log("Remove me NOW")
        if (value.item !== undefined) {
            if (value.item.liteItemType == "userFee") {
                this.transferService.feeCartCount = 0;
                // console.log("What is the feeCartItem Here: ", this.transferService.feeCartItem)
                // console.log("Does Remove have a CartState: ", this.cartState)
                this.transferService.feeCartItem = {};
            }
            this.isUpdating = true;
            this.failedToUpdate = false;
            if (!this.addCartItemService.deleteResult) {
                this.addCartItemService.deleteCartItemNew(value.item.itemKey, value.item.accountBalanceID, this.loginResponse);
            }
        }
        //this.removeInterval = setInterval(() => {
        if (this.addCartItemService.cartResponse || this.addCartItemService.deleteResult == true) {
            // console.log("What is the CartResponse After subscribeToDelete: ", this.addCartItemService.cartResponse);
            if (this.addCartItemService.cartResponse.itemCount == 0) {
                this.store.dispatch(new CartStoreActions.ClearCart());
                this.store.dispatch(new MealStoreActions.ClearMeals());
                //Refresh meals Store after cart item removed
                this.refreshService.refreshMeals();
                //clearInterval(this.removeInterval);
            }
            else {
                var tempCartResponse = this.addCartItemService.cartResponse;
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempCartResponse));
                this.updateCartOnDelete();
                //clearInterval(this.removeInterval);
            }
            if (this.addCartItemService.loginResponse.messageType === app_settings_1.Constants.Error) {
                this.failedToUpdateMsg = this.addCartItemService.loginResponse.message;
                this.failedToUpdate = true;
                this.isUpdating = false;
                //console.log('is there an error here');
                this.utilityService.clearErrorMessage(this.addCartItemService.loginResponse);
                //clearInterval(this.removeInterval);
            }
            else {
                //on success update cart items, count, etc.
                this.addCartItemService.loginResponse.access_token.trim();
                // console.log("Creating a cookie: ", this.addCartItemService.loginResponse)
                this.loginStoreSvc.loadLogin(this.addCartItemService.loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, this.addCartItemService.loginResponse);
                // console.log("Do we have a cart response: ", this.addCartItemService.cartResponse);
                if (this.addCartItemService.cartResponse) {
                    //console.log('cartResponse during remove', this.addCartItemService.cartResponse);
                    this.isCartItems = (this.addCartItemService.cartResponse.items.length > 0) ? true : false;
                    this.failedToUpdate = false;
                    this.cartItem.subTotal = this.addCartItemService.cartResponse.total;
                    //Copied from commented code below
                    this.isUpdating = false;
                    this.updateCartOnDelete();
                    //clearInterval(this.removeInterval);
                    this.loginResponse.cartItemCount = this.addCartItemService.cartResponse.itemCount;
                    // console.log("Our New Subtotal: ", this.cartItem.subTotal);
                    // console.log("About to subscribeToGetCartCheckoutCartItem - CartItem3 ")
                    //this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                    this.getCartList();
                    this.addCartItemService.itemRemoved = false;
                }
            }
            this.addCartItemService.deleteResult = false;
            this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
            //clearInterval(this.removeInterval);
        }
        else {
            this.addCartItemService.count++;
            //clearInterval(this.removeInterval);
        }
        //}, 1000);
    };
    CartComponent.prototype.goBackToDashboard = function () {
        var _this = this;
        // console.log("Going Back to Dashboard No CartItems: ", this.cartItem)
        this.addCartItemService.deleteResult = false;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.studentMealsService.getStudentMealsNew(this.loginResponse);
        this.pageLoadingService.show("Returning to Dashboard");
        setTimeout(function () {
            _this.router.navigate(['/dashboard']);
            _this.pageLoadingService.hide();
        }, 1000);
    };
    CartComponent.prototype.updateItem = function (item) {
        //console.log("Calling updateItem: ", item);
        //console.log("updatedItem cartItem: ", this.cartCheckoutItemsService.cartItem)
        var _this = this;
        var subscription;
        for (var i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
            if (this.cartCheckoutItemsService.cartItem.items[i].accountBalanceID == item.accountBalanceID && this.cartCheckoutItemsService.cartItem.items[i].itemKey === item.itemKey) {
                //  console.log("updateItem ForLoop: ", this.cartCheckoutItemsService.cartItem.items[i]);
                this.cartCheckoutItemsService.cartItem.items[i].amountInCart = Number(item.amountInCart);
                this.cartCheckoutItemsService.cartItem.items[i].extendedAmount = Number(item.amountInCart);
                this.cartCheckoutItemsService.cartItem.items[i].itemAmount = Number(item.itemAmount);
            }
        }
        var updateList = this.cartCheckoutItemsService.cartItem.items;
        subscription = this.cartCheckoutItemsService.subscribeToUpdateCartCheckOutItemsNew(updateList, this.loginResponse);
        this.checkoutInterval = setInterval(function () {
            if (_this.cartCheckoutItemsService.result == true) {
                _this.cartItem.subTotal = _this.cartCheckoutItemsService.cartItem.total;
                _this.cartCheckoutItemsService.updateCart$.unsubscribe();
                //this.getCartList();
                // console.log("About subscribeTopostCartCheckoutReviewItems - Cart3")
                //If we updated the ViewCart(CartItems) the ReviewCart(CheckOutItems) needs to be refreshed
                //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse)
                _this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(_this.loginResponse)
                    .subscribe(function (data) {
                    _this.cartCheckoutItemsService.checkOutItem = data;
                }, function (error) {
                    // console.log("Error: No Checkout Item: ", this.checkOutItem);
                    if (_this.cartCheckoutItemsService.checkOutItem) {
                        _this.loginStoreSvc.loadLogin(_this.loginResponse);
                        _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                        _this.cartCheckoutItemsService.checkoutResults = true;
                        _this.cartCheckoutItemsService.cartUpdate.emit(true);
                    }
                    else {
                        _this.failedToUpdateMsg = _this.cartCheckoutItemsService.loginResponse.message;
                        _this.isUpdating = false;
                        _this.failedToUpdate = true;
                        _this.utilityService.clearErrorMessage(_this.cartCheckoutItemsService.loginResponse);
                        _this.cartCheckoutItemsService.checkoutResults = false;
                    }
                }, function () {
                    _this.loginStoreSvc.loadLogin(_this.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                    _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                    _this.cartCheckoutItemsService.checkoutResults = true;
                    _this.cartCheckoutItemsService.cartUpdate.emit(true);
                    _this.isUpdating = false;
                });
                clearInterval(_this.checkoutInterval);
            }
            else {
                _this.cartCheckoutItemsService.count++;
            }
        }, 1000);
    };
    CartComponent.prototype.checkCartStore = function () {
        var _this = this;
        if (this.cartItem) {
            this.cartStore.subscribe(function (c) { return _this.tempCartState = c; });
            if (this.tempCartState) {
                this.cartState = this.tempCartState.data;
                if (this.cartState.items) {
                    var temptState = void 0;
                    this.store.dispatch(new CartStoreActions.ClearCart());
                    this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                    temptState = this.cartState;
                    this.cartItem = temptState.data;
                }
            }
        }
        else {
            var temptState = void 0;
            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
            if (this.cartState) {
                temptState = this.cartState;
                this.cartItem = temptState.data;
            }
        }
    };
    //custom validator that will check to make sure values are greater than 0
    CartComponent.prototype.minimumAmount = function () {
        return function (control) {
            var goodToGo = true;
            var selection = control.value;
            if (isNaN(selection)) {
                //other validation will catch this case
            }
            else if (selection <= 0 && selection !== '') {
                goodToGo = false;
            }
            return goodToGo ? null : { 'minimumAmount': { selection: selection } };
        };
    };
    CartComponent.prototype.completeUpdateList = function (updatedItem, currentList) {
        var completeList = {};
        var unChangedItems;
        unChangedItems = this.isUnchangedItem(updatedItem, currentList);
        return completeList;
    };
    CartComponent.prototype.isUnchangedItem = function (currentItem, fullList) {
        var unChangedList = [];
        for (var i = 0; i < fullList.length; i++) {
            if (fullList[i].accountBalanceID !== currentItem.accountBalanceID) {
                unChangedList.push(fullList[i]);
            }
        }
        return unChangedList;
    };
    CartComponent.prototype.updateCartList = function (currentCartList, updateCartItem) {
        //  console.log("Updating CartList: ", currentCartList)
        //   console.log("the updated Item: ", updateCartItem)
        var updatedItemId = updateCartItem.items[0].accountBalanceID;
        var newCartItemsList = [];
        for (var i = 0; i < currentCartList.items.length; i++) {
            if (updatedItemId == currentCartList.items[i].accountBalanceID) {
                var fixedItem = this.amendItem(currentCartList.items[i], updateCartItem.items[0]);
                newCartItemsList.push(fixedItem);
            }
            else {
                newCartItemsList.push(currentCartList.items[i]);
            }
        }
        currentCartList.items = newCartItemsList;
        currentCartList = this.upDateSubTotal(currentCartList);
        return currentCartList;
    };
    CartComponent.prototype.amendItem = function (currentCartItem, changedCartItem) {
        if (currentCartItem.amountInCart == changedCartItem.amountInCart) {
            currentCartItem = currentCartItem;
        }
        else {
            currentCartItem.amountInCart = changedCartItem.amountInCart;
        }
        return currentCartItem;
    };
    CartComponent.prototype.upDateSubTotal = function (currentCartList) {
        var tempCartList = currentCartList;
        var temptItemList = tempCartList.items;
        temptItemList = temptItemList.map(function (a) { return parseInt(a.amountInCart); });
        var amountList = temptItemList.reduce(function (acc, temptItemList) { return acc + temptItemList; }, 0);
        currentCartList.subTotal = amountList;
        currentCartList.total = this.getNewTotal(currentCartList.subTotal, currentCartList.consumerFeeTotal);
        return currentCartList;
    };
    CartComponent.prototype.getNewTotal = function (subTotal, consumerFee) {
        var tempConsumerFee;
        var tempSubTotal = subTotal;
        if (consumerFee) {
            tempConsumerFee = consumerFee;
        }
        else {
            tempConsumerFee = 0;
        }
        var newTotal = Number(tempSubTotal) + Number(tempConsumerFee);
        return newTotal;
    };
    CartComponent.prototype.checkChecOutItems = function () {
        var _this = this;
        //  console.log("calling checkout Items")
        this.checkoutItemsInterval = setInterval(function () {
            _this.checkoutItems = _this.cartCheckoutItemsService.checkOutItem;
            if (_this.checkoutItems.itemCount > 0) {
                // console.log("What is the checkoutItems: ", this.checkoutItems)
                _this.isChekoutItemsGetting = (_this.checkoutItems.merchants.length > 0) ? true : false;
                clearInterval(_this.checkoutItemsInterval);
            }
            else {
                _this.isChekoutItemsGetting = false;
                clearInterval(_this.checkoutItemsInterval);
            }
            _this.cartCheckoutItemsService.cartResults = false;
        }, 1000);
    };
    CartComponent.prototype.onResize = function (event) {
        var element = event.currentTarget;
        this.mobile = (element.innerWidth < 960) ? true : false;
        this.checkMobile.emit(this.mobile);
    };
    CartComponent.prototype.ngOnDestroy = function () {
        this.addCartItemService.cartUpdate.emit(false);
        this.addCartItemService.result = false;
        this.isChekoutItemsGetting = false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CartComponent.prototype, "cartItem", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CartComponent.prototype, "checkoutItem", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.EventEmitter)
    ], CartComponent.prototype, "remove", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CartComponent.prototype, "onResize", null);
    CartComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'shopping-cart',
            templateUrl: './cart.component.html',
            styleUrls: ['./cart.component.less', './cart-item.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.CartCheckoutItemsService,
            index_2.UtilityService,
            index_1.AddCartItemService,
            index_1.StudentMealsService,
            discount_service_1.DiscountService,
            index_1.TransfersService,
            refresh_service_1.RefreshService,
            index_2.LoginStoreService,
            page_loading_service_1.PageLoadingService,
            store_1.Store,
            store_1.State])
    ], CartComponent);
    return CartComponent;
}());
exports.CartComponent = CartComponent;
//# sourceMappingURL=cart.component.js.map