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
var app_settings_1 = require("../app.settings");
//import { RegistrationSetupComponent } from './registration-setup.component'
var index_1 = require("../login/model/index");
var index_2 = require("./services/index");
var index_3 = require("../shared/services/index");
var index_4 = require("./services/index");
var SegmentationFormComponent = /** @class */ (function () {
    //constructor( @Inject(forwardRef(() => RegistrationSetupComponent)) registrationSetupComponent: RegistrationSetupComponent,
    function SegmentationFormComponent(toasterService, cookieService, validateCookie, messageProccessor, formBuilder, router, breadcrumbService, segmentationSaveService, districtLoginDerivedService, loginStoreService) {
        this.toasterService = toasterService;
        this.cookieService = cookieService;
        this.validateCookie = validateCookie;
        this.messageProccessor = messageProccessor;
        this.formBuilder = formBuilder;
        this.router = router;
        this.breadcrumbService = breadcrumbService;
        this.segmentationSaveService = segmentationSaveService;
        this.districtLoginDerivedService = districtLoginDerivedService;
        this.loginStoreService = loginStoreService;
        this.loginResponse = new index_1.LoginResponseModel();
        this.segmentationDetail = { isGuest: false, isParent: false, isStaff: false, isStudent: false };
        //move this to use real model
        this.relationships = { isParent: false, isStudent: false, isStaff: false, isGuest: false };
        this.deviceInfo = null;
    }
    SegmentationFormComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Device, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('SegmentationFormComponent');
                        this.loginResponse = this.loginStoreService.cookieStateItem;
                        Device = core_2.Plugins.Device;
                        _a = this;
                        return [4 /*yield*/, Device.getInfo()];
                    case 1:
                        _a.deviceInfo = _b.sent();
                        //this.validateCookie.validateCookie();
                        //alert(this.loginResponse.access_token)
                        this.relationshipForm = this.formBuilder.group({
                            'parent': [''],
                            'student': [''],
                            'staff': [''],
                            'guest': ['']
                        }, {
                            validator: this.checkboxRequired
                        });
                        this.districtLoginDerivedService.districtName;
                        return [2 /*return*/];
                }
            });
        });
    };
    SegmentationFormComponent.prototype.checkboxRequired = function (group) {
        var valid = false;
        var name;
        for (name in group.controls) {
            if (group.controls[name].value) {
                valid = true;
            }
        }
        if (valid) {
            return null;
        }
        return {
            checkboxRequired: true
        };
    };
    SegmentationFormComponent.prototype.saveRelationship = function () {
        var _this = this;
        if (!this.checkboxRequired(this.relationshipForm)) {
            this.formError = false;
            //SAVE ALL MY CHOICES HERE
            //Mapping
            this.segmentationDetail.isGuest = this.relationshipForm.controls['guest'].value;
            this.segmentationDetail.isParent = this.relationshipForm.controls['parent'].value;
            this.segmentationDetail.isStudent = this.relationshipForm.controls['student'].value;
            this.segmentationDetail.isStaff = this.relationshipForm.controls['staff'].value;
            var subscription_1 = this.segmentationSaveService.saveSegmentation(this.segmentationDetail, this.loginResponse)
                .subscribe(function () {
                if (_this.segmentationSaveService.result == true) {
                    subscription_1.unsubscribe();
                    if (_this.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.loginStoreService.loadLogin(_this.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                    }
                    else {
                        _this.loginStoreService.loadLogin(_this.loginResponse);
                        //  this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                        //After saving routing
                        if (_this.isGuestUser) {
                            //this is a guest user, take me to the site
                            if (_this.loginResponse.isNewExperience || _this.deviceInfo.platform !== 'web') {
                                var link = ['dashboard'];
                                _this.router.navigate(link);
                            }
                            else if (!_this.loginResponse.isNewExperience && _this.deviceInfo.platform === 'web') {
                                var cleanToken = _this.loginResponse.access_token.trim();
                                window.location.href = app_settings_1.Constants.ParentPaymentsUrl + '?id=' + cleanToken;
                            }
                        }
                        else {
                            console.log('setRelationshipState');
                            _this.breadcrumbService.setRelationshipState(true);
                            _this.router.navigate(['/setup/add-student']);
                        }
                    }
                }
                else {
                    ++_this.segmentationSaveService.count;
                }
            });
        }
        else {
            this.formError = true;
        }
    };
    SegmentationFormComponent.prototype.checkGuestUser = function () {
        if (this.relationships.isGuest === true &&
            this.relationships.isParent === false &&
            this.relationships.isStudent === false &&
            this.relationships.isStaff === false) {
            this.isGuestUser = true;
            this.breadcrumbService.setGuestState(true);
        }
        else {
            this.isGuestUser = false;
            this.breadcrumbService.setGuestState(false);
        }
    };
    SegmentationFormComponent = __decorate([
        core_1.Component({
            selector: 'segmentation-form',
            templateUrl: './segmentation-form.component.html',
            providers: [index_3.ValidateCookieService,
                index_3.CookieService
            ]
        }),
        __metadata("design:paramtypes", [index_3.ToasterService,
            index_3.CookieService,
            index_3.ValidateCookieService,
            index_3.MessageProcessorService,
            forms_1.FormBuilder,
            router_1.Router,
            index_4.RegistrationBreadcrumbsService,
            index_2.SegmentationSaveService,
            index_3.DistrictLoginDerivedService,
            index_3.LoginStoreService])
    ], SegmentationFormComponent);
    return SegmentationFormComponent;
}());
exports.SegmentationFormComponent = SegmentationFormComponent;
//# sourceMappingURL=segmentation-form.component.js.map