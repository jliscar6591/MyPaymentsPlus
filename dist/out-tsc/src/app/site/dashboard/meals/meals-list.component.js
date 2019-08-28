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
require("rxjs/add/observable/interval");
var student_meals_service_1 = require("../../services/student-meals.service");
var student_meals_service_remote_1 = require("../../services/student-meals.service-remote");
var meals_component_1 = require("./meals.component");
var site_home_component_1 = require("../../site-home.component");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var login_store_service_1 = require("../../../shared/services/login-store.service");
var index_1 = require("../../services/index");
var store_1 = require("@ngrx/store");
var MealStoreActions = require("../../../shared/store/actions/mealStore.actions");
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
var index_2 = require("../../../registration/services/index");
var meals_add_bottom_sheet_component_1 = require("./meals-add-bottom-sheet.component");
//import { window } from 'rxjs-compat/operator/window';
//import { setTimeout } from 'timers';
var MealsListComponent = /** @class */ (function () {
    function MealsListComponent(siteHomeComponent, studentMealsService, studentRemoteMealsSrvc, mealsComponent, cartCheckoutItemsService, router, pageLoadingService, transfersService, refreshService, multiDistrictSrvc, studentListService, loginStoreSrvc, _bottomSheet, store, state) {
        this.siteHomeComponent = siteHomeComponent;
        this.studentMealsService = studentMealsService;
        this.studentRemoteMealsSrvc = studentRemoteMealsSrvc;
        this.mealsComponent = mealsComponent;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.router = router;
        this.pageLoadingService = pageLoadingService;
        this.transfersService = transfersService;
        this.refreshService = refreshService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.studentListService = studentListService;
        this.loginStoreSrvc = loginStoreSrvc;
        this._bottomSheet = _bottomSheet;
        this.store = store;
        this.state = state;
        this.isSuspendPayment = false;
        this.mealStateCounter = 0;
        this.userContextCounter = 0;
        this.testCounter = 0;
        this.testCounter2 = 0;
        this.tabIndex = 0;
        this.isXferFeePaid = false;
        this.reply = false;
        this.canTransfer = true;
        this.isPending = false;
        this.cartItemCount = 0;
        this.mealStore = store.select(function (state) { return state.mealStore; });
        this.mealsComponent.isStudentsGetting = true;
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    }
    MealsListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tempIntrvl, i, j;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //console.log("Loading Meals List: ", this.mealsComponent.refreshStudents);
                        this.isPending = false;
                        return [4 /*yield*/, this.studentListService.subscribeToGetStudentsNew(this.loginResponse)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.transfersService.subscribeToGetTransferStatusNew(this.loginResponse)];
                    case 2:
                        _b.sent();
                        this.isMobile = (window.innerWidth < 960) ? true : false;
                        //Shows the Getting MPP Balances message while waiting for response from getStudentsRemote
                        this.isSuspendPayment = this.studentMealsService.getSuspendPayment();
                        _a = this;
                        return [4 /*yield*/, setInterval(function () {
                                if (_this.mealsComponent.isStudentsGetting === true) {
                                    //  console.log("Should show MPP Loading");
                                    _this.pageLoadingService.show("Getting MPP Balances....");
                                }
                                else if (_this.studentRemoteMealsSrvc.studentMeals) {
                                    clearInterval(_this.getMpppInterval);
                                    _this.pageLoadingService.hide();
                                    // setTimeout(() => { this.pageLoadingService.hide(); }, 0)
                                    if (_this.studentRemoteMealsSrvc.studentMeals != undefined) {
                                        console.log("Does ngONIt have StudentMeals: ", _this.studentRemoteMealsSrvc.studentMeals);
                                        var i;
                                        for (i = 0; i < _this.studentRemoteMealsSrvc.studentMeals.length; i++) {
                                            _this.studentRemoteMealsSrvc.studentMeals[i].showBarcode = false;
                                            var j;
                                            for (j = 0; j < _this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].length; j++) {
                                                if (_this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].transferPendingAmount > 0 || _this.studentRemoteMealsSrvc.studentMeals[i].mealAccounts[j].transferPendingAmount < 0) {
                                                    _this.isPending = true;
                                                    break;
                                                }
                                                else {
                                                    _this.isPending = false;
                                                }
                                            }
                                        }
                                        // console.log(this.isPending);
                                    }
                                }
                            }, 20)];
                    case 3:
                        _a.getMpppInterval = _b.sent();
                        this.nowMobile = this.isMobile;
                        //if (this.mealsComponent.refreshStudents === false) {
                        //  await this.mealsComponent.reBuildForm();
                        //}
                        //Rebuilds the form if the component tries to load with a blank form
                        //console.log(this.nowMobile);
                        //if (this.nowMobile) {
                        //  if (this.mealsComponent.addCartAmountMobileForm.value === {}) {
                        //    // console.log("No FORM vale: ", this.mealsComponent.addCartAmountMobileForm.value);
                        //    this.mealsComponent.addCartAmountMobileForm = await this.mealsComponent.formBuilder.group({});
                        //     console.log("Do we have the form: ", this.mealsComponent.addCartAmountMobileForm.value);
                        //  }
                        //} else if (!this.nowMobile) {
                        //  if (this.mealsComponent.addCartAmountForm.value === {}) {
                        //    //  console.log("No FORM vale: ", this.mealsComponent.addCartAmountForm.value);
                        //    this.mealsComponent.addCartAmountForm = await this.mealsComponent.formBuilder.group({});
                        //    //console.log("Do we have the form: ", this.mealsComponent.addCartAmountForm.value);
                        //  }
                        //}
                        //console.log("Do we have the form: ", this.mealsComponent.addCartAmountMobileForm.value);
                        this.mealStateCounter = 0;
                        this.listInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(this.studentRemoteMealsSrvc.listReady == true)) return [3 /*break*/, 1];
                                        this.siteHomeComponent.siteMealsRefresh = true;
                                        if (this.mealsComponent.studentMealsComponent) {
                                            this.studentMeals = this.mealsComponent.studentMealsComponent;
                                            // console.log("this.mealsComponent.studentMealsComponent: ", this.studentMeals)
                                        }
                                        else {
                                            this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
                                            //  console.log("this.studentMealsService.studentMeals: ", this.studentMeals)
                                        }
                                        clearInterval(this.listInterval);
                                        return [3 /*break*/, 3];
                                    case 1:
                                        _a = this;
                                        return [4 /*yield*/, this.formatStudentMeals(this.mealsComponent.studentMealsComponent)];
                                    case 2:
                                        _a.studentMeals = _b.sent();
                                        console.log("this.formatStudentMeals: ", this.studentMeals);
                                        this.mealsComponent.refreshStudents = true;
                                        clearInterval(this.listInterval);
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, 100);
                        return [4 /*yield*/, setInterval(function () {
                                if (!_this.mealsComponent.addCartAmountForm.controls) {
                                    _this.mealsComponent.isStudentsGetting = true;
                                }
                                else {
                                    _this.mealsComponent.isStudentsGetting = false;
                                    clearInterval(tempIntrvl);
                                }
                                //(!this.mealsComponent.addCartAmountForm.controls) ? true : false;
                                // console.log('.mealsComponent.isStudentsGetting: ', this.mealsComponent.isStudentsGetting)
                            }, 100)
                            // this.mealsComponent.isStudentsGetting = (!this.mealsComponent.addCartAmountForm.controls) ? true : false; 
                        ];
                    case 4:
                        tempIntrvl = _b.sent();
                        for (i = 0; i < this.studentMeals.length; i++) {
                            for (j = 0; j < this.studentMeals[i].mealAccounts.length; j++) {
                                //console.log('transfer amount', this.studentMeals[i].mealAccounts[j].transferPendingAmount)
                                if (this.studentMeals[i].mealAccounts[j].transferPendingAmount !== 0) {
                                    this.canTransfer = false;
                                    //console.log(this.canTransfer);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MealsListComponent.prototype.ngDoCheck = function () {
        // //if (this.studentRemoteMealsSrvc.result === true && this.mealsComponent.refreshStudents === true) {
        // //  //console.log('NGDOCHECK nUMBER 1')
        // //  this.mealStore.subscribe(c => this.mealState = c);
        // //  if (this.mealState) {
        // //    this.studentMealsService.studentMeals = this.mealState.data;
        // //    this.studentMeals = this.studentMealsService.studentMeals;
        // //    this.mealsComponent.refreshStudents = false;
        // //    this.siteHomeComponent.siteMealsRefresh = false;
        // //  }
        // //}
        // this.isStudentsGetting = this.mealsComponent.isStudentsGetting;
        // this.xferSubscription = this.refreshService.xferEvent$.subscribe(() => {
        //   if (this.refreshService.mealRefresh && this.mealStateCounter < 4) {
        //     //console.log('NGDOCHECK nUMBER 2')
        //     this.mealStore.subscribe(c => this.mealState = c);
        //     if (this.mealState) {
        //       this.studentMealsService.studentMeals = this.mealState.data;
        //       this.studentMeals = this.studentMealsService.studentMeals;
        //       this.mealsComponent.refreshStudents = false;
        //       this.refreshService.siteRefreshNow = false;
        //       this.xferSubscription.unsubscribe();
        //       this.mealStateCounter++;
        //     }
        //   }
        // });
        // // setTimeout(() => {
        // //  if (!this.refreshService.haveUserContext || this.siteHomeComponent.siteHomeRefreshCounter < 5) {
        // // console.log('NGDOCHECK nUMBER 3')
        // //if (this.siteHomeComponent.siteMealsRefresh === true) {
        // //  this.refreshService.haveUserContext = true;
        // //  this.siteHomeComponent.siteHomeRefreshCounter = 6;
        // //}
        // this.userContextSubscription = this.siteHomeComponent.userContextRefresh$.subscribe(() => {
        //   this.siteHomeComponent.siteHomeRefreshCounter++;
        //   // console.log('NGDOCHECK nUMBER 3: ', this.siteHomeComponent.siteMealsRefresh)
        //   if (this.siteHomeComponent.siteMealsRefresh === true) {
        //     //this.siteHomeComponent.userContextRefresh$.emit(false);
        //     this.userContextSubscription.unsubscribe();
        //     this.mealsComponent.isStudentsRemote = false;
        //     // console.log("setting isStudentsRemote: ", this.mealsComponent.isStudentsRemote)
        //     // console.log("We saw the Emission: ", this.siteHomeComponent.siteMealsRefresh)
        //     this.mealStore.subscribe(c => this.mealState = c);
        //     if (this.mealState) {
        //       this.studentMealsService.studentMeals = this.mealState.data;
        //       this.studentMeals = [];
        //       this.studentMeals = this.studentMealsService.studentMeals;
        //       this.siteHomeComponent.siteMealsRefresh = false;
        //       this.refreshService.multiDistrictRefresh = true;
        //       this.refreshService.multiDistrictEvent$.emit(this.refreshService.multiDistrictRefresh);
        //       this.pageLoadingService.hide();
        //     }
        //   } else {
        //     if (this.multiDistrictSrvc.newDistrictSelected && this.userContextCounter < 2) {
        //       this.mealsComponent.isStudentsRemote = false;
        //       // console.log("setting isStudentsRemote2: ", this.mealsComponent.isStudentsRemote)
        //       this.mealStore.subscribe(c => this.mealState = c);
        //       if (this.mealState) {
        //         this.studentMealsService.studentMeals = this.mealState.data;
        //         this.studentMeals = [];
        //         this.studentMeals = this.studentMealsService.studentMeals;
        //         this.pageLoadingService.hide();
        //         // setTimeout(() => {
        //         this.siteHomeComponent.siteMealsRefresh = false;
        //         this.refreshService.multiDistrictRefresh = true;
        //         this.refreshService.multiDistrictEvent$.emit(this.refreshService.multiDistrictRefresh);
        //         //  console.log("Unsubcribing userContextSubscription")
        //         this.userContextSubscription.unsubscribe();
        //         //  }, 500)
        //       }
        //       this.userContextCounter++;
        //     }
        //   }
        // })
        // // }
        // //}, 0);
        // if (!this.studentMeals) {
        //   this.latestMealsSun = this.mealsComponent.lateMeals$.subscribe(() => {
        //     //console.log('NGDOCHECK nUMBER 4')
        //     if (this.mealsComponent.refreshStudents === true) {
        //       this.studentMeals = this.mealsComponent.studentMealsComponent;
        //       this.refreshService.refreshMealsList(this.loginStoreSrvc.cookieStateItem);
        //     }
        //   })
        // }
    };
    MealsListComponent.prototype.ngAfterViewInit = function () {
        // console.log("Calling Meals List ngAfterViewInit: ", this.studentMealsService.studentMeals)
        //console.log("Is the meals LIst Ready: ", this.studentMealsService.listReady)
        //this.cdr.detectChanges();
        var _this = this;
        this.xferStatusInterval = setInterval(function () {
            //console.log(this.transfersService);
            if (_this.transfersService.gotStautsCode) {
                //console.log('this.transfersService.gotStautsCode: ', this.transfersService.gotStautsCode)
                _this.reply = _this.transfersService.result;
                if (_this.transfersService.isFeeAdded === false) {
                    _this.isXferFeePaid = true;
                }
                else {
                    _this.isXferFeePaid = false;
                }
                clearInterval(_this.xferStatusInterval);
                //console.log('this.reply: ', this.reply)
                //console.log('this.isXferFeePaid: ', this.transfersService.hasPaidTransFee)
            }
        }, 50);
        this.statusInterval = setInterval(function () {
            _this.availStatus = _this.transfersService.xferLinkStatus;
            clearInterval(_this.statusInterval);
        }, 50);
        if (this.mealsComponent.refreshStudents === true && this.siteHomeComponent.siteMealsRefresh === true) {
            this.mealStore.subscribe(function (c) { return _this.mealState = c; });
            if (this.mealState) {
                //console.log("Meals List Meal State: ", this.mealState)
                this.studentRemoteMealsSrvc.studentMeals = this.mealState.data;
                this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
                //console.log("Meals LIst this.studentMeals: ", this.studentMeals)
                this.mealsComponent.refreshStudents = (this.studentMeals.length > 0) ? true : false;
                this.siteHomeComponent.siteMealsRefresh = (this.studentMeals.length < 0) ? true : false;
                this.pageLoadingService.hide();
            }
            this.refreshService.mealRefreshCounter++;
        }
        //setTimeout(() => {
        this.mealStore.subscribe(function (c) { return _this.mealState = c; });
        if (this.mealState) {
            //console.log("Does Meals List see the filtered MealState: ", this.mealState.data)
            if (this.mealState.data.length > 0) {
                this.studentRemoteMealsSrvc.studentMeals = this.mealState.data;
                this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
                //console.log("What is Student Meals: ", this.studentMeals)
                this.mealsComponent.refreshStudents = false;
                this.refreshService.siteRefreshNow = false;
                // this.xferSubscription.unsubscribe();
            }
            else {
                this.studentMeals = this.studentRemoteMealsSrvc.studentMeals;
                if (this.studentMeals) {
                    this.store.dispatch(new MealStoreActions.LoadMealsSuccess(this.studentMeals));
                    //  console.log("What is studentRemoteMealsSrvc.Student Meals: ", this.studentMeals)
                }
                this.mealsComponent.refreshStudents = true;
            }
            this.mealStateCounter += 1;
        }
        //}, 1000)
        if (this.siteHomeComponent.showDistricts) {
            this.siteHomeComponent.getDistrictcounter = 0;
        }
        if (this.mealsComponent.refreshStudents === true || this.mealsComponent.isStudentsGetting === false) {
            //setTimeout(() => {
            this.mealStore.subscribe(function (c) { return _this.mealState = c; });
            if (this.mealState) {
                this.studentMealsService.studentMeals = this.mealState.data;
                this.studentMeals = this.studentMealsService.studentMeals;
                this.mealsComponent.refreshStudents = false;
                this.refreshService.siteRefreshNow = false;
                // this.xferSubscription.unsubscribe();
                this.mealStateCounter += 1;
            }
            //}, 1000)
        }
        this.pageLoadingService.hide();
    };
    //Converts list to an array 
    MealsListComponent.prototype.formatStudentMeals = function (studentMeals) {
        var studentMealsList = [];
        //let accountBal;
        if (studentMeals) {
            for (var i = 0; i < studentMeals.length; i++) {
                // var testKey = Object.keys(studentMeals[0]);
                var b = Object.keys(studentMeals).map(function (e) { return { accounts: studentMeals[e] }; });
                studentMealsList.push(b[i].accounts);
            }
        }
        return studentMealsList;
    };
    //Updates student meals if the balances are out of date
    MealsListComponent.prototype.updateStudentMeals = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // alert(this.loginStoreSrvc.devicePlatform);
                        this.mealsComponent.errorRefreshCnt++;
                        // console.log("MealsComponent.errorRefreshCnt: ", this.mealsComponent.errorRefreshCnt)
                        //commenting out for Testing
                        // this.mealsComponent.isStudentsRemote = false;
                        this.pageLoadingService.show("Retrieving Account Information");
                        if (this.studentRemoteMealsSrvc.getMealsErr === true) {
                            this.studentRemoteMealsSrvc.getMealsErr = false;
                            // console.log("clearing studentMeals error: ", this.studentRemoteMealsSrvc.getMealsErr)
                        }
                        return [4 /*yield*/, this.studentRemoteMealsSrvc.subscribeToGetMeals(this.loginStoreSrvc.cookieStateItem)];
                    case 1:
                        _a.sent();
                        // setTimeout(() => { 
                        //this.mealsComponent.getStudentMealsRemoteNew();
                        // }, 10)
                        // console.log("Do we have a count: ", this.mealsComponent.errorRefreshCnt)
                        //This keeps track of the refresh counter and displays a fatal error message if the screen is refreshed more than 3 times.
                        if (this.mealsComponent.errorRefreshCnt > 4) {
                            //  console.log("this.mealsComponent.isCurrentDate: ", this.mealsComponent.isCurrentDate)
                            this.mealsComponent.fatalMealsError = true;
                            // console.log(" this.fatalMealsError: ", this.mealsComponent.fatalMealsError)
                        }
                        // setTimeout(() => { 
                        this.pageLoadingService.hide();
                        return [2 /*return*/];
                }
            });
        });
    };
    MealsListComponent.prototype.openAddBottomSheet = function (outsideIndex) {
        this._bottomSheet.open(meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent, {
            data: {
                index: outsideIndex,
                model: this.studentRemoteMealsSrvc.studentMeals[outsideIndex]
            }
        });
    };
    MealsListComponent.prototype.openTransferBottomSheet = function (outsideIndex) {
        this._bottomSheet.open(meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent, {
            data: { index: outsideIndex }
        });
    };
    MealsListComponent.prototype.openFee = function (outsideIndex) {
        //console.log(outsideIndex);
        //console.log(this.studentRemoteMealsSrvc.studentMeals[outsideIndex])
        var model = this.studentRemoteMealsSrvc.studentMeals[outsideIndex].mealAccounts;
        var index = outsideIndex;
        var account = {
            firstName: this.studentRemoteMealsSrvc.studentMeals[outsideIndex].firstName,
            lastname: this.studentRemoteMealsSrvc.studentMeals[outsideIndex].lastName
        };
        this.transfersService.openFee(model, index, account, this.loginStoreSrvc.cookieStateItem);
    };
    MealsListComponent.prototype.openBarcode = function (outsideIndex) {
        console.log(outsideIndex);
        var i;
        console.log(this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode);
        console.log(this.studentListService.students[outsideIndex].studentId);
        if (this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode) {
            this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode = false;
        }
        else {
            this.studentRemoteMealsSrvc.studentMeals[outsideIndex].showBarcode = true;
        }
    };
    MealsListComponent.prototype.viewCart = function () {
        var _this = this;
        // console.log("Calling veiwCart")
        var proceedCart;
        // console.log("about to subscribeToGetCartCheckoutCartItem - SiteHome1:  ", this.cartCheckoutItemsService.cartItem)
        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
        if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
            if (this.cartStateItems || this.cartCheckoutItemsService.cartItem) {
                if (this.cartStateItems) {
                    proceedCart = this.cartStateItems;
                }
                else {
                    proceedCart = this.cartCheckoutItemsService.cartItem;
                }
                //  console.log("proceedCart: ", proceedCart)
                if (proceedCart && this.router.url !== '/review') {
                    this.tabIndex = null;
                    this.router.navigate(['/checkout']);
                    window.clearInterval(this.checkoutInterval);
                }
            }
        }
        else {
            this.checkoutInterval = window.setInterval(function () {
                if (_this.cartStateItems || _this.cartCheckoutItemsService.cartItem) {
                    if (_this.cartStateItems) {
                        proceedCart = _this.cartStateItems;
                    }
                    else {
                        proceedCart = _this.cartCheckoutItemsService.cartItem;
                    }
                    //  console.log("proceedCart: ", proceedCart)
                    if (proceedCart && _this.router.url !== '/review') {
                        _this.tabIndex = null;
                        _this.router.navigate(['/checkout']);
                        window.clearInterval(_this.checkoutInterval);
                    }
                }
            }, 500);
        }
    };
    MealsListComponent.prototype.ngOnDestroy = function () {
        this.siteHomeComponent.cartStoreCounter = 0;
        this.siteHomeComponent.getCartItemcounter = 0;
        this.siteHomeComponent.updateCartCounter = 0;
        this.refreshService.stopRefreshMeals();
        this.mealStateCounter = 0;
        this.refreshService.haveUserContext = false;
        this.testCounter = 0;
        this.testCounter2 = 0;
        this.refreshService.mealRefreshCounter = 0;
        this.mealsComponent.isStudentsRemote = false;
        this.mealsComponent.isStudentsGetting = false;
        if (this.getMpppInterval) {
            clearInterval(this.getMpppInterval);
        }
    };
    MealsListComponent = __decorate([
        core_1.Component({
            selector: 'meals-list',
            moduleId: module.id,
            templateUrl: './meals-list.component.html',
            styleUrls: ['./meals.component.less', '../dashboard-home.component.less']
        }),
        __metadata("design:paramtypes", [site_home_component_1.SiteHomeComponent,
            student_meals_service_1.StudentMealsService,
            student_meals_service_remote_1.StudentMealsServiceRemote,
            meals_component_1.MealsComponent,
            index_1.CartCheckoutItemsService,
            router_1.Router,
            page_loading_service_1.PageLoadingService,
            index_1.TransfersService,
            refresh_service_1.RefreshService,
            index_1.MultiDistrictService,
            index_2.StudentListService,
            login_store_service_1.LoginStoreService,
            bottom_sheet_1.MatBottomSheet,
            store_1.Store,
            store_1.State])
    ], MealsListComponent);
    return MealsListComponent;
}());
exports.MealsListComponent = MealsListComponent;
//# sourceMappingURL=meals-list.component.js.map