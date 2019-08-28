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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var app_settings_1 = require("../../app.settings");
var index_1 = require("../../shared/services/index");
var SupplementalEmailComponent = /** @class */ (function () {
    function SupplementalEmailComponent(formBuilder, router, stateProvinceListService, validateCookie, cookieService, districtListService, messageProcessorService, supportRequestService, loginStoreSvc) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.stateProvinceListService = stateProvinceListService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.districtListService = districtListService;
        this.messageProcessorService = messageProcessorService;
        this.supportRequestService = supportRequestService;
        this.loginStoreSvc = loginStoreSvc;
        this.stateLoading = true;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        //this.validateCookie.validateCookie();
        this.contactOfflineView = { category: '', diagnostics: '', district: '', email: '', ids: '', message: '', names: '', schools: '', state: '' };
        this.supportRequestDetail = { Category: '', Diagnostics: '', DistrictName: '', Email: '', Message: '', SchoolName: '', StudentId: '', StudentName: '' };
        this.showDistrictDdl = false;
        this.showNoDistrictWarning = false;
        this.isSendingEmail = false;
        this.categoryList = [
            { "value": "Account Balances", "text": "Account Balances" },
            { "value": "Payment", "text": "Payment" },
            { "value": "Purchase History", "text": "Purchase History" },
            { "value": "Registration", "text": "Registration" },
            { "value": "Fees and Activities", "text": "Fees and Activities" },
            { "value": "Sign In", "text": "Sign In" },
            { "value": "Student ID", "text": "Student ID" },
            { "value": "Other", "text": "Other" },
            { "value": "Cancel Account", "text": "Cancel Account" }
        ];
        this.formErrors = {
            'email': '',
            'state': '',
            'district': '',
            'schools': '',
            'names': '',
            'ids': '',
            'category': '',
            'message': '',
        };
        this.validationMessages = {
            'email': {
                'required': 'Email is required.',
                'pattern': 'Email must be valid.'
            },
            'state': {
                'required': 'State is required.'
            },
            'district': {
                'required': 'District is required.'
            },
            'schools': {},
            'names': {},
            'ids': {},
            'category': {
                'required': 'Subject Category is required.',
            },
            'message': {
                'required': 'Message is required.'
            }
        };
        //since login is not required 
        this.loginResponse.status = '';
        this.loginResponse.incidentId = '';
        this.loginResponse.message = '';
        this.loginResponse.messageType = app_settings_1.Constants.Success;
        this.loginResponse.messageTitle = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    }
    SupplementalEmailComponent.prototype.ngOnInit = function () {
        this.buildForm();
        this.getState();
        this.cookieService.removeAll();
    };
    SupplementalEmailComponent.prototype.buildForm = function () {
        var _this = this;
        this.contactOfflineForm = this.formBuilder.group({
            'email': ['', [forms_1.Validators.required, forms_1.Validators.pattern(app_settings_1.Constants.EmailPattern)]],
            'state': ['', forms_1.Validators.required],
            'district': ['', forms_1.Validators.required],
            'schools': [''],
            'names': [''],
            'ids': [''],
            'category': ['', forms_1.Validators.required],
            'message': ['', forms_1.Validators.required]
        });
        this.contactOfflineForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    SupplementalEmailComponent.prototype.onValueChanged = function (data) {
        if (!this.contactOfflineForm) {
            return;
        }
        var form = this.contactOfflineForm;
        for (var field in this.formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            this.formErrors[field] = '';
            control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    SupplementalEmailComponent.prototype.getDistrictName = function (selectedDistrictValue) {
        for (var x = 0; x < this.districtListService.districtList.length; x++) {
            if (this.districtListService.districtList[x].districtKey === selectedDistrictValue) {
                break;
            }
        }
        return this.districtListService.districtList[x].districtName;
    };
    SupplementalEmailComponent.prototype.submitForm = function () {
        var _this = this;
        if (this.contactOfflineForm.valid) {
            this.isSendingEmail = true;
            //Mapping
            this.supportRequestDetail.Category = this.contactOfflineView.category;
            this.supportRequestDetail.Diagnostics = "";
            this.supportRequestDetail.DistrictName = this.getDistrictName(this.contactOfflineView.district);
            this.supportRequestDetail.Email = this.contactOfflineView.email;
            this.supportRequestDetail.Message = this.contactOfflineView.message;
            this.supportRequestDetail.SchoolName = this.contactOfflineView.schools;
            this.supportRequestDetail.StudentId = this.contactOfflineView.ids;
            this.supportRequestDetail.StudentName = this.contactOfflineView.names;
            this.supportRequestService.result = false;
            var subscription_1 = this.supportRequestService.requestSupport(this.supportRequestDetail, this.loginResponse)
                .subscribe(function () {
                if (_this.supportRequestService.result == true) {
                    subscription_1.unsubscribe();
                    if (_this.supportRequestService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.loginStoreSvc.loadLogin(_this.supportRequestService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.supportRequestService.loginResponse);
                        _this.messageProcessorService.messageHandler();
                        _this.clearErrorMessage();
                        _this.isSendingEmail = false;
                    }
                    else {
                        _this.clearForm();
                        _this.isSendingEmail = false;
                        _this.loginStoreSvc.loadLogin(_this.supportRequestService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.supportRequestService.loginResponse);
                        _this.messageProcessorService.messageHandler();
                    }
                }
                else {
                    ++_this.supportRequestService.count;
                }
            });
        }
        else {
            //show the error of my ways
            for (var control in this.contactOfflineForm.controls) {
                this.contactOfflineForm.controls[control].markAsDirty();
                this.onValueChanged();
            }
        }
    };
    SupplementalEmailComponent.prototype.getState = function () {
        var _this = this;
        this.stateLoading = true;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSvc.loadLogin(_this.stateProvinceListService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
                }
                else {
                    //processing the successful response
                    _this.stateLoading = false;
                    //enable the state selector.
                    _this.contactOfflineForm.controls['state'].enable();
                }
            }
            else {
                ++_this.stateProvinceListService.count;
            }
        });
    };
    SupplementalEmailComponent.prototype.getDistrict = function (stateId) {
        var _this = this;
        //let districtViewModel: DistrictViewModel = { stateId: 'GA' };
        this.showNoDistrictWarning = true;
        var districtViewModel = { stateId: stateId };
        this.districtListService.result = false;
        var subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
            .subscribe(function () {
            if (_this.districtListService.result == true) {
                subscription.unsubscribe();
                if (_this.districtListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSvc.loadLogin(_this.districtListService.loginResponse);
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
    SupplementalEmailComponent.prototype.clearErrorMessage = function () {
        this.loginResponse.message = '';
        this.loginResponse.messageType = '';
        this.loginResponse.messageTitle = '';
        this.loginResponse.message = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    };
    SupplementalEmailComponent.prototype.clearForm = function () {
        for (var control in this.contactOfflineForm.controls) {
            this.contactOfflineForm.controls[control].reset();
        }
    };
    SupplementalEmailComponent = __decorate([
        core_1.Component({
            selector: 'supplemental-email',
            templateUrl: './supplemental-email.component.html',
            styleUrls: ['./supplemental-email.component.css', './supplemental.component.less']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            router_1.Router,
            index_1.StateProvinceListService,
            index_1.ValidateCookieService,
            index_1.CookieService,
            index_1.DistrictListService,
            index_1.MessageProcessorService,
            index_1.SupportRequestService,
            index_1.LoginStoreService])
    ], SupplementalEmailComponent);
    return SupplementalEmailComponent;
}());
exports.SupplementalEmailComponent = SupplementalEmailComponent;
//# sourceMappingURL=supplemental-email.component.js.map