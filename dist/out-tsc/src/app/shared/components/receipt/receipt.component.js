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
var receipt_service_1 = require("./receipt.service");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var index_1 = require("../../../site/services/index");
var index_2 = require("../../../shared/services/index");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var services_1 = require("../../../site/account/services");
var add_cart_item_service_1 = require("../../../site/services/add-cart-item.service");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
//import { clearInterval } from 'timers';
//import { setInterval } from 'timers';
var ReceiptComponent = /** @class */ (function () {
    function ReceiptComponent(receiptService, cd, store, state, refreshService, loginStoreSvc, cartCheckoutService, router, addCartItemService, paymentHistoryService, pageLoadingService) {
        this.receiptService = receiptService;
        this.cd = cd;
        this.store = store;
        this.state = state;
        this.refreshService = refreshService;
        this.loginStoreSvc = loginStoreSvc;
        this.cartCheckoutService = cartCheckoutService;
        this.router = router;
        this.addCartItemService = addCartItemService;
        this.paymentHistoryService = paymentHistoryService;
        this.pageLoadingService = pageLoadingService;
        this.displayReceipt = true;
        this.displayHistoryReceipt = true;
        this.changeReceipt = new core_1.EventEmitter();
        this.receiptUpdate = new core_1.EventEmitter();
        this.isbonusAmount = true;
        this.receiptReady = false;
        this.receiptDataCounter = 0;
        this.receiptCall = 0;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    ReceiptComponent.prototype.ngOnInit = function () {
        // console.log("Calling Receipt Component:", this.receiptService.transactions)
        this.pageLoadingService.show("Getting Receipt Details");
        if (this.receiptService.transactions) {
            //console.log('Receipt trasactions on page load', this.receiptService.transactions);
            //console.log(this.receiptService.receiptType);
            //console.log('what is this', this.cartCheckoutService.saleTransactionResponse);
            //console.log(this.receiptService.showReceipt);
            // clearInterval(this.receiptDetailInterval);
            this.receiptType = this.receiptService.receiptType;
            this.transactions = this.receiptService.transactions;
            this.cd.markForCheck();
            this.receiptReady = true;
            //console.log("Do we have details yet: ", this.receiptService.receiptDetail)
            if (this.receiptService.receiptDetail) {
                // console.log("What is the detail: ", this.receiptService.receiptDetail)
                if (this.receiptType == 'purchase') {
                    if (this.transactions) {
                        //console.log('whats the receipt type - purchase');
                        //  console.log("Displaying the Receipt: ", this.transactions)
                        this.displayReceipt = true;
                        this.displayHistoryReceipt = false;
                        // console.log("Setting show Receipt")
                        this.pageLoadingService.hide();
                    }
                }
                else {
                    //console.log('whats the receipt type - history');
                    // console.log("Displaying the Receipt from timeOut: ", this.transactions)
                    this.displayReceipt = false;
                    this.displayHistoryReceipt = true;
                    this.pageLoadingService.hide();
                }
                // console.log('cartResponse: ', this.addCartItemService.cartResponse)
                //if (this.addCartItemService.cartResponse) {
                //  this.addCartItemService.cartResponse.itemCount = 0;
                //}
                //} else {
                //  const cartRespIntrvl =
                //    setInterval(() => {
                //      if (this.addCartItemService.cartResponse) {
                //        this.addCartItemService.cartResponse.itemCount = 0;
                //        clearInterval(cartRespIntrvl);
                //      }
                //    }, 500)
                //}
            }
            else {
                this.displayHistoryReceipt = true;
                this.displayReceipt = true;
            }
        }
        else {
            this.displayReceipt = false;
        }
    };
    ReceiptComponent.prototype.ngAfterViewInit = function () {
    };
    ReceiptComponent.prototype.ngDoCheck = function () {
        // console.log("Do we know the receipt type: ", this.receiptType);
        if (this.receiptType == 'history') {
            //  console.log("What is Show Receipt: ", this.showReceipt);
            var printDiv = document.querySelector('.history-receipt');
            this.receiptService.openTabReceipt(printDiv);
        }
    };
    ReceiptComponent.prototype.setReceiptReady = function () {
        return true;
    };
    ReceiptComponent.prototype.printReceipt = function () {
        var printDiv = document.querySelector('.receipt-container');
        //console.log("Here is the print content: ", printDiv.innerHTML);
        //removed width and height detail to force window to open in a new tab
        var windowObject = window.open("", '_blank');
        windowObject.document.write('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />');
        windowObject.document.writeln(printDiv.innerHTML);
        windowObject.document.write('<link rel="stylesheet" type="text/css" href="../../assets/css/print.css">');
        var btnContainer = windowObject.document.createElement('div');
        btnContainer.id = 'printBtnContainer';
        windowObject.document.body.appendChild(btnContainer);
        var btnHTML = '<div class="print-button-row">';
        btnHTML += '<button id="print" onclick="window.focus(); window.print(); window.close()">Print</button>';
        btnHTML += '<button id="cancel" onclick="window.close();">Cancel</button>';
        btnHTML += '</div>';
        btnContainer.innerHTML = btnHTML;
        windowObject.document.close();
        this.receiptService.result = false;
    };
    ReceiptComponent.prototype.closeReceipt = function () {
        var _this = this;
        //console.log('does this happen');
        this.displayReceipt = false;
        this.displayHistoryReceipt = false;
        this.changeReceipt.emit(this.displayHistoryReceipt);
        this.receiptUpdate.emit(this.displayHistoryReceipt);
        this.receiptReady = false;
        this.receiptService.hide();
        this.loginStoreSvc.cookieStateItem.cartItemCount = 0;
        this.receiptService.result = false;
        this.store.dispatch(new CartStoreActions.ClearCart());
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        var temptState = this.cartState;
        this.displayHistoryReceipt = false;
        this.displayReceipt = false;
        this.changeReceipt.emit(this.displayHistoryReceipt);
        this.receiptDataCounter = 0;
        this.receiptService.transactions = [];
        this.receiptService.refreshDash = true;
        this.refreshService.refreshCart();
        this.addCartItemService.cartResponse.itemCount = 0;
    };
    ReceiptComponent.prototype.closeHistoryReceipt = function () {
        //console.log('or does this');
        this.displayReceipt = false;
        this.displayHistoryReceipt = false;
        this.changeReceipt.emit(this.displayHistoryReceipt);
        this.receiptUpdate.emit(this.displayHistoryReceipt);
        this.receiptReady = false;
        this.receiptService.hideHistory();
        var paymentType = this.receiptService.paymentType;
        this.receiptService.result = false;
        this.displayHistoryReceipt = false;
        this.displayReceipt = false;
        this.changeReceipt.emit(this.displayHistoryReceipt);
        this.receiptDataCounter = 0;
        this.receiptService.transactions = [];
        this.refreshService.refreshCart();
    };
    ReceiptComponent.prototype.ngOnDestroy = function () {
        //this.subscription.unsubscribe();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ReceiptComponent.prototype, "displayReceipt", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ReceiptComponent.prototype, "displayHistoryReceipt", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ReceiptComponent.prototype, "changeReceipt", void 0);
    ReceiptComponent = __decorate([
        core_1.Component({
            selector: 'app-receipt',
            templateUrl: './receipt.component.html',
            styleUrls: ['./receipt.component.less'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [receipt_service_1.ReceiptService,
            core_1.ChangeDetectorRef,
            store_1.Store,
            store_1.State,
            refresh_service_1.RefreshService,
            index_2.LoginStoreService,
            index_1.CartCheckoutService,
            router_1.Router,
            add_cart_item_service_1.AddCartItemService,
            services_1.PaymentHistoryService,
            page_loading_service_1.PageLoadingService])
    ], ReceiptComponent);
    return ReceiptComponent;
}());
exports.ReceiptComponent = ReceiptComponent;
//# sourceMappingURL=receipt.component.js.map