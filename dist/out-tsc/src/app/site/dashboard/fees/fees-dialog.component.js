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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var index_1 = require("../../services/index");
var index_2 = require("../../account/services/index");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var index_3 = require("../../../shared/services/index");
var forms_1 = require("@angular/forms");
var store_1 = require("@ngrx/store");
var FeeStoreActions = require("../../../shared/store/actions/feeStore.actions");
var FeesDialogComponent = /** @class */ (function () {
    function FeesDialogComponent(userContextService, studentMealsService, transferService, receiptService, utilityService, dialog, feesService, cookieService, validateCookie, messageProcessorService, districtLoginDerivedService, validCartCountService, addCartItemService, formBuilder, cartCheckoutItemsService, dialogRef, loginStoreSvc, store, data) {
        this.userContextService = userContextService;
        this.studentMealsService = studentMealsService;
        this.transferService = transferService;
        this.receiptService = receiptService;
        this.utilityService = utilityService;
        this.dialog = dialog;
        this.feesService = feesService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.districtLoginDerivedService = districtLoginDerivedService;
        this.validCartCountService = validCartCountService;
        this.addCartItemService = addCartItemService;
        this.formBuilder = formBuilder;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.dialogRef = dialogRef;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.data = data;
        this.cleanOutCart = false;
        this.cartProcessedFlag = this.transferService.cartProcessedEvt;
        this.cartItemCount = 0;
        this.feeAddedFlag = this.transferService.feeAddedToCart;
        this.belowMinimum = false;
        this.aboveMaximum = false;
        this.i = this.data.outsideIndex;
        this.j = this.data.insideIndex;
        this.dialogFeesForm = new forms_1.FormGroup({
            feeAmount: new forms_1.FormControl()
        });
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.feeStore = store.select(function (state) { return state.feeStore; });
    }
    FeesDialogComponent.prototype.ngOnInit = function () {
        this.feesList = this.feesService.feesList;
        //console.log('this is the data on the dialog', this.data);
        this.createForm();
    };
    FeesDialogComponent.prototype.createForm = function () {
        this.dialogFeesForm = this.formBuilder.group({
            feeAmount: '',
        });
    };
    FeesDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close(this.data.amountInCart);
    };
    FeesDialogComponent.prototype.addCartItem = function (i, j) {
        console.log("Calling addCartFEEitem");
        var feesList = this.feesList;
        var params = {
            outsideIndex: i,
            insideIndex: j,
        };
        console.log('params', params);
        this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
        this.updateCartAmount(i, j);
        this.feesList[i].fees[j].isInCart = true;
        this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amount;
        this.feesService.subscribeToGetFees(this.loginResponse);
        this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
        this.feesService.feesList[i].fees[j].isInCart = true;
    };
    //partial pay add item
    FeesDialogComponent.prototype.addCartItemPartial = function (i, j) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        //console.log("Calling addCartFEEitem");
        if (parseInt(this.dialogFeesForm.value.feeAmount) < this.data.minimumPayment && this.data.amountToPay > this.data.minimumPayment) {
            document.getElementById('hint').innerHTML = "Amount must be above " + formatter.format(this.feesList[i].fees[j].minimumPayment);
            document.getElementById('hint').style.color = "red";
        }
        else if (parseInt(this.dialogFeesForm.value.feeAmount) > this.feesList[i].fees[j].amountToPay) {
            document.getElementById('hint').style.color = "red";
            document.getElementById('hint').innerHTML = "Amount must be smaller than " + formatter.format(this.feesList[i].fees[j].amountToPay);
        }
        else if (parseInt(this.dialogFeesForm.value.feeAmount) < this.data.minimumPayment && this.data.amountToPay < this.data.minimumPayment) {
            this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
            this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
            this.data.amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
            console.log('hi');
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            console.log('params', params);
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
            this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
            //console.log('feesList before dispatch to feeStore', this.feesList);
            this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
            this.feesService.subscribeToGetFees(this.loginResponse);
            this.feesList = this.feesService.feesList;
            this.feesService.result = false;
            this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
            this.feesService.feesList[i].fees[j].isInCart = true;
        }
        else if (!this.dialogFeesForm.value.feeAmount) {
            this.belowMinimum = false;
            this.aboveMaximum = false;
            this.feesList[i].fees[j].amountInCart = this.feesList[i].fees[j].amountToPay;
            this.data.amountInCart = this.feesList[i].fees[j].amountToPay;
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            console.log('params', params);
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
        }
        else {
            this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
            this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
            this.data.amountToPay = this.feesList[i].fees[j].amountToPay - this.feesList[i].fees[j].amountInCart;
            var feesList = this.feesList;
            var params = {
                outsideIndex: i,
                insideIndex: j,
            };
            //console.log('params', params)
            this.addCartItemService.putCartFeeNew(feesList[i], params, this.loginResponse);
            this.updateCartAmount(i, j);
            this.feesList[i].fees[j].amountInCart = parseInt(this.dialogFeesForm.value.feeAmount);
            this.data.amountInCart = this.feesList[i].fees[j].amountInCart;
            //console.log('feesList before dispatch to feeStore', this.feesList);
            this.store.dispatch(new FeeStoreActions.LoadFeesSuccess(this.feesList));
            this.feesService.result = false;
            this.feesService.feesList[i].fees[j].isInCart = true;
        }
    };
    FeesDialogComponent.prototype.editAmount = function (i, j) {
        this.data.isInCart = false;
    };
    FeesDialogComponent.prototype.updateCartAmount = function (i, j) {
        this.feesList[i].fees[j].isInCart = true;
        this.data.isInCart = true;
    };
    FeesDialogComponent = __decorate([
        core_1.Component({
            selector: 'fees-dialog',
            templateUrl: './fees-dialog.component.html',
            styleUrls: ['./fees-dialog.component.less']
        }),
        __param(18, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [index_2.UserContextService,
            index_1.StudentMealsService,
            index_1.TransfersService,
            receipt_service_1.ReceiptService,
            index_3.UtilityService,
            material_1.MatDialog,
            index_1.FeesService,
            index_3.CookieService,
            index_3.ValidateCookieService,
            index_3.MessageProcessorService,
            index_3.DistrictLoginDerivedService,
            index_1.ValidCartCountService,
            index_1.AddCartItemService,
            forms_1.FormBuilder,
            index_1.CartCheckoutItemsService,
            material_1.MatDialogRef,
            index_3.LoginStoreService,
            store_1.Store, Object])
    ], FeesDialogComponent);
    return FeesDialogComponent;
}());
exports.FeesDialogComponent = FeesDialogComponent;
//# sourceMappingURL=fees-dialog.component.js.map