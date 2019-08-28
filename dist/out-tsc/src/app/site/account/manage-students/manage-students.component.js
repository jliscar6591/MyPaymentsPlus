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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../../registration/services/index");
var simple_dialog_service_1 = require("../../../shared/components/simple-dialog/simple-dialog.service");
var district_list_service_1 = require("../../../shared/services/district-list.service");
var state_province_list_service_1 = require("../../../shared/services/state-province-list.service");
var index_2 = require("../../../shared/services/index");
var ManageStudentsComponent = /** @class */ (function () {
    function ManageStudentsComponent(router, formBuilder, districtListService, stateProvinceListService, cookieService, studentAddService, validateCookie, studentListService, messageProcessorService, dialogService, districtContentService, viewContainerRef, loginStoreSrvc) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.districtListService = districtListService;
        this.stateProvinceListService = stateProvinceListService;
        this.cookieService = cookieService;
        this.studentAddService = studentAddService;
        this.validateCookie = validateCookie;
        this.studentListService = studentListService;
        this.messageProcessorService = messageProcessorService;
        this.dialogService = dialogService;
        this.districtContentService = districtContentService;
        this.viewContainerRef = viewContainerRef;
        this.loginStoreSrvc = loginStoreSrvc;
        this.showAddStudent = false;
        this.stateLoading = true;
        this.showDistrictDdl = false;
        this.showNoDistrictWarning = false;
        //= this.validateCookie.validateCookie();
        this.studentAddDetail = { districtKey: '', lastName: '', studentID: '' };
        this.registrationView = {
            district: '',
            email: '',
            firstName: '',
            lastName: '',
            newPassword: '',
            state: ''
        };
        this.isAdding = false;
        this.failedtoAdd = false;
        this.failedtoAddMsg = '';
        this.failedtoDelete = false;
        this.hasStudents = true;
        this.showSpinner = false;
        this.addStudentsCntr = 0;
        //activateStudent() {
        //}
        this.formErrors = {
            'state': '',
            'district': '',
            'id': '',
            'lastname': ''
        };
        this.validationMessages = {
            'state': {
                'required': 'State is required.'
            },
            'district': {
                'required': 'District is required.'
            },
            'id': {
                'required': 'Student Id is required.'
            },
            'lastname': {
                'required': 'Last name is required.'
            }
        };
        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
        //since login is not required set the 
        this.loginResponse.status = '';
        this.loginResponse.incidentId = '';
        this.loginResponse.message = '';
        this.loginResponse.messageType = 'Success';
        this.loginResponse.messageTitle = '';
        this.loginResponse.showCloseButton = false;
        this.loginResponse.closeHtml = '';
    }
    ManageStudentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getState();
        this.addStudentForm = this.formBuilder.group({
            'id': ['', [forms_1.Validators.required]],
            'lastname': ['', [forms_1.Validators.required]],
            'state': ['', [forms_1.Validators.required]],
            'district': ['', [forms_1.Validators.required]]
        });
        //this.getstudents();
        this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
        this.addStudentForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
        this.getDistrict(this.loginResponse.state);
        if (!this.studentAddDetail.districtKey) {
            this.studentAddDetail.districtKey = this.loginResponse.districtKey;
        }
    };
    ManageStudentsComponent.prototype.ngDoCheck = function () {
        // console.log("Ok Maybe Now: ", this.multiDistrictSrvc.multiDistrictFlag);
        if (this.studentListService.result == true) {
            if (this.studentListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                this.loginStoreSrvc.loadLogin(this.studentListService.loginResponse);
                this.hasStudents = false;
            }
            else {
                this.loginStoreSrvc.loadLogin(this.studentListService.loginResponse);
                if (this.studentListService.students.length > 0) {
                    this.hasStudents = true;
                }
                else {
                    this.hasStudents = false;
                }
            }
        }
        //console.log("Do we have the Student List: ", this.studentListService.students);
        if (this.studentAddService.isDeleted == true) {
            // console.log("Calling getStudents Again: ", this.studentAddService.isDeleted);
            this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
            this.studentAddService.isDeleted = false;
        }
    };
    ManageStudentsComponent.prototype.onValueChanged = function (data) {
        if (!this.addStudentForm) {
            return;
        }
        var form = this.addStudentForm;
        for (var field in this.formErrors) {
            var control = void 0;
            // clear previous error message (if any)
            this.formErrors[field] = '';
            control = form.get(field);
            //console.log("What is the control: ", control);
            // if (control && control.dirty && !control.valid) {
            if (control.status == "INVALID") {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    ManageStudentsComponent.prototype.overrideDerivedDistrict = function (selectedDistrictValue) {
        //  console.log("Calling overrideDerivedDistrict: ", selectedDistrictValue)
        this.selectedDistrict = selectedDistrictValue;
    };
    ManageStudentsComponent.prototype.updatePaymentMethod = function () {
        this.showAddStudent = false;
    };
    ManageStudentsComponent.prototype.getState = function () {
        var _this = this;
        this.stateLoading = true;
        var subscription = this.stateProvinceListService.getState(this.loginResponse)
            .subscribe(function () {
            if (_this.stateProvinceListService.result == true) {
                subscription.unsubscribe();
                if (_this.stateProvinceListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSrvc.loadLogin(_this.stateProvinceListService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
                    _this.messageProcessorService.messageHandler();
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
    ManageStudentsComponent.prototype.getDistrict = function (stateId) {
        var _this = this;
        var districtViewModel = { stateId: stateId };
        this.districtListService.result = false;
        this.loadingDistricts = true;
        if (stateId) {
            var subscription_1 = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
                .subscribe(function () {
                if (_this.districtListService.result == true) {
                    subscription_1.unsubscribe();
                    if (_this.districtListService.loginResponse.messageType === app_settings_1.Constants.Error) {
                        _this.loginStoreSrvc.loadLogin(_this.districtListService.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
                        _this.messageProcessorService.messageHandler();
                        _this.loadingDistricts = false;
                    }
                    else {
                        //processing the successful response
                        _this.showDistrictDdl = _this.districtListService.districtList.length > 0;
                        _this.showNoDistrictWarning = !_this.showDistrictDdl;
                        _this.districtList = _this.districtListService.districtList;
                        //console.log(this.districtList);
                        _this.loadingDistricts = false;
                    }
                }
                else {
                    ++_this.districtListService.count;
                }
            });
        }
        //let districtViewModel: DistrictViewModel = { stateId: stateId };
        //districtViewModel.stateId = stateId == null ? this.loginResponse.state : stateId;
        //this.districtListService.subscribeToGetDistrictNew(districtViewModel, this.loginResponse)
        //this.districtInterval = setInterval(() => {
        //  if (this.districtListService.districtList) {
        //    if (this.districtListService.loginResponse.messageType === Constants.Error) {
        //      this.loginStoreSrvc.loadLogin(this.districtListService.loginResponse);
        //      // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
        //      this.messageProcessorService.messageHandler();
        //      this.showNoDistrictWarning = true;
        //    } else {
        //      //processing the successful response
        //      this.showDistrictDdl = this.districtListService.districtList.length > 0;
        //      this.showNoDistrictWarning = this.showDistrictDdl;
        //      this.districtList = this.districtListService.districtList;
        //      console.log(this.districtList);
        //      clearInterval(this.districtInterval);
        //    }
        //  } else {
        //    ++this.districtListService.count;
        //  }
        //}, 200);
    };
    ManageStudentsComponent.prototype.addStudent = function () {
        var _this = this;
        this.isAdding = true;
        this.failedtoAdd = false;
        this.studentAddService.result = false;
        if (this.addStudentsCntr >= 2) {
            this.addStudentsCntr = 0;
        }
        //this.loginResponse.districtKey
        //let subscription =  this.studentAddService.addStudent(this.studentAddDetail, this.loginResponse)
        this.studentAddService.subscribeToAddStudentNew(this.studentAddDetail, this.loginResponse);
        //.subscribe(() => {
        this.addStudentInterval = setInterval(function () {
            if (_this.studentAddService.addStudentResult == true) {
                _this.studentAddDetail.districtKey = _this.loginResponse.districtKey;
                // let subscription = this.studentAddService.addStudent(this.studentAddDetail, this.loginResponse)
                _this.isAdding = false;
                if (_this.studentAddService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.failedtoAddMsg = _this.studentAddService.loginResponse.message;
                    _this.failedtoAdd = true;
                    //this.studentAddDetail.lastName = ' ';
                    // this.studentAddDetail.studentID = ' ';
                    _this.formErrors.lastname;
                    _this.formErrors.id;
                }
                else {
                    //Updates Cookie Object with the updated loginResponse
                    _this.loginStoreSrvc.loadLogin(_this.studentAddService.loginResponse);
                    //  this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
                    _this.studentAddDetail.lastName = ' ';
                    _this.studentAddDetail.studentID = ' ';
                    _this.failedtoAdd = false;
                    // this.getstudents();
                    _this.studentListService.subscribeToGetStudentsNew(_this.loginResponse);
                    _this.hasStudents = true;
                    _this.showAddStudent = false;
                    clearInterval(_this.addStudentInterval);
                }
            }
            else {
                ++_this.studentAddService.count;
            }
        }, 200);
        //})
        this.studentAddService.studentAdded$.subscribe(function () {
            if (_this.studentAddService.addStudentResult === true && _this.addStudentsCntr < 2) {
                setTimeout(function () {
                    _this.studentAddDetail.districtKey = _this.loginResponse.districtKey;
                    _this.isAdding = false;
                    _this.studentAddDetail.lastName = ' ';
                    _this.studentAddDetail.studentID = ' ';
                    _this.failedtoAdd = false;
                    // this.getstudents();
                    _this.studentListService.subscribeToGetStudentsNew(_this.loginResponse);
                    _this.hasStudents = true;
                    _this.showAddStudent = false;
                }, 500);
            }
            _this.addStudentsCntr++;
        });
    };
    ManageStudentsComponent.prototype.showDeleteDialog = function (fname, lname, district, accountId) {
        var _this = this;
        // console.log("Do we have the Managed Student List: ", this.studentListService.students);
        //console.log("What is the accountID: ", accountId);
        var dialogContent = '<p>Please confirm that you would like to delete the following student:</p>';
        dialogContent += '<br/><p><b>' + fname + ' ' + lname + '</b></p><p>' + district + '</p>';
        this.dialogService.open("Delete Student", dialogContent, 'Delete', null, this.viewContainerRef)
            .subscribe(function (result) {
            if (result) {
                _this.deleteStudent(accountId);
            }
            ;
        });
    };
    ManageStudentsComponent.prototype.deleteStudent = function (accountBalanceId) {
        this.studentAddService.subscribeToDeleteStudent(accountBalanceId, this.loginResponse);
    };
    //Sets the District Name of the student to be removed so we can remove all accounts with that district
    ManageStudentsComponent.prototype.setDeleteDistrict = function (accountBalanceId) {
        // console.log("What is the AccountBalanceId: ", accountBalanceId);
        var districtName;
        for (var i = 0; i < this.studentListService.students.length; i++) {
            if (this.studentListService.students[i].accountBalanceId == accountBalanceId) {
                // console.log("My name Is: ", this.studentListService.students[i].firstName);
                // console.log("My district is: ", this.studentListService.students[i].districtName);
                districtName = this.studentListService.students[i].districtName;
            }
        }
        return districtName;
    };
    //Creates a list of all accountId's that belong to the district of the selected student
    ManageStudentsComponent.prototype.createDeleteList = function (districtName) {
        var removeList = [];
        for (var i = 0; i < this.studentListService.students.length; i++) {
            if (this.studentListService.students[i].districtName == districtName) {
                removeList.push(this.studentListService.students[i].accountBalanceId);
            }
        }
        // console.log("Do I have a Remove List: ", removeList);
        return removeList;
    };
    ManageStudentsComponent.prototype.closeDialog = function (close) {
        this.showIDDialog = false;
    };
    ManageStudentsComponent.prototype.getDistrictContent = function () {
        var _this = this;
        var subscription = this.districtContentService.getContent(this.studentAddDetail.districtKey, this.loginResponse)
            .subscribe(function () {
            if (_this.districtContentService.result == true) {
                subscription.unsubscribe();
                if (_this.districtContentService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.loginStoreSrvc.loadLogin(_this.districtContentService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);
                }
                else {
                    _this.districtContentService.districtContent;
                    _this.showIDDialog = true;
                    _this.loginStoreSrvc.loadLogin(_this.districtContentService.loginResponse);
                    // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);
                    var dialogContent;
                    var content = _this.districtContentService.districtContent;
                    if (!content) {
                        dialogContent = '<p>If you do not know the Student ID, it may be available from one of the following<br/>resources or you may contact your institution directly for this information:</p><ul><li>Report card</li><li>Student schedule</li><li>Student ID card</li><li>Transcripts</li></ul>';
                    }
                    else {
                        dialogContent = content;
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
    ManageStudentsComponent.prototype.ngOnDestroy = function () {
        this.addStudentsCntr = 0;
    };
    ManageStudentsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'relative-path',
            templateUrl: 'manage-students.component.html',
            styleUrls: ['manage-students.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            district_list_service_1.DistrictListService,
            state_province_list_service_1.StateProvinceListService,
            index_2.CookieService,
            index_1.StudentAddService,
            index_2.ValidateCookieService,
            index_1.StudentListService,
            index_2.MessageProcessorService,
            simple_dialog_service_1.SimpleDialogService,
            index_1.DistrictContentService,
            core_1.ViewContainerRef,
            index_2.LoginStoreService])
    ], ManageStudentsComponent);
    return ManageStudentsComponent;
}());
exports.ManageStudentsComponent = ManageStudentsComponent;
//# sourceMappingURL=manage-students.component.js.map