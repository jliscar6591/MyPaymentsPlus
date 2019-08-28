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
var router_1 = require("@angular/router");
var index_1 = require("../../../shared/services/index");
var orientation_service_1 = require("../../services/orientation.service");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var auto_enroll_dialog_component_1 = require("../../dashboard/auto-enroll-dialog/auto-enroll-dialog.component");
var activities_service_1 = require("../../services/activities.service");
var index_2 = require("../../../site/services/index");
var core_2 = require("@capacitor/core");
var index_3 = require("../../../site/account/services/index");
var OrientationDialogComponent = /** @class */ (function () {
    function OrientationDialogComponent(router, loginStoreSvc, orientationService, snackBar, data, dialogRef, dialog, feesService, addCartItemService, cartCheckoutItemsService, activitiesService, userContextService) {
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
        this.orientationService = orientationService;
        this.snackBar = snackBar;
        this.data = data;
        this.dialogRef = dialogRef;
        this.dialog = dialog;
        this.feesService = feesService;
        this.addCartItemService = addCartItemService;
        this.cartCheckoutItemsService = cartCheckoutItemsService;
        this.activitiesService = activitiesService;
        this.userContextService = userContextService;
        this.showButton = false;
        this.step = 0;
        this.gettingOrientation = true;
        this.autoEnrollActivitiesCounter = 0;
        this.districtHasFees = false;
        this.districtHasActivities = false;
        this.showFees = true;
        this.showActivities = true;
        this.unsignedOrientationList = [];
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    OrientationDialogComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log(this.data.orientationList);
                        this.orientationList = this.data.orientationList;
                        this.responses = [];
                        this.autoEnrollActivitiesCounter = 0;
                        this.userContextDefault = this.userContextService.defaultData;
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
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
                        for (i = 0; i < this.orientationList.length; i++) {
                            if (this.orientationList[i].orientation.signedDocuments.length > 0) {
                                this.hasSigned = true;
                            }
                            if (this.orientationList[i].orientation.unsignedDocuments.length > 0) {
                                this.hasUnsigned = true;
                                this.unsignedOrientationList.push(this.orientationList[i]);
                            }
                        }
                        this.gettingOrientation = false;
                        clearInterval(this.orientationInterval);
                        console.log('unsigned orientationLists', this.unsignedOrientationList);
                        console.log('orientation list', this.orientationList);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrientationDialogComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    OrientationDialogComponent.prototype.nextStep = function () {
        if (this.step === this.unsignedOrientationList.length - 1) {
        }
        this.step++;
    };
    OrientationDialogComponent.prototype.prevStep = function () {
        this.step--;
    };
    OrientationDialogComponent.prototype.onCheckBoxChange = function (event, studentIndex, documentIndex, item, student) {
        item.checked = !item.checked;
        // console.log('checked?', item.checked);
        if (item.checked) {
            // console.log(studentIndex, documentIndex, event, item);
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
    OrientationDialogComponent.prototype.onChangeAgree = function (mrChange, studentIndex, documentIndex, item, student) {
        console.log(mrChange.value);
        console.log(studentIndex, documentIndex, item, student);
        var mrButton = mrChange.source;
        var response = {
            'accountBalanceID': student.accountBalanceID,
            'orientationItemID': item.orientationItemId,
            'signed': true
        };
        var i;
        for (i = 0; i < this.responses.length; i++) {
            if (this.responses[i].orientationItemID === item.orientationItemId) {
                this.responses.splice(i, 1);
            }
        }
        this.responses.push(response);
        this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
        console.log("responses", this.responses);
        this.nextStep();
    };
    OrientationDialogComponent.prototype.onChangeYes = function (mrChange, studentIndex, documentIndex, item, student) {
        console.log(mrChange.value);
        console.log(studentIndex, documentIndex, item, student);
        console.log(studentIndex, documentIndex, item, student);
        var mrButton = mrChange.source;
        this.showButton = true;
        console.log(mrButton.name);
        console.log(mrButton.checked);
        console.log(mrButton.inputId);
        var response = {
            'accountBalanceID': student.accountBalanceID,
            'orientationItemID': item.orientationItemId,
            'signed': true
        };
        var i;
        for (i = 0; i < this.responses.length; i++) {
            if (this.responses[i].orientationItemID === item.orientationItemId) {
                this.responses.splice(i, 1);
            }
        }
        this.responses.push(response);
        this.unsignedOrientationList[studentIndex].orientation.unsignedDocuments[documentIndex].signed = true;
        console.log("responses", this.responses);
        this.nextStep();
    };
    OrientationDialogComponent.prototype.signDocuments = function () {
        var _this = this;
        this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
        this.orientationInterval = setInterval(function () {
            _this.gettingOrientation = true;
            if (_this.orientationService.orientationResponse) {
                // console.log('response',this.orientationService.orientationResponse);
                _this.gettingOrientation = false;
                _this.responses = [];
                if (_this.activitiesService.activitiesList && _this.feesService.feesList && _this.autoEnrollActivitiesCounter === 0) {
                    if (_this.districtHasFees || _this.districtHasActivities) {
                        console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
                        _this.openAutoEnrollDialog();
                        _this.autoEnrollActivitiesCounter++;
                        window.clearInterval(_this.autoEnrollInterval);
                        _this.dialogRef.close();
                    }
                }
                _this.openSnackBar();
                clearInterval(_this.orientationInterval);
            }
        }, 1000);
    };
    OrientationDialogComponent.prototype.openSnackBar = function () {
        this.snackBar.open('Documents Submitted', '✔', {
            duration: 2000,
        });
    };
    //closes dialog
    OrientationDialogComponent.prototype.onNoClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.activitiesService.activitiesList && this.feesService.feesList && this.autoEnrollActivitiesCounter === 0) {
                    if (this.districtHasFees || this.districtHasActivities) {
                        console.log('OR DOES IT SKIP STRAIGHT TO HERE?');
                        this.openAutoEnrollDialog();
                        this.autoEnrollActivitiesCounter++;
                        window.clearInterval(this.autoEnrollInterval);
                    }
                }
                this.dialogRef.close();
                return [2 /*return*/];
            });
        });
    };
    OrientationDialogComponent.prototype.openAutoEnrollDialog = function () {
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
    OrientationDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-orientation-dialog',
            templateUrl: './orientation-dialog.component.html',
            styleUrls: ['./orientation-dialog.component.less']
        }),
        __param(4, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.LoginStoreService,
            orientation_service_1.OrientationService,
            material_2.MatSnackBar, Object, material_1.MatDialogRef,
            material_1.MatDialog,
            index_2.FeesService,
            index_2.AddCartItemService,
            index_2.CartCheckoutItemsService,
            activities_service_1.ActivitiesService,
            index_3.UserContextService])
    ], OrientationDialogComponent);
    return OrientationDialogComponent;
}());
exports.OrientationDialogComponent = OrientationDialogComponent;
//# sourceMappingURL=orientation-dialog.component.js.map