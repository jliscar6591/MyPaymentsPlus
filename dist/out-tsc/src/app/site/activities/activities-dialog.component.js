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
var store_1 = require("@ngrx/store");
var ActivityStoreActions = require("../../shared/store/actions/activityStore.actions");
var activities_service_1 = require("../services/activities.service");
var add_cart_item_service_1 = require("../services/add-cart-item.service");
var forms_service_1 = require("../services/forms.service");
var forms_1 = require("@angular/forms");
var index_1 = require("../../shared/services/index");
var forms_dialog_component_1 = require("./forms/forms-dialog/forms-dialog.component");
var picture_dialog_component_1 = require("./picture-dialog.component");
var page_loading_service_1 = require("../../shared/components/page-loading/page-loading.service");
var ActivitiesDialogComponent = /** @class */ (function () {
    function ActivitiesDialogComponent(dialog, dialogRef, store, activitiesService, validateCookie, formBuilder, pageLoadingService, addCartItemService, formsService, loginStoreSvc, data) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.store = store;
        this.activitiesService = activitiesService;
        this.validateCookie = validateCookie;
        this.formBuilder = formBuilder;
        this.pageLoadingService = pageLoadingService;
        this.addCartItemService = addCartItemService;
        this.formsService = formsService;
        this.loginStoreSvc = loginStoreSvc;
        this.data = data;
        this.mobile = false;
        this.activitiesReady = false;
        this.dialogActivityForm = new forms_1.FormGroup({
            activityAmount: new forms_1.FormControl(),
            quantity: new forms_1.FormControl()
        });
        this.isAdding = false;
        this.activityStore = store.select(function (state) { return state.activityStore; });
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ActivitiesDialogComponent.prototype.ngOnInit = function () {
        this.mobile = (window.innerWidth < 960) ? true : false;
        //console.log('data on the dialog', this.data);
        this.activitiesList = this.activitiesService.activitiesList;
        this.createForm();
    };
    ActivitiesDialogComponent.prototype.createForm = function () {
        this.dialogActivityForm = this.formBuilder.group({
            activityAmount: '',
            quantity: ''
        });
    };
    ActivitiesDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ActivitiesDialogComponent.prototype.openPictureDialog = function () {
        if (this.mobile) {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '300px',
                height: '300px',
                data: this.data.s3UriFull
            });
        }
        else {
            var dialogRef = this.dialog.open(picture_dialog_component_1.PictureDialogComponent, {
                width: '600px',
                data: this.data.s3UriFull
            });
        }
    };
    ActivitiesDialogComponent.prototype.addToCart = function (formId, studentKey) {
        var _this = this;
        if (formId !== 0) {
            this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
            this.pageLoadingService.show('Loading your forms');
            this.isAdding = true;
            if (this.dialogActivityForm.value.quantity === '') {
                this.data.quantity = 1;
                this.data.amountInCart = this.data.amount * this.data.quantity;
            }
            else {
                this.data.quantity = this.dialogActivityForm.value.quantity;
                this.data.amountInCart = this.data.amount * this.data.quantity;
            }
            this.openFormsDialogFixed();
        }
        else {
            if (this.dialogActivityForm.value.quantity === '') {
                this.data.quantity = 1;
                this.data.amountInCart = this.data.amount * this.data.quantity;
                var activity = this.data;
                this.addCartItemService.putCartActivityNew(activity, this.loginResponse)
                    .subscribe(function (response) {
                    _this.cartResponse = response;
                }, function (error) {
                    _this.addCartItemService.result = false;
                }, function () {
                    //console.log('activity added cart response', this.cartResponse);
                    _this.activitiesService.subscribeToGetActivities(_this.loginResponse);
                    _this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(_this.activitiesList));
                    _this.updateDialogData();
                    _this.dialogRef.close();
                });
            }
            else {
                this.data.quantity = this.dialogActivityForm.value.quantity;
                this.data.amountInCart = this.data.amount * this.data.quantity;
                var activity = this.data;
                this.addCartItemService.putCartActivityNew(activity, this.loginResponse)
                    .subscribe(function (response) {
                    _this.cartResponse = response;
                }, function (error) {
                    _this.addCartItemService.result = false;
                }, function () {
                    //console.log('activity added cart response', this.cartResponse);
                    _this.activitiesService.subscribeToGetActivities(_this.loginResponse);
                    _this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(_this.activitiesList));
                    _this.updateDialogData();
                    _this.dialogRef.close();
                });
            }
        }
    };
    ActivitiesDialogComponent.prototype.addToCartPartial = function (formId, studentKey) {
        var _this = this;
        if (formId !== 0) {
            this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
            this.data.quantity = 1;
            this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
            this.pageLoadingService.show('Loading your forms');
            this.isAdding = true;
            this.openFormsDialogPartial();
        }
        else if (parseInt(this.dialogActivityForm.value.activityAmount) < this.data.minimumPayment) {
            document.getElementById('amount').style.color = 'red';
        }
        else if (parseInt(this.dialogActivityForm.value.activityAmount) > this.data.amount) {
            document.getElementById('amount').style.color = 'red';
            document.getElementById('amount').innerHTML = 'Amount must be less than $' + this.data.amount;
        }
        else {
            //console.log('calling addCart ActivityPartial');
            this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
            this.data.quantity = 1;
            var activity = this.data;
            this.addCartItemService.putCartActivityNew(activity, this.loginResponse)
                .subscribe(function (response) {
                _this.cartResponse = response;
            }, function (error) {
                _this.addCartItemService.result = false;
            }, function () {
                //console.log('activity added cart response', this.cartResponse);
                _this.activitiesService.subscribeToGetActivities(_this.loginResponse);
                _this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(_this.activitiesList));
                _this.updateDialogData();
                _this.dialogRef.close();
            });
        }
    };
    ActivitiesDialogComponent.prototype.addToCartVariable = function (formId, studentKey) {
        var _this = this;
        //console.log('calling addCart ActivityVariable');
        if (formId !== 0) {
            this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
            this.data.quantity = 1;
            this.formsService.subscribeToGetForm(this.loginResponse, formId, studentKey);
            this.pageLoadingService.show('Loading your forms');
            this.isAdding = true;
            this.openFormsDialogVariable();
        }
        else if (this.dialogActivityForm.value.activityAmount === '') {
            this.data.amountInCart = this.data.amount;
            this.data.quantity = 1;
            var activity = this.data;
            this.addCartItemService.putCartActivityNew(activity, this.loginResponse)
                .subscribe(function (response) {
                _this.cartResponse = response;
            }, function (error) {
                _this.addCartItemService.result = false;
            }, function () {
                //console.log('activity added cart response', this.cartResponse);
                _this.activitiesService.subscribeToGetActivities(_this.loginResponse);
                _this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(_this.activitiesList));
                _this.updateDialogData();
                _this.dialogRef.close();
            });
        }
        else if (this.dialogActivityForm.value.activityAmount < 1) {
            document.getElementById('amount').style.color = 'red';
        }
        else {
            this.data.amountInCart = this.dialogActivityForm.value.activityAmount;
            this.data.quantity = 1;
            var activity = this.data;
            this.addCartItemService.putCartActivityNew(activity, this.loginResponse)
                .subscribe(function (response) {
                _this.cartResponse = response;
            }, function (error) {
                _this.addCartItemService.result = false;
            }, function () {
                //console.log('activity added cart response', this.cartResponse);
                _this.activitiesService.subscribeToGetActivities(_this.loginResponse);
                _this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(_this.activitiesList));
                _this.updateDialogData();
                _this.dialogRef.close();
            });
        }
    };
    ActivitiesDialogComponent.prototype.editAmount = function () {
        this.data.isInCart = false;
        this.data.quantity = 0;
        this.data.formResponse = [];
    };
    ActivitiesDialogComponent.prototype.updateDialogData = function () {
        this.data.isInCart = true;
    };
    ActivitiesDialogComponent.prototype.openFormsDialogFixed = function () {
        var _this = this;
        this.fixedInterval = setInterval(function () {
            if (_this.formsService.form) {
                _this.dialogRef.close();
                _this.pageLoadingService.hide();
                //console.log('form', this.formsService.form);
                var dialogRef = void 0;
                var config = new material_1.MatDialogConfig();
                config.panelClass = 'my-class';
                config.height = '750px';
                config.width = '750px';
                config.data = {
                    form: _this.formsService.form,
                    activity: _this.data,
                    quantity: _this.data.quantity,
                    amount: _this.data.amount,
                    isValid: null
                };
                config.disableClose = true;
                dialogRef = _this.dialog.open(forms_dialog_component_1.FormsDialogComponent, config);
                clearInterval(_this.fixedInterval);
            }
        }, 50);
    };
    ActivitiesDialogComponent.prototype.openFormsDialogPartial = function () {
        var _this = this;
        this.partialInterval = setInterval(function () {
            if (_this.formsService.form) {
                _this.dialogRef.close();
                _this.pageLoadingService.hide();
                //console.log('form', this.formsService.form);
                var dialogRef = void 0;
                var config = new material_1.MatDialogConfig();
                config.panelClass = 'my-class';
                config.height = '750px';
                config.width = '750px';
                config.data = {
                    form: _this.formsService.form,
                    activity: _this.data,
                    quantity: 1,
                    amount: _this.data.amount,
                    isValid: null
                };
                config.disableClose = true;
                dialogRef = _this.dialog.open(forms_dialog_component_1.FormsDialogComponent, config);
                clearInterval(_this.partialInterval);
            }
        }, 50);
    };
    ActivitiesDialogComponent.prototype.openFormsDialogVariable = function () {
        var _this = this;
        this.variableInterval = setInterval(function () {
            if (_this.formsService.form) {
                _this.dialogRef.close();
                _this.pageLoadingService.hide();
                //console.log('form', this.formsService.form);
                var dialogRef = void 0;
                var config = new material_1.MatDialogConfig();
                config.panelClass = 'my-class';
                config.height = '750px';
                config.width = '750px';
                config.data = {
                    form: _this.formsService.form,
                    activity: _this.data,
                    quantity: 1,
                    amount: _this.dialogActivityForm.value.activityAmount,
                    isValid: null
                };
                config.disableClose = true;
                dialogRef = _this.dialog.open(forms_dialog_component_1.FormsDialogComponent, config);
                clearInterval(_this.variableInterval);
            }
        }, 50);
    };
    ActivitiesDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-activities-dialog',
            templateUrl: './activities-dialog.component.html',
            styleUrls: ['./activities-dialog.component.less'],
            providers: [forms_service_1.FormsService]
        }),
        __param(10, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialog,
            material_1.MatDialogRef,
            store_1.Store,
            activities_service_1.ActivitiesService,
            index_1.ValidateCookieService,
            forms_1.FormBuilder,
            page_loading_service_1.PageLoadingService,
            add_cart_item_service_1.AddCartItemService,
            forms_service_1.FormsService,
            index_1.LoginStoreService, Object])
    ], ActivitiesDialogComponent);
    return ActivitiesDialogComponent;
}());
exports.ActivitiesDialogComponent = ActivitiesDialogComponent;
//# sourceMappingURL=activities-dialog.component.js.map