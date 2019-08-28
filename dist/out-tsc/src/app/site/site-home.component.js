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
var index_1 = require("../site/account/services/index");
var student_meals_service_1 = require("../site/services/student-meals.service");
var student_meals_service_remote_1 = require("../site/services/student-meals.service-remote");
var index_2 = require("../registration/services/index");
var index_3 = require("../site/services/index");
var index_4 = require("../shared/services/index");
var refresh_service_1 = require("../shared/services/refresh.service");
var page_loading_service_1 = require("../shared/components/page-loading/page-loading.service");
var receipt_service_1 = require("../shared/components/receipt/receipt.service");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
var store_1 = require("@ngrx/store");
var CartStoreActions = require("../shared/store/actions/cartStore.actions");
var MealStoreActions = require("../shared/store/actions/mealStore.actions");
exports.browserRefresh = false;
var activities_service_1 = require("./services/activities.service");
var core_2 = require("@capacitor/core");
var material_1 = require("@angular/material");
var auto_enroll_dialog_component_1 = require("./dashboard/auto-enroll-dialog/auto-enroll-dialog.component");
var orientation_dialog_component_1 = require("./dashboard/orientation-dialog/orientation-dialog.component");
var orientation_service_1 = require("./services/orientation.service");
var SiteHomeComponent = /** @class */ (function () {
    function SiteHomeComponent(router, route, authenticationService, userContextService, studentMealsService, studentMealsRemoteService, studentListService, validCartCountService, transferService, cdr, receiptService, multiDistrictSrvc, feesService, addCartItemService, cartCheckoutItemsService, store, state, cartCheckoutSrvc, refreshService, dialog, pageLoadingService, loginStoreSvc, activitiesService, utilityService, orientationService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.authenticationService = authenticationService;
        this.userContextService = userContextService;
        this.studentMealsService = studentMealsService;
        this.studentMealsRemoteService = studentMealsRemoteService;
        this.studentListService = studentListService;
        this.validCartCountService = validCartCountService;
        this.transferService = transferService;
        this.cdr = cdr;
        this.receiptService = receiptService;
        this.multiDistrictSrvc = multiDistrictSrvc;
        this.feesService = feesService;
        this.addCartItemService = addCartItemService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.store = store;
        this.state = state;
        this.cartCheckoutSrvc = cartCheckoutSrvc;
        this.refreshService = refreshService;
        this.dialog = dialog;
        this.pageLoadingService = pageLoadingService;
        this.loginStoreSvc = loginStoreSvc;
        this.activitiesService = activitiesService;
        this.utilityService = utilityService;
        this.orientationService = orientationService;
        this.sidenavLayout = false;
        this.tabIndex = 0;
        this.mobile = false;
        this.title = '';
        this.userOptions = null;
        this.isTranslateOption = true;
        this.cartItemCount = 0;
        this.cleanOutCart = false;
        this.cartProcessedFlag = this.transferService.cartProcessedEvt;
        this.feeAddedFlag = this.transferService.feeAddedToCart;
        this.navSeleceted = false;
        this.districtList = [];
        this.userData = [];
        this.isDestroyed = false;
        this.showDistricts = false;
        this.paymntProcessedCounter = 0;
        this.siteMealsRefresh = false;
        this.updateCartCounter = 0;
        this.siteMealsCounter = 0;
        this.getCartCounter = 0;
        this.checkMealsCounter = 0;
        this.cartStoreCounter = 0;
        this.getCartItemcounter = 0;
        this.cartRefreshCounter = 0;
        this.getDefaultDatacounter = 0;
        this.getDistrictcounter = 0;
        this.haveCartCount = false;
        this.currentDistrictList = [];
        this.userContextRefresh$ = new core_1.EventEmitter();
        this.refreshUserContext = false;
        this.isContextRefreshing = false;
        this.multiDistrictRecheckCntr = 0;
        this.siteHomeRefreshCounter = 0;
        this.userRefreshedCounter = 0;
        this.newDistrictCartCounter = 0;
        this.autoEnrollCounter = 0;
        this.showFees = true;
        this.showActivities = true;
        this.districtHasFees = false;
        this.districtHasActivities = false;
        this.autoEnrollActivitiesCounter = 0;
        this.district = new forms_1.FormGroup({
            defaultDistrict: new forms_1.FormControl()
        });
        this.welcome = new forms_1.FormGroup({
            userOptions: new forms_1.FormControl()
        });
        this.unsignedDocumentCount = 0;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.defaultDistrict = this.loginResponse.districtName;
        this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                _this.setTitle();
                //need a better way to do this - to know that the outer layout needs to account for a sidenav is there is one
                _this.sidenavLayout = (_this.router.url.indexOf('/account') >= 0) ? true : false;
            }
        });
        this.cartStore = store.select(function (state) { return state.cartStore; });
        this.mealStore = store.select(function (state) { return state.mealStore; });
        this.feeStore = store.select(function (state) { return state.feeStore; });
        this.districtMealStore = store.select(function (state) { return state.districtMealStore; });
    }
    SiteHomeComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this.addCartItemService.cartResponse) {
            if (this.addCartItemService.cartResponse.itemCount !== undefined) {
                this.cartItemCount = this.addCartItemService.cartResponse.itemCount;
                //console.log(this.cartItemCount);
            }
        }
        else if (this.cartCheckoutItemsService.cartItem && this.addCartItemService.cartResponse) {
            this.cartItemCount = this.cartCheckoutItemsService.cartItem.itemCount;
            //console.log(this.cartItemCount);
        }
        if (this.addCartItemService.cartResponse && this.addCartItemService.deleteResult) {
            window.setTimeout(function () {
                //console.log('cartState', this.cartState);
                //console.log("Calling getCartCount DoCheck")
                _this.getCartCount();
                //console.log(this.cartItemCount);
                _this.addCartItemService.deleteResult = false;
            }, 1000);
        }
        // if (this.refreshService.cartRefresh) {
        //   let temptState: any;
        //   this.cartStore.subscribe(c => this.cartState = c);
        //   if (this.cartState) {
        //     temptState = this.cartState.data;
        //     // console.log("getCartCount - cartRefresh: ", this.refreshService.cartRefresh)
        //     window.setTimeout(() => { this.getCartCount(); }, 1000);
        //     window.setTimeout(() => { this.refreshService.stopCartRefresh(); }, 0)
        //     //console.log('this.cartitemCount', this.cartItemCount);
        //     // this.getCartCount();
        //     // this.refreshService.stopCartRefresh();
        //     this.cartRefreshCounter++;
        //     if (this.cartRefreshCounter > 4) {
        //       this.refreshService.cartRefresh = false;
        //     }
        //   }
        // }
        // this.getCartItemcounter++;
        // //console.log("this.getCartItemcounter = ", this.getCartItemcounter)
        // if (this.getCartItemcounter == 5 && this.cartCheckoutItemsService.cartItem) {
        //   window.setTimeout(() => {
        //     // console.log("Did we get a Lite Cart: ", this.cartCheckoutItemsService.cartItem)
        //     if (this.cartCheckoutItemsService.cartItem) {
        //       this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
        //       this.cartItemCount = this.countStore();
        //       if (this.cartItemCount > 0) {
        //         this.haveCartCount = true;
        //       }
        //     }
        //   }, 1000);
        // }
        if (this.paymntProcessedCounter < 1) {
            this.getDistrictcounter = 0;
            // console.log("Calling RefeshMeals: ", this.paymntProcessedCounter)
            this.receiptService.processedPayment.subscribe(function (data) { return (_this.refeshMeals(data)); }, this.showReceipt = true);
            this.paymntProcessedCounter++;
        }
        // if (this.userContextService.defaultData && this.getDistrictcounter < 1) {
        //   this.userData = this.userContextService.defaultData;
        //   //console.log("We got userData: ", this.userData);
        //   this.loginStoreSvc.fixLoginResponse(this.userData);
        //   this.getUserDistricts(this.userData);
        //   this.userContextService.result = false;
        //   //  console.log("Should be clearing Interval")
        //   if (this.userData.availableDistricts.length > 1) {
        //     if (!this.studentListService.result) {
        //       //  console.log("subscribeToGetStudentsNew fromSite")
        //       this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        //     }
        //     this.showDistricts = (this.userData.availableDistricts.length > 0) ? true : false;
        //   }
        //   this.getDistrictcounter++;
        // } else {
        //   if (!this.userContextService.defaultData && this.getDefaultDatacounter < 1) {
        //     this.getDefaultDatacounter++;
        //   }
        // }
        // if (!this.showDistricts && this.multiDistrictRecheckCntr < 3) {
        //   let districtList = this.getUserDistricts(this.userData);
        //   this.multiDistrictRecheckCntr++;
        // }
        // this.multiDistrictSrvc.didSwitchDistrict.subscribe(() => {
        //   if (this.multiDistrictSrvc.newDistrictSelected === true && this.newDistrictCartCounter < 1) {
        //     this.newDistrictCartCount();
        //     this.newDistrictCartCounter++;
        //   }
        // });
        if (this.mobile && this.router.url == '/terms' || this.router.url == '/privacy-policy' || this.router.url == '/about' || this.router.url == '/support' || this.router.url == '/welcome') {
            document.getElementById('app-toolbar').style.backgroundColor = 'white';
        }
        //} else if (this.mobile && this.router.url !== '/terms' || this.router.url !== '/privacy-policy' || this.router.url !== '/about' || this.router.url !== '/support' || this.router.url !== '/welcome' && this.mobile) {
        //  document.getElementById('app-toolbar').style.backgroundColor = 'rgb(56,131,208)';
        //}
        //if (this.router.url == '/checkout') {
        //  var i;
        //  for (i = 0; i < this.cartCheckoutSrvc.cartItem.items.length; i++) {
        //    if (this.cartCheckoutSrvc.cartItem.items[i].isAutoEnrolled && this.cartCheckoutSrvc.cartItem.items[i].activityFormId && this.cartCheckoutSrvc.cartItem.items[i].formResponse.length === 0) {
        //      console.log('hey this is where ill show the forms you didnt fill out');
        //    }
        //  }
        //}
        //console.log('this.cartitemCount', this.cartItemCount);
    };
    SiteHomeComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.router.url == '/dashboard')) return [3 /*break*/, 2];
                        this.mobile = (window.innerWidth < 800) ? true : false;
                        this.userContextDefault = this.userContextService.defaultData;
                        this.orientationService.subscribeToGetOrientationAutoEnroll(this.loginResponse);
                        this.feesService.subscribeToGetFees(this.loginResponse);
                        this.activitiesService.subscribeToGetActivities(this.loginResponse);
                        //Calling CafeteriaAccounts to fill MealStore with values to be used if
                        //no response from CafeteriaAccountRemote
                        if (this.studentMealsService.result === false && this.siteMealsCounter < 1) {
                            // console.log("Calling getMeals from site studentMealsService.result: ", this.loginResponse)
                            // this.studentMealsService.subscribeToGetMeals(this.loginResponse);
                            // console.log("B4 getStudentMealsNew: ", this.loginResponse)
                            this.subscription = this.studentMealsService.getStudentMealsNew(this.loginResponse)
                                .subscribe(function (data) {
                                _this.studentMealsService.studentMeals = data;
                                _this.studentMealsService.result = true;
                            }, function (error) {
                                // console.log("Error: No Meals: ", this.studentMealsService.studentMeals);
                                _this.studentMealsService.result = false;
                            }, function () {
                                // console.log("The result: ", this.result)
                                if (_this.studentMealsService.result == false) {
                                    _this.studentMealsService.isStudentsGetting = false;
                                    _this.studentMealsService.getStudentErr = true;
                                    _this.studentMealsService.getStudentErrMsg = _this.loginResponse.message;
                                }
                                else {
                                    _this.studentMealsService.weGotStudents.emit(true);
                                    _this.studentMealsService.needGetStudents.emit(true);
                                    _this.studentMealsService.studentMeals = _this.studentMealsService.formatStudentMeals(_this.studentMealsService.studentMeals);
                                    _this.studentMealsService.listReady = true;
                                    _this.studentMealsService.isStudents = _this.studentMealsService.studentMeals.length > 0;
                                    //  console.log("Creating a cookie: ", this.loginResponse)
                                    _this.loginStoreSvc.loadLogin(_this.loginResponse);
                                    var tempMeals = _this.studentMealsService.studentMeals;
                                    // console.log("Student Meals Refreshing Store: ", tempMeals)
                                    _this.store.dispatch(new MealStoreActions.ClearMeals());
                                    _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
                                }
                            });
                            //  return this.studentMealsService.studentMeals;
                            /*WE will write the data returned from CafeteriaAccounts to the store once received
                             * This value will be displayed if a response from CafeteriaAccountRemote is not
                             * received in a timely fashion, after approximately 10 seconds
                             */
                            this.getDefaultDataInterval = setInterval(function () {
                                _this.studentMealsList = _this.studentMealsService.studentMeals;
                                // console.log("did site Get Student Meals: ", this.studentMealsList)
                                if (_this.studentMealsList) {
                                    // console.log("We should write to the store real quick: ", this.studentMealsList)
                                    clearInterval(_this.getDefaultDataInterval);
                                    _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(_this.studentMealsList));
                                }
                            }, 500);
                            this.siteMealsCounter++;
                        }
                        else {
                            if (this.siteMealsCounter < 5) {
                                this.siteMealsCounter++;
                            }
                        }
                        return [4 /*yield*/, this.transferService.subscribeToGetTransferFeeStatusNew(this.loginResponse)];
                    case 1:
                        _b.sent();
                        //  console.log('I am dashboard GetRemote')
                        //this.studentMealsRemoteService.subscribeToGetMeals(this.loginStoreSvc.cookieStateItem);
                        // console.log("What is the getMeals loginResponseObj: ", this.loginResponse)
                        this.studentMealsRemoteService.studentMealsSub$ =
                            this.studentMealsRemoteService.getRemoteStudentMeals(this.loginResponse)
                                .subscribe(function (data) {
                                //  console.log("Returned Data: ", data)
                                _this.studentMealsRemoteService.studentMeals = data;
                                _this.studentMealsRemoteService.result = true;
                            }, function (error) {
                                // console.log("Error: No Meals: ", this.studentMealsRemoteService.studentMeals);
                                _this.studentMealsRemoteService.result = false;
                            }, function () {
                                if (_this.utilityService.posCommError) {
                                    //  console.log("We got a commError: ", this.loginResponse)
                                    _this.studentMealsRemoteService.getMealsErr = _this.utilityService.posCommError;
                                    // console.log("What is getMealsErr: ", this.studentMealsRemoteService.getMealsErr)
                                }
                                //console.log("Did we get Meals: ", this.studentMeals);
                                if (_this.studentMealsRemoteService.result == false) {
                                    _this.studentMealsRemoteService.isStudentsRemoteGetting = false;
                                }
                                else {
                                    _this.studentMealsRemoteService.weGotStudents.emit(true);
                                    //  console.log("WeGotStudents: ", this.studentMeals);
                                    _this.studentMealsRemoteService.isStudentsRemoteGetting = _this.studentMealsRemoteService.studentMeals.length > 0;
                                    _this.loginStoreSvc.loadLogin(_this.loginResponse);
                                    var tempMeals = _this.studentMealsRemoteService.studentMeals;
                                    // console.log("What is tempMeals: ", tempMeals)
                                    _this.store.dispatch(new MealStoreActions.ClearMeals());
                                    _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
                                    // console.log("Calling this.formCompleted ")
                                    _this.studentMealsRemoteService.formCompleted = new rxjs_1.Observable(function (observer) {
                                        observer.next(true);
                                        observer.complete();
                                    });
                                    _this.studentMealsRemoteService.formCompleted.pipe(operators_1.first(function (data) { return data = true; }));
                                }
                                _this.studentMealsRemoteService.studentMealsSub$.unsubscribe();
                            });
                        _b.label = 2;
                    case 2:
                        this.feeStore.subscribe(function (c) { return _this.feeState = c; });
                        this.autoEnrollActivitiesCounter = 0;
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 3:
                        _a.deviceInfo = _b.sent();
                        console.log('user context', this.userContextDefault);
                        if (this.deviceInfo.platform === 'web') {
                            this.web = true;
                            if (this.userContextDefault.districtHasFees) {
                                this.districtHasFees = true;
                                this.showFees = true;
                            }
                            if (this.userContextDefault.districtHasActivities) {
                                this.districtHasActivities = true;
                                this.showActivities = true;
                            }
                        }
                        else {
                            if (this.userContextDefault.districtHasFees) {
                                this.districtHasFees = true;
                            }
                            if (this.userContextDefault.districtHasActivities) {
                                this.districtHasActivities = true;
                            }
                            if (this.userContextService.defaultData.isMobileMealsOnly === true) {
                                this.showFees = false;
                                this.showActivities = false;
                            }
                            else {
                                this.showFees = true;
                                this.showActivities = true;
                            }
                        }
                        this.orientationDialogInterval = setInterval(function () {
                            console.log('ORIENTATION AUTO ENROLL', _this.orientationService.orientationAutoEnrollList);
                            if (_this.orientationService.orientationAutoEnrollList) {
                                var i;
                                for (i = 0; i < _this.orientationService.orientationAutoEnrollList.length; i++) {
                                    _this.unsignedDocumentCount = _this.unsignedDocumentCount + _this.orientationService.orientationAutoEnrollList[i].orientation.unsignedDocuments.length;
                                }
                                console.log('doc count', _this.unsignedDocumentCount);
                                if (_this.orientationService.orientationAutoEnrollList.length > 0 && _this.userContextDefault.distristHasOrientations) {
                                    console.log(_this.orientationService.orientationAutoEnrollList);
                                    var i;
                                    for (i = 0; i < _this.orientationService.orientationAutoEnrollList.length; i++) {
                                        _this.unsignedDocumentCount = _this.unsignedDocumentCount + _this.orientationService.orientationAutoEnrollList[i].orientation.unsignedDocuments.length;
                                    }
                                    console.log('doc count', _this.unsignedDocumentCount);
                                    console.log('DOES IT GET TO THIS POINT TO OPEN THE ORIENTATION DIALOG?');
                                    _this.openOrientationDialog();
                                    clearInterval(_this.orientationDialogInterval);
                                }
                                else {
                                    clearInterval(_this.orientationDialogInterval);
                                    //Opens Auto Enroll dialog for fees/Activities
                                    _this.autoEnrollInterval = window.setInterval(function () {
                                        if (_this.activitiesService.activitiesList && _this.feesService.feesList && _this.autoEnrollActivitiesCounter === 0) {
                                            if (_this.districtHasFees || _this.districtHasActivities) {
                                                console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
                                                _this.openAutoEnrollDialog();
                                                _this.autoEnrollActivitiesCounter++;
                                                window.clearInterval(_this.autoEnrollInterval);
                                            }
                                        }
                                    }, 500);
                                }
                            }
                        }, 500);
                        // console.log("Calling Site Component : ", this.loginStoreSvc.didBrowserRefresh)
                        //need something a bit more robust to select which state to go to based on route 
                        this.tabIndex = (this.router.url.indexOf('dashboard') >= 0) ? 0 : 1;
                        this.setTitle();
                        this.studentMealsList = this.studentMealsService.studentMeals;
                        if (this.studentMealsList || this.studentFeesList) {
                            if (this.transferService.feeCartCount == 0 && this.cartStoreCounter < 2) {
                                //console.log("Calling Get Cart Count from ngOnIt")
                                this.getCartCount();
                                // console.log(this.cartItemCount);
                            }
                            else if (this.receiptService.clearCart == true) {
                                this.cartItemCount = this.cartItemCount;
                            }
                        }
                        this.findDistricts(this.loginResponse);
                        if (this.loginStoreSvc.didBrowserRefresh === true) {
                            this.multiDistrictCheck();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SiteHomeComponent.prototype.ngAfterViewInit = function () {
        // console.log('feestate', this.feeState)
        var _this = this;
        this.cdr.detectChanges();
        window.setTimeout(function () {
            // console.log("calling getCartCount - detectChanges")
            _this.getCartCount();
        }, 1000);
        this.userContextService.gotNewUserContext$.subscribe(function () {
            if (_this.userContextService.newTokenResults === true && _this.userRefreshedCounter < 1) {
                _this.userRefreshedCounter++;
                _this.siteMealsRefresh = (_this.studentMealsService.studentMeals.length > 0) ? true : false;
                // console.log("siteMealRefresh? ", this.siteMealsRefresh)
                _this.showDistricts = (_this.userData.availableDistricts.length > 0) ? true : false;
                //console.log("Show Districts? ", this.showDistricts);
            }
        });
        this.browserRefreshSub$ = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                exports.browserRefresh = !_this.router.navigated;
                //console.log("What is browserRefresh: ", browserRefresh);
                //console.log("Do we have a Refresh LoginResponse: ", this.loginStoreSvc.cookieStateItem)
            }
        });
    };
    //Opens orientation dialog
    SiteHomeComponent.prototype.openOrientationDialog = function () {
        var _this = this;
        if (this.orientationService.orientationAutoEnrollList.length > 0) {
            var config = new material_1.MatDialogConfig();
            config.panelClass = 'my-class';
            config.maxHeight = '750px';
            config.width = '650px';
            config.data = {
                orientationList: this.orientationService.orientationAutoEnrollList
            };
            config.disableClose = true;
            console.log(config.data);
            var dialogRef = this.dialog.open(orientation_dialog_component_1.OrientationDialogComponent, config);
            dialogRef.afterClosed().subscribe(function (result) {
                _this.orientationService.subscribeToGetOrientation(_this.loginResponse);
            });
        }
    };
    //Opens autoEnroll dialog
    SiteHomeComponent.prototype.openAutoEnrollDialog = function () {
        var _this = this;
        if (this.activitiesService.activitiesList) {
            this.autoCartList = [];
            this.activitiesList = this.activitiesService.activitiesList;
            var i;
            for (i = 0; i < this.activitiesList.length; i++) {
                var j;
                for (j = 0; j < this.activitiesList[i].accounts.length; j++) {
                    var k;
                    for (k = 0; k < this.activitiesList[i].accounts[j].activities.length; k++) {
                        if (this.activitiesList[i].accounts[j].activities[k].isAutoAddToCart && !this.activitiesList[i].accounts[j].activities[k].isInCart) {
                            this.autoCartList.push(this.activitiesList[i].accounts[j].activities[k]);
                        }
                    }
                }
                var l;
                for (l = 0; l < this.activitiesList[i].subCategory.length; l++) {
                    var m;
                    for (m = 0; m < this.activitiesList[i].subCategory[l].accounts.length; m++) {
                        var n;
                        for (n = 0; n < this.activitiesList[i].subCategory[l].accounts[m].activities.length; n++) {
                            if (this.activitiesList[i].subCategory[l].accounts[m].activities[n].isAutoAddToCart && !this.activitiesList[i].subCategory[l].accounts[m].activities[n].isInCart) {
                                this.autoCartList.push(this.activitiesList[i].subCategory[l].accounts[m].activities[n]);
                            }
                        }
                    }
                }
                if (i + 1 == this.activitiesList.length) {
                    this.autoCartListReady = true;
                }
            }
        }
        if (this.feesService.feesList) {
            this.autoFeesList = [];
            this.feesList = this.feesService.feesList;
            console.log('feeslist', this.feesList);
            var o;
            for (o = 0; o < this.feesList.length; o++) {
                var p;
                for (p = 0; p < this.feesList[o].fees.length; p++) {
                    if (this.feesList[o].fees[p].isAutoAddToCart && !this.feesList[o].fees[p].isInCart) {
                        this.feesList[o].fees[p].name = this.feesList[o].name;
                        this.feesList[o].fees[p].studentKey = this.feesList[o].studentKey;
                        this.feesList[o].fees[p].insideIndex = p;
                        this.feesList[o].fees[p].outsideIndex = o;
                        this.autoFeesList.push(this.feesList[o].fees[p]);
                    }
                }
                if (o + 1 == this.feesList.length) {
                    this.autoFeesListReady = true;
                }
            }
        }
        if (this.autoCartListReady && this.autoFeesListReady && this.autoFeesList.length > 0 || this.autoCartList.length > 0) {
            //console.log('autoCartList', this.autoCartList);
            //console.log('autoFeesList', this.autoFeesList);
            var config = new material_1.MatDialogConfig();
            config.panelClass = 'my-class';
            config.maxHeight = '750px';
            config.width = '650px';
            config.data = {
                feesList: this.autoFeesList,
                cart: this.autoCartList
            };
            config.disableClose = true;
            //console.log(config.data);
            var dialogRef = this.dialog.open(auto_enroll_dialog_component_1.AutoEnrollDialogComponent, config);
            dialogRef.afterClosed().subscribe(function (result) {
                _this.feesService.subscribeToGetFees(_this.loginResponse);
            });
            this.autoEnrollActivitiesCounter = 1;
        }
        else {
            this.autoEnrollActivitiesCounter = 1;
        }
    };
    SiteHomeComponent.prototype.multiDistrictCheck = function () {
        var _this = this;
        //  console.log("Do we have a Refresh LoginResponse: ", this.loginStoreSvc.cookieStateItem)
        var selectedDistrict = this.loginStoreSvc.cookieStateItem.districtName;
        this.userContextService.subscribeToGetDeriveDefaultsNew(this.loginStoreSvc.cookieStateItem);
        window.setTimeout(function () {
            //  console.log("Do we have defaultData: ", this.userContextService.defaultData)
            if (_this.userContextService.defaultData) {
                _this.showDistricts = (_this.userContextService.defaultData.availableDistricts.length > 0) ? true : false;
                _this.loginStoreSvc.didBrowserRefresh = false;
            }
        }, 0);
    };
    SiteHomeComponent.prototype.getCartCount = function () {
        var _this = this;
        this.getCartCounter++;
        this.cartStoreCounter++;
        this.updateCartCounter++;
        var storeCount;
        if (this.loginStoreSvc.cookieStateItem) {
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
        }
        else {
            this.loginResponse = this.loginStoreSvc.fixLoginResponse(this.loginStoreSvc.storeLoginResponse);
        }
        // this needs to come out once we're doing more than meal payments: this.loginResponse.mealPaymentsSuspended
        // They could have something in the cart besides meals.
        if (this.loginResponse.isBlockPayments || this.loginResponse.allPaymentsSuspended || this.loginResponse.mealPaymentsSuspended) {
            this.cartItemCount = 0;
        }
        else {
            //Validates the Cart Amount before returning it
            if (this.feeAddedFlag == true) {
                this.cartItemCount = this.loginResponse.cartItemCount;
            }
            else {
                if (this.studentMealsService.studentMeals || this.feesService.feesList && this.multiDistrictSrvc.newDistrictSelected === false) {
                    this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                    if (this.cartState) {
                        this.cartItemCount = this.countStore();
                        this.refreshService.stopCartRefresh();
                    }
                    if (this.studentMealsService.studentMeals || this.feesService.feesList) {
                        if (this.cartState) {
                            this.cartItemCount = this.countStore();
                            this.loginResponse.cartItemCount = this.cartItemCount;
                        }
                        if (this.cartCheckoutItemsService.cartItem && !this.cartState) {
                            if (this.cartCheckoutItemsService.cartItem.itemCount) {
                                this.cartItemCount = this.cartCheckoutItemsService.cartItem.itemCount;
                            }
                            else {
                                this.cartItemCount = this.loginResponse.cartItemCount;
                            }
                        }
                    }
                    else {
                        this.cartItemCount = this.loginResponse.cartItemCount;
                    }
                }
                else {
                    //Just in case studentMeals has been set to false before we got a cartState
                    this.cartStore.subscribe(function (c) { return _this.cartState = c; });
                    if (this.cartState) {
                        this.cartItemCount = this.countStore();
                        this.cartItemCount = this.cartState.data.itemCount;
                        this.loginResponse.cartItemCount = this.cartItemCount;
                        //console.log("Did we get a cart count from the CartStore: ", this.loginResponse.cartItemCount)
                    }
                }
                this.updateCartCounter++;
                this.addCartItemService.addedToCart = false;
            }
            if (this.multiDistrictSrvc.newDistrictSelected === true) {
                this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
                window.setTimeout(function () {
                    if (_this.cartCheckoutItemsService.cartItem) {
                        _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartCheckoutItemsService.cartItem));
                        _this.cartItemCount = _this.countStore();
                        if (_this.cartItemCount > 0) {
                            _this.haveCartCount = true;
                        }
                    }
                }, 1000);
                this.addCartItemService.addedToCart = false;
            }
            //This checks to see if a fee has been added to the cart if not the cart amount should be the loginresponse.cartItemAmount
            if (this.transferService.feeCartCount == 0 || this.transferService.feeCartCount == undefined) {
                if (this.cartCheckoutItemsService.cartItem && !this.cartState && storeCount) {
                    this.cartItemCount = storeCount;
                    this.refreshService.stopCartRefresh();
                }
            }
            else if (this.receiptService.clearCart == false || this.receiptService.clearCart == undefined) {
                //If a transfer fee is accepted the cart count is set to 1
                this.cartItemCount = this.transferService.feeCartCount;
            }
            else if (this.cartProcessedFlag == true) {
                this.cartItemCount = 0;
            }
            else {
                this.cartItemCount = this.cartItemCount;
            }
            this.receiptService.clearCart == false;
        }
        //this.validCartCountService.fixCartNow = false;
        if (this.cartItemCount > 0) {
            // console.log("What is the final cartCount: ", this.cartItemCount)
            this.haveCartCount = true;
            return this.haveCartCount;
        }
        else {
            //  console.log("What is the final cartCount- False: ", this.cartItemCount)
            this.haveCartCount = false;
            return this.haveCartCount;
        }
    };
    SiteHomeComponent.prototype.countStore = function () {
        var _this = this;
        //  console.log("Calling countStore")
        var temptState;
        var storeTempItem;
        var storeCount;
        this.receiptService.clearCart = false;
        this.cartStore.subscribe(function (c) { return _this.cartState = c; });
        temptState = this.cartState;
        if (temptState) {
            storeTempItem = temptState.data;
            storeCount = storeTempItem.itemCount;
            // console.log(storeCount)
            this.haveCartCount = (storeCount > 0) ? true : false;
            // console.log("Should we Show Cart: ", this.haveCartCount)
            return storeCount;
        }
        else {
            this.haveCartCount = (this.cartItemCount > 0) ? true : false;
            //  console.log("Should we Show Cart: ", this.haveCartCount)
            return this.cartItemCount;
        }
    };
    SiteHomeComponent.prototype.viewCart = function () {
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
    SiteHomeComponent.prototype.newDistrictCartCount = function () {
        var _this = this;
        console.log("Calling newDistrictCartCount ");
        var testObj = this.loginStoreSvc.getLoginObj();
        window.setTimeout(function () {
            // console.log("do we have a testObj: ", testObj)
            if (testObj) {
                //  console.log("We had a testObj: ", testObj)
                _this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(testObj);
            }
            else {
                var testStieCookie = _this.loginStoreSvc.cookieStateItem;
                // console.log("Do we have the correct loginResponse: ", testStieCookie)
                _this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(testStieCookie);
            }
        }, 1000);
        setTimeout(function () {
            // console.log("Do we have the correct CartItems: ", this.cartCheckoutItemsService.cartItem)
            _this.store.dispatch(new CartStoreActions.ClearCart());
            if (_this.cartCheckoutItemsService.cartItem) {
                _this.store.dispatch(new CartStoreActions.LoadCartSuccess(_this.cartCheckoutItemsService.cartItem));
                _this.cartItemCount = _this.countStore();
                if (_this.cartItemCount > 0) {
                    _this.haveCartCount = true;
                }
            }
        }, 1000);
    };
    SiteHomeComponent.prototype.reroute = function (index) {
        this.tabIndex = index;
    };
    SiteHomeComponent.prototype.switchUserOptions = function () {
        if (this.userOptions == 1 && (this.router.url.indexOf('/account') < 0)) {
            this.userOptions = null;
            this.tabIndex = 1;
            this.router.navigate(['/account']);
        }
        else if (this.userOptions == 2) {
            //do a sign out
            this.logOut();
        }
        this.userOptions = null;
    };
    SiteHomeComponent.prototype.logOut = function () {
        this.loginStoreSvc.clearSessionStorage();
        this.router.navigate(['/welcome']);
    };
    SiteHomeComponent.prototype.userOptionsAccount = function () {
        return (this.router.url.indexOf('/account') >= 0) ? true : false;
    };
    //Checks on whether or not to show the sign in card in-line
    SiteHomeComponent.prototype.onResize = function (event) {
        this.mobile = (window.innerWidth < 800) ? true : false;
    };
    SiteHomeComponent.prototype.setTitle = function () {
        this.title = this.route.snapshot.firstChild.data['title'];
    };
    SiteHomeComponent.prototype.getUserDistricts = function (userData) {
        //console.log("Calling getUserDistricts", userData.availableDistricts);
        this.districtList = userData.availableDistricts;
    };
    SiteHomeComponent.prototype.setDistrict = function (userOptions) {
        var _this = this;
        // console.log("Calling setDistrict")
        if (this.loginResponse.districtName == userOptions) {
            this.loginStoreSvc.loadLogin(this.loginResponse);
        }
        this.pageLoadingService.show("Retrieving Account Data");
        this.getDistrictcounter = 0;
        this.userRefreshedCounter = 0;
        this.multiDistrictSrvc.multiDistrictRefreshCntr = 0;
        if (this.refreshService.haveUserContext === true) {
            this.refreshService.haveUserContext = false;
            //  console.log("WE set haveUserContext")
            this.siteHomeRefreshCounter = 0;
            this.refreshService.mealRefreshCounter = 0;
            this.refreshService.mealRefresh = false;
        }
        var dList = this.districtList;
        if (this.multiDistrictSrvc.processedDistrict) {
            //"We switched Districts clear Processed after the receipt is closed. Set to ensure the correct district is used to refresh the dashboard
            this.multiDistrictSrvc.processedDistrict = '';
            // console.log("We switched Districts clear Processed: ", this.multiDistrictSrvc.processedDistrict);
            this.selectedLoginResponse = this.loginResponse;
        }
        this.selectedDistrict = this.getSelectedDistrict(userOptions, dList);
        if (this.selectedDistrict) {
            //  console.log("the selected DISTRICT: ", this.selectedDistrict);
            this.defaultDistrict = this.selectedDistrict[0].distirctName;
        }
        this.multiDistrictSrvc.newDistrictSelected = true;
        //  console.log("New District Selected: ", this.multiDistrictSrvc.newDistrictSelected);
        if (this.router.url == '/account/payment-method') {
            //  console.log('Im Payment Method');
            this.subscribeToPostNewUserContext(this.selectedDistrict, this.loginResponse);
            window.setTimeout(function () {
                // console.log("do we have an updated LoginResponse: ", this.loginResponse)
                _this.multiDistrictSrvc.paymentMethodsUpdate();
            }, 2000);
        }
        else {
            this.pageLoadingService.show("Retrieving Account Data...");
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
            this.subscribeToPostNewUserContext(this.selectedDistrict, this.loginResponse);
            this.userContextIntrvl =
                window.setInterval(function () {
                    _this.studentMealsService.studentMeals = [];
                    // console.log("Do we have userContextNow newLoginResponse:  ", this.userContextService.newLoginResponse )
                    if (_this.userContextService.newLoginResponse) {
                        _this.loginResponse = _this.userContextService.newLoginResponse;
                        _this.loginStoreSvc.loadLogin(_this.loginResponse);
                        //console.log("Calling from setDistrict 1")
                        window.clearInterval(_this.userContextIntrvl);
                        // this.studentMealsRemoteService.subscribeToGetMeals(this.loginResponse);
                        _this.studentMealsRemoteService.getRemoteStudentMeals(_this.loginResponse)
                            .subscribe(function (data) {
                            //  console.log("Returned Data: ", data)
                            _this.studentMealsRemoteService.studentMeals = data;
                            _this.studentMealsRemoteService.result = true;
                            _this.studentMealsRemoteService.listReady = true;
                        }, function (error) {
                            // console.log("Error: No Meals: ", this.studentMealsRemoteService.studentMeals);
                            _this.studentMealsRemoteService.result = false;
                        }, function () {
                            if (_this.utilityService.posCommError) {
                                //  console.log("We got a commError: ", this.loginResponse)
                                _this.studentMealsRemoteService.getMealsErr = _this.utilityService.posCommError;
                                //  console.log("What is getMealsErr: ", this.getMealsErr)
                            }
                            //console.log("Did we get Meals: ", this.studentMeals);
                            if (_this.studentMealsRemoteService.result == false) {
                                _this.studentMealsRemoteService.isStudentsRemoteGetting = false;
                            }
                            else {
                                _this.studentMealsRemoteService.weGotStudents.emit(true);
                                //  console.log("WeGotStudents: ", this.studentMeals);
                                _this.studentMealsRemoteService.isStudentsRemoteGetting = _this.studentMealsRemoteService.studentMeals.length > 0;
                                _this.loginStoreSvc.loadLogin(_this.loginResponse);
                                var tempMeals = _this.studentMealsRemoteService.studentMeals;
                                // console.log("What is tempMeals: ", tempMeals)
                                _this.store.dispatch(new MealStoreActions.ClearMeals());
                                _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempMeals));
                                // console.log("Calling this.formCompleted ")
                                _this.studentMealsRemoteService.formCompleted = new rxjs_1.Observable(function (observer) {
                                    observer.next(true);
                                    observer.complete();
                                });
                                _this.studentMealsRemoteService.formCompleted.pipe(operators_1.first(function (data) { return data == true; }));
                            }
                            _this.studentMealsRemoteService.studentMealsSub$.unsubscribe();
                            _this.processedNewList();
                        });
                    }
                }, 0);
        }
        this.getCartCount();
    };
    SiteHomeComponent.prototype.findDistricts = function (loginResponse) {
        //  console.log("Calling find Districts: ", loginResponse);
        this.multiDistrictSrvc.subscribeToGetDistricts(this.loginResponse);
    };
    SiteHomeComponent.prototype.getSelectedDistrict = function (userOptions, dList) {
        var selectedOption = [];
        for (var i = 0; i < dList.length; i++) {
            if (userOptions == dList[i].districtName) {
                selectedOption.push(dList[i]);
            }
        }
        return selectedOption;
    };
    //Refreshes meals after refresh event ex: processed payment, returning back to the dashboard
    SiteHomeComponent.prototype.refeshMeals = function (refreshNow) {
        var _this = this;
        if (refreshNow) {
            this.addCartItemService.count = 0;
            this.getCartCount();
            // console.log("Calling getMeals from refeshMeals: ")
            this.studentMealsRemoteService.subscribeToGetMeals(this.loginResponse);
            this.studentMealsService.listReady = true;
            this.siteMealsRefresh = true;
            if (this.studentMealsRemoteService.studentMeals) {
                var tempStudentMeal = void 0;
                tempStudentMeal = this.studentMealsRemoteService.studentMeals;
                this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeal));
                this.mealStore.subscribe(function (m) { return _this.mealState = m; });
                if (this.mealState) {
                    this.mealStateMeals = this.mealState.data;
                }
            }
            this.cartStore.subscribe(function (c) { return _this.cartState = c; });
            if (this.cartState) {
                this.cartStateItems = this.cartState.data;
            }
        }
    };
    SiteHomeComponent.prototype.subscribeToPostNewUserContext = function (districtObj, loginResponse) {
        var _this = this;
        // console.log("calling subscribeToPostNewUserContext: ", districtObj)
        var districtKey = districtObj[0].districtKey;
        // console.log("What is the loginResponse: ", loginResponse)
        var failureMessage = 'Failed to get New User Credentials';
        var loginModelObj;
        this.userContextService.postNewUserContext(districtKey, loginResponse)
            .subscribe(function (data) {
            // this.newLoginResponse = data;
            loginModelObj = data.apiUserContext;
            // console.log("did we get a loginModelObj: ", loginModelObj)
            _this.userContextService.newToken = data.jwt;
            _this.userContextService.newTokenResults = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, loginResponse, failureMessage);
            _this.userContextService.newTokenResults = true;
        }, function () {
            loginResponse.access_token = _this.userContextService.newToken;
            loginResponse.allPaymentsResumeDate = loginModelObj.allPaymentsResumeDate; //add
            loginResponse.allPaymentsSuspended = loginModelObj.allPaymentsSuspended; //add
            loginResponse.cartItemCount = loginModelObj.cartItemCount;
            loginResponse.districtKey = loginModelObj.districtKey;
            loginResponse.districtName = loginModelObj.districtName; //add
            loginResponse.expires_in = loginModelObj.expires_in; //add
            loginResponse.firstName = loginModelObj.firstName; //add
            loginResponse.incidentId = loginModelObj.incidentId; //add
            loginResponse.isAchAllowed = loginModelObj.isAchAllowed;
            loginResponse.isAlertsAllowedDistrict = loginModelObj.isAlertsAllowedDistrict;
            loginResponse.isAutoPayEnabled = loginModelObj.isAutoPayEnabled;
            loginResponse.isBlockACH = loginModelObj.isBlockACH;
            loginResponse.isBlockPayments = loginModelObj.isBlockPayments;
            loginResponse.isDisableMealPaymentsDistrict = loginModelObj.isDisableMealPaymentsDistrict;
            loginResponse.isNewExperience = loginModelObj.isNewExperience;
            loginResponse.lastName = loginModelObj.lastName;
            loginResponse.mealPaymentsResumeDate = loginModelObj.mealPaymentsResumeDate; //add
            loginResponse.mealPaymentsSuspended = loginModelObj.mealPaymentsSuspended; //add
            loginResponse.requiresRelationship = loginModelObj.requiresRelationship; //add
            loginResponse.requiresStudent = loginModelObj.requiresStudent; //add
            loginResponse.state = loginModelObj.state;
            loginResponse.isFroEnabled = loginModelObj.isFroEnabled;
            loginResponse.isOldExperienceAllowed = loginModelObj.isOldExperienceAllowed;
            _this.userContextService.newLoginResponse = loginResponse;
            // console.log("We got a New LoginResponse: ", this.newLoginResponse)
            //console.log("What is the New UserContext LoginResponse: ", this.loginResponse);
            //console.log("Do we have default Data: ", this.defaultData);
            var testDefaultData = _this.userContextService.defaultData;
            if (testDefaultData) {
                //  console.log("The testDefaultDate: ", testDefaultData)
                testDefaultData.districtKey = _this.userContextService.newLoginResponse.districtKey;
                testDefaultData.districtName = _this.userContextService.newLoginResponse.districtName;
                _this.loginStoreSvc.createLoginObj(testDefaultData, _this.userContextService.newLoginResponse);
            }
            _this.loginStoreSvc.loadLogin(_this.userContextService.newLoginResponse);
            _this.loginResponse = _this.loginStoreSvc.cookieStateItem;
            _this.userContextService.callUserCntxtCnt = 0;
            //Tells app we got a new token now call api's using the new Token
            _this.userContextService.gotNewUserContext$.emit(_this.userContextService.newTokenResults);
        });
    };
    SiteHomeComponent.prototype.processedNewList = function () {
        //console.log("Calling new Processed List: ", this.studentMealsRemoteService.studentMeals)
        var _this = this;
        if (this.studentMealsRemoteService.studentMeals.length > 0) {
            var tempStudentMeals = this.studentMealsRemoteService.studentMeals;
            this.store.dispatch(new MealStoreActions.ClearMeals());
            //  window.setTimeout(() => {
            this.isContextRefreshing = true;
            this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeals));
            this.mealStore.subscribe(function (m) { return _this.mealState = m; });
            if (this.mealState) {
                this.mealStateMeals = this.mealState.data;
                this.siteMealsRefresh = true;
                this.userContextRefresh$.emit(this.siteMealsRefresh);
                this.newDistrictCartCounter = 0;
                this.multiDistrictSrvc.newDistrictSelected = true;
                // console.log("Sitehome saw district switch: ", this.multiDistrictSrvc.newDistrictSelected)
                this.multiDistrictSrvc.didSwitchDistrict.emit(true);
                //  this.pageLoadingService.hide();
            }
            //   }, 0)
        }
        else {
            this.studentMealsRemoteService.weGotStudents.subscribe(function () {
                if (_this.studentMealsRemoteService.studentMeals.length > 0) {
                    var tempStudentMeals = _this.studentMealsRemoteService.studentMeals;
                    _this.isContextRefreshing = (tempStudentMeals.length > 0) ? true : false;
                    _this.store.dispatch(new MealStoreActions.ClearMeals());
                    _this.store.dispatch(new MealStoreActions.LoadMealsSuccess(tempStudentMeals));
                    _this.mealStore.subscribe(function (m) { return _this.mealState = m; });
                    if (_this.mealState) {
                        _this.mealStateMeals = _this.mealState.data;
                        _this.siteMealsRefresh = (_this.mealStateMeals) ? true : false;
                        _this.userContextRefresh$.emit(_this.siteMealsRefresh);
                        _this.newDistrictCartCounter = 0;
                        _this.multiDistrictSrvc.newDistrictSelected = true;
                        // console.log("Sitehome saw district switch: ", this.multiDistrictSrvc.newDistrictSelected)
                        _this.multiDistrictSrvc.didSwitchDistrict.emit(true);
                        _this.studentMealsRemoteService.weGotStudents.unsubscribe();
                    }
                }
            });
        }
    };
    SiteHomeComponent.prototype.ngOnDestroy = function () {
        this.isDestroyed = true; /* Update our state. */
        this.updateCartCounter = 0;
        this.siteMealsCounter = 0;
        this.getCartCounter = 0;
        this.cartStoreCounter = 0;
        this.multiDistrictSrvc.newDistrictSelected = false;
    };
    __decorate([
        core_1.ViewChild('userOptionsDropdown'),
        __metadata("design:type", Object)
    ], SiteHomeComponent.prototype, "options", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SiteHomeComponent.prototype, "onResize", null);
    SiteHomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'site-home.component.html',
            styleUrls: ['./site-home.component.less'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_1.ActivatedRoute,
            index_4.AuthenticationService,
            index_1.UserContextService,
            student_meals_service_1.StudentMealsService,
            student_meals_service_remote_1.StudentMealsServiceRemote,
            index_2.StudentListService,
            index_3.ValidCartCountService,
            index_3.TransfersService,
            core_1.ChangeDetectorRef,
            receipt_service_1.ReceiptService,
            index_3.MultiDistrictService,
            index_3.FeesService,
            index_3.AddCartItemService,
            index_3.CartCheckoutItemsService,
            store_1.Store,
            store_1.State,
            index_3.CartCheckoutItemsService,
            refresh_service_1.RefreshService,
            material_1.MatDialog,
            page_loading_service_1.PageLoadingService,
            index_4.LoginStoreService,
            activities_service_1.ActivitiesService,
            index_4.UtilityService,
            orientation_service_1.OrientationService])
    ], SiteHomeComponent);
    return SiteHomeComponent;
}());
exports.SiteHomeComponent = SiteHomeComponent;
//# sourceMappingURL=site-home.component.js.map