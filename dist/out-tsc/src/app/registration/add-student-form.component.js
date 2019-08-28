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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var core_2 = require("@capacitor/core");
//Local
var app_settings_1 = require("../app.settings");
var index_1 = require("./services/index");
var simple_dialog_service_1 = require("../shared/components/simple-dialog/simple-dialog.service");
var index_2 = require("../shared/services/index");
var AddStudentFormComponent = /** @class */ (function () {
    function AddStudentFormComponent(router, toasterService, formBuilder, districtListService, stateProvinceListService, cookieService, validateCookie, messageProcessorService, districtLoginDerivedService, studentAddService, studentListService, districtContentService, dialogService, viewContainerRef, loginStoreService) {
        this.router = router;
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.districtListService = districtListService;
        this.stateProvinceListService = stateProvinceListService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProcessorService = messageProcessorService;
        this.districtLoginDerivedService = districtLoginDerivedService;
        this.studentAddService = studentAddService;
        this.studentListService = studentListService;
        this.districtContentService = districtContentService;
        this.dialogService = dialogService;
        this.viewContainerRef = viewContainerRef;
        this.loginStoreService = loginStoreService;
        this.deviceInfo = null;
        //= this.validateCookie.validateCookie();
        this.stateLoading = true;
        this.showStateDistrict = false;
        this.studentAddDetail = { districtKey: '', lastName: '', studentID: '' };
        this.state = '';
        this.showDistrictDdl = false;
        this.showNoDistrictWarning = false;
        this.isAdding = false;
        this.failedtoAdd = false;
        //move this to use real model
        this.studentForm = { id: '', last: '', state: '', district: '' };
        this.students = [];
        this.formErrors = {
            'id': '',
            'last': '',
            'state': '',
            'district': ''
        };
        this.loginResponse = this.loginStoreService.cookieStateItem;
    }
    AddStudentFormComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        console.log('AddStudentFormComponent');
                        this.getState();
                        this.schoolDistrict = '[School District Name Here]';
                        this.showIDDialog = false;
                        this.addStudentForm = this.formBuilder.group({
                            'id': ['', [forms_1.Validators.required]],
                            'last': ['', [forms_1.Validators.required]],
                            'state': ['', [forms_1.Validators.required]],
                            'district': ['', [forms_1.Validators.required]]
                        });
                        this.getstudents();
                        return [2 /*return*/];
                }
            });
        });
    };
    AddStudentFormComponent.prototype.ngDoCheck = function () {
        var _this = this;
        this.addStudentForm.get('district').valueChanges.subscribe(function (value) { _this.overrideDerivedDistrict(value); });
    };
    AddStudentFormComponent.prototype.overrideDerivedDistrict = function (selectedDistrictValue) {
        // console.log("Calling overrideDerivedDistrict: ", selectedDistrictValue)
        for (var x = 0; x < this.districtListService.districtList.length; x++) {
            if (this.districtListService.districtList[x].districtKey === selectedDistrictValue) {
                this.districtLoginDerivedService.districtName = this.districtListService.districtList[x].districtName;
                break;
            }
        }
    };
    //Get the students for the current logged in user
    AddStudentFormComponent.prototype.getstudents = function () {
        var _this = this;
        this.studentListService.result = false;
        this.studentListService.students = [];
        this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        window.setTimeout(function () {
            if (_this.studentListService.result) {
                if (_this.studentListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.studentListService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.studentListService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                    _this.clearErrorMessage();
                }
            }
            else {
                ++_this.studentListService.count;
            }
        }, 2000);
    };
    AddStudentFormComponent.prototype.getState = function () {
        var _this = this;
        this.stateLoading = true;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.stateProvinceListService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                    _this.clearErrorMessage();
                }
                else {
                    //processing the successful response
                    _this.stateLoading = false;
                    //enable the state selector.
                    _this.addStudentForm.controls['state'].enable();
                }
            }
            else {
                ++_this.stateProvinceListService.count;
            }
        });
    };
    AddStudentFormComponent.prototype.getDistrict = function (stateId) {
        var _this = this;
        this.showNoDistrictWarning = true;
        var districtViewModel = { stateId: stateId };
        this.districtListService.result = false;
        var subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
            .subscribe(function () {
            if (_this.districtListService.result == true) {
                subscription.unsubscribe();
                if (_this.districtListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.districtListService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                    _this.clearErrorMessage();
                }
                else {
                    //processing the successful response
                    _this.showDistrictDdl = _this.districtListService.districtList.length > 0;
                }
            }
            else {
                ++_this.districtListService.count;
            }
        });
    };
    AddStudentFormComponent.prototype.addStudent = function () {
        var _this = this;
        console.log("Trying to Add a Student");
        this.isAdding = true;
        this.failedtoAdd = false;
        this.studentAddService.result = false;
        this.studentAddService.subscribeToAddStudentNew(this.studentAddDetail, this.loginResponse);
        window.setTimeout(function () {
            if (_this.studentAddService.result) {
                if (_this.studentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.clearErrorMessage();
                    _this.isAdding = false;
                    _this.failedtoAdd = true;
                }
                else {
                    _this.loginStoreService.loadLogin(_this.studentAddService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
                    _this.studentAddDetail.lastName = '';
                    _this.studentAddDetail.studentID = '';
                    _this.studentAddDetail.districtKey = '';
                    _this.isAdding = false;
                    _this.failedtoAdd = false;
                    _this.getstudents();
                }
            }
            else {
                ++_this.studentAddService.count;
            }
        }, 2000);
    };
    AddStudentFormComponent.prototype.closeDialog = function (close) {
        this.showIDDialog = false;
    };
    AddStudentFormComponent.prototype.deleteStudent = function (accountBalanceId) {
        var _this = this;
        var subscription = this.studentAddService.deleteStudentNew(accountBalanceId, this.loginResponse)
            .subscribe(function () {
            if (_this.studentAddService.result == true) {
                subscription.unsubscribe();
                if (_this.studentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.studentAddService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                    _this.clearErrorMessage();
                }
                else {
                    _this.loginStoreService.loadLogin(_this.studentAddService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
                    _this.getstudents();
                }
            }
            else {
                ++_this.studentAddService.count;
            }
        });
    };
    AddStudentFormComponent.prototype.clearErrorMessage = function () {
        this.loginResponse.message = '';
        this.loginResponse.messageType = '';
        this.loginResponse.messageTitle = '';
        this.loginResponse.message = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    };
    AddStudentFormComponent.prototype.getDistrictContent = function () {
        var _this = this;
        var subscription = this.districtContentService.getContent(this.studentAddDetail.districtKey, this.loginResponse)
            .subscribe(function () {
            if (_this.districtContentService.result == true) {
                subscription.unsubscribe();
                if (_this.districtContentService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreService.loadLogin(_this.districtContentService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);
                    _this.messageProcessorService.messageHandler();
                    _this.clearErrorMessage();
                }
                else {
                    _this.districtContentService.districtContent;
                    _this.showIDDialog = true;
                    _this.loginStoreService.loadLogin(_this.districtContentService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);
                    var dialogContent;
                    if (!_this.districtContentService.districtContent) {
                        dialogContent = '<p>If you do not know the Student ID, it may be available from one of the following<br/>resources or you may contact your institution directly for this information:</p><ul><li>Report card</li><li>Student schedule</li><li>Student ID card</li><li>Transcripts</li></ul>';
                    }
                    else {
                        dialogContent = _this.districtContentService.districtContent;
                    }
                    _this.dialogService.open("Where to find Student ID", dialogContent, null, null, _this.viewContainerRef)
                        .subscribe(function (result) {
                        if (result) { }
                        ;
                    });
                }
            }
            else {
                ++_this.districtContentService.count;
            }
        });
    };
    AddStudentFormComponent.prototype.navHome = function () {
        //console.log(this.loginResponse);
        //alert('check it out')
        if (this.loginResponse.isNewExperience || this.deviceInfo.platform !== 'web') {
            var link = ['dashboard'];
            this.router.navigate(link);
        }
        else if (!this.loginResponse.isNewExperience && this.deviceInfo.platform === 'web') {
            this.loginResponse = this.loginStoreService.cookieStateItem;
            //this.validateCookie.validateCookie();
            var cleanToken = this.loginResponse.access_token.trim();
            window.location.href = app_settings_1.Constants.ParentPaymentsUrl + '?id=' + cleanToken;
        }
    };
    AddStudentFormComponent = __decorate([
        core_1.Component({
            selector: 'add-student-form',
            templateUrl: './add-student-form.component.html',
            styleUrls: ['./add-student-form.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            index_2.ToasterService,
            forms_1.FormBuilder,
            index_2.DistrictListService,
            index_2.StateProvinceListService,
            index_2.CookieService,
            index_2.ValidateCookieService,
            index_2.MessageProcessorService,
            index_2.DistrictLoginDerivedService,
            index_1.StudentAddService,
            index_1.StudentListService,
            index_1.DistrictContentService,
            simple_dialog_service_1.SimpleDialogService,
            core_1.ViewContainerRef,
            index_2.LoginStoreService])
    ], AddStudentFormComponent);
    return AddStudentFormComponent;
}());
exports.AddStudentFormComponent = AddStudentFormComponent;
//# sourceMappingURL=add-student-form.component.js.map