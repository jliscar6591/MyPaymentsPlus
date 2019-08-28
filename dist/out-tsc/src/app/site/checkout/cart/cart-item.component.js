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
var forms_1 = require("@angular/forms");
require("rxjs/add/observable/interval");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var dialog_1 = require("@angular/material/dialog");
var forms_service_1 = require("../../services/forms.service");
var forms_dialog_component_1 = require("../../activities/forms/forms-dialog/forms-dialog.component");
var picture_dialog_component_1 = require("../../activities/picture-dialog.component");
var CartItemComponent = /** @class */ (function () {
    function CartItemComponent(dialog, router, formsService, addCartItemService, 
    // private validateCookie: ValidateCookieService,
    cookieService, utilityService, dialogService, viewContainerRef, cartCheckoutItemsService, formBuilder, transferSrvc, validCartCountService, loginStoreSvc, store, state) {
        this.dialog = dialog;
        this.router = router;
        this.formsService = formsService;
        this.addCartItemService = addCartItemService;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.dialogService = dialogService;
        this.viewContainerRef = viewContainerRef;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.formBuilder = formBuilder;
        this.transferSrvc = transferSrvc;
        this.validCartCountService = validCartCountService;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.state = state;
        this.mobile = false;
        this.pipe = true;
        this.isReview = false;
        this.failedAddCartAmount = false;
        this.failedAddCartAmountMsg = '';
        this.isAddCartAmountSaving = false;
        this.isCanEdit = true;
        this.hasCounter = 0;
        this.invalidQuantity = false;
        this.isMobile = new core_1.EventEmitter();
        this.updated = new core_1.EventEmitter();
        this.remove = new core_1.EventEmitter();
        this.formErrors = {
            'editAmount': ''
        };
        this.validationMessages = {
            'editAmount': {
                'pattern': 'Amount must be valid.',
                'required': 'Amount must be valid.',
                'minimumAmount': 'Amount must be greater than 0.'
            },
        };
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    ;
    CartItemComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mobile = (window.innerWidth < 960) ? true : false;
                        this.isMobile.subscribe(function (value) {
                            _this.mobile = value;
                        });
                        this.form = this.createEditForm();
                        if (this.router.url == '/checkout') {
                            //console.log("What is the Model: ", this.model);
                        }
                        if (this.router.url == '/review') {
                            this.isReview = true;
                            //console.log("What is the Model: ", this.model);
                        }
                        if (!!this.isReview) return [3 /*break*/, 2];
                        if (!this.form) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.form.valueChanges
                                .subscribe(function (data) { return _this.utilityService.onValueChanged(_this.form, _this.formErrors, _this.validationMessages); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        //this.quantityForm = new FormGroup({
                        //  quantity: new FormControl()
                        //});
                        // console.log("About to subscribeToGetCartCheckoutCartItem - CartItem1:  ", this.cartCheckoutItemsService.cartItem)
                        if (this.cartCheckoutItemsService.cartItem) {
                            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                            this.cartStateItems = this.cartCheckoutItemsService.cartItem;
                        }
                        else {
                            this.getcartItemInterval = window.setInterval(function () {
                                if (_this.cartCheckoutItemsService.cartItem) {
                                    var newCartItem = _this.cartCheckoutItemsService.cartItem;
                                    _this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem));
                                    _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                                    _this.cartStateItems = _this.cartState.data;
                                    window.clearInterval(_this.getcartItemInterval);
                                }
                            }, 1000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CartItemComponent.prototype.createEditForm = function () {
        var group = new forms_1.FormGroup({});
        group.addControl('editAmount' + this.insideIndex, new forms_1.FormControl(''));
        return group;
    };
    CartItemComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.addCartItemService.cartResponse && this.hasCounter < 4) {
            var newCartItem = this.cartCheckoutItemsService.cartItem;
            this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem));
            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
            this.cartStateItems = this.cartState.data;
            this.hasCounter++;
        }
    };
    CartItemComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.transferSrvc.feeCartItem) {
            // this.isTransfer = this.getCartItemType();
            window.setTimeout(function () {
                _this.getCartItemType();
            }, 1000);
            // console.log("Is this a transferFee: ", this.isTransfer)
        }
    };
    CartItemComponent.prototype.validate = function () {
        this.utilityService.onValueChanged(this.form, this.formErrors, this.validationMessages);
    };
    //Determine in the row is a meal
    CartItemComponent.prototype.isMeal = function (liteItemType) {
        return liteItemType == 'meal';
    };
    CartItemComponent.prototype.isFee = function (liteItemType) {
        return liteItemType == 'fee';
    };
    CartItemComponent.prototype.isActivity = function (liteItemType) {
        return liteItemType == 'activity';
    };
    CartItemComponent.prototype.confirmRemove = function (item) {
        var _this = this;
        var dialogContent = '<p>Please confirm that you would like to remove the following item from your cart:</p>';
        if (this.isMeal(item.liteItemType)) {
            dialogContent += '<br/><p><b>' + item.studentName + "'s meal plan</b></p><p>" + item.itemName + "</p>";
            if (!isNaN(item.amountInCart)) {
                dialogContent += "<p>Remove $" + item.itemAmount + "</p>";
                //console.log(item.itemAmount);
            }
        }
        else if (this.isFee(item.liteItemType)) {
            dialogContent += '<br/><p><b>' + item.itemName + "</b></p><p>$" + item.amountInCart + '</p>';
        }
        else if (this.isActivity(item.liteItemType)) {
            dialogContent += '<br/><p><b>' + item.itemName + "</b></p><p>$" + item.amountInCart + '</p>';
        }
        this.dialogService.open("Delete Item", dialogContent, 'Delete', null, this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                _this.remove.emit({
                    item: item,
                    index: _this.insideIndex
                });
                // console.log("What is result: ", result)
                //console.log("About to subscribeToGetCartCheckoutCartItem - CartItem2: ")
                _this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(_this.loginResponse);
                window.setTimeout(function () {
                    var newCartItem = _this.cartCheckoutItemsService.cartItem;
                    _this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem));
                    _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                    _this.cartStateItems = _this.cartState.data;
                    _this.updateCartStore(item);
                }, 1000);
                //console.log(result);
                _this.addCartItemService.deleteCartItemNew(item.itemKey, item.accountBalanceID, _this.loginResponse);
                //this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                window.setTimeout(function () {
                    _this.updateCartStore(item);
                }, 1000);
            }
            ;
        });
    };
    CartItemComponent.prototype.updateCartStore = function (item) {
        var _this = this;
        //  console.log("What is our Item: ", item);
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        if (this.cartState) {
            this.cartStateItems = this.cartState.data;
            // console.log('cartstate',this.cartStateItems);
        }
        //  console.log("Do we have cartStateItem: ", this.cartStateItems)
        if (this.cartStateItems.items) {
            // console.log("Do we have cartStateItem.Items: ", this.cartStateItems.items.length)
            this.cartStateItems.items.length;
            for (var i = 0; i < this.cartStateItems.itemCount; i++) {
                var x = 0;
                if (item.itemKey == this.cartStateItems.items[i].itemKey && item.accountBalanceID == this.cartStateItems.items[i].accountBalanceID) {
                    // console.log("What is I and I: ", i);
                    var removedTotal = this.cartStateItems.items[i].amountInCart;
                    if (this.cartStateItems.subTotal) {
                        this.cartStateItems.subTotal = this.cartStateItems.total - removedTotal;
                    }
                    else {
                        this.cartStateItems.subTotal = 0;
                    }
                    if (this.cartStateItems.total < 1) {
                        this.cartStateItems.total = 0;
                        this.cartStateItems.consumerFeeTotal = 0;
                    }
                    x = i + 1;
                    if (this.cartStateItems.items.length > 0) {
                        this.store.dispatch(new CartStoreActions.ClearCart());
                        //console.log('is store clear', this.cartState);
                        //console.log('whats going in here?', this.cartStateItems)
                        this.loginResponse.cartItemCount = this.cartStateItems.itemCount;
                        this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartStateItems));
                        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                        this.cartStateItems = this.cartState.data;
                        //console.log('cartStateItems after dispatch', this.cartStateItems);
                        //console.log('this.model', this.model);
                    }
                    else {
                        this.store.dispatch(new CartStoreActions.ClearCart());
                        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                        this.cartStateItems = this.cartState.data;
                    }
                    this.cartCheckoutItemsService.cartItem = this.cartStateItems;
                }
            }
        }
    };
    CartItemComponent.prototype.isNaN = function (num) {
        return isNaN(num) || (num == '');
    };
    CartItemComponent.prototype.update = function (item, insideIndex) {
        this.item = item;
        //console.log('update this.item', this.item);
        //console.log('what is this?', Number(this.form.get('editAmount' + insideIndex).value));
        //console.log('this.form', this.form);
        if (this.form.get('editAmount' + insideIndex).value !== '') {
            if (this.item.liteItemType === 'meal') {
                //this.model.itemAmount = Number(this.form.get('editAmount' + insideIndex).value);
                this.item.itemAmount = Number(this.form.get('editAmount' + insideIndex).value);
                this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
            }
            else if (this.item.liteItemType === 'fee') {
                if (Number(this.form.get('editAmount' + insideIndex).value) < this.model.minimumPayment) {
                    this.form.controls['editAmount' + insideIndex].status = 'INVALID';
                    this.formErrors = {
                        'editAmount': 'Amount must be greater than' + this.model.minimumPayment,
                    };
                }
                else if (Number(this.form.get('editAmount' + insideIndex).value) > this.item.itemAmount) {
                    this.form.controls['editAmount' + insideIndex].status = 'INVALID';
                    this.formErrors = {
                        'editAmount': 'Amount must be less than' + this.item.itemAmount,
                    };
                }
                else {
                    this.form.status = 'VALID';
                    //console.log(this.model.itemKey);
                    //console.log(this.item.itemKey);
                    //console.log('no its me', this.form.get('editAmount' + insideIndex).value);
                    this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
                    //this.model.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
                    this.form.controls['editAmount' + insideIndex].setValue(Number(this.form.get('editAmount' + insideIndex).value));
                }
            }
            else if (this.item.liteItemType === 'activity') {
                if (Number(this.form.get('editAmount' + insideIndex).value) < this.model.minimumPayment) {
                    this.form.controls['editAmount' + insideIndex].status = 'INVALID';
                    this.formErrors = {
                        'editAmount': 'Amount must be greater than' + this.model.minimumPayment,
                    };
                }
                else if (Number(this.form.get('editAmount' + insideIndex).value) > this.item.itemAmount) {
                    this.form.controls['editAmount' + insideIndex].status = 'INVALID';
                    this.formErrors = {
                        'editAmount': 'Amount must be less than' + this.item.itemAmount,
                    };
                }
                else {
                    this.form.status = 'VALID';
                    //console.log('model key', this.model.itemKey);
                    //console.log('item key', this.item.itemKey);
                    //console.log('no its me', this.form.get('editAmount' + insideIndex).value);
                    this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
                    //this.model.amountInCart = this.form.get('editAmount' + insideIndex).value;
                    this.form.controls['editAmount' + insideIndex].setValue(Number(this.form.get('editAmount' + insideIndex).value));
                }
            }
            else if (this.form.get('editAmount' + insideIndex).value === NaN) {
                if (this.item.liteItemType === 'meal') {
                    this.item.itemAmount = this.model.itemAmount;
                    this.item.amountInCart = this.model.amountInCart;
                }
                else {
                    //console.log('me', this.model.amountInCart);
                    this.item.amountInCart = this.model.amountInCart;
                    this.form.controls['editAmount' + insideIndex].setValue(this.model.amountInCart);
                }
            }
            if (this.form.controls['editAmount' + insideIndex].status === 'VALID') {
                this.updated.emit(this.item);
                //console.log('updated item', this.item);
                //sets cart validity on components listening to cart
                this.cartCheckoutItemsService.cartValidity(true);
            }
            else {
                this.cartCheckoutItemsService.cartValidity(false);
            }
            //Removed quantity changer for now will add back later
            //if (this.model.isQuantity) {
            //  if (this.quantityForm.value.quantity <= 1) {
            //    this.invalidQuantity = true;
            //  } else if (this.quantityForm.value.quanity !== '') {
            //    this.invalidQuantity = false;
            //    this.item.quantity = this.quantityForm.value.quantity;
            //    this.item.amountInCart = this.model.itemAmount;
            //    this.model.quantity = this.quantityForm.value.quantity
            //  } else {
            //    this.invalidQuantity = false;
            //    this.item.quantity = this.model.quantity;
            //    this.item.amountInCart = this.model.itemAmount;
            //  }
            //}
            //console.log('what is the value of the edit form', this.form.get('editAmount' + insideIndex).value);
            //  console.log(this.item);
            //if (this.form.valid) {
            //  //emits when item gets updated to save
            //  this.updated.emit(this.item);
            //  console.log('updated item', item);
            //  //sets cart validity on components listening to cart
            //  this.cartCheckoutItemsService.cartValidity(true);
            //}
            //else {
            //  this.cartCheckoutItemsService.cartValidity(false);
            //}
        }
    };
    CartItemComponent.prototype.focusAmount = function ($event) {
        //remove pipe on focus to avoid trying to format invalid values
        this.pipe = false;
        //adds back trailing .00 if needed
        //if (this.form.get('editAmount').value !== '' && this.form.get('editAmount').value !== 0) {
        //  this.form.get('editAmount').setValue(parseFloat(this.form.get('editAmount').value).toFixed(2));
        //}
        //selects entire input on focus
        $event.target.select();
    };
    CartItemComponent.prototype.getCartItemType = function () {
        // console.log("What is feeCartItem: ", this.transferSrvc.feeCartItem);
        if (this.transferSrvc.feeCartItem) {
            var cartType = this.transferSrvc.feeCartItem['liteItemType'];
            //If true disable the input
            if (cartType == "userFee") {
                this.isTransfer = true;
                this.isCanEdit = false;
            }
            else {
                this.isTransfer = false;
                this.isCanEdit = true;
            }
        }
        else {
            this.isCanEdit = true;
            this.isTransfer = false;
        }
        //console.log("What is isTransfer: ", this.isTransfer);
        // console.log("What is CanEdit: ", this.isCanEdit)
    };
    CartItemComponent.prototype.populateForm = function (formId) {
        this.uniqueResponses = [];
        this.uniqueForms = [];
        this.responses = this.model.formResponse;
        //console.log('formId', this.model.activityFormId);
        //console.log('responses', this.responses);
        this.formsService.subscribeToGetForm(this.loginResponse, this.model.activityFormId, this.model.accountBalanceID);
        var i;
        for (i = 0; i < this.responses.length; i++) {
            this.uniqueResponses.push(this.responses[i].responseSetId);
        }
        this.uniqueForms = this.uniqueResponses.filter(this.getUniqueResponses);
        //console.log('number of forms to dislplay in tabs', this.uniqueForms.length);
        this.openFormsDialogFixed();
    };
    CartItemComponent.prototype.getUniqueResponses = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    CartItemComponent.prototype.openFormsDialogFixed = function () {
        var _this = this;
        window.setTimeout(function () {
            //console.log('form', this.formsService.form);
            var config = new dialog_1.MatDialogConfig();
            config.panelClass = 'my-class';
            config.width = '750px';
            config.data = {
                form: _this.formsService.form,
                activity: _this.model,
                responses: _this.responses,
                quantity: _this.uniqueForms.length,
                uniqueForms: _this.uniqueForms
            };
            config.disableClose = true;
            var dialogRef = _this.dialog.open(forms_dialog_component_1.FormsDialogComponent, config);
        }, 1000);
    };
    CartItemComponent.prototype.openPictureDialog = function () {
        if (this.mobile) {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '200px',
                height: '300px',
                data: this.model.s3UriFull
            });
        }
        else {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '600px',
                data: this.model.s3UriFull
            });
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], CartItemComponent.prototype, "quantityForm", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CartItemComponent.prototype, "model", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CartItemComponent.prototype, "insideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CartItemComponent.prototype, "checkout", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.EventEmitter)
    ], CartItemComponent.prototype, "isMobile", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CartItemComponent.prototype, "updated", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], CartItemComponent.prototype, "remove", void 0);
    CartItemComponent = __decorate([
        core_1.Component({
            selector: 'cart-item',
            templateUrl: './cart-item.component.html',
            styleUrls: ['./cart-item.component.less'],
            providers: [forms_dialog_component_1.FormsDialogComponent]
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog,
            router_1.Router,
            forms_service_1.FormsService,
            index_1.AddCartItemService,
            index_2.CookieService,
            index_2.UtilityService,
            simple_dialog_service_1.SimpleDialogService,
            core_1.ViewContainerRef,
            index_1.CartCheckoutItemsService,
            forms_1.FormBuilder,
            index_1.TransfersService,
            index_1.ValidCartCountService,
            index_2.LoginStoreService,
            store_1.Store,
            store_1.State])
    ], CartItemComponent);
    return CartItemComponent;
}());
exports.CartItemComponent = CartItemComponent;
//# sourceMappingURL=cart-item.component.js.map