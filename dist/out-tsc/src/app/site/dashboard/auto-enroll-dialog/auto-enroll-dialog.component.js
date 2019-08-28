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
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var store_1 = require("@ngrx/store");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var forms_service_1 = require("../../services/forms.service");
var auto_enroll_forms_component_1 = require("./auto-enroll-forms.component");
var material_2 = require("@angular/material");
var auto_enroll_bottom_sheet_component_1 = require("../auto-enroll-dialog/auto-enroll-bottom-sheet/auto-enroll-bottom-sheet.component");
var orientation_service_1 = require("../../services/orientation.service");
var material_3 = require("@angular/material");
var AutoEnrollDialogComponent = /** @class */ (function () {
    function AutoEnrollDialogComponent(addCartItemService, data, dialogRef, loginStoreSvc, store, dialog, feesService, cookieService, validateCookie, messageProcessorService, districtLoginDerivedService, cartCheckoutItemsService, validCartCountService, activitiesService, formBuilder, formsService, cartCheckoutService, orientationService, snackBar, bottomSheet) {
        this.addCartItemService = addCartItemService;
        this.data = data;
        this.dialogRef = dialogRef;
        this.loginStoreSvc = loginStoreSvc;
        this.store = store;
        this.dialog = dialog;
        this.feesService = feesService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.districtLoginDerivedService = districtLoginDerivedService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.validCartCountService = validCartCountService;
        this.activitiesService = activitiesService;
        this.formBuilder = formBuilder;
        this.formsService = formsService;
        this.cartCheckoutService = cartCheckoutService;
        this.orientationService = orientationService;
        this.snackBar = snackBar;
        this.bottomSheet = bottomSheet;
        this.showButton = false;
        this.listReady = false;
        this.newFormsCounter = 0;
        this.selectedAllTotal = 0;
        this.selectAll = false;
        this.step = 0;
        this.hasOrientations = false;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.feeStore = store.select(function (state) { return state.feeStore; });
        this.cartStore = store.select(function (state) { return state.cartStore; });
    }
    AutoEnrollDialogComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.mobile = (window.innerWidth < 960) ? true : false;
                this.feesList = this.feesService.feesList;
                this.autoFeesList = this.data.feesList;
                this.autoCartList = this.data.cart;
                //console.log(this.autoFeesList);
                //console.log(this.autoCartList);
                this.listReady = true;
                this.selectedFees = [];
                this.selectedActivities = [];
                this.selectedAll = [];
                this.newForms = [];
                return [2 /*return*/];
            });
        });
    };
    AutoEnrollDialogComponent.prototype.ngDoCheck = function () {
    };
    AutoEnrollDialogComponent.prototype.openBottomSheet = function (item) {
        this.bottomSheet.open(auto_enroll_bottom_sheet_component_1.AutoEnrollBottomSheetComponent, {
            data: item
        });
    };
    AutoEnrollDialogComponent.prototype.selectAllItems = function () {
        this.selectedAll = [];
        var i;
        for (i = 0; i < this.autoFeesList.length; i++) {
            this.selectedAll.push(this.autoFeesList[i]);
        }
        var j;
        for (j = 0; j < this.autoCartList.length; j++) {
            this.selectedAll.push(this.autoCartList[j]);
        }
        this.selectedAllTotal = 0;
        var k;
        for (k = 0; k < this.selectedAll.length; k++) {
            this.selectedAllTotal = this.selectedAll[k].amount + this.selectedAllTotal;
        }
        this.selectAll = true;
    };
    AutoEnrollDialogComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    AutoEnrollDialogComponent.prototype.nextStep = function () {
        this.step++;
    };
    AutoEnrollDialogComponent.prototype.prevStep = function () {
        this.step--;
    };
    AutoEnrollDialogComponent.prototype.onCheckBoxChange = function (event, index, item, student) {
        item.checked = !item.checked;
        // console.log('checked?', item.checked);
        if (item.checked) {
            // console.log(index, event, item);
            var response = {
                'accountBalanceID': student.accountBalanceID,
                'orientationItemID': item.orientationItemId,
                'signed': item.checked
            };
            this.responses.push(response);
            // console.log("responses", this.responses);
            this.nextStep();
        }
        else {
            var i;
            for (i = 0; i < this.responses.length; i++) {
                if (this.responses[i].orientationItemID === item.orientationItemId) {
                    this.responses.splice(i, 1);
                }
            }
        }
    };
    AutoEnrollDialogComponent.prototype.onChange = function (mrChange) {
        console.log(mrChange.value);
        var mrButton = mrChange.source;
        this.showButton = true;
        console.log(mrButton.name);
        console.log(mrButton.checked);
        console.log(mrButton.inputId);
        this.nextStep();
    };
    AutoEnrollDialogComponent.prototype.hideSubmit = function () {
        var _this = this;
        this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
        this.orientationInterval = setInterval(function () {
            _this.gettingOrientation = true;
            if (_this.orientationService.orientationResponse) {
                // console.log('response',this.orientationService.orientationResponse);
                _this.gettingOrientation = false;
                _this.responses = [];
                _this.openSnackBar();
                clearInterval(_this.orientationInterval);
            }
        }, 1000);
    };
    AutoEnrollDialogComponent.prototype.openSnackBar = function () {
        this.snackBar.open('Documents Submitted', '✔', {
            duration: 2000,
        });
    };
    //Creates a FeeItem to be added to the cart
    AutoEnrollDialogComponent.prototype.preProcessAddFeeAmount = function (cartItem, studentKey, name) {
        //console.log('is this being called');
        var cartFeeDetail = {
            liteItemType: 'fee',
            itemKey: cartItem.feeTransactionKey,
            districtKey: this.loginResponse.districtKey,
            accountBalanceID: studentKey,
            itemName: cartItem.feeName,
            itemAmount: cartItem.amount,
            amountInCart: cartItem.amountInCart,
            amountToPay: cartItem.amount - cartItem.amountInCart,
            studentName: name,
            isPartialPayEligible: cartItem.supportsPartialPay,
            partialPayDue: cartItem.partialPayDue,
            minimumPayment: cartItem.minimumPayment
        };
        this.broadCastCartFeeItem(cartFeeDetail);
        return cartFeeDetail;
    };
    AutoEnrollDialogComponent.prototype.broadCastCartFeeItem = function (cartFeeDetail) {
        this.broadCastDetail = cartFeeDetail;
        return this.broadCastDetail;
    };
    AutoEnrollDialogComponent.prototype.preProcessActivityAddAmount = function (cartItem, studentKey, studentName) {
        var cartActivityDetail = {
            liteItemType: 'activity',
            itemKey: cartItem.activityKey,
            districtKey: this.loginResponse.districtKey,
            accountBalanceID: cartItem.studentKey,
            itemName: cartItem.activityName,
            itemAmount: cartItem.amount,
            studentName: cartItem.studentName,
            isPartialPayEligible: cartItem.isPartialPay,
            partialPayDue: cartItem.partialPayDue,
            minimumPayment: cartItem.minimumPayment,
            amountInCart: cartItem.amountInCart,
            quantity: cartItem.quantity,
            formResponse: cartItem.formResponse,
            activityFormId: cartItem.activityFormId,
        };
        this.broadCastCartActivityItem(cartActivityDetail);
        return cartActivityDetail;
    };
    AutoEnrollDialogComponent.prototype.broadCastCartActivityItem = function (cartActivityDetail) {
        this.broadCastDetail = cartActivityDetail;
        return this.broadCastDetail;
    };
    //Adds and removes activities from the selected activity list when clicked
    AutoEnrollDialogComponent.prototype.onSelectionActivities = function (e, v) {
        console.log('v', v);
        console.log('e.option', e.option);
        this.newlySelected = [];
        this.newlySelected.push(e.option.value);
        if (this.selectedActivities.length === 0) {
            this.selectedActivities.push(e.option.value);
        }
        else {
            if (this.selectedActivities.includes(e.option.value)) {
                var i;
                for (i = 0; i < this.selectedActivities.length; i++) {
                    if (this.selectedActivities[i] === e.option.value) {
                        this.selectedActivities.splice(i, 1);
                    }
                }
            }
            else {
                this.selectedActivities.push(e.option.value);
            }
            //console.log('selectedActivites', this.selectedActivities);
        }
        this.selectedAll = this.selectedActivities.concat(this.selectedFees);
        if (this.selectedAll === false) { }
        this.selectedAllTotal = 0;
        var j;
        for (j = 0; j < this.selectedAll.length; j++) {
            this.selectedAllTotal = this.selectedAll[j].amount + this.selectedAllTotal;
        }
        this.checkForNewForms();
    };
    //Adds and removes fees from the selected fees list when clicked
    AutoEnrollDialogComponent.prototype.onSelectionFees = function (e, v) {
        //console.log('v', v);
        //console.log('e.option', e.option);
        if (this.selectedFees.length === 0) {
            this.selectedFees.push(e.option.value);
        }
        else {
            if (this.selectedFees.includes(e.option.value)) {
                var i;
                for (i = 0; i < this.selectedFees.length; i++) {
                    if (this.selectedFees[i] === e.option.value) {
                        this.selectedFees.splice(i, 1);
                    }
                }
            }
            else {
                this.selectedFees.push(e.option.value);
            }
            //console.log('selectedFees', this.selectedFees);
        }
        this.selectedAll = this.selectedActivities.concat(this.selectedFees);
        this.selectedAllTotal = 0;
        var j;
        for (j = 0; j < this.selectedAll.length; j++) {
            this.selectedAllTotal = this.selectedAll[j].amount + this.selectedAllTotal;
        }
    };
    //Adds all selected activities and fees to the cart
    AutoEnrollDialogComponent.prototype.addAutoEnrolledItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, j, params;
            return __generator(this, function (_a) {
                this.selectedAll = [];
                for (i = 0; i < this.selectedActivities.length; i++) {
                    this.selectedActivities[i].amountInCart = this.selectedActivities[i].amount;
                    this.selectedActivities[i].quantity = 1;
                    this.selectedAll.push(this.selectedActivities[i]);
                }
                for (j = 0; j < this.selectedFees.length; j++) {
                    this.selectedFees[j].amountInCart = this.selectedFees[j].amount;
                    params = {
                        outsideIndex: this.selectedFees[j].outsideIndex,
                        insideIndex: this.selectedFees[j].insideIndex,
                    };
                    this.selectedAll.push(this.selectedFees[j]);
                }
                // console.log('selected all', this.selectedAll);
                this.addCartItemService.subscribeToPostCartGroup(this.selectedAll, this.loginResponse);
                return [2 /*return*/];
            });
        });
    };
    //Sees if any the activities added to the cart have a required form
    AutoEnrollDialogComponent.prototype.checkForNewForms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.newForms = [];
                        this.formsService.newForms = [];
                        this.activitiesWithForms = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.newlySelected.length)) return [3 /*break*/, 4];
                        if (!(this.newlySelected[i].activityFormId !== 0)) return [3 /*break*/, 3];
                        this.activitiesWithForms.push(this.newlySelected[i]);
                        return [4 /*yield*/, this.formsService.subscribeToGetForm(this.loginResponse, this.newlySelected[i].activityFormId, this.newlySelected[i].studentKey)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.formInterval = setInterval(function () {
                            console.log('newlySelected', _this.newlySelected);
                            if (_this.newlySelected[0].activityFormId !== 0) {
                                if (_this.formsService.newForms.length > 0) {
                                    _this.newForms = _this.formsService.newForms;
                                    console.log('forms that need to be filled out', _this.newForms);
                                    clearInterval(_this.formInterval);
                                    _this.openAutoEnrollFormsDialog();
                                }
                            }
                            else {
                                clearInterval(_this.formInterval);
                                _this.addAutoEnrolledItems();
                                console.log('why doesnt it clear this interval');
                            }
                        }, 50);
                        return [2 /*return*/];
                }
            });
        });
    };
    //Opens dialog containing list of activities and fees
    AutoEnrollDialogComponent.prototype.openAutoEnrollFormsDialog = function () {
        if (!this.mobile) {
            //console.log('does this get called?');
            var config = new material_1.MatDialogConfig();
            config.panelClass = 'my-class';
            config.disableClose = true;
            config.maxHeight = '750px';
            config.width = '750px';
            config.data = {
                forms: this.newForms,
                activities: this.activitiesWithForms,
                quantity: 1
            };
            var dialogRef = this.dialog.open(auto_enroll_forms_component_1.AutoEnrollFormsComponent, config);
        }
        else {
            console.log('does this get called?');
            console.log('new forms', this.newForms);
            console.log('activities with forms', this.activitiesWithForms);
            var config = new material_1.MatDialogConfig();
            config.panelClass = 'my-class';
            config.disableClose = true;
            config.maxHeight = '675px';
            config.width = '350px';
            config.data = {
                forms: this.newForms,
                activities: this.activitiesWithForms,
                quantity: 1
            };
            var dialogRef = this.dialog.open(auto_enroll_forms_component_1.AutoEnrollFormsComponent, config);
        }
    };
    //closes dialog
    AutoEnrollDialogComponent.prototype.onNoClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dialogRef.close();
                return [2 /*return*/];
            });
        });
    };
    AutoEnrollDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-auto-enroll-dialog',
            templateUrl: './auto-enroll-dialog.component.html',
            styleUrls: ['./auto-enroll-dialog.component.less'],
            providers: [forms_service_1.FormsService]
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [index_1.AddCartItemService, Object, material_1.MatDialogRef,
            index_2.LoginStoreService,
            store_1.Store,
            material_1.MatDialog,
            index_1.FeesService,
            index_2.CookieService,
            index_2.ValidateCookieService,
            index_2.MessageProcessorService,
            index_2.DistrictLoginDerivedService,
            index_1.CartCheckoutItemsService,
            index_1.ValidCartCountService,
            index_1.ActivitiesService,
            forms_1.FormBuilder,
            forms_service_1.FormsService,
            index_1.CartCheckoutService,
            orientation_service_1.OrientationService,
            material_3.MatSnackBar,
            material_2.MatBottomSheet])
    ], AutoEnrollDialogComponent);
    return AutoEnrollDialogComponent;
}());
exports.AutoEnrollDialogComponent = AutoEnrollDialogComponent;
//# sourceMappingURL=auto-enroll-dialog.component.js.map