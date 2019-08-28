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
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var forms_1 = require("@angular/forms");
var index_3 = require("../../account/meal-purchases/model/index");
var index_4 = require("../../account/services/index");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var payment_method_dialog_service_1 = require("../../services/payment-method-dialog.service");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var discount_service_1 = require("../../services/discount.service");
var core_2 = require("@capacitor/core");
//import { clearInterval } from 'timers';
var ReviewCartComponent = /** @class */ (function () {
    function ReviewCartComponent(router, paymentMethodService, utilityService, formBuilder, paymentMethodDialogService, viewContainerRef, pageLoadingService, receiptService, cartCheckoutItemsService, cartCheckoutService, discountService, store, state, refreshService, loginStoreSrvc, multiDistrictSvc) {
        this.router = router;
        this.paymentMethodService = paymentMethodService;
        this.utilityService = utilityService;
        this.formBuilder = formBuilder;
        this.paymentMethodDialogService = paymentMethodDialogService;
        this.viewContainerRef = viewContainerRef;
        this.pageLoadingService = pageLoadingService;
        this.receiptService = receiptService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.cartCheckoutService = cartCheckoutService;
        this.discountService = discountService;
        this.store = store;
        this.state = state;
        this.refreshService = refreshService;
        this.loginStoreSrvc = loginStoreSrvc;
        this.multiDistrictSvc = multiDistrictSvc;
        this.applyingDiscount = false;
        this.persistDefaultCheckBox = false;
        this.hasWallets = true;
        this.paymentAddDetail = new index_3.PaymentMethodInputModel();
        this.loadingPayments = false;
        this.getWalletsErr = false;
        this.discountFailed = false;
        this.clearDiscounts = false;
        this.emitterCounter = 0;
        this.backToDashboardCounter = 0;
        this.seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
        this.getReceiptCounter = 0;
        this.discountError = false;
        this.noMoreDiscounts = false;
        this.discountCall = 0;
        this.isReview = false;
        this.showReceipt = false;
        this.cardTransaction = {
            paymentType: '',
            nameOnAccount: '',
            company: '',
            street: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            cardNumber: '',
            expiryYear: '',
            expiryMonth: '',
            cardCode: ''
        };
        this.achTransaction = {
            paymentType: '',
            nameOnAccount: '',
            street: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            account: '',
            accountType: '',
            routing: ''
        };
        this.walletTransaction = {
            paymentType: '',
            key: ''
        };
        this.emptyCartItem = {
            itemCount: 0,
            items: [],
            total: 0,
            bonusTotal: 0,
            subTotal: 0,
            consumerFeeTotal: 0,
            validationToken: ''
        };
        this.emptyCheckOutItem = {
            bonusTotal: 0,
            consumerFeeTotal: 0,
            itemCount: 0,
            total: 0,
            subTotal: 0,
            validationToken: '',
            totalTax: 0,
            discountTotal: 0,
            isDiscountAvailable: false,
            merchants: [],
            discounts: []
        };
        this.discountCodeForm = new forms_1.FormGroup({
            discount: new forms_1.FormControl()
        });
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    ReviewCartComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a, trueTotal, i, temptState, temptState, currentDate, currentDay, currentTime, startSupportHours, endSupportHours;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        // console.log(this.deviceInfo);
                        if (this.deviceInfo.platform === 'web') {
                            this.web = true;
                        }
                        if (this.discountService.CheckoutItem) {
                            this.clearDiscounts = true;
                            this.discountsApplied = false;
                        }
                        this.getPaymentMethods();
                        if (this.router.url == '/review') {
                            //console.log("does Review have a cartCheckoutItemsService CartItem: ", this.cartCheckoutItemsService.cartItem)
                            // console.log("does Review have a CartItem: ", this.cartItem)
                            // console.log("Do we have checkout Items: ", this.checkOutItem)
                            //setTimeout(() => { this.getCartListReview(); }, 0);
                            this.getCartListReview();
                            // console.log("Calling postCartCheckoutReviewItems: ", this.loginResponse)
                            if (this.loginResponse.cartItemCount) {
                                this.cCount = this.loginResponse.cartItemCount;
                            }
                            trueTotal = 0;
                            this.isReview = true;
                            //  console.log("Do we have the checkoutItems: ", this.checkOutItem)
                            if (this.cartCheckoutItemsService.cartItem) {
                                //   console.log('merchant info', this.cartCheckoutItemsService.checkOutItem)
                                if (this.cartCheckoutItemsService.cartItem.itemCount > 0) {
                                    for (i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
                                        // console.log("What is my amount in Cart: ", this.cartCheckoutItemsService.cartItem.items[i].amountInCart)
                                        if (this.cartCheckoutItemsService.cartItem.items[i].amountInCart > 0 && this.cartCheckoutItemsService.cartItem.total == 0) {
                                            trueTotal += this.cartCheckoutItemsService.cartItem.items[i].amountInCart;
                                        }
                                    }
                                    this.cartCheckoutItemsService.cartItem.total = trueTotal;
                                    //console.log("New cartCheckoutItemsService.cartItem B4 dispatch: ", this.cartCheckoutItemsService.cartItem);
                                }
                                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem));
                                this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                temptState = void 0;
                                temptState = this.cartState;
                                this.cartItem = temptState.data;
                                // console.log("DoesStore Have cartItem: ", this.cartItem)
                            }
                            else {
                                this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                temptState = void 0;
                                temptState = this.cartState;
                                this.cartItem = temptState.data;
                                // console.log("Do we have an else cartItem: ", this.cartItem)
                            }
                            //  setTimeout(() => { this.getCartListReview(); }, 0);
                        }
                        currentDate = new Date();
                        currentDay = currentDate.getDay();
                        this.supportAvailable = (currentDay > 0 && currentDay < 6) ? true : false;
                        if (this.supportAvailable) {
                            currentTime = currentDate.getHours();
                            startSupportHours = new Date();
                            startSupportHours.setHours(7, 30, 0); // 7:30 am
                            endSupportHours = new Date();
                            endSupportHours.setHours(17, 30, 0); // 5.30 pm
                            this.supportAvailable = (currentDate >= startSupportHours && currentDate <= endSupportHours) ? true : false;
                        }
                        this.createDiscountForm();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReviewCartComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.applyingDiscount === true && this.discountService.result === true && this.discountCall === 0) {
            //console.log("Checking for Discounts")
            setTimeout(function () {
                if (_this.discountService.CheckoutItem.discountTotal === 0) {
                    _this.pageLoadingService.hide();
                    _this.checkOutItem = _this.cartCheckoutItemsService.checkOutItem;
                    _this.discountError = true;
                    _this.discountsApplied = false;
                    _this.discountErrorMsg = "Discount Code Incorrect";
                }
                else {
                    //   console.log('discount response', this.discountService.CheckoutItem);
                    _this.discountError = false;
                    _this.discountErrorMsg = '';
                    _this.checkOutItem = _this.discountService.CheckoutItem;
                    _this.discountsApplied = true;
                    _this.pageLoadingService.hide();
                    _this.discountCall = 1;
                }
            }, 500);
        }
    };
    ReviewCartComponent.prototype.createDiscountForm = function () {
        this.discountCodeForm = this.formBuilder.group({
            discount: '',
        });
    };
    ReviewCartComponent.prototype.getCartListReview = function () {
        var _this = this;
        //console.log("Reviewing the Cart");
        this.isCheckoutItemsGetting = true;
        this.cartCheckoutItemsService.result = false;
        if (this.cartCheckoutItemsService.checkOutItem) {
            // console.log("Do we have checkoutItemsNow: ", this.cartCheckoutItemsService.checkOutItem)
            if (this.cartCheckoutItemsService.loginResponse.messageType === app_settings_1.Constants.Error) {
                this.isCartItems = true;
                this.getCartItemsErr = true;
                this.getCartItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
                this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
                this.isCheckoutItems = true;
                this.getCheckoutItemsErr = true;
                this.getCheckoutItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
                this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
            }
            else {
                this.loginStoreSrvc.loadLogin(this.cartCheckoutItemsService.loginResponse);
                // console.log("What is the Loaded store-Cookie: ", this.loginStoreSrvc.cookieStateItem)
                // this.cookieService.putObject(Constants.AuthCookieName, this.cartCheckoutItemsService.loginResponse);
                this.checkOutItem = this.cartCheckoutItemsService.checkOutItem;
                //  console.log("Do we have checkoutItemsNow: ", this.checkOutItem)
                this.isCheckoutItems = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups.length > 0;
                this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
                // let tCartState: any = this.cartState
                if (this.cartItem) {
                    if (this.cartItem.items[0].liteItemType == 'userFee') {
                        if (this.cartItem.consumerFeeTotal > 0) {
                            this.cartItem.consumerFeeTotal = 0;
                        }
                        else {
                            this.cartItem.consumerFeeTotal = 0;
                        }
                        this.cartItem.subTotal = this.cartItem.items[0].amountInCart;
                        this.cartItem.total = this.cartItem.items[0].amountInCart + this.cartItem.consumerFeeTotal;
                        this.checkOutItem.consumerFeeTotal = 0;
                        this.checkOutItem.subTotal = this.cartItem.items[0].amountInCart;
                        this.checkOutItem.total = this.cartItem.total;
                    }
                    //console.log("Was checkoutItem Changed: ", this.checkOutItem)
                }
            }
            var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            seconds.subscribe(function (x) {
                if (x == app_settings_1.Constants.SpinnerDelay) {
                    _this.isCartItemsGetting = false;
                }
            });
        }
        else {
            this.cartItem = this.cartCheckoutItemsService.cartItem;
            if (this.cartItem.items[0].liteItemType == 'userFee') {
                //  let newTotal = this.cartItem.total;
                if (this.cartItem.consumerFeeTotal > 0) {
                    this.cartItem.consumerFeeTotal = 0;
                }
                this.cartItem.total = this.cartItem.subTotal + this.cartItem.consumerFeeTotal;
            }
            ++this.cartCheckoutItemsService.count;
        }
    };
    ReviewCartComponent.prototype.getPaymentMethods = function () {
        var _this = this;
        this.persistDefaultCheckBox = true;
        this.loadingPayments = true;
        this.paymentMethodService.result = false;
        this.paymentMethodService.paymentMethods = [];
        this.hasWallets = false;
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        var failureMessage = 'Updating Cart Failed';
        //console.log("What is the subscribeToGetPaymentMethods LoginResponse: ", this.loginResponse)
        //this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);
        this.paymentMethodService.getPaymentMethodsNew(this.loginResponse)
            .subscribe(function (data) {
            _this.paymentMethodService.paymentMethods = data;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.getWalletsErrMsg = _this.paymentMethodService.loginResponse.message;
            _this.getWalletsErr = true;
            _this.utilityService.clearErrorMessage(_this.paymentMethodService.loginResponse);
        }, function () {
            //  console.log("What R these paymentMethods: ", this.paymentMethods)
            _this.paymentMethodService.result = true;
            _this.loginStoreSrvc.loadLogin(_this.paymentMethodService.loginResponse);
            _this.hasWallets = _this.paymentMethodService.paymentMethods.length > 0;
            _this.paymentMethodService.paymentMethods.forEach(function (method) {
                if (method.isDefault) {
                    _this.selectedPaymentMethod = method;
                }
            });
            var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            seconds.subscribe(function (x) {
                if (x == app_settings_1.Constants.SpinnerDelay) {
                    _this.loadingPayments = false;
                }
            });
        });
    };
    ReviewCartComponent.prototype.selectPayment = function (payment) {
        //Not expired credit card.
        if (!this.utilityService.isAch(payment.walletKey, this.paymentMethodService.paymentMethods) && !payment.isExpired) {
            this.selectedPaymentMethod = payment;
        }
        else if (!this.utilityService.isAchBlocked(this.loginResponse)) {
            this.selectedPaymentMethod = payment;
        }
        this.selectPaymentErr = false;
    };
    //Includes listener
    ReviewCartComponent.prototype.showMethodDialog = function () {
        var _this = this;
        //save selected
        this.paymentMethodDialogService.open(this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                if (result.action != 'cancel') {
                    if (result.methodValues.saveMethod) {
                        //New method, was saved successfully, get fresh list
                        _this.getPaymentMethods();
                    }
                    else {
                        //New method, one time use, add to list
                        _this.mapNewPayMethod(result.methodValues);
                    }
                }
                else {
                    _this.restoreSelected(_this.selectedPaymentMethod);
                }
            }
        });
    };
    ReviewCartComponent.prototype.restoreSelected = function (selected) {
        //When the dialog is popped the selected payment radio button 
        //selected indication vanishes
        //This is the Hack to cause refresh when there is no change
        //like when one clicks cancel in the dialog.
        //Just changing the object proved to not be enough
        //however when exchanging the entire array it refreshes proper
        var _this = this;
        //This doesn't work and is here for example
        //if (this.paymentMethodService.paymentMethods[0]) {
        //    this.paymentMethodService.paymentMethods[0].isDefault = !this.paymentMethodService.paymentMethods[0].isDefault;
        //    let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
        //    seconds.subscribe(
        //        x => {
        //            if (x == Constants.SpinnerDelay) {
        //                this.paymentMethodService.paymentMethods[0].isDefault = !this.paymentMethodService.paymentMethods[0].isDefault;
        //            }
        //        });
        //}
        var pm = this.paymentMethodService.paymentMethods;
        this.paymentMethodService.paymentMethods = [];
        var seconds = rxjs_1.Observable.interval(0);
        seconds.subscribe(function (x) {
            if (x == app_settings_1.Constants.SpinnerDelay) {
                _this.paymentMethodService.paymentMethods = pm;
            }
        });
    };
    //Mapping to the payment method list.
    ReviewCartComponent.prototype.mapNewPayMethod = function (methodValues) {
        var oneTimePaymentMethod = new index_3.PaymentMethodModel();
        oneTimePaymentMethod.accountHolderName = methodValues.firstName + ' ' + methodValues.lastName;
        oneTimePaymentMethod.walletNickname = methodValues.nickname;
        oneTimePaymentMethod.saveMethod = false;
        oneTimePaymentMethod.isDefault = true;
        if (methodValues.ach) {
            oneTimePaymentMethod.walletType = 'ACH';
            oneTimePaymentMethod.accountType = methodValues.ach.accountType.toLocaleLowerCase();
            oneTimePaymentMethod.accountTail = methodValues.ach.account.slice(-4, methodValues.ach.account.length);
            this.selectedPaymentMethod = oneTimePaymentMethod;
            this.achTransaction.account = methodValues.ach.account;
            this.achTransaction.routing = methodValues.ach.routing;
            this.isCard = false;
        }
        else if (methodValues.creditCard) {
            // console.log("The CC methodValues: ", methodValues )
            oneTimePaymentMethod.walletType = 'CreditCard';
            oneTimePaymentMethod.accountType = methodValues.creditCard.cardType.toLocaleLowerCase();
            oneTimePaymentMethod.expiryMonth = methodValues.creditCard.expiryMonth;
            oneTimePaymentMethod.expiryYear = methodValues.creditCard.expiryYear;
            oneTimePaymentMethod.accountTail = methodValues.creditCard.cardNumber.slice(-4, methodValues.creditCard.cardNumber.length);
            this.selectedPaymentMethod = oneTimePaymentMethod;
            this.cardTransaction.cardNumber = methodValues.creditCard.cardNumber;
            this.cardTransaction.cardCode = methodValues.creditCard.cardCode;
            this.cardTransaction.street = methodValues.billingAddress;
            this.cardTransaction.street2 = methodValues.billingAddress2;
            this.cardTransaction.city = methodValues.billingCity;
            this.cardTransaction.state = methodValues.billingState;
            this.cardTransaction.zip = methodValues.billingZip;
            this.isCard = true;
        }
        this.paymentMethodService.paymentMethods.push(oneTimePaymentMethod);
    };
    //proposed never used
    ReviewCartComponent.prototype.isChecked = function (tail) {
        if (tail == this.selectedPaymentMethod.accountTail) {
            return true;
        }
        else {
            return false;
        }
    };
    //adds discount code
    ReviewCartComponent.prototype.applyDiscount = function () {
        if (!this.discountService.CheckoutItem || this.clearDiscounts) {
            this.applyingDiscount = true;
            this.pageLoadingService.show("Applying Discount Code...");
            //  console.log('discount code applied', this.discountCodeForm.value.discount);
            var code = this.discountCodeForm.value.discount;
            this.discountService.subscribeToApplyDiscount(this.loginResponse, code);
            this.discountCodeForm.reset();
        }
        else if (this.discountService.CheckoutItem && this.discountService.CheckoutItem.discounts.length > 0) {
            this.noMoreDiscounts = true;
        }
    };
    ReviewCartComponent.prototype.prepareToPay = function () {
        //console.log('prepareToPay');
        var payMethod = {
            payment: null,
            paymentChannel: '',
            validationToken: ''
        };
        if (this.selectedPaymentMethod &&
            this.selectedPaymentMethod.walletType.toLocaleLowerCase() == 'ach' &&
            this.utilityService.isAchBlocked(this.loginResponse)) {
            this.selectPaymentErr = true;
            this.selectPaymentErrMsg = "Please select a payment method.";
        }
        else if (this.selectedPaymentMethod) {
            if (this.selectedPaymentMethod.hasOwnProperty('walletKey')) {
                payMethod.payment = this.walletTransaction;
                payMethod.payment.paymentType = 'wallet';
                payMethod.payment.key = this.selectedPaymentMethod.walletKey;
            }
            else {
                if (this.isCard) {
                    this.cardTransaction.paymentType = 'credit';
                    this.cardTransaction.nameOnAccount = this.selectedPaymentMethod.accountHolderName;
                    this.cardTransaction.company = null;
                    this.cardTransaction.expiryMonth = this.selectedPaymentMethod.expiryMonth;
                    this.cardTransaction.expiryYear = this.selectedPaymentMethod.expiryYear;
                    if (this.selectedPaymentMethod.billingAddress2 == undefined) {
                        this.cardTransaction.street2 = '';
                    }
                    payMethod.payment = this.cardTransaction;
                }
                else {
                    this.achTransaction.paymentType = 'ach';
                    this.achTransaction.nameOnAccount = this.selectedPaymentMethod.accountHolderName;
                    this.achTransaction.accountType = this.selectedPaymentMethod.accountType;
                    payMethod.payment = this.achTransaction;
                }
            }
            //This is the correct way to handle the validationToken commenting out for development purposes
            if (this.discountService.CheckoutItem) {
                payMethod.validationToken = this.discountService.CheckoutItem.validationToken;
            }
            else if (this.cartCheckoutItemsService.checkOutItem.validationToken) {
                payMethod.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
            }
            else {
                payMethod.validationToken = this.validationToken;
            }
            //Use for development to force first pay attempt to fail to test error handling
            //if (this.validationToken) {
            //  payMethod.validationToken = this.validationToken;
            //} else {
            //  payMethod.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
            //}
            this.processpayNew(payMethod);
        }
        else {
            this.selectPaymentErr = true;
            this.selectPaymentErrMsg = "Please select a payment method.";
        }
    };
    ReviewCartComponent.prototype.processpayNew = function (payMethod) {
        var _this = this;
        //console.log('processPayNew')
        // console.log("The PayMethod: ", payMethod);
        var paymentType = this.cartCheckoutItemsService.cartItem.items[0]['liteItemType'];
        if (!this.selectPaymentErr) {
            this.pageLoadingService.show("Processing Payment...");
            if (this.web) {
                payMethod.paymentChannel = 'WEB';
            }
            else {
                payMethod.paymentChannel = 'MOBIL';
            }
            // this.subscriptionSaleT = this.cartCheckoutService.subscribeToPostSaleTransactionNew(payMethod, this.loginResponse);
            var failureMessage_1 = 'Transaction Failed';
            this.cartCheckoutService.postSaleTransactionNew(payMethod, this.loginResponse)
                .subscribe(function (data) {
                _this.cartCheckoutService.saleTransactionResponse = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage_1);
                _this.cartCheckoutService.postSaleResult = true;
                _this.cartCheckoutService.saleProcessed.emit(_this.cartCheckoutService.postSaleResult);
            }, function () {
                //console.log("Does this call complete: ", this.loginResponse)
                _this.cartCheckoutService.isPayPosted = true;
                _this.cartCheckoutService.postSaleResult = true;
                _this.cartCheckoutService.saleProcessed.emit(_this.cartCheckoutService.postSaleResult);
                _this.selectPaymentErr = false;
                _this.selectPaymentErrMsg = '';
                //This piece of code allows us to detect errors on checkouts when the payment method is created at time of checkout but not saved
                //In this scenario the payment method is only validated when the payment is posted and we need to subscribe to the event emitter in the event
                //The payment method is Invalid and handle the error
                //console.log("Did the sale Process? ", this.cartCheckoutService.postSaleResult)
                if (_this.cartCheckoutService.postSaleResult) {
                    if (_this.cartCheckoutService.postSaleResult == true) {
                        if (_this.cartCheckoutService.loginResponse.messageType === app_settings_1.Constants.Error) {
                            _this.pageLoadingService.hide();
                            _this.processPaymentError = true;
                            _this.processErrorMessage = _this.cartCheckoutService.loginResponse.message;
                            //if there is an conflict error, re-pull order summary (heavy cart) to show up to date info
                            // console.log("do we have an error message: ", this.cartCheckoutService.loginResponse.status)
                            if (_this.cartCheckoutService.loginResponse.status == '409') {
                                // console.log("We thAT 409: ", this.cartCheckoutService.isPayPosted);
                                _this.cartCheckoutService.result = false;
                                // this.cartCheckoutService.subscribeToPostSaleTransactionNew(payMethod, this.loginResponse);
                                //Gets the transaction again in teh event of a 409 error
                                _this.subscription =
                                    _this.cartCheckoutService.postSaleTransactionNew(payMethod, _this.loginResponse)
                                        .subscribe(function (data) {
                                        _this.cartCheckoutService.saleTransactionResponse = data;
                                    }, function (error) {
                                        _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage_1);
                                        _this.cartCheckoutService.postSaleResult = true;
                                        _this.cartCheckoutService.saleProcessed.emit(_this.cartCheckoutService.postSaleResult);
                                    }, function () {
                                        // console.log("Does this call complete: ", this.loginResponse)
                                        _this.cartCheckoutService.isPayPosted = true;
                                        _this.cartCheckoutService.postSaleResult = true;
                                        _this.cartCheckoutService.saleProcessed.emit(_this.cartCheckoutService.postSaleResult);
                                        _this.getCartListReview();
                                        _this.subscription.unsubscribe();
                                    });
                                _this.cartCheckoutService.result = false;
                            }
                            _this.utilityService.clearErrorMessage(_this.cartCheckoutService.loginResponse);
                        }
                        else {
                            if (_this.cartCheckoutService.loginResponse.status == '409' || _this.cartCheckoutService.loginResponse.status == '500') {
                                //  console.log("We had an error get CheckoutSummary Again")
                                _this.cartCheckoutService.result = false;
                                // console.log("About subscribeTopostCartCheckoutReviewItems - ReviewCart2")
                                // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                                // setTimeout(() => {
                                // console.log("We got a new checkout Summary:  ", this.cartCheckoutItemsService.checkOutItem)
                                //}, 2000)
                                _this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(_this.loginResponse)
                                    .subscribe(function (data) {
                                    _this.cartCheckoutItemsService.checkOutItem = data;
                                }, function (error) {
                                    // console.log("Error: No Checkout Item: ", this.checkOutItem);
                                    if (_this.cartCheckoutItemsService.checkOutItem) {
                                        _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                        _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                        _this.cartCheckoutItemsService.checkoutResults = true;
                                        _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                    }
                                    else {
                                        _this.cartCheckoutItemsService.checkoutResults = false;
                                    }
                                }, function () {
                                    _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                    // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                                    _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                    _this.cartCheckoutItemsService.checkoutResults = true;
                                    _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                    _this.validationToken = _this.cartCheckoutItemsService.checkOutItem.validationToken;
                                    _this.cartCheckoutService.loginResponse.status = '';
                                    _this.prepareToPay();
                                    _this.cartCheckoutService.result = true;
                                });
                            }
                            //  console.log('Review Cart about to add a Cookie: ', this.cartCheckoutService.loginResponse)
                            _this.loginStoreSrvc.loadLogin(_this.cartCheckoutService.loginResponse);
                            _this.processPaymentError = false;
                            //console.log("saleTransactionResponse: ", this.cartCheckoutService.saleTransactionResponse.cartResults)
                            if (_this.cartCheckoutService.saleTransactionResponse.cartResults) {
                                var i;
                                for (i = 0; i < _this.cartCheckoutService.saleTransactionResponse.cartResults.length; i++) {
                                    //console.log("Do we have a cookieStateItemHere: ", this.loginStoreSrvc.cookieStateItem)
                                    //console.log("The cartCheckout LoginResponse: ", this.cartCheckoutService.loginResponse)
                                    var cCount = _this.loginStoreSrvc.cookieStateItem.cartItemCount;
                                    // console.log("cCount: ", cCount)
                                    if (_this.loginResponse.cartItemCount === undefined) {
                                        //console.log("cartItemCount is undefined: ", this.loginResponse)
                                        //console.log("cCount = ", this.cCount)
                                        _this.cartCheckoutService.loginResponse.cartItemCount = _this.cCount;
                                    }
                                    if (!_this.receiptService.result) {
                                        //console.log("About to get the receipt")
                                        _this.subscription =
                                            _this.receiptService.getReceiptMod(_this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, _this.cartCheckoutService.loginResponse, paymentType)
                                                .subscribe(function (data) {
                                                _this.receiptService.receiptDetail = data;
                                                _this.receiptService.result = true;
                                            }, function (error) {
                                                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage_1);
                                                _this.receiptService.showReceipt = false;
                                            }, function () {
                                                _this.receiptService.transactions.push(_this.receiptService.receiptDetail);
                                                //console.log('transactions Length', this.transactions.length);
                                                //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
                                                if (_this.receiptService.result == true && _this.receiptService.transactions.length === _this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                                                    //console.log("Show receipt now: ", this.result)
                                                    _this.receiptService.receiptUpdate.emit(true);
                                                    _this.receiptService.processedPayment.emit(true);
                                                    _this.receiptService.showReceipt = _this.receiptService.result;
                                                    _this.showReceipt = _this.receiptService.showReceipt;
                                                    //console.log("Show receipt now: ", this.showReceipt )
                                                    _this.cartCheckoutService.saleTransactionResponse.cartResults = [];
                                                }
                                                if (_this.receiptService.receiptDetail && _this.receiptService.receiptDetail.areas[0]['area'] == 'USERFEE') {
                                                    _this.receiptService.receiptDetail['convenienceFee'] = 0;
                                                    _this.receiptService.receiptDetail['totalAmount'] = _this.receiptService.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                                                }
                                                // console.log("What district is getting the Receipt: ", loginResponse);
                                                _this.multiDistrictSvc.processedDistrict = _this.cartCheckoutService.loginResponse.districtName;
                                                //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);
                                            });
                                    }
                                }
                                if (!_this.receiptService.refreshDash) {
                                    if (_this.loginResponse) {
                                        _this.loginResponse.cartItemCount = 0;
                                        _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                        _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                        //  console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                                        _this.store.dispatch(new CartStoreActions.ClearCart());
                                    }
                                    else {
                                        _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                        // console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                                        _this.loginResponse.cartItemCount = 0;
                                        _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                        //After setting cartItemCount want to get the updated cookieStateItem
                                        _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                        // console.log("After Receipt Closes Ow what is LoginResponse: ", this.loginResponse);
                                        _this.store.dispatch(new CartStoreActions.ClearCart());
                                    }
                                    _this.getReceiptCounter++;
                                }
                                //setTimeout(() => {
                                //  if (this.backToDashboardCounter < 1 && this.receiptService.processedPayment) {
                                //    this.pageLoadingService.hide();
                                //    this.cartCheckoutItemsService.cartItem = <CartItem>{};
                                //    //console.log("Going back to DASHBOARD")
                                //    this.router.navigate(['/dashboard']);
                                //    this.cartCheckoutService.cartProcessed.emit(true);
                                //    this.refreshService.refreshCart();
                                //    this.backToDashboardCounter++;
                                //  }
                                //}, 2000)
                            }
                            else {
                                _this.cartResultInterval = setInterval(function () {
                                    if (_this.cartCheckoutService.saleTransactionResponse.cartResults && _this.getReceiptCounter < 2) {
                                        clearInterval(_this.cartResultInterval);
                                        // console.log("What are the saleTrans Cartresults: ", this.cartCheckoutService.saleTransactionResponse.cartResults)
                                        var i;
                                        for (i = 0; i < _this.cartCheckoutService.saleTransactionResponse.cartResults.length; i++) {
                                            //console.log("Do we have a cookieStateItemHere: ", this.loginStoreSrvc.cookieStateItem)
                                            //console.log("The cartCheckout LoginResponse: ", this.cartCheckoutService.loginResponse)
                                            var cCount = _this.loginStoreSrvc.cookieStateItem.cartItemCount;
                                            // console.log("cCount: ", cCount)
                                            if (_this.loginResponse.cartItemCount === undefined) {
                                                //console.log("cartItemCount is undefined: ", this.loginResponse)
                                                //console.log("cCount = ", this.cCount)
                                                _this.cartCheckoutService.loginResponse.cartItemCount = _this.cCount;
                                            }
                                            // this.receiptService.subscribeGetReceipt(this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, this.cartCheckoutService.loginResponse, paymentType);
                                            if (!_this.receiptService.result) {
                                                //console.log("About to get the receipt")
                                                _this.subscription =
                                                    _this.receiptService.getReceiptMod(_this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, _this.cartCheckoutService.loginResponse, paymentType)
                                                        .subscribe(function (data) {
                                                        // newJwt = data.headers;
                                                        _this.receiptService.receiptDetail = data;
                                                        _this.receiptService.result = true;
                                                    }, function (error) {
                                                        _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage_1);
                                                        _this.receiptService.showReceipt = false;
                                                    }, function () {
                                                        _this.receiptService.transactions.push(_this.receiptService.receiptDetail);
                                                        //console.log('transactions Length', this.transactions.length);
                                                        //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
                                                        if (_this.receiptService.result == true && _this.receiptService.transactions.length === _this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                                                            //console.log("Show receipt now: ", this.result)
                                                            _this.receiptService.receiptUpdate.emit(true);
                                                            _this.receiptService.processedPayment.emit(true);
                                                            _this.receiptService.showReceipt = _this.receiptService.result;
                                                            _this.showReceipt = _this.receiptService.showReceipt;
                                                            // console.log("Show receipt now: ", this.showReceipt )
                                                            _this.cartCheckoutService.saleTransactionResponse.cartResults = [];
                                                        }
                                                        if (_this.receiptService.receiptDetail && _this.receiptService.receiptDetail.areas[0]['area'] == 'USERFEE') {
                                                            _this.receiptService.receiptDetail['convenienceFee'] = 0;
                                                            _this.receiptService.receiptDetail['totalAmount'] = _this.receiptService.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                                                        }
                                                        // console.log("What district is getting the Receipt: ", loginResponse);
                                                        _this.multiDistrictSvc.processedDistrict = _this.cartCheckoutService.loginResponse.districtName;
                                                        //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);
                                                    });
                                            }
                                        }
                                        if (!_this.receiptService.refreshDash) {
                                            if (_this.loginResponse) {
                                                _this.loginResponse.cartItemCount = 0;
                                                _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                                _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                                //  console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                                                _this.store.dispatch(new CartStoreActions.ClearCart());
                                            }
                                            else {
                                                _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                                // console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                                                _this.loginResponse.cartItemCount = 0;
                                                _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                                //After setting cartItemCount want to get the updated cookieStateItem
                                                _this.loginResponse = _this.loginStoreSrvc.cookieStateItem;
                                                // console.log("After Receipt Closes Ow what is LoginResponse: ", this.loginResponse);
                                                _this.store.dispatch(new CartStoreActions.ClearCart());
                                            }
                                            _this.getReceiptCounter++;
                                        }
                                        //setTimeout(() => {
                                        //  if (this.backToDashboardCounter < 1 && this.receiptService.processedPayment) {
                                        //    this.pageLoadingService.hide();
                                        //    this.cartCheckoutItemsService.cartItem = <CartItem>{};
                                        //    //console.log("Going back to DASHBOARD")
                                        //    this.router.navigate(['/dashboard']);
                                        //    this.cartCheckoutService.cartProcessed.emit(true);
                                        //    this.refreshService.refreshCart();
                                        //    this.backToDashboardCounter++;
                                        //  }
                                        //}, 2000)
                                    }
                                }, 500);
                            }
                            //Stop
                        }
                    }
                    else {
                        // console.log("We got an error: ", this.selectPaymentErr)
                        if (_this.cartCheckoutService.loginResponse.status === '409') {
                            _this.cartCheckoutService.result = false;
                            // console.log("About subscribeTopostCartCheckoutReviewItems - ReviewCart3")
                            //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                            //setTimeout(() => {
                            //  // console.log("We got a new checkout Summary:  ", this.cartCheckoutItemsService.checkOutItem)
                            //  this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
                            //  this.cartCheckoutService.loginResponse.status = '';
                            //  this.prepareToPay();
                            //}, 1000)
                            _this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(_this.loginResponse)
                                .subscribe(function (data) {
                                _this.cartCheckoutItemsService.checkOutItem = data;
                            }, function (error) {
                                // console.log("Error: No Checkout Item: ", this.checkOutItem);
                                if (_this.cartCheckoutItemsService.checkOutItem) {
                                    _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                    _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                    _this.cartCheckoutItemsService.checkoutResults = true;
                                    _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                }
                                else {
                                    _this.cartCheckoutItemsService.checkoutResults = false;
                                }
                            }, function () {
                                _this.loginStoreSrvc.loadLogin(_this.loginResponse);
                                // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                                _this.cartCheckoutItemsService.isGettingCheckOutItems = _this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                                _this.cartCheckoutItemsService.checkoutResults = true;
                                _this.cartCheckoutItemsService.cartUpdate.emit(true);
                                _this.validationToken = _this.cartCheckoutItemsService.checkOutItem.validationToken;
                                _this.cartCheckoutService.loginResponse.status = '';
                                _this.prepareToPay();
                                // this.cartCheckoutService.result = true;
                            });
                            ++_this.cartCheckoutService.count;
                        }
                        else {
                            ++_this.cartCheckoutService.count;
                        }
                    } //
                }
                else {
                    _this.selectPaymentErr = true;
                    clearInterval(_this.saleInterval);
                    _this.pageLoadingService.hide();
                    _this.selectPaymentErrMsg = 'Not Acceptable. Please re-enter Your Payment Information.';
                }
            });
        }
    }; //End of process pay
    ReviewCartComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionSaleT) {
            this.subscriptionSaleT.unsubscribe();
            this.cartCheckoutService.saleTransactionResponse.cartResults = [];
            this.cartCheckoutItemsService.cartItem = this.emptyCartItem;
            this.checkOutItem = this.emptyCheckOutItem;
            this.cartItem = this.cartCheckoutItemsService.cartItem;
        }
        this.backToDashboardCounter = 0;
        this.getReceiptCounter = 0;
    };
    ReviewCartComponent = __decorate([
        core_1.Component({
            selector: 'review-cart',
            templateUrl: './review-cart.component.html',
            styleUrls: ['./review-cart.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_4.PaymentMethodService,
            index_2.UtilityService,
            forms_1.FormBuilder,
            payment_method_dialog_service_1.PaymentMethodDialogService,
            core_1.ViewContainerRef,
            page_loading_service_1.PageLoadingService,
            receipt_service_1.ReceiptService,
            index_1.CartCheckoutItemsService,
            index_1.CartCheckoutService,
            discount_service_1.DiscountService,
            store_1.Store,
            store_1.State,
            refresh_service_1.RefreshService,
            index_2.LoginStoreService,
            index_1.MultiDistrictService])
    ], ReviewCartComponent);
    return ReviewCartComponent;
}());
exports.ReviewCartComponent = ReviewCartComponent;
//# sourceMappingURL=review-cart.component.js.map