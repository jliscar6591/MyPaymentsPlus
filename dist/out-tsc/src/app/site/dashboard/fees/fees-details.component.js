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
var material_1 = require("@angular/material");
var fees_component_1 = require("./fees.component");
var fees_dialog_component_1 = require("./fees-dialog.component");
var site_home_component_1 = require("../../site-home.component");
var index_1 = require("../../services/index");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var index_2 = require("../../../shared/services/index");
var forms_1 = require("@angular/forms");
var store_1 = require("@ngrx/store");
var FeeStoreActions = require("../../../shared/store/actions/feeStore.actions");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var FeesDetailsComponent = /** @class */ (function () {
    function FeesDetailsComponent(feesComponent, siteHomeComponent, 
    // private userContextService: UserContextService,
    studentMealsService, transferService, receiptService, 
    //  private utilityService: UtilityService,
    dialog, feesService, 
    // private cookieService: CookieService,
    validateCookie, 
    // private messageProcessorService: MessageProcessorService,
    //  private districtLoginDerivedService: DistrictLoginDerivedService,
    validCartCountService, addCartItemService, 
    // private cartCheckoutItemsService: CartCheckoutItemsService,
    loginStoreSvc, formBuilder, refreshService, store, state) {
        this.feesComponent = feesComponent;
        this.siteHomeComponent = siteHomeComponent;
        this.studentMealsService = studentMealsService;
        this.transferService = transferService;
        this.receiptService = receiptService;
        this.dialog = dialog;
        this.feesService = feesService;
        this.validateCookie = validateCookie;
        this.validCartCountService = validCartCountService;
        this.addCartItemService = addCartItemService;
        this.loginStoreSvc = loginStoreSvc;
        this.formBuilder = formBuilder;
        this.refreshService = refreshService;
        this.store = store;
        this.state = state;
        this.feeCallCount = 0;
        this.cleanOutCart = false;
        this.cartProcessedFlag = this.transferService.cartProcessedEvt;
        this.cartItemCount = 0;
        this.feeAddedFlag = this.transferService.feeAddedToCart;
        this.belowMinimum = false;
        this.aboveMaximum = false;
        this.empty = NaN;
        this.submitted = false;
        this.feesForm = new forms_1.FormGroup({
            feeAmount: new forms_1.FormControl(),
        });
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.feeStore = store.select(function (state) { return state.feeStore; });
        this.createForm();
    }
    FeesDetailsComponent.prototype.createForm = function () {
        this.feesForm = this.formBuilder.group({
            feeAmount: '',
        });
    };
    FeesDetailsComponent.prototype.ngOnInit = function () {
        //this.subscription = this.feesService.subscribeToGetFees(this.loginResponse);
        this.feesList = this.feesService.feesList;
        this.feeCallCount = 0;
    };
    FeesDetailsComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.addCartItemService.result) {
            //console.log('cartResponse on ng do check', this.addCartItemService.cartResponse);
            var tempResponse = void 0;
            tempResponse = this.addCartItemService.cartResponse;
            this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempResponse));
            this.addCartItemService.result = false;
        }
        if (this.addCartItemService.result && this.feeState.loaded) {
            this.feeStore.subscribe(function (c) { return _this.feeState = c; });
            this.feeInterval = setInterval(function () {
                if (_this.feeState.data) {
                    _this.feesList = _this.feeState.data;
                    clearInterval(_this.feeInterval);
                }
            }, 1000);
            this.addCartItemService.result = false;
            //console.log('does this run when i add on ein the dialog');
        }
        if (this.feesService.result === true && this.feeCallCount === 0) {
            this.feesService.subscribeToGetFees(this.loginResponse);
            this.feesList = this.feesService.feesList;
            this.feesService.result = false;
            //console.log('what am i getting in here before the dispatch', this.feesList);
            this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
            this.feeStore.subscribe(function (c) { return _this.feeState = c; });
            this.feesList = this.feeState.data;
            this.feeCallCount = 1;
        }
    };
    FeesDetailsComponent.prototype.ngAfterContentInit = function () {
        //console.log('here is the current feesList on the fee-details component', this.feesList);
    };
    FeesDetailsComponent.prototype.editAmount = function (i, j) {
        this.feesList[i].fees[j].isInCart = false;
        this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amountInCart + this.feesList[i].fees[j].amountToPay;
    };
    FeesDetailsComponent.prototype.formatFeeDetails = function (studentKey, feeTransactionKey) {
        //console.log(this.feesList);
        var i;
        for (i = 0; i < this.feesList.length; i++) {
            if (studentKey === this.feesList[i].studentKey) {
                this.name = this.feesList[i].name;
                this.studentKey = this.feesList[i].studentKey;
                //console.log('student key: ', this.studentKey);
                var j;
                for (j = 0; j < this.feesList[i].fees.length; j++) {
                    if (feeTransactionKey === this.feesList[i].fees[j].feeTransactionKey) {
                        this.insideIndex = j;
                        this.outsideIndex = i;
                        this.feeTransactionKey = this.feesList[i].fees[j].feeTransactionKey;
                        this.description = this.feesList[i].fees[j].description;
                        this.dueDate = this.feesList[i].fees[j].dueDate;
                        this.feeName = this.feesList[i].fees[j].feeName;
                        //console.log('fee key: ', this.feeTransactionKey);
                        this.minimumPayment = this.feesList[i].fees[j].minimumPayment;
                        this.partialPayDue = this.feesList[i].fees[j].partialPayDue;
                        this.supportsPartialPay = this.feesList[i].fees[j].supportsPartialPay;
                        this.amount = this.feesList[i].fees[j].amount;
                        this.amountInCart = this.feesList[i].fees[j].amountInCart;
                        this.amountToPay = this.feesList[i].fees[j].amountToPay;
                        this.notificationType = this.feesList[i].fees[j].notificationType;
                        this.isInCart = this.feesList[i].fees[j].isInCart;
                    }
                }
            }
        }
        this.openFeeDialog();
    };
    FeesDetailsComponent.prototype.openFeeDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(fees_dialog_component_1.FeesDialogComponent, {
            width: '650px',
            data: {
                outsideIndex: this.outsideIndex,
                insideIndex: this.insideIndex,
                name: this.name,
                student: this.studentKey,
                feeTransactionKey: this.feeTransactionKey,
                description: this.description,
                dueDate: this.dueDate,
                feeName: this.feeName,
                minimumPayment: this.minimumPayment,
                partialPayDue: this.partialPayDue,
                supportsPartialPay: this.supportsPartialPay,
                amount: this.amount,
                amountToPay: this.amountToPay,
                amountInCart: this.amountInCart,
                notificationType: this.notificationType,
                isInCart: this.isInCart
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (_this.addCartItemService.cartResponse) {
                _this.feesList[_this.outsideIndex].fees[_this.insideIndex].amountInCart = result;
                _this.feesList[_this.outsideIndex].fees[_this.insideIndex].amountToPay = _this.amountToPay - result;
                _this.feesList[_this.outsideIndex].fees[_this.insideIndex].isInCart = true;
            }
        });
    };
    ;
    FeesDetailsComponent.prototype.updateCartAmount = function (i, j) {
        this.feesList[i].fees[j].isInCart = true;
    };
    ;
    FeesDetailsComponent.prototype.addCartItem = function (i, j) {
        var _this = this;
        console.log("Calling addCartFEEitem");
        var feesList = this.feesList;
        var params = {
            outsideIndex: i,
            insideIndex: j,
        };
        this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
        this.updateCartAmount(i, j);
        this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amount;
        this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amount - this.feesList[i].fees[j].amountInCart;
        //console.log('feesList before dispatch to feeStore', this.feesList);
        this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList));
        this.feeStore.subscribe(function (c) { return _this.feeState = c; });
        this.feesList = this.feeState.data;
        this.siteHomeComponent.fixCartFlag = true;
        //this.refreshService.refreshCart();
        //console.log('cartResponse', this.addCartItemService.cartResponse);
    };
    //partial pay add item
    FeesDetailsComponent.prototype.addCartItemPartial = function (i, j) {
        var _this = this;
        console.log("what is going on");
        console.log('fees form value', this.feesForm.value.feeAmount);
        console.log('feeslist', this.feesList);
        console.log('i & j', i, j);
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        if (parseInt(this.feesForm.value.feeAmount) < this.feesList[i].fees[j].minimumPayment && this.feesList[i].fees[j].amountToPay > this.feesList[i].fees[j].minimumPayment) {
            document.getElementById('amount' + i + j).innerHTML = "Amount must be above " + formatter.format(this.feesList[i].fees[j].minimumPayment);
            document.getElementById('amount' + i + j).style.color = "red";
            console.log('hi');
        }
        else if (parseInt(this.feesForm.value.feeAmount) > this.feesList[i].fees[j].amountToPay) {
            document.getElementById('amount' + i + j).style.color = "red";
            document.getElementById('amount' + i + j).innerHTML = "Amount must be smaller than " + formatter.format(this.feesList[i].fees[j].amountToPay);
            console.log('hi');
        }
        else if (parseInt(this.feesForm.value.feeAmount) < this.feesList[i].fees[j].minimumPayment && this.feesList[i].fees[j].amountToPay < this.feesList[i].fees[j].minimumPayment) {
            console.log('hi');
            this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
            console.log(this.feesList[i].fees[j].amountInCart);
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            console.log('params', params);
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
            this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amount - this.feesList[i].fees[j].amountInCart;
            console.log('feesList before dispatch to feeStore', this.feesList);
            this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList));
            this.feeStore.subscribe(function (c) { return _this.feeState = c; });
            this.feesList = this.feeState.data;
            this.siteHomeComponent.fixCartFlag = true;
        }
        else if (!this.feesForm.value.feeAmount) {
            console.log('hi');
            this.belowMinimum = false;
            this.aboveMaximum = false;
            //console.log('is it NaN');
            this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountToPay;
            //console.log('cart amount i want to show in cart', this.feesList[i].fees[j].amountInCart);
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            console.log('params', params);
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            //console.log('feesList before dispatch to feeStore', this.feesList);
            this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList));
            this.feeStore.subscribe(function (c) { return _this.feeState = c; });
            this.feesList = this.feeState.data;
            this.siteHomeComponent.fixCartFlag = true;
        }
        else {
            this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
            this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountInCart;
            this.feesList[i].fees[j].amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            console.log('params', params);
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            this.feesList[i].fees[j].amountInCart = parseInt(this.feesForm.value.feeAmount);
            //console.log('feesList before dispatch to feeStore', this.feesList);
            this.store.dispatch(new FeeStoreActions.AddFeesSuccess(this.feesList));
            this.feeStore.subscribe(function (c) { return _this.feeState = c; });
            this.feesList = this.feeState.data;
            this.feesService.feesList[i].fees[j].isInCart = true;
            this.siteHomeComponent.fixCartFlag = true;
        }
    };
    FeesDetailsComponent.prototype.ngOnDestroy = function () {
        this.feesService.feesList = [];
        this.store.dispatch(new FeeStoreActions.LoadFees());
        //console.log('feesList on destory', this.feesList);
    };
    FeesDetailsComponent = __decorate([
        core_1.Component({
            selector: 'fees-details',
            templateUrl: './fees-details.component.html',
            styleUrls: ['./fees-details.component.less']
        }),
        __metadata("design:paramtypes", [fees_component_1.FeesComponent,
            site_home_component_1.SiteHomeComponent,
            index_1.StudentMealsService,
            index_1.TransfersService,
            receipt_service_1.ReceiptService,
            material_1.MatDialog,
            index_1.FeesService,
            index_2.ValidateCookieService,
            index_1.ValidCartCountService,
            index_1.AddCartItemService,
            index_2.LoginStoreService,
            forms_1.FormBuilder,
            refresh_service_1.RefreshService,
            store_1.Store,
            store_1.State])
    ], FeesDetailsComponent);
    return FeesDetailsComponent;
}());
exports.FeesDetailsComponent = FeesDetailsComponent;
//# sourceMappingURL=fees-details.component.js.map