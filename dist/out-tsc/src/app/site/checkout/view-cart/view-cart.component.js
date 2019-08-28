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
var index_2 = require("../../../shared/services/index");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var material_1 = require("@angular/material");
var orientation_service_1 = require("../../services/orientation.service");
//import { clearInterval } from 'timers';
//import { setInterval, clearInterval } from 'timers';
var ViewCartComponent = /** @class */ (function () {
    function ViewCartComponent(router, formBuilder, cartCheckoutItemsService, utilityService, pageLoadingService, addCartItemService, snackBar, loginStoreSvc, store, orientationService, state) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.utilityService = utilityService;
        this.pageLoadingService = pageLoadingService;
        this.addCartItemService = addCartItemService;
        this.snackBar = snackBar;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.orientationService = orientationService;
        this.state = state;
        this.showProceed = false;
        this.proceedValid = true;
        this.cartCallCount = 0;
        this.testcount = 0;
        this.cartStateCounter = 0;
        this.readyForCheckout = true;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    ViewCartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        // console.log("view cart : ", this.addCartItemService.cartResponse);
        if (this.addCartItemService.cartResponse) {
            this.subscription = this.addCartItemService.cartUpdate.subscribe(function () {
                if (_this.addCartItemService.cartResponse) {
                    _this.showProceed = (_this.addCartItemService.cartResponse.items.length > 0) ? true : false;
                }
                else {
                    var temptState = void 0;
                    var tempCartItem = void 0;
                    _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                    temptState = _this.cartState;
                    if (temptState) {
                        tempCartItem = temptState.data;
                        _this.showProceed = (tempCartItem.items.length > 0) ? true : false;
                    }
                }
            });
            //  console.log("ShowProceed: ", this.showProceed)
        }
        else {
            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
            if (this.cartCheckoutItemsService.cartItem && this.cartCheckoutItemsService.cartItem.itemCount > 0 && !this.cartState) {
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem));
            }
        }
        //this.subscription = this.cartCheckoutItemsService.cartUpdate.subscribe(() => {
        //  let listLength: number;
        //  let temptState: any;
        //  let tempCartItem: CartItem;
        //  this.cartStore.subscribe(c => this.cartState = c);
        //  temptState = this.cartState;
        //  if (temptState) {
        //    tempCartItem = temptState.data;
        //    //console.log("What is the tempCartItem: ", tempCartItem);
        //    this.showProceed = (tempCartItem.items.length > 0) ? true : false;
        //  } else {
        //    if (this.cartCheckoutItemsService.cartItem.items) {
        //      listLength = this.cartCheckoutItemsService.cartItem.items.length;
        //      //  console.log(this.cartCheckoutItemsService.cartItem)
        //    } else {
        //      listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
        //      // console.log(this.cartCheckoutItemsService.checkOutItem)
        //    }
        //    this.showProceed = (listLength > 0) ? true : false;
        //    //console.log("ShowProceed2: ", this.showProceed)
        //  }
        //});
        var cartUpdateInterval = setInterval(function () {
            if (_this.cartCheckoutItemsService.checkOutItem) {
                clearInterval(cartUpdateInterval);
                // console.log("checkoutResults: ", this.cartCheckoutItemsService.checkoutResults)
                //this.cartUpdate$.subscribe(() => {
                var listLength = void 0;
                var temptState = void 0;
                var tempCartItem = void 0;
                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                temptState = _this.cartState;
                if (temptState) {
                    tempCartItem = temptState.data;
                    //  console.log("What is the tempCartItem: ", tempCartItem);
                    _this.showProceed = (tempCartItem.items.length > 0) ? true : false;
                }
                else {
                    if (_this.cartCheckoutItemsService.cartItem.items) {
                        listLength = _this.cartCheckoutItemsService.cartItem.items.length;
                        //  console.log(this.cartCheckoutItemsService.cartItem)
                    }
                    else {
                        listLength = _this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
                        // console.log(this.cartCheckoutItemsService.checkOutItem)
                    }
                    _this.showProceed = (listLength > 0) ? true : false;
                    //console.log("ShowProceed2: ", this.showProceed)
                }
                //});
            }
        }, 500);
        this.checkOutProceed =
            this.subscription = this.cartCheckoutItemsService.cartUpdate.subscribe(function () {
                //  console.log("Subscribing to Checkout CartUpdate")
                var listLength;
                if (_this.cartCheckoutItemsService.cartItem.items) {
                    listLength = _this.cartCheckoutItemsService.cartItem.items.length;
                }
                else {
                    //listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
                    listLength = _this.cartState.itemCount;
                }
                _this.showProceed = (listLength > 0) ? true : false;
                //console.log("Show Proceed: ", this.showProceed);
            });
        this.subscription = this.cartCheckoutItemsService.cartValid.subscribe(function (valid) {
            _this.proceedValid = valid;
        });
    };
    ViewCartComponent.prototype.ngDoCheck = function () {
        var listLength;
        if (this.cartCheckoutItemsService.cartItem.items) {
            listLength = this.cartCheckoutItemsService.cartItem.items.length;
        }
        else {
            //listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
            listLength = this.cartState.itemCount;
        }
        this.showProceed = (listLength > 0) ? true : false;
    };
    ViewCartComponent.prototype.proceed = function () {
        var _this = this;
        // console.log('proceed: ', this.proceedValid)
        this.pageLoadingService.show("Going To Checkout...");
        var temptState;
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        temptState = this.cartState;
        if (this.proceedValid) {
            // console.log("About subscribeTopostCartCheckoutReviewItems - ViewCart1")
            // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
            this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
                .subscribe(function (data) {
                _this.cartCheckoutItemsService.checkOutItem = data;
                // console.log("we got checkOutItem data: ", this.cartCheckoutItemsService.checkOutItem)
            }, function (error) {
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
                _this.cartUpdate$ = new rxjs_1.Observable(function (observer) {
                    observer.next(true);
                    observer.complete();
                });
                _this.cartUpdate$.pipe(operators_1.first(function (data) { return data == true; }));
                _this.cartCheckoutItemsService.checkoutResults = true;
                _this.cartCheckoutItemsService.cartUpdate.emit(true);
                _this.pageLoadingService.hide();
                _this.router.navigate(['/review']);
            });
        }
        else {
            this.pageLoadingService.hide();
            this.openErrorSnackBar();
        }
    };
    ViewCartComponent.prototype.openErrorSnackBar = function () {
        this.snackBar.open('Please correct errors in cart', '', {
            duration: 3000,
        });
    };
    ViewCartComponent.prototype.ngOnDestroy = function () {
        // this.subscription.unsubscribe();
        this.addCartItemService.cartUpdate.emit(false);
    };
    ViewCartComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'view-cart',
            templateUrl: './view-cart.component.html',
            styleUrls: ['./view-cart.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.CartCheckoutItemsService,
            index_2.UtilityService,
            page_loading_service_1.PageLoadingService,
            index_1.AddCartItemService,
            material_1.MatSnackBar,
            index_2.LoginStoreService,
            store_1.Store,
            orientation_service_1.OrientationService,
            store_1.State])
    ], ViewCartComponent);
    return ViewCartComponent;
}());
exports.ViewCartComponent = ViewCartComponent;
//# sourceMappingURL=view-cart.component.js.map