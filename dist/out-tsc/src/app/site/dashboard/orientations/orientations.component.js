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
var index_1 = require("../../../shared/services/index");
var orientation_service_1 = require("../../services/orientation.service");
var material_1 = require("@angular/material");
var OrientationsComponent = /** @class */ (function () {
    function OrientationsComponent(router, loginStoreSvc, orientationService, snackBar) {
        this.router = router;
        this.loginStoreSvc = loginStoreSvc;
        this.orientationService = orientationService;
        this.snackBar = snackBar;
        this.showButton = false;
        this.step = 0;
        this.gettingOrientation = true;
        this.signedOrientationList = [];
        this.unsignedOrientationList = [];
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    OrientationsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.isMobile = (window.innerWidth < 960) ? true : false;
                        return [4 /*yield*/, this.orientationService.subscribeToGetOrientation(this.loginStoreSvc.loginStateItems)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, setInterval(function () {
                                if (_this.orientationService.orientationList) {
                                    _this.orientationList = _this.orientationService.orientationList;
                                    var i;
                                    for (i = 0; i < _this.orientationList.length; i++) {
                                        if (_this.orientationList[i].orientation.signedDocuments.length > 0) {
                                            _this.hasSigned = true;
                                            _this.signedOrientationList.push(_this.orientationList[i]);
                                        }
                                        if (_this.orientationList[i].orientation.unsignedDocuments.length > 0) {
                                            _this.hasUnsigned = true;
                                            _this.unsignedOrientationList.push(_this.orientationList[i]);
                                        }
                                    }
                                    _this.gettingOrientation = false;
                                    clearInterval(_this.orientationInterval);
                                    console.log('unsigned orientationLists', _this.unsignedOrientationList);
                                    console.log('signed documents', _this.signedOrientationList);
                                    console.log('orientation list', _this.orientationList);
                                }
                            }, 100)];
                    case 2:
                        _a.orientationInterval = _b.sent();
                        this.responses = [];
                        this.detailedResponses = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    OrientationsComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    OrientationsComponent.prototype.nextStep = function () {
        this.step++;
    };
    OrientationsComponent.prototype.prevStep = function () {
        this.step--;
    };
    OrientationsComponent.prototype.onCheckBoxChange = function (event, studentIndex, documentIndex, item, student) {
        item.checked = !item.checked;
        console.log('checked?', item.checked);
        if (item.checked) {
            console.log(studentIndex, documentIndex, event, item);
            var response = {
                'accountBalanceID': student.accountBalanceID,
                'orientationItemID': item.orientationItemId,
                'signed': item.checked
            };
            this.responses.push(response);
            console.log("responses", this.responses);
            var details = {
                'document': item,
                'student': student
            };
            var j;
            for (j = 0; j < this.detailedResponses.length; j++) {
                if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
                    this.detailedResponses.splice(j, 1);
                }
            }
            this.detailedResponses.push(details);
            console.log('detailed responses', this.detailedResponses);
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
        if (this.responses.length > 0 || this.detailedResponses.length > 0) {
            this.showButton = true;
            this.showInCart = true;
        }
        else {
            this.showButton = false;
            this.showInCart = false;
        }
    };
    OrientationsComponent.prototype.onChangeYes = function (mrChange, studentIndex, documentIndex, item, student) {
        console.log(mrChange.value);
        console.log(studentIndex, documentIndex, item, student);
        if (mrChange.value === true) {
            item.checked;
        }
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
        var details = {
            'document': item,
            'student': student
        };
        var j;
        for (j = 0; j < this.detailedResponses.length; j++) {
            if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
                this.detailedResponses.splice(j, 1);
            }
        }
        this.detailedResponses.push(details);
        this.nextStep();
        var mrButton = mrChange.source;
        if (this.responses.length > 0 || this.detailedResponses.length > 0) {
            this.showButton = true;
            this.showInCart = true;
        }
        else {
            this.showButton = false;
            this.showInCart = false;
        }
    };
    OrientationsComponent.prototype.onChangeAgree = function (mrChange, studentIndex, documentIndex, item, student) {
        console.log(mrChange.value);
        if (mrChange.value === true) {
            item.checked;
        }
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
        var details = {
            'document': item,
            'student': student
        };
        var j;
        for (j = 0; j < this.detailedResponses.length; j++) {
            if (this.detailedResponses[j].document.orientationItemId === item.orientationItemId && this.detailedResponses[j].student.accountBalanceID === student.accountBalanceID) {
                this.detailedResponses.splice(j, 1);
            }
        }
        this.detailedResponses.push(details);
        console.log('detailed responses', this.detailedResponses);
        this.nextStep();
        if (this.responses.length > 0 || this.detailedResponses.length > 0) {
            this.showButton = true;
            this.showInCart = true;
        }
        else {
            this.showButton = false;
            this.showInCart = false;
        }
    };
    OrientationsComponent.prototype.hideSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.orientationService.subscribeToPostOrientation(this.loginResponse, this.responses);
                this.orientationInterval = setInterval(function () {
                    _this.gettingOrientation = true;
                    if (_this.orientationService.orientationResponse) {
                        console.log('response', _this.orientationService.orientationResponse);
                        _this.showButton = false;
                        _this.showInCart = false;
                        _this.gettingOrientation = false;
                        _this.responses = [];
                        _this.openSnackBar();
                        _this.orientationService.subscribeToGetOrientation(_this.loginStoreSvc.loginStateItems);
                        if (_this.orientationService.orientationResponse) {
                            _this.resetPage();
                            clearInterval(_this.orientationInterval);
                        }
                    }
                }, 1000);
                return [2 /*return*/];
            });
        });
    };
    OrientationsComponent.prototype.resetPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, setInterval(function () {
                                if (_this.orientationService.orientationList) {
                                    _this.orientationList = _this.orientationService.orientationList;
                                    var i;
                                    for (i = 0; i < _this.orientationList.length; i++) {
                                        if (_this.orientationList[i].orientation.signedDocuments.length > 0) {
                                            _this.hasSigned = true;
                                            _this.signedOrientationList.push(_this.orientationList[i]);
                                        }
                                        if (_this.orientationList[i].orientation.unsignedDocuments.length > 0) {
                                            _this.hasUnsigned = true;
                                            _this.unsignedOrientationList.push(_this.orientationList[i]);
                                        }
                                    }
                                    _this.gettingOrientation = false;
                                    clearInterval(_this.orientationInterval);
                                    console.log('unsigned orientationLists', _this.unsignedOrientationList);
                                    console.log('signed documents', _this.signedOrientationList);
                                    console.log('orientation list', _this.orientationList);
                                }
                            }, 100)];
                    case 1:
                        _a.orientationInterval = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrientationsComponent.prototype.openSnackBar = function () {
        this.snackBar.open('Documents Submitted', '✔', {
            duration: 2000,
        });
    };
    OrientationsComponent = __decorate([
        core_1.Component({
            selector: 'app-orientations',
            templateUrl: './orientations.component.html',
            styleUrls: ['./orientations.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_1.LoginStoreService,
            orientation_service_1.OrientationService,
            material_1.MatSnackBar])
    ], OrientationsComponent);
    return OrientationsComponent;
}());
exports.OrientationsComponent = OrientationsComponent;
//# sourceMappingURL=orientations.component.js.map