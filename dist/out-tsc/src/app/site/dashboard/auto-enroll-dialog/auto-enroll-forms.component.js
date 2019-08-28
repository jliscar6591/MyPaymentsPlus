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
var material_1 = require("@angular/material");
var core_1 = require("@angular/core");
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var store_1 = require("@ngrx/store");
var forms_service_1 = require("../../services/forms.service");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var material_2 = require("@angular/material");
var core_2 = require("@capacitor/core");
var Modals = core_2.Plugins.Modals;
var AutoEnrollFormsComponent = /** @class */ (function () {
    function AutoEnrollFormsComponent(dialog, dialogRef, store, router, activitiesService, validateCookie, viewContainerRef, formBuilder, addCartItemService, sanitizer, snackBar, loginStoreSvc, data, formsService) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.store = store;
        this.router = router;
        this.activitiesService = activitiesService;
        this.validateCookie = validateCookie;
        this.viewContainerRef = viewContainerRef;
        this.formBuilder = formBuilder;
        this.addCartItemService = addCartItemService;
        this.sanitizer = sanitizer;
        this.snackBar = snackBar;
        this.loginStoreSvc = loginStoreSvc;
        this.data = data;
        this.formsService = formsService;
        this.formCallCount = 0;
        this.selected = new forms_1.FormControl(0);
        this.isCart = false;
        this.missingControlCounter = 0;
        this.mobile = false;
        this.isMobile = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    AutoEnrollFormsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("Calling Auto Enroll Form")
                        console.log('data', this.data);
                        this.mobile = (window.innerWidth < 960) ? true : false;
                        this.isMobile.subscribe(function (value) {
                            _this.mobile = value;
                        });
                        this.checked = false;
                        // console.log('data on form dialog', this.data);
                        this.formFieldIds = [];
                        this.selectedCheckboxes = [];
                        this.checkboxResponses = [];
                        this.radioResponses = [];
                        this.checkboxFieldIds = [];
                        this.radioFieldIds = [];
                        if (!(this.router.url == '/checkout')) return [3 /*break*/, 3];
                        i = 0;
                        return [4 /*yield*/, this.createFormGroupCart(i)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.buildFormCart(i)];
                    case 2:
                        _a.sent();
                        this.showForm(0);
                        return [3 /*break*/, 6];
                    case 3:
                        i = 0;
                        return [4 /*yield*/, this.createFormGroupActivity(i)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.buildFormActivity(i)];
                    case 5:
                        _a.sent();
                        this.showForm(0);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AutoEnrollFormsComponent.prototype.ngDoCheck = function () {
        if (this.formsService.result === true && this.formCallCount === 0) {
            //console.log('data on form dialog', this.data.form);
            this.formCallCount = 1;
        }
    };
    //pushes form for currently selected activty into view and changes color of activity selected
    AutoEnrollFormsComponent.prototype.showForm = function (i) {
        return __awaiter(this, void 0, void 0, function () {
            var index, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentForm = [];
                        if (!this.data.forms[i]) return [3 /*break*/, 7];
                        this.currentForm.push(this.data.forms[i]);
                        this.selectedActivityIndex = i;
                        index = i.toString();
                        document.getElementById(index).style.backgroundColor = ' rgb(56,131,208)';
                        document.getElementById(index).style.color = 'white';
                        for (j = 0; j < this.data.activities.length; j++) {
                            if (index !== j.toString() && !this.data.activities[j].isInCart) {
                                document.getElementById(j.toString()).style.backgroundColor = ' white';
                                document.getElementById(j.toString()).style.color = 'rgba(0, 0, 0, 0.87)';
                            }
                        }
                        if (!(this.router.url == '/checkout')) return [3 /*break*/, 4];
                        if (!this.data.activities[this.selectedActivityIndex].formResponse) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createFormGroupCart(i)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.buildFormCart(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.createFormGroupActivity(this.selectedActivityIndex)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.buildFormActivity(this.selectedActivityIndex)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AutoEnrollFormsComponent.prototype.buildFormActivity = function (i) {
        this.data.activities[i].formResponse = [];
        this.mrChange = {};
        this.mrChange.value = '';
        this.data.forms[i].fields.sort(function (fieldA, fieldB) {
            if (new Date(fieldA.displayOrder).valueOf() < new Date(fieldB.displayOrder).valueOf())
                return -1;
            if (new Date(fieldA.displayOrder).valueOf() > new Date(fieldB.displayOrder).valueOf())
                return 1;
            return 0;
        });
        //console.log('data on form dialog', this.data);
        this.submissions = [];
        //console.log('quantity', this.data.quantity);
        this.submissions.push(this.data.forms[i]);
        // console.log(this.submissions);
        //var j;
        //for (j = 0; j < this.data.form.fields.length; j++) {
        //  if (this.data.form.fields[j].fieldType == 5) {
        //    console.log('does this happen');
        //    this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(this.data.form.fields[j].fieldTextArea);
        //    console.log('sanitized HTML', this.sanitizedHTML);
        //  }
        //}
    };
    //handles building the form group and form arrays
    AutoEnrollFormsComponent.prototype.createFormGroupActivity = function (i) {
        this.builtFormGroup = new forms_1.FormGroup({
            formTabs: this.formBuilder.array([this.createFormTabActivity(i)])
        });
        //console.log('builtFormGroup', this.builtFormGroup);
    };
    AutoEnrollFormsComponent.prototype.createFormTabActivity = function (i) {
        this.builtForm = this.formBuilder.group({});
        var j;
        for (j = 0; j < this.data.forms[i].fields.length; j++) {
            if (this.data.forms[i].fields[j].fieldType === 1 || this.data.forms[i].fields[j].fieldType === 2 || this.data.forms[i].fields[j].fieldType === 3 || this.data.forms[i].fields[j].fieldType === 4 || this.data.forms[i].fields[j].fieldType === 6) {
                this.builtForm.addControl(j, new forms_1.FormControl(''));
            }
        }
        //console.log('built form', this.builtForm);
        return this.builtForm;
    };
    AutoEnrollFormsComponent.prototype.buildFormCart = function (i) {
        this.isCart = true;
        this.askPrevious = true;
        this.mrChange = {};
        this.mrChange.value = '';
        this.uniqueFormFields = [];
        this.data.forms[i].fields.sort(function (fieldA, fieldB) {
            if (new Date(fieldA.displayOrder).valueOf() < new Date(fieldB.displayOrder).valueOf())
                return -1;
            if (new Date(fieldA.displayOrder).valueOf() > new Date(fieldB.displayOrder).valueOf())
                return 1;
            return 0;
        });
        //console.log('data on form dialog', this.data);
        this.submissions = [];
        var i;
        for (i = 0; i < this.data.quantity; i++) {
            this.submissions.push(this.data.forms[i]);
        }
        //var j;
        //for (j = 0; j < this.data.form.fields.length; j++) {
        //  if (this.data.form.fields[j].fieldType == 5) {
        //    this.data.form.fields[j].fieldTextArea
        //  }
        //}
        //console.log('uniqueForms', this.data.uniqueForms);
        var k;
        for (k = 0; k < this.data.forms[i].fields.length; k++) {
            if (this.data.forms[i].fields[k].fieldType === 1 || this.data.forms[i].fields[k].fieldType === 2 || this.data.forms[i].fields[k].fieldType === 3 || this.data.forms[i].fields[k].fieldType === 4 || this.data.forms[i].fields[k].fieldType === 6) {
                this.formFieldIds.push(this.data.forms[i].fields[k].formFieldId);
            }
        }
    };
    //Creates the FormGroup that contains the FormArray of seperate ActivityForms
    AutoEnrollFormsComponent.prototype.createFormGroupCart = function (i) {
        //The Group containing the array of seperate forms
        this.builtFormGroup = new forms_1.FormGroup({
            //Control name for the array of seperate forms
            formTabs: this.formBuilder.array([this.createFormTabCart(i)])
        });
        //console.log('builtformGroup', this.builtFormGroup);
    };
    //Creates the FormGroup for each tab / ActivityForm
    AutoEnrollFormsComponent.prototype.createFormTabCart = function (i) {
        //Control name for the group of responses for each form
        this.builtForm = this.formBuilder.group({});
        //Have to build a specific form for each response 
        var i;
        for (i = 0; i < this.data.activities[i].formResponse.length; i++) {
            var j;
            for (j = 0; j < this.data.forms[i].fields.length; j++) {
                //Only adds form fields for formFieldTypes 1/2/3/4/6
                if (this.data.forms[i].fields[j].fieldType === 1 || this.data.forms[i].fields[j].fieldType === 2 || this.data.forms[i].fields[j].fieldType === 3 || this.data.forms[i].fields[j].fieldType === 4 || this.data.forms[i].fields[j].fieldType === 6) {
                    //Adds a control for each formField
                    if (this.data.forms[i].fields[j].isRequired) {
                        this.builtForm.addControl(j, new forms_1.FormControl(''));
                    }
                }
            }
            //console.log('built form', this.builtForm);
            return this.builtForm;
        }
    };
    //identifies whoss being chosen on each radio button click
    AutoEnrollFormsComponent.prototype.onChange = function (mrChange, field) {
        // console.log(mrChange.value);
        if (this.radioResponses.length === 0) {
            this.radioFieldIds.push(field.formFieldId);
            var response = {
                fieldId: field.formFieldId,
                response: mrChange.value
            };
            this.radioResponses.push(response);
        }
        else {
            if (this.radioFieldIds.includes(field.formFieldId)) {
                var i;
                for (i = 0; i < this.radioResponses.length; i++) {
                    if (this.radioResponses[i].fieldId === field.formFieldId && this.radioResponses[i].response === mrChange.value) {
                        this.radioResponses[i].response = mrChange.value;
                    }
                    else {
                        if (this.radioResponses[i].fieldId === field.formFieldId) {
                            this.radioResponses[i].response = mrChange.value;
                        }
                    }
                }
            }
            else {
                this.radioFieldIds.push(field.formFieldId);
                var response = {
                    fieldId: field.formFieldId,
                    response: mrChange.value
                };
                this.radioResponses.push(response);
            }
        }
        // console.log('radio responses', this.radioResponses)
        // this.mrChange.value = mrChange.value;
        // let mrButton: MatRadioButton = mrChange.source;
        // console.log(mrButton.name);
        // console.log(mrButton.checked);
        // console.log(mrButton.inputId);
    };
    //creates an unique GUID for each response set 
    AutoEnrollFormsComponent.prototype.createGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    //saves current responses to activity and ads a new blank form to the response set
    AutoEnrollFormsComponent.prototype.addNewForm = function (i) {
        this.formTabs = this.builtFormGroup.get('formTabs');
        if (this.formTabs.valid) {
            //console.log('formTabs', this.formTabs);
            var responseSetId = this.createGuid();
            this.formResponse = {};
            this.formResponse.formResponses = [];
            this.formResponse.responseSetId = responseSetId;
            var j;
            //console.log('guid for first response set', responseSetId);
            for (j = 0; j < this.data.forms[i].fields.length; j++) {
                if (this.data.forms[i].fields[j].fieldType === 1 || this.data.forms[i].fields[j].fieldType === 2 || this.data.forms[i].fields[j].fieldType === 3 || this.data.forms[i].fields[j].fieldType === 4 || this.data.forms[i].fields[j].fieldType === 6) {
                    var fieldResponse = {
                        response: '',
                        activityFormKey: '',
                        formFieldId: null,
                        responseSetId: null,
                    };
                    this.response = '';
                    if (this.data.forms[i].fields[j].fieldType === 4) {
                        //console.log('does this happen at all');
                        //console.log('radio value', this.mrChange.value);
                        var m;
                        for (m = 0; m < this.radioResponses.length; m++) {
                            if (this.data.forms[i].fields[j].formFieldId === this.radioResponses[m].fieldId) {
                                fieldResponse.response = this.radioResponses[m].response;
                            }
                        }
                        // console.log('radio response', fieldResponse.response);
                    }
                    else if (this.data.forms[i].fields[j].fieldType === 3) {
                        var l;
                        for (l = 0; l < this.checkboxResponses.length; l++) {
                            if (this.data.forms[i].fields[j].formFieldId === this.checkboxResponses[l].fieldId) {
                                fieldResponse.response = this.checkboxResponses[l].checked.toString();
                            }
                        }
                        //console.log('checkbox response', fieldResponse.response);
                    }
                    else if (this.data.forms[i].fields[j].fieldType === 7) {
                        this.systemValues = [];
                        var k;
                        for (k = 0; k < this.data.forms[i].fields[j].choices.length; k++) {
                            this.systemValues.push(this.data.forms[i].fields[j].choices[k].value);
                        }
                        fieldResponse.response = this.systemValues.toString();
                        //console.log('system response', fieldResponse.response);
                    }
                    else {
                        var h = this.selected.value;
                        //console.log('h', h);
                        this.builtForm = this.formTabs.controls[h].get(j.toString());
                        //console.log('builtform', this.builtForm);
                        if (this.builtForm.value) {
                            //console.log('builtForm', this.builtForm);
                            //console.log('value', this.builtForm.value);
                            this.response = this.builtForm.value;
                            fieldResponse.response = this.response;
                        }
                    }
                    fieldResponse.activityFormKey = this.data.forms[i].formKey;
                    fieldResponse.formFieldId = this.data.forms[i].fields[j].formFieldId;
                    fieldResponse.responseSetId = responseSetId;
                    //console.log('fieldResposne', fieldResponse);
                    this.formResponse.formResponses.push(fieldResponse);
                }
            }
            this.formTabs.push(this.createFormTabActivity(i));
            //console.log('individual formResponse', this.formResponse);
            this.data.activities[i].formResponse.push(this.formResponse);
            this.currentForm.push(this.data.forms[i]);
            this.selected.setValue(this.currentForm.length);
            //console.log('selected tab', this.selected.value);
        }
        else {
            //console.log('invalid formTab', this.formTabs);
            //console.log('invalid form', this.builtForm);
            var j;
            for (j = 0; j < this.data.forms[i].fields.length; j++) {
                if (this.builtForm.controls[j]) {
                    if (this.builtForm.controls[j].invalid) {
                        this.builtForm.controls[j].markAsTouched();
                    }
                }
            }
            this.openErrorSnackBar();
        }
    };
    //adds an activity and with its form responses saved to the cart
    AutoEnrollFormsComponent.prototype.addToCart = function (i) {
        var _this = this;
        console.log('quantity', this.data.quantity);
        i = this.selectedActivityIndex;
        this.formTabs = this.builtFormGroup.get('formTabs');
        if (this.formTabs.valid) {
            if (!this.data.activities[i].formResponse) {
                this.data.activities[i].formResponse = [];
            }
            var j;
            var responseSetId = this.createGuid();
            this.formResponse = {};
            this.formResponse.formResponses = [];
            //console.log('formTabs', this.formTabs);
            //console.log('formResposne', this.formResponse);
            //console.log('this.formResponse.formResponses', this.formResponse.formResponses);
            //console.log('guid for first response set', responseSetId);
            this.formResponse.responseSetId = responseSetId;
            for (j = 0; j < this.data.forms[i].fields.length; j++) {
                if (this.data.forms[i].fields[j].fieldType === 1 || this.data.forms[i].fields[j].fieldType === 2 || this.data.forms[i].fields[j].fieldType === 3 || this.data.forms[i].fields[j].fieldType === 4 || this.data.forms[i].fields[j].fieldType === 6 || this.data.forms[i].fields[j].fieldType === 7) {
                    var fieldResponse = {
                        response: '',
                        activityFormKey: '',
                        formFieldId: null,
                        responseSetId: null,
                    };
                    if (this.data.forms[i].fields[j].fieldType === 4) {
                        var m;
                        for (m = 0; m < this.radioResponses.length; m++) {
                            if (this.data.forms[i].fields[j].formFieldId === this.radioResponses[m].fieldId) {
                                fieldResponse.response = this.radioResponses[m].response;
                            }
                        }
                        // console.log('radio response', fieldResponse.response);
                    }
                    else if (this.data.forms[i].fields[j].fieldType === 3) {
                        var l;
                        for (l = 0; l < this.checkboxResponses.length; l++) {
                            if (this.data.forms[i].fields[j].formFieldId === this.checkboxResponses[l].fieldId) {
                                fieldResponse.response = this.checkboxResponses[l].checked.toString();
                            }
                        }
                        // console.log('checkbox response', fieldResponse.response);
                    }
                    else if (this.data.forms[i].fields[j].fieldType === 7) {
                        this.systemValues = [];
                        var k;
                        for (k = 0; k < this.data.forms[i].fields[j].choices.length; k++) {
                            this.systemValues.push(this.data.forms[i].fields[j].choices[k].value);
                        }
                        fieldResponse.response = this.systemValues.toString();
                        //console.log('system response', fieldResponse.response);
                    }
                    else {
                        // console.log(this.selected.value);
                        var h = this.selected.value;
                        this.builtForm = this.formTabs.controls[h].get(j.toString());
                        if (this.builtForm.value) {
                            //console.log('builtForm', this.builtForm);
                            //console.log('value', this.builtForm.value);
                            this.response = this.builtForm.value;
                            fieldResponse.response = this.response;
                        }
                    }
                    fieldResponse.activityFormKey = this.data.forms[i].formKey;
                    fieldResponse.formFieldId = this.data.forms[i].fields[j].formFieldId;
                    fieldResponse.responseSetId = responseSetId;
                    //console.log('fieldResponse', fieldResponse);
                    this.formResponse.formResponses.push(fieldResponse);
                }
            }
            // console.log('individual formResponse', this.formResponse);
            this.data.activities[i].formResponse.push(this.formResponse);
            // console.log('formresponses before they go to cart', this.data.activities[i].formResponse);
            //console.log('activity form id before it goes to cart', this.data.activity.activityFormId);
            this.data.activities[i].quantity = 1;
            this.data.activities[i].amountInCart = this.data.activities[i].amount;
            this.data.activities[i].isInCart = false;
            console.log('activity before it goes to cart', this.data.activities[i]);
            this.addCartItemService.putCartActivityNew(this.data.activities[i], this.loginResponse)
                .subscribe(function (response) {
                _this.cartResponse = response;
            }, function (error) {
                _this.addCartItemService.result = false;
            }, function () {
                //console.log('activity added cart response', this.cartResponse);
                //this.activitiesService.subscribeToGetActivities(this.loginResponse);         
                //this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
                _this.data.activities[i].isInCart = true;
                _this.openSuccessSnackBar();
                // console.log('this.selectedActivityIndex', this.selectedActivityIndex);
                if (_this.data.forms.length === 1) {
                    _this.dialogRef.close();
                }
                else {
                    console.log(_this.mobile);
                    if (!_this.mobile) {
                        _this.data.activities[i].isInCart = true;
                        _this.disableActivity(i);
                        _this.checkboxResponses = [];
                        _this.radioResponses = [];
                        _this.radioFieldIds = [];
                        _this.checkboxFieldIds = [];
                        _this.dialogRef.close();
                    }
                    else {
                        _this.disableActivity(i);
                        _this.checkboxResponses = [];
                        _this.radioResponses = [];
                        _this.radioFieldIds = [];
                        _this.checkboxFieldIds = [];
                        _this.dialogRef.close();
                    }
                }
            });
        }
        else {
            //console.log('invalid formTab', this.formTabs);
            //console.log('invalid form', this.builtForm);
            var j;
            for (j = 0; j < this.data.forms[i].fields.length; j++) {
                if (this.builtForm.controls[j]) {
                    if (this.builtForm.controls[j].invalid) {
                        this.builtForm.controls[j].markAsTouched();
                    }
                }
            }
            this.openErrorSnackBar();
        }
    };
    AutoEnrollFormsComponent.prototype.openErrorSnackBar = function () {
        this.snackBar.open('Please fill out required fields', '', {
            duration: 3000,
        });
    };
    AutoEnrollFormsComponent.prototype.spliceActivity = function (i) {
        this.data.activities.splice(i, 1);
        this.data.forms.splice(i, 1);
    };
    //produces the snack bar for a succesfully addition to the cart
    AutoEnrollFormsComponent.prototype.openSuccessSnackBar = function () {
        this.snackBar.open('Form Saved Successfully', '✔', {
            duration: 1000,
        });
    };
    //removes an activity from the autoenroll list when the forms have been submitted
    AutoEnrollFormsComponent.prototype.disableActivity = function (i) {
        document.getElementById(i.toString()).style.backgroundColor = 'rgba(129,199,132 ,1)';
        document.getElementById(i.toString()).setAttribute('disabled', 'true');
    };
    //Removes a formGroup control from the formArray called formTabs
    AutoEnrollFormsComponent.prototype.removeForm = function (i) {
        this.formTabs.controls.splice(i, 1);
        this.currentForm.splice(i, 1);
    };
    //Closes dialog 
    AutoEnrollFormsComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
        //this.showAlert();
    };
    //saves current responses to activity and moves to the next required form for quantities greater than 1
    AutoEnrollFormsComponent.prototype.next = function (i) {
        //console.log('index', i);
        this.formTabs = this.builtFormGroup.get('formTabs');
        var j;
        var responseSetId = this.createGuid();
        this.formResponse = {};
        this.formResponse.formResponses = [];
        //console.log('formTabs', this.formTabs);
        //console.log('formResposne', this.formResponse);
        //console.log('this.formResponse.formResponses', this.formResponse.formResponses);
        //console.log('guid for first response set', responseSetId);
        this.formResponse.responseSetId = responseSetId;
        for (j = 0; j < this.data.forms[i].fields.length; j++) {
            if (this.data.forms[i].fields[j].fieldType === 1 || this.data.forms[i].fields[j].fieldType === 2 || this.data.forms[i].fields[j].fieldType === 3 || this.data.forms[i].fields[j].fieldType === 4 || this.data.forms[i].fields[j].fieldType === 6) {
                var fieldResponse = {
                    response: '',
                    activityFormKey: '',
                    formFieldId: null,
                    responseSetId: null,
                };
                if (this.data.forms[i].fields[i].fieldType === 4) {
                    var m;
                    for (m = 0; m < this.radioResponses.length; m++) {
                        if (this.data.forms[i].fields[j].formFieldId === this.radioResponses[m].fieldId) {
                            fieldResponse.response = this.radioResponses[m].response;
                        }
                    }
                    //console.log('radio response', fieldResponse.response);
                }
                else if (this.data.forms[i].fields[i].fieldType === 3) {
                    var l;
                    for (l = 0; l < this.checkboxResponses.length; l++) {
                        if (this.data.forms[i].fields[j].formFieldId === this.checkboxResponses[l].fieldId) {
                            fieldResponse.response = this.checkboxResponses[l].checked.toString();
                        }
                    }
                    //console.log('checkbox response', fieldResponse.response);
                }
                else {
                    // console.log(this.selected.value);
                    var h = this.selected.value;
                    //console.log('formTabs', this.formTabs);
                    this.builtForm = this.formTabs.controls[h].get(j.toString());
                    if (this.builtForm.value) {
                        //console.log('builtForm', this.builtForm);
                        //console.log('value', this.builtForm.value);
                        this.response = this.builtForm.value;
                        fieldResponse.response = this.response;
                    }
                }
                fieldResponse.activityFormKey = this.data.forms[i].formKey;
                fieldResponse.formFieldId = this.data.forms[i].fields[i].formFieldId;
                fieldResponse.responseSetId = responseSetId;
                //console.log('fieldResponse', fieldResponse);
                this.formResponse.formResponses.push(fieldResponse);
            }
        }
        //console.log('individual formResponse', this.formResponse);
        //this.data.activity.formResponse.push(this.formResponse);
        if (this.data.quantity !== i) {
            this.addNewForm(i);
            this.selected.setValue(i + 1);
        }
    };
    AutoEnrollFormsComponent.prototype.showAlert = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alertRet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Modals.alert({
                            title: 'Stop',
                            message: 'this is an error'
                        })];
                    case 1:
                        alertRet = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Changes boolean value for checkbox fieldType
    AutoEnrollFormsComponent.prototype.showOptions = function (event, value, id) {
        // console.log('event', event);
        // console.log('value', value);
        // console.log('id', id)
        if (this.checkboxResponses.length === 0) {
            this.checkboxFieldIds.push(id);
            var response = {
                fieldId: id,
                checked: [event.option.value]
            };
            this.checkboxResponses.push(response);
        }
        else {
            // console.log(this.checkboxFieldIds);
            // console.log('does it though', this.checkboxFieldIds.includes(id));
            if (this.checkboxFieldIds.includes(id)) {
                var i;
                for (i = 0; i < this.checkboxResponses.length; i++) {
                    if (this.checkboxResponses[i].fieldId === id && this.checkboxResponses[i].checked.includes(event.option.value)) {
                        // console.log(id);
                        // console.log(this.checkboxResponses[i].fieldId);
                        var j;
                        for (j = 0; j < this.checkboxResponses[i].checked.length; j++) {
                            if (this.checkboxResponses[i].fieldId === id && this.checkboxResponses[i].checked[j] === event.option.value) {
                                this.checkboxResponses[i].checked.splice(j, 1);
                            }
                        }
                    }
                    else {
                        if (this.checkboxResponses[i].fieldId === id) {
                            this.checkboxResponses[i].checked.push(event.option.value);
                        }
                    }
                }
            }
            else {
                this.checkboxFieldIds.push(id);
                var response = {
                    fieldId: id,
                    checked: [event.option.value]
                };
                this.checkboxResponses.push(response);
            }
        }
        // console.log('checkbox responses', this.checkboxResponses);
    };
    //Returns an array of unique Form Fields 
    AutoEnrollFormsComponent.prototype.getUniqueFormFields = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.EventEmitter)
    ], AutoEnrollFormsComponent.prototype, "isMobile", void 0);
    AutoEnrollFormsComponent = __decorate([
        core_1.Component({
            selector: 'app-auto-enroll-forms',
            templateUrl: './auto-enroll-forms.component.html',
            styleUrls: ['./auto-enroll-forms.component.less']
        }),
        __param(12, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialog,
            material_1.MatDialogRef,
            store_1.Store,
            router_1.Router,
            index_1.ActivitiesService,
            index_2.ValidateCookieService,
            core_1.ViewContainerRef,
            forms_1.FormBuilder,
            index_1.AddCartItemService,
            platform_browser_1.DomSanitizer,
            material_2.MatSnackBar,
            index_2.LoginStoreService, Object, forms_service_1.FormsService])
    ], AutoEnrollFormsComponent);
    return AutoEnrollFormsComponent;
}());
exports.AutoEnrollFormsComponent = AutoEnrollFormsComponent;
//# sourceMappingURL=auto-enroll-forms.component.js.map