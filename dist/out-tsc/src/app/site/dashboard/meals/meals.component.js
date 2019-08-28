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
var refresh_service_1 = require("../../../shared/services/refresh.service");
var receipt_service_1 = require("../../../shared/components/receipt/receipt.service");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
var suspend_payment_warning_service_1 = require("../../../shared/components/suspend-payment-warning/suspend-payment-warning.service");
var index_3 = require("../../services/index");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../../../shared/store/actions/cartStore.actions");
var MealStoreActions = require("../../../shared/store/actions/mealStore.actions");
var core_2 = require("@capacitor/core");
var MealsComponent = /** @class */ (function () {
    function MealsComponent(router, formBuilder, studentMealsService, studentMealsServiceRemote, addCartItemService, utilityService, suspendPaymentWarningService, validateCartService, store, state, receiptService, refreshService, transfersService, multiDistrictSvc, loginStoreSvc, 
    //public cdr: ChangeDetectorRef,
    pageLoadingService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.studentMealsService = studentMealsService;
        this.studentMealsServiceRemote = studentMealsServiceRemote;
        this.addCartItemService = addCartItemService;
        this.utilityService = utilityService;
        this.suspendPaymentWarningService = suspendPaymentWarningService;
        this.validateCartService = validateCartService;
        this.store = store;
        this.state = state;
        this.receiptService = receiptService;
        this.refreshService = refreshService;
        this.transfersService = transfersService;
        this.multiDistrictSvc = multiDistrictSvc;
        this.loginStoreSvc = loginStoreSvc;
        this.pageLoadingService = pageLoadingService;
        this.isStudentsGetting = true;
        this.getStudentErr = false;
        this.getStudentErrMsg = '';
        this.isStudents = false;
        this.mobileFormReady = false;
        this.isStudentsRemoteGetting = true;
        this.getStudentRemoteErr = false;
        this.getStudentRemoteErrMsg = '';
        this.isStudentsRemote = false;
        this.formReady = false;
        this.isAddCartAmountSaving = false;
        this.refreshStudents = false;
        this.getStudentCounter = 0;
        this.refreshStudentsCounter = 0;
        this.hadPendingXfers = false;
        this.stillPendingCounter = 0;
        this.pendingStillCalled = 0;
        this.xIntervalCounter = 0;
        this.testStudentRemoteCnter = 0;
        this.multiDistrictRefreshCntr = 0;
        this.listReadyCounter = 0;
        this.lateMeals$ = new core_1.EventEmitter();
        this.isMobile = false;
        this.isCurrentDate = true;
        this.errorRefreshCnt = 0;
        this.fatalMealsError = false;
        this.getRemoteIntrvlCount = 0;
        this.cartStore = store.select(function (state) { return state.cartStore; });
        this.mealStore = store.select(function (state) { return state.mealStore; });
        this.districtMealStore = store.select(function (state) { return state.districtMealStore; });
        this.addCartAmountForm = this.formBuilder.group({});
        this.addCartAmountMobileForm = this.formBuilder.group({});
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ;
    MealsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        this.isMobile = (window.innerWidth < 960) ? true : false;
                        // console.log('deviceInfo',this.deviceInfo);
                        // console.log("Calling Meals")
                        return [4 /*yield*/, this.mealStore.subscribe(function (c) { return _this.mealState = c; })];
                    case 2:
                        // console.log('deviceInfo',this.deviceInfo);
                        // console.log("Calling Meals")
                        _b.sent();
                        if (window.innerWidth < 960) {
                            this.isStudentsRemote = false;
                        }
                        if (!this.loginResponse.isDisableMealPaymentsDistrict) {
                            //console.log("Calling getRemote New")
                            this.getStudentMealsRemoteNew();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MealsComponent.prototype.ngDoCheck = function () { };
    MealsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        //this.cdr.detectChanges();
        //console.log(this.studentMealsServiceRemote.studentMeals);
        //console.log(this.mealState);
        this.remoteInterval = setInterval(function () {
            if (_this.studentMealsServiceRemote.studentMeals && _this.addCartAmountForm.controls || _this.addCartAmountMobileForm.controls) {
                _this.isStudentsRemote = true;
            }
        }, 50);
    };
    MealsComponent.prototype.getSuspendPayment = function () {
        var issupended;
        var warning = false;
        var warningMsg = '';
        //console.log("Calling getSuspendPayment from Meals: ", this.loginResponse);
        if (this.loginResponse.isBlockPayments) {
            warningMsg += "Payments are disabled for this account.";
            warning = true;
        }
        else if (this.loginResponse.allPaymentsSuspended) {
            warningMsg += "All payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate + '.';
            warning = true;
        }
        else if (this.loginResponse.mealPaymentsSuspended) {
            warningMsg += "Meal payments are suspended at your district and\n                           scheduled to resume on " + this.loginResponse.allPaymentsResumeDate + '.';
            warning = true;
        }
        else if (this.loginResponse.isDisableMealPaymentsDistrict) {
            warningMsg += 'Meal payments are disabled at your district.';
            warning = true;
        }
        return issupended = this.suspendPaymentWarningService.getWarning(warning, warningMsg);
    };
    //for desktop browser component
    MealsComponent.prototype.initListItem = function () {
        return this.formBuilder.group({
            'addAmount': [null, [forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern)]]
        }, { updateOn: 'submit' });
    };
    //for mobile browser component
    MealsComponent.prototype.initAddAmountMobile = function () {
        //console.log("Building Mobile Form")
        return this.formBuilder.group({
            'addAmountMobile': [null, [forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern)]],
            'mealSelectMobile': ['']
        }, { updateOn: 'submit' });
    };
    //For mobile
    MealsComponent.prototype.addCartItemMobile = function (params) {
        //console.log('params', params);
        this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].addAmount = params.amount;
        this.addCartItem(params, this.studentMealsService.studentMeals);
    };
    MealsComponent.prototype.getStudentMealsRemoteNew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            var _this = this;
            return __generator(this, function (_a) {
                list = [];
                // console.log("Do we have mealState: ", this.mealState)
                if (this.mealState !== undefined) {
                    this.getRemoteInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var i, arrayControl, _i, _a, mealAccount, arrayControl, _b, _c, mealAccount, i, arrayControl, _d, _e, mealAccount, arrayControl, _f, _g, mealAccount;
                        var _this = this;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    this.getRemoteIntrvlCount++;
                                    if (!(this.getRemoteIntrvlCount < 6)) return [3 /*break*/, 12];
                                    if (!(this.mealState.data && this.studentMealsServiceRemote.result)) return [3 /*break*/, 12];
                                    this.studentMealsServiceRemote.studentMeals = this.mealState.data;
                                    //console.log("mealState: ", this.studentMealsServiceRemote.studentMeals)
                                    this.studentMealsComponent = this.studentMealsServiceRemote.studentMeals;
                                    //console.log("do we have  this.studentMealsComponent: ", this.studentMealsComponent)
                                    //Checking to make sure the mealAccounts are current
                                    list = this.studentMealsComponent;
                                    this.checkDate(list);
                                    clearInterval(this.getRemoteInterval);
                                    if (!this.studentMealsComponent) return [3 /*break*/, 5];
                                    this.testStudentList = this.studentMealsComponent;
                                    //console.log("this.testStudentList: ", this.testStudentList.length)
                                    //Build Form
                                    this.addCartAmountMobileForm = this.formBuilder.group({});
                                    i = 0;
                                    _h.label = 1;
                                case 1:
                                    if (!(i < this.testStudentList.length)) return [3 /*break*/, 4];
                                    //For use with the mobile version. Mobile is flatter 
                                    //it only contains one add amount field per student.
                                    //the selection of category is by ddl.
                                    if (this.isMobile) {
                                        //this.mobileFormInterval = setInterval(() => {
                                        clearInterval(this.mobileFormInterval);
                                        this.addCartAmountMobileForm.valueChanges;
                                        this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]));
                                        arrayControl = this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                                        // console.log("do we have arrayControl: ", arrayControl)
                                        for (_i = 0, _a = this.testStudentList[i].mealAccounts; _i < _a.length; _i++) {
                                            mealAccount = _a[_i];
                                            arrayControl.push(this.initAddAmountMobile());
                                        }
                                        // }, 500)
                                        //console.log("Do we have a form Here: ", this.addCartAmountMobileForm.controls)
                                        //}, 50);
                                        this.mobileFormReady = true;
                                    }
                                    if (!!this.isMobile) return [3 /*break*/, 3];
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    return [4 /*yield*/, this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]))];
                                case 2:
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    _h.sent();
                                    arrayControl = this.addCartAmountForm.controls['addAmountArray' + i];
                                    for (_b = 0, _c = this.testStudentList[i].mealAccounts; _b < _c.length; _b++) {
                                        mealAccount = _c[_b];
                                        arrayControl.push(this.initListItem());
                                    }
                                    this.formReady = true;
                                    _h.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    this.isStudentsGetting = this.isStudents = (this.testStudentList.length < 0) ? true : false;
                                    // console.log("isStudentsGetting: ", this.isStudentsGetting);
                                    this.isStudentsRemoteGetting = (this.testStudentList.length < 0) ? true : false;
                                    //console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
                                    this.pageLoadingService.hide();
                                    return [3 /*break*/, 12];
                                case 5:
                                    this.studentMealsServiceRemote.subscribeToGetMeals(this.loginResponse);
                                    if (!this.studentMealsServiceRemote.studentMeals) return [3 /*break*/, 12];
                                    list = [];
                                    list = this.studentMealsServiceRemote.studentMeals;
                                    // console.log("Calling check Date: ", list)
                                    // this.checkDate(list);
                                    this.store.dispatch(new MealStoreActions.ClearMeals());
                                    this.store.dispatch(new MealStoreActions.LoadMealsSuccess(list));
                                    this.mealStore.subscribe(function (c) { return _this.mealState = c; });
                                    if (this.mealState) {
                                        this.studentMealsServiceRemote.studentMeals = this.mealState.data;
                                        //console.log("mealState: ", this.studentMealsServiceRemote.studentMeals)
                                        this.studentMealsComponent = this.studentMealsServiceRemote.studentMeals;
                                        this.isStudents = (this.studentMealsComponent.length > 0) ? true : false;
                                    }
                                    if (!this.studentMealsComponent) return [3 /*break*/, 12];
                                    this.isMobile = (window.innerWidth < 960) ? true : false;
                                    this.testStudentList = this.studentMealsComponent;
                                    i = 0;
                                    _h.label = 6;
                                case 6:
                                    if (!(i < this.testStudentList.length)) return [3 /*break*/, 11];
                                    if (!this.isMobile) return [3 /*break*/, 8];
                                    this.addCartAmountMobileForm = this.formBuilder.group({});
                                    // setTimeout(() => {
                                    this.addCartAmountMobileForm.valueChanges;
                                    return [4 /*yield*/, this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]))];
                                case 7:
                                    _h.sent();
                                    arrayControl = this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                                    // console.log("do we have arrayControl: ", arrayControl)
                                    for (_d = 0, _e = this.testStudentList[i].mealAccounts; _d < _e.length; _d++) {
                                        mealAccount = _e[_d];
                                        arrayControl.push(this.initAddAmountMobile());
                                    }
                                    this.mobileFormReady = true;
                                    _h.label = 8;
                                case 8:
                                    if (!!this.isMobile) return [3 /*break*/, 10];
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    return [4 /*yield*/, this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]))];
                                case 9:
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    _h.sent();
                                    arrayControl = this.addCartAmountForm.controls['addAmountArray' + i];
                                    for (_f = 0, _g = this.testStudentList[i].mealAccounts; _f < _g.length; _f++) {
                                        mealAccount = _g[_f];
                                        arrayControl.push(this.initListItem());
                                    }
                                    this.formReady = true;
                                    _h.label = 10;
                                case 10:
                                    i++;
                                    return [3 /*break*/, 6];
                                case 11:
                                    this.isStudentsGetting = (this.studentMealsComponent.length < 0) ? true : false;
                                    // console.log("isStudentsGetting: ", this.isStudentsGetting);
                                    this.isStudentsRemoteGetting = (this.studentMealsComponent.length < 0) ? true : false;
                                    // console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
                                    this.pageLoadingService.hide();
                                    _h.label = 12;
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); }, 500);
                }
                else {
                    //The meal store was emptied out when we left the dashboard
                    // console.log("the meal store was empty calling CafeteriaAccounts/Remote")
                    this.subscription = this.studentMealsServiceRemote.getRemoteStudentMeals(this.loginResponse)
                        .subscribe(function (data) {
                        _this.studentMealsComponent = data;
                    }, function (error) {
                        // console.log("Error: No Meals: ", this.studentMealsComponent);
                    }, function () { return __awaiter(_this, void 0, void 0, function () {
                        var i, arrayControl, _i, _a, mealAccount, arrayControl, _b, _c, mealAccount;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    this.studentMealsServiceRemote.weGotStudents.emit(true);
                                    this.isStudentsRemoteGetting = this.studentMealsComponent.length > 0;
                                    //Checking to make sure the mealAccounts are current
                                    list = this.studentMealsComponent;
                                    this.checkDate(list);
                                    this.loginStoreSvc.loadLogin(this.loginResponse);
                                    // console.log("What is tempMeals: ", list)
                                    this.store.dispatch(new MealStoreActions.ClearMeals());
                                    this.store.dispatch(new MealStoreActions.LoadMealsSuccess(list));
                                    // console.log("Calling this.formCompleted ")
                                    this.studentMealsServiceRemote.formCompleted = new rxjs_1.Observable(function (observer) {
                                        observer.next(true);
                                        observer.complete();
                                    });
                                    this.studentMealsServiceRemote.formCompleted.pipe(operators_1.first(function (data) { return data == true; }));
                                    if (!this.studentMealsComponent) return [3 /*break*/, 6];
                                    this.testStudentList = this.studentMealsComponent;
                                    this.isStudentsRemote = (this.testStudentList.length > 0) ? true : false;
                                    this.isMobile = (window.innerWidth < 960) ? true : false;
                                    i = 0;
                                    _d.label = 1;
                                case 1:
                                    if (!(i < this.testStudentList.length)) return [3 /*break*/, 6];
                                    if (!this.isMobile) return [3 /*break*/, 3];
                                    this.addCartAmountMobileForm = this.formBuilder.group({});
                                    //setTimeout(() => {
                                    this.addCartAmountMobileForm.valueChanges;
                                    return [4 /*yield*/, this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]))];
                                case 2:
                                    _d.sent();
                                    arrayControl = this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                                    // console.log("do we have arrayControl: ", arrayControl)
                                    for (_i = 0, _a = this.testStudentList[i].mealAccounts; _i < _a.length; _i++) {
                                        mealAccount = _a[_i];
                                        arrayControl.push(this.initAddAmountMobile());
                                    }
                                    //}, 0)
                                    this.mobileFormReady = true;
                                    _d.label = 3;
                                case 3:
                                    if (!!this.isMobile) return [3 /*break*/, 5];
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    return [4 /*yield*/, this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]))];
                                case 4:
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    _d.sent();
                                    arrayControl = this.addCartAmountForm.controls['addAmountArray' + i];
                                    for (_b = 0, _c = this.testStudentList[i].mealAccounts; _b < _c.length; _b++) {
                                        mealAccount = _c[_b];
                                        arrayControl.push(this.initListItem());
                                    }
                                    this.formReady = true;
                                    _d.label = 5;
                                case 5:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    // this.isStudentsGetting = this.isStudents = (this.testStudentList.length < 0) ? true : false;
                                    //console.log("isStudentsGetting: ", this.isStudentsGetting);
                                    // this.isStudentsRemoteGetting = (this.testStudentList.length < 0) ? true : false;
                                    this.isStudentsRemote = (this.testStudentList.length > 0) ? true : false;
                                    this.isStudentsGetting = (this.testStudentList.length < 0) ? true : false;
                                    //  console.log("Do we have a form Here: ", this.addCartAmountForm.controls)
                                    this.pageLoadingService.hide();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [2 /*return*/];
            });
        });
    };
    //End of getRemote
    MealsComponent.prototype.addCartItem = function (params, studentMeals) {
        var _this = this;
        //console.log("Adding cart item: ", params);
        this.addCartItemService.result = false;
        var account = this.studentMealsServiceRemote.studentMeals;
        //console.log("These are the accounts: ", account)
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //console.log("What is the current LoginResponse: ", this.loginResponse)
        if (params.valid && params.amount) {
            account[params.outsideIndex].mealAccounts[params.insideIndex].addAmount = parseFloat(params.amount);
        }
        if (params.valid && account[params.outsideIndex].mealAccounts[params.insideIndex].addAmount) {
            //start spinner
            account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = true;
            //start spinner mobile
            //console.log('do we get in here');
            //console.log("Do we have the new LoginResponse: ", this.loginResponse);
            var subscription_1 = this.addCartItemService.putCartItemNew(account, params, this.loginResponse)
                .subscribe(function (response) {
                _this.cartResponse = response;
                _this.refreshService.refreshMeals();
                _this.refreshService.refreshCart();
            }, function (error) {
                _this.addCartItemService.result = false;
                if (_this.addCartItemService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    console.log('is there an error');
                    //error report
                    account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmount = true;
                    account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmountMsg = _this.addCartItemService.loginResponse.message;
                    //error report mobile
                    account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmount = true;
                    account[params.outsideIndex].mealAccounts[params.insideIndex].failedAddCartAmountMsg = _this.addCartItemService.loginResponse.message;
                    //finish spinner
                    account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;
                    //finish spinner mobile
                    account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;
                    _this.utilityService.clearErrorMessage(_this.addCartItemService.loginResponse);
                }
            }, function () {
                // //console.log("What is cartResponse:  ", this.cartResponse);
                if (_this.cartResponse.itemCount > 0) {
                    _this.loginResponse.cartItemCount = _this.cartResponse.itemCount;
                    _this.addCartItemService.count = _this.loginResponse.cartItemCount;
                    _this.validateCartService.fixCartNow = true;
                    _this.addCartItemService.addedToCart = true;
                }
                //account,
                _this.setAccountCartAmount(_this.cartResponse, params);
                _this.studentMealsService.needGetStudents.emit(true);
                _this.validateCartService.fixCartNow = true;
                _this.loginStoreSvc.loadLogin(_this.addCartItemService.loginResponse);
                var tempResponse;
                tempResponse = _this.cartResponse;
                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempResponse));
                _this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                _this.cartStateItems = _this.cartState.data;
                if (_this.cartStateItems) {
                    _this.addCartItemService.result = false;
                    _this.addCartItemService.cartUpdate.emit(false);
                    _this.refreshService.refreshCart();
                }
                //console.log('cartstate', this.cartState);
                //let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
                //seconds.subscribe(
                //  x => {
                //    if (x == Constants.SpinnerDelay) {
                //      //finish spinner
                account[params.outsideIndex].mealAccounts[params.insideIndex].isAddCartAmountSaving = false;
                //  }
                //});
                _this.addCartItemService.count = _this.cartResponse.itemCount;
                subscription_1.unsubscribe();
            });
        }
    };
    MealsComponent.prototype.setAccountCartAmount = function (countResponse, params) {
        var itemIndex;
        //countResponse.itemCount > 0
        if (params.insideIndex > 0) {
            itemIndex = params.insideIndex - 1;
        }
        else {
            itemIndex = params.insideIndex;
            // console.log("The itemIndex from inside - 1: ", itemIndex)
        }
        if (this.studentMealsService.studentMeals) {
            if (countResponse.items[itemIndex].itemAmount > 0) {
                for (var i = 0; i < countResponse.items.length; i++) {
                    if (this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].categoryKey == countResponse.items[i].mealCategoryKey) {
                        this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].cartAmount = countResponse.items[i].itemAmount;
                    }
                }
            }
            else {
                this.studentMealsService.studentMeals[params.outsideIndex].mealAccounts[params.insideIndex].cartAmount = countResponse.items[itemIndex].amountInCart;
            }
        }
    };
    MealsComponent.prototype.setMultiDistrictMeals = function () {
        var _this = this;
        // console.log("Calling setMultiDistrictMeals ")
        setTimeout(function () {
            _this.districtMealStore.subscribe(function (m) { return _this.districtMealState = m; });
            if (_this.districtMealState) {
                _this.districtMealStateMeal = _this.districtMealState.data;
                //console.log("this DistrictMealStateMeal: ", this.districtMealStateMeal)
            }
        }, 2000);
    };
    MealsComponent.prototype.reBuildForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, i, i, arrayControl, _i, _a, mealAccount, arrayControl, _b, _c, mealAccount;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // this.studentMealsServiceRemote.studentMeals = this.mealState.data;
                        //  console.log("Need to Rebuild Form: ", this.mealState.data)
                        if (this.mealState.data) {
                            this.testStudentList = this.mealState.data;
                        }
                        this.studentMealsServiceRemote.listReady = (this.testStudentList.length > 0) ? true : false;
                        if (!(this.studentMealsServiceRemote.listReady === true && this.studentMealsServiceRemote.studentMeals.length > 0)) return [3 /*break*/, 11];
                        if (!this.testStudentList) return [3 /*break*/, 5];
                        // this.getStudentRemoteErr = (this.testStudentList.length < 0) ? true : false;
                        this.studentMealsServiceRemote.getMealsErr = (this.testStudentList.length == 0) ? true : false;
                        this.getStudentRemoteErr = this.studentMealsServiceRemote.getMealsErr;
                        _loop_1 = function (i) {
                            var arrayControl, _i, _a, mealAccount;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!this_1.isMobile) return [3 /*break*/, 1];
                                        this_1.addCartAmountMobileForm = this_1.formBuilder.group({});
                                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var arrayControl, _i, _a, mealAccount;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        this.addCartAmountMobileForm.valueChanges;
                                                        return [4 /*yield*/, this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]))];
                                                    case 1:
                                                        _b.sent();
                                                        arrayControl = this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                                                        // console.log("do we have arrayControl: ", arrayControl)
                                                        for (_i = 0, _a = this.testStudentList[i].mealAccounts; _i < _a.length; _i++) {
                                                            mealAccount = _a[_i];
                                                            arrayControl.push(this.initAddAmountMobile());
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 200);
                                        return [3 /*break*/, 3];
                                    case 1: 
                                    //the categories as a row under the student along with the add amount fields and the submit button
                                    return [4 /*yield*/, this_1.addCartAmountForm.addControl('addAmountArray' + i, this_1.formBuilder.array([]))];
                                    case 2:
                                        //the categories as a row under the student along with the add amount fields and the submit button
                                        _b.sent();
                                        arrayControl = this_1.addCartAmountForm.controls['addAmountArray' + i];
                                        for (_i = 0, _a = this_1.testStudentList[i].mealAccounts; _i < _a.length; _i++) {
                                            mealAccount = _a[_i];
                                            arrayControl.push(this_1.initListItem());
                                        }
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < this.testStudentList.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        //setTimeout(() => {
                        this.testStudentList = this.studentMealsService.studentMeals;
                        i = 0;
                        _d.label = 6;
                    case 6:
                        if (!(i < this.testStudentList.length)) return [3 /*break*/, 11];
                        if (!this.isMobile) return [3 /*break*/, 8];
                        this.addCartAmountMobileForm = this.formBuilder.group({});
                        this.addCartAmountMobileForm.valueChanges;
                        return [4 /*yield*/, this.addCartAmountMobileForm.addControl('mobileFormGroup' + i, this.formBuilder.array([]))];
                    case 7:
                        _d.sent();
                        arrayControl = this.addCartAmountMobileForm.controls['mobileFormGroup' + i];
                        // console.log("do we have arrayControl: ", arrayControl)
                        for (_i = 0, _a = this.testStudentList[i].mealAccounts; _i < _a.length; _i++) {
                            mealAccount = _a[_i];
                            arrayControl.push(this.initAddAmountMobile());
                        }
                        return [3 /*break*/, 10];
                    case 8: 
                    //the categories as a row under the student along with the add amount fields and the submit button
                    return [4 /*yield*/, this.addCartAmountForm.addControl('addAmountArray' + i, this.formBuilder.array([]))];
                    case 9:
                        //the categories as a row under the student along with the add amount fields and the submit button
                        _d.sent();
                        arrayControl = this.addCartAmountForm.controls['addAmountArray' + i];
                        for (_b = 0, _c = this.testStudentList[i].mealAccounts; _b < _c.length; _b++) {
                            mealAccount = _c[_b];
                            arrayControl.push(this.initListItem());
                        }
                        _d.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 6];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    //Checks for Date integrity of the meal balances
    MealsComponent.prototype.checkDate = function (studentMeals) {
        //  console.log("do wehave the currentDate: ", studentMeals);
        var mealDate;
        var mealTime;
        /*Right now forcing the date for Test Purposes, should really check the following object:
        studentMeals[0].mealAccounts[0].currentBalanceLastUpdated.slice(0, 10);*/
        if (studentMeals.length > 0) {
            mealDate = studentMeals[0].mealAccounts[0].currentBalanceLastUpdated.slice(0, 10);
            mealTime = new Date(studentMeals[0].mealAccounts[0].currentBalanceLastUpdated);
        }
        else {
            mealDate = "2000-01-01";
            mealTime = "00:00:00";
        }
        // console.log("mealDate and Time: ", mealDate)
        //Using the full DateTime to check for a more than 60 minutes time difference in diff()
        //for debugging
        //new Date("2019-04-15T13:50:36.257")
        // console.log("mealTime: ", mealTime)
        //.slice(0, 10);
        //For debugging
        //'2019-04-29';
        //
        //console.log("mealDate: ", mealDate)
        var now = new Date();
        // console.log("what is now: ", now)
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        // console.log("What is today: ", today);
        if (today == mealDate) {
            this.isCurrentDate = true;
        }
        else {
            this.isCurrentDate = false;
        }
        // console.log("isCurrentDate: ", this.isCurrentDate)
        //Displays the Failed Communications error when we get a 206
        //which is a successful response with no data
        if (this.studentMealsServiceRemote.getMealsErr) {
            this.getStudentRemoteErr = this.studentMealsServiceRemote.getMealsErr;
        }
        //if (today == mealDate) {
        //  this.diff(mealTime, now);
        //}
        //For debuging to force the Communications error to display
        //else {
        //  this.getStudentRemoteErr = true;
        //}
        //  console.log("We got a Meals Error: ", this.getStudentRemoteErr)
    };
    //Calculates the time difference between Now and the last update Date of the Meal Accounts
    //diff(start, end) {
    //  // console.log("Start: ", start)
    //  // console.log("end: ",end )
    //  // console.log("iscurrentDate Here: ", this.isCurrentDate)
    //  var diff = end.getTime() - start.getTime();
    //  var resultInMinutes = Math.round(diff / 60000)
    //  // console.log("resultInMinutes: ", resultInMinutes)
    //  if (this.deviceInfo.model === 'Macintosh' && this.deviceInfo.platform === 'web') {
    //    if (resultInMinutes > 560) {
    //      this.isCurrentDate = false;
    //      // alert("I am mac: " + this.deviceInfo.model);
    //      // console.log("iscurrentDate: ", this.isCurrentDate)
    //      //console.log("fatalMealsError: ", this.fatalMealsError)
    //    }
    //  } else if (this.deviceInfo.model === 'iPhone' && this.deviceInfo.platform === 'web') {
    //    if (resultInMinutes > 600) {
    //      this.isCurrentDate = false;
    //      // alert("I am ios: " + this.deviceInfo.model);
    //      // console.log("iscurrentDate: ", this.isCurrentDate)
    //      // console.log("fatalMealsError: ", this.fatalMealsError)
    //      // alert("I am ios");
    //    }
    //    //this.isCurrentDate = true;
    //  } else {
    //    if (resultInMinutes > 60 && (this.deviceInfo.model !== 'iPhone' || this.deviceInfo.model !== 'Macintosh')) {
    //      this.isCurrentDate = false;
    //      // console.log("iscurrentDate: ", this.isCurrentDate)
    //      //console.log("fatalMealsError: ", this.fatalMealsError)
    //    }
    //  }
    //}
    /**
     * I was beginning to create a way to check when Pending Transfers had processed per the original requirements
     * I was told that it isn't needed anymore but I don't believe that so I'm keeping this function
     * In case I need to fully implement -JT
     * @param studentMeals
     */
    //public checkForPendingXfers(studentMeals) {
    //  console.log("checkForPendingXfers")
    //  if (studentMeals) {
    //    console.log("Student Meals: ", studentMeals)
    //  }
    //}
    MealsComponent.prototype.onResize = function (event) {
        var element = event.currentTarget;
        this.isMobile = (element.innerWidth < 960) ? true : false;
    };
    MealsComponent.prototype.ngOnDestroy = function () {
        this.multiDistrictSvc.multiDistrictRefreshCntr = 0;
        this.studentMealsService.isStudents = false;
        this.studentMealsService.listReady = false;
        this.listReadyCounter = 0;
        this.isStudentsGetting = true;
        this.isStudentsRemote = false;
        this.errorRefreshCnt = 0;
        this.addCartAmountMobileForm.reset();
        this.store.dispatch(new MealStoreActions.ClearMeals());
        // console.log("Destroying Meals: ", this.isStudentsRemote );
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MealsComponent.prototype, "onResize", null);
    MealsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'meals',
            templateUrl: './meals.component.html',
            styleUrls: ['./meals.component.less', '../dashboard-home.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.StudentMealsService,
            index_1.StudentMealsServiceRemote,
            index_1.AddCartItemService,
            index_2.UtilityService,
            suspend_payment_warning_service_1.SuspendPaymentWarningService,
            index_1.ValidCartCountService,
            store_1.Store,
            store_1.State,
            receipt_service_1.ReceiptService,
            refresh_service_1.RefreshService,
            index_3.TransfersService,
            index_3.MultiDistrictService,
            index_2.LoginStoreService,
            page_loading_service_1.PageLoadingService])
    ], MealsComponent);
    return MealsComponent;
}());
exports.MealsComponent = MealsComponent;
//# sourceMappingURL=meals.component.js.map