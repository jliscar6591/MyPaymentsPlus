import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatRadioChange, MatRadioButton, MatDialogModule } from '@angular/material';
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { LoginModel, LoginResponseModel } from '../../../../login/model/index';
import { Observable, Observer } from 'rxjs';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import * as ActivityStoreActions from '../../../../shared/store/actions/activityStore.actions'
import { ActivitiesService } from '../../../services/activities.service';
import { ActivitiesList, Activities, Categories } from 'app/site/model/activities.model';
import { ActivityDetails } from './../../activities-details.component';
import { tap } from 'rxjs/internal/operators/tap';
import { AddCartItemService } from '../../../services/add-cart-item.service';
import { FormsService } from '../../../services/forms.service';
import { CartResponse } from '../../../model/cart-response-model';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import {
  CookieService,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../../shared/services/index';
import { Form, Fields, Choices } from '../../../model/forms.model';
import { FormResponse, FieldResponse, FormResponses } from '../formResponse.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Plugins } from '@capacitor/core';
const { Modals } = Plugins;

@Component({
  selector: 'app-forms-dialog',
  templateUrl: './forms-dialog.component.html',
  styleUrls: ['./forms-dialog.component.less']
})
export class FormsDialogComponent implements OnInit {
  public form: Form[];
  public fields: Fields[];
  public choices: Choices[];
  public formCallCount: number = 0;
  public activityStore: Observable<ActivitiesList>;
  public submissions: any;
  private loginResponse: LoginResponseModel;
  public cartResponse: CartResponse;
  public activitiesList: ActivitiesList;
  public activityForm: FormGroup;
  public selection: string;
  public mrChange: any;
  public checked: boolean;
  public selected = new FormControl(0);
  public sanitizedHTML: any;
  public askPrevious: boolean;
  public loadPrevious: boolean;
  public isCart: boolean = false;
  public builtFormGroup: FormGroup;
  public formTabs: FormArray;
  public builtForm: FormGroup;
  public formFieldIds: any;
  public uniqueFormFields: any;
  public formCollection: any;
  public formResponses: any;
  public fieldResponse: any;
  public formResponse: any;
  public response: any;
  public missingControlCounter: number = 0;
  public mobile: boolean = false;
  public isLoading: boolean;
  public selectedCheckboxes: any;
  public systemValues: any;
  public checkboxResponses: any;
  public radioResponses: any;
  public checkboxFieldIds: any;
  public radioFieldIds: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormsDialogComponent>,
    private store: Store<AppState>,
    private router: Router,
    private activitiesService: ActivitiesService,
    private validateCookie: ValidateCookieService,
    private viewContainerRef: ViewContainerRef,
    private formBuilder: FormBuilder,
    private addCartItemService: AddCartItemService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private loginStoreSvc: LoginStoreService,
    @Inject(MAT_DIALOG_DATA) public data: {
      form: Form,
      activity: Activities,
      responses: any,
      quantity: number,
      isValid: boolean,
      uniqueForms: any
    },
    private formsService: FormsService
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  @Input() isMobile: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    //console.log('data', this.data);
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.isMobile.subscribe(value => {
      this.mobile = value;
    });
    this.selectedCheckboxes = [];
    this.checkboxResponses = [];
    this.radioResponses = [];
    this.checkboxFieldIds = [];
    this.radioFieldIds = [];
    this.checked = false;
    //console.log('data on form dialog', this.data);
    this.formFieldIds = [];
    if (this.router.url == '/checkout') {
      this.isLoading = true;

      this.createFormGroupCart();
      this.buildFormCart();
      this.isLoading = false;

    } else {
      this.isLoading = true;

      this.createFormGroupActivity();
      this.buildFormActivity();
      this.isLoading = false;

    }
  }

  ngDoCheck() {
    if (this.formsService.result === true && this.formCallCount === 0) {
      //console.log('data on form dialog', this.data.form);
      this.formCallCount = 1;
    }
  }

  public buildFormActivity() {
    this.data.activity.formResponse = [];
    this.mrChange = {};
    this.mrChange.value = '';
    this.data.form.fields.sort((fieldA: Fields, fieldB: Fields) => {
      if (new Date(fieldA.displayOrder).valueOf() < new Date(fieldB.displayOrder).valueOf()) return -1;
      if (new Date(fieldA.displayOrder).valueOf() > new Date(fieldB.displayOrder).valueOf()) return 1;
      return 0;
    });
    //console.log('data on form dialog', this.data);
    this.submissions = [];
    //console.log('quantity', this.data.quantity);

    this.submissions.push(this.data.form);
    //console.log(this.submissions);
  }

  public createFormGroupActivity() {
    this.builtFormGroup = this.formBuilder.group({
      formTabs: this.formBuilder.array([this.createFormTabActivity()])
    })
    //console.log('builtformGroup', this.builtFormGroup);
  }

  public createFormTabActivity(): FormGroup {
    //console.log('quantity', this.data.quantity);
    this.builtForm = this.formBuilder.group({})
    var i;
    for (i = 0; i < this.data.quantity; i++) {
      var j;
      for (j = 0; j < this.data.form.fields.length; j++) {
        if (this.data.form.fields[j].fieldType === 1 || this.data.form.fields[j].fieldType === 2 || this.data.form.fields[j].fieldType === 3 || this.data.form.fields[j].fieldType === 4 || this.data.form.fields[j].fieldType === 6) {
          this.builtForm.addControl(j, new FormControl(''));
        }
      }
      //console.log('built form', this.builtForm);
      return this.builtForm;
    }
  }

  public buildFormCart() {
    this.isCart = true;
    this.askPrevious = true;
    this.mrChange = {};
    this.mrChange.value = '';
    this.uniqueFormFields = [];
    this.data.form.fields.sort((fieldA: Fields, fieldB: Fields) => {
      if (new Date(fieldA.displayOrder).valueOf() < new Date(fieldB.displayOrder).valueOf()) return -1;
      if (new Date(fieldA.displayOrder).valueOf() > new Date(fieldB.displayOrder).valueOf()) return 1;
      return 0;
    });
    //console.log('data on form dialog', this.data);
    this.submissions = [];
    var i;
    for (i = 0; i < this.data.quantity; i++) {
      this.submissions.push(this.data.form);

    }
    //var j;
    //for (j = 0; j < this.data.form.fields.length; j++) {
    //  if (this.data.form.fields[j].fieldType == 5) {
    //    this.data.form.fields[j].fieldTextArea

    //  }
    //}
    //console.log('uniqueForms', this.data.uniqueForms);
    var k;
    for (k = 0; k < this.data.form.fields.length; k++) {
      if (this.data.form.fields[k].fieldType === 1 || this.data.form.fields[k].fieldType === 2 || this.data.form.fields[k].fieldType === 3 || this.data.form.fields[k].fieldType === 4 || this.data.form.fields[k].fieldType === 6) {
        this.formFieldIds.push(this.data.form.fields[k].formFieldId);
      }
    }
  }

  //Creates the FormGroup that contains the FormArray of seperate ActivityForms
  public createFormGroupCart() {
    //The Group containing the array of seperate forms
    this.builtFormGroup = this.formBuilder.group({
      //Control name for the array of seperate forms
      formTabs: this.formBuilder.array([this.createFormTabCart()])
    })
    //console.log('builtformGroup', this.builtFormGroup);
  }

  //Creates the FormGroup for each tab / ActivityForm
  public createFormTabCart(): FormGroup {
    //Control name for the group of responses for each form
    this.builtForm = this.formBuilder.group({})
    //Have to build a specific form for each response 
    var i;
    for (i = 0; i < this.data.responses.length; i++) {
      var j;
      for (j = 0; j < this.data.form.fields.length; j++) {
        //Only adds form fields for formFieldTypes 1/2/3/4/6
        if (this.data.form.fields[j].fieldType === 1 || this.data.form.fields[j].fieldType === 2 || this.data.form.fields[j].fieldType === 3 || this.data.form.fields[j].fieldType === 4 || this.data.form.fields[j].fieldType === 6) {
          //Adds a control for each formField 
          this.builtForm.addControl(j, new FormControl(''));
        }
      }
      //console.log('built form', this.builtForm);
      return this.builtForm;
    }
  }

  public onChange(mrChange: MatRadioChange, field) {
    // console.log(mrChange.value);
    if (this.radioResponses.length === 0) {
      this.radioFieldIds.push(field.formFieldId);
      let response = {
        fieldId: field.formFieldId,
        response: mrChange.value
      }
      this.radioResponses.push(response);
    } else {
      if (this.radioFieldIds.includes(field.formFieldId)) {
        var i;
        for (i = 0; i < this.radioResponses.length; i++) {
          if (this.radioResponses[i].fieldId === field.formFieldId && this.radioResponses[i].response === mrChange.value) {
            this.radioResponses[i].response = mrChange.value;
          } else {
            if (this.radioResponses[i].fieldId === field.formFieldId) {
              this.radioResponses[i].response = mrChange.value;
            }
          }
        }
      } else {
        this.radioFieldIds.push(field.formFieldId);
        let response = {
          fieldId: field.formFieldId,
          response: mrChange.value
        }
        this.radioResponses.push(response);
      }
    }
    // console.log('radio responses', this.radioResponses)
    // this.mrChange.value = mrChange.value;
    // let mrButton: MatRadioButton = mrChange.source;
    // console.log(mrButton.name);
    // console.log(mrButton.checked);
    // console.log(mrButton.inputId);
  }

  public createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  addNewForm() {
    this.formTabs = this.builtFormGroup.get('formTabs') as FormArray;
    if (this.formTabs.valid) {
      var responseSetId = this.createGuid();
      this.formResponse = {};
      this.formResponse.formResponses = [];
      this.formResponse.responseSetId = responseSetId;
      //console.log('formTabs', this.formTabs);
      var i;
      //console.log('guid for first response set', responseSetId);
      for (i = 0; i < this.data.form.fields.length; i++) {
        if (this.data.form.fields[i].fieldType === 1 || this.data.form.fields[i].fieldType === 2 || this.data.form.fields[i].fieldType === 3 || this.data.form.fields[i].fieldType === 4 || this.data.form.fields[i].fieldType === 6) {
          let fieldResponse = {
            response: '',
            activityFormKey: '',
            formFieldId: null,
            responseSetId: null,
          }
          this.response = '';
          if (this.data.form.fields[i].fieldType === 4) {
            var m;
            for (m = 0; m < this.radioResponses.length; m++) {
              if (this.data.form.fields[i].formFieldId === this.radioResponses[m].fieldId) {
                fieldResponse.response = this.radioResponses[m].response;
              }
            }
            //console.log('radio response', fieldResponse.response);
          } else if (this.data.form.fields[i].fieldType === 3) {
            var l;
            for (l = 0; l < this.checkboxResponses.length; l++) {
              if (this.data.form.fields[i].formFieldId === this.checkboxResponses[l].fieldId) {
                fieldResponse.response = this.checkboxResponses[l].checked.toString();
              }
            }
            //console.log('checkbox response', fieldResponse.response);
          } else if (this.data.form.fields[i].fieldType === 7) {
            this.systemValues = [];
            var k;
            for (k = 0; k < this.data.form.fields[i].choices.length; k++) {
              this.systemValues.push(this.data.form.fields[i].choices[k].value)
            }
            fieldResponse.response = this.systemValues.toString();
            //console.log('system response', fieldResponse.response);
          } else {
            var h = this.selected.value;
            this.builtForm = this.formTabs.controls[h].get([i]) as FormGroup;
            if (this.builtForm.value) {
              //console.log('builtForm', this.builtForm);
              //console.log('value', this.builtForm.value);
              this.response = this.builtForm.value;
              fieldResponse.response = this.response;
            }
          }
          fieldResponse.activityFormKey = this.data.form.formKey;
          fieldResponse.formFieldId = this.data.form.fields[i].formFieldId;
          fieldResponse.responseSetId = responseSetId;
          //console.log('fieldResposne', fieldResponse);
          this.formResponse.formResponses.push(fieldResponse);
        }
      }
      this.formTabs.push(this.createFormTabActivity());
      //console.log('individual formResponse', this.formResponse);
      this.data.activity.formResponse.push(this.formResponse);
      this.submissions.push(this.data.form);
      this.selected.setValue(this.submissions.length);
      //console.log('selected tab', this.selected.value);
    } else {
      //console.log('invalid formTab', this.formTabs);
      //console.log('invalid form', this.builtForm);
      var j;
      for (j = 0; j < this.data.form.fields.length; j++) {
        if (this.builtForm.controls[j]) {
          if (this.builtForm.controls[j].invalid) {
            this.builtForm.controls[j].markAsTouched();
          }
        }
      }
      this.openErrorSnackBar();
    }
  }

  addToCart() {
    this.formTabs = this.builtFormGroup.get('formTabs') as FormArray;
    if (this.formTabs.valid) {
      var i;
      var responseSetId = this.createGuid();
      this.formResponse = {};
      this.formResponse.formResponses = [];
      //console.log('formTabs', this.formTabs);
      //console.log('formResposne', this.formResponse);
      //console.log('this.formResponse.formResponses', this.formResponse.formResponses);
      //console.log('guid for first response set', responseSetId);
      this.formResponse.responseSetId = responseSetId;
      for (i = 0; i < this.data.form.fields.length; i++) {
        if (this.data.form.fields[i].fieldType === 1 || this.data.form.fields[i].fieldType === 2 || this.data.form.fields[i].fieldType === 3 || this.data.form.fields[i].fieldType === 4 || this.data.form.fields[i].fieldType === 6) {
          let fieldResponse = {
            response: '',
            activityFormKey: '',
            formFieldId: null,
            responseSetId: null,
          }
          if (this.data.form.fields[i].fieldType === 4) {
            var m;
            for (m = 0; m < this.radioResponses.length; m++) {
              if (this.data.form.fields[i].formFieldId === this.radioResponses[m].fieldId) {
                fieldResponse.response = this.radioResponses[m].response;
              }
            }
            //console.log('radio response', fieldResponse.response);
          } else if (this.data.form.fields[i].fieldType === 3) {
            var l;
            for (l = 0; l < this.checkboxResponses.length; l++) {
              if (this.data.form.fields[i].formFieldId === this.checkboxResponses[l].fieldId) {
                fieldResponse.response = this.checkboxResponses[l].checked.toString();
              }
            }
            //console.log('checkbox response', fieldResponse.response);
          } else if (this.data.form.fields[i].fieldType === 7) {
            this.systemValues = [];
            var k;
            for (k = 0; k < this.data.form.fields[i].choices.length; k++) {
              this.systemValues.push(this.data.form.fields[i].choices[k].value)
            }
            fieldResponse.response = this.systemValues.toString();
            //console.log('system response', fieldResponse.response);
          } else {
            console.log(this.selected.value);
            var h = this.selected.value;
            this.builtForm = this.formTabs.controls[h].get(i.toString()) as FormGroup;
            if (this.builtForm.value) {
              //console.log('builtForm', this.builtForm);
              //console.log('value', this.builtForm.value);
              this.response = this.builtForm.value;
              fieldResponse.response = this.response;
            }
          }
          fieldResponse.activityFormKey = this.data.form.formKey;
          fieldResponse.formFieldId = this.data.form.fields[i].formFieldId;
          fieldResponse.responseSetId = responseSetId;
          //console.log('fieldResponse', fieldResponse);
          this.formResponse.formResponses.push(fieldResponse);
        }
      }
      //console.log('individual formResponse', this.formResponse);
      this.data.activity.formResponse.push(this.formResponse);
      //console.log('formresponses before they go to cart', this.data.activity.formResponse);
      //console.log('activity form id before it goes to cart', this.data.activity.activityFormId);
      this.data.activity.isInCart = false;
      //console.log('activity before it goes to cart', this.data.activity);
      this.addCartItemService.putCartActivityNew(
        this.data.activity,
        this.loginResponse)
        .subscribe(
          response => {
            this.cartResponse = response;
          },
          error => {
            this.addCartItemService.result = false;
          },
          () => {
            //console.log('activity added cart response', this.cartResponse);
            //this.activitiesService.subscribeToGetActivities(this.loginResponse);         
            //this.store.dispatch(new ActivityStoreActions.LoadActivitiesSuccess(this.activitiesList))
            this.data.activity.isInCart = true;
            this.dialogRef.close();
            this.openSuccessSnackBar();
          })
    } else {
      //console.log('invalid formTab', this.formTabs);
      //console.log('invalid form', this.builtForm);
      var j;
      for (j = 0; j < this.data.form.fields.length; j++) {
        if (this.builtForm.controls[j]) {
          if (this.builtForm.controls[j].invalid) {
            this.builtForm.controls[j].markAsTouched();
          }
        }
      }
      this.openErrorSnackBar();
    }
  }

  public openErrorSnackBar() {
    this.snackBar.open('Please fill out required fields', '', {
      duration: 3000,
    });
  }

  public openSuccessSnackBar() {
    this.snackBar.open('Form Saved Successfully', '✔', {
      duration: 2000,
    });
  }

  //Removes a formGroup control from the formArray called formTabs
  removeForm(i: number) {
    this.formTabs.controls.splice(i, 1);
    this.submissions.splice(i, 1);
  }

  //Closes dialog 
  onNoClick() {
    this.dialogRef.close();
    //this.showAlert();
  }

  public next(index: any) {
    //console.log('index', index);
    this.formTabs = this.builtFormGroup.get('formTabs') as FormArray;
    var i;
    var responseSetId = this.createGuid();
    this.formResponse = {};
    this.formResponse.formResponses = [];
    //console.log('formTabs', this.formTabs);
    //console.log('formResposne', this.formResponse);
    //console.log('this.formResponse.formResponses', this.formResponse.formResponses);
    //console.log('guid for first response set', responseSetId);
    this.formResponse.responseSetId = responseSetId;
    for (i = 0; i < this.data.form.fields.length; i++) {
      if (this.data.form.fields[i].fieldType === 1 || this.data.form.fields[i].fieldType === 2 || this.data.form.fields[i].fieldType === 3 || this.data.form.fields[i].fieldType === 4 || this.data.form.fields[i].fieldType === 6) {
        let fieldResponse = {
          response: '',
          activityFormKey: '',
          formFieldId: null,
          responseSetId: null,
        }
        if (this.data.form.fields[i].fieldType === 4) {
          var m;
          for (m = 0; m < this.radioResponses.length; m++) {
            if (this.data.form.fields[i].formFieldId === this.radioResponses[m].fieldId) {
              fieldResponse.response = this.radioResponses[m].response;
            }
          }
          //console.log('radio response', fieldResponse.response);
        } else if (this.data.form.fields[i].fieldType === 3) {
          var l;
          for (l = 0; l < this.checkboxResponses.length; l++) {
            if (this.data.form.fields[i].formFieldId === this.checkboxResponses[l].fieldId) {
              fieldResponse.response = this.checkboxResponses[l].checked.toString();
            }
          }
          //console.log('radio response', fieldResponse.response);
        } else if (this.data.form.fields[i].fieldType === 7) {
          this.systemValues = [];
          var k;
          for (k = 0; k < this.data.form.fields[i].choices.length; k++) {
            this.systemValues.push(this.data.form.fields[i].choices[k].value)
          }
          fieldResponse.response = this.systemValues.toString();
          //console.log('system response', fieldResponse.response);
        } else {
          console.log(this.selected.value);
          var h = this.selected.value;
          //console.log('formTabs', this.formTabs);
          this.builtForm = this.formTabs.controls[h].get(i.toString()) as FormGroup;
          if (this.builtForm.value) {
            //console.log('builtForm', this.builtForm);
            //console.log('value', this.builtForm.value);
            this.response = this.builtForm.value;
            fieldResponse.response = this.response;
          }
        }
        fieldResponse.activityFormKey = this.data.form.formKey;
        fieldResponse.formFieldId = this.data.form.fields[i].formFieldId;
        fieldResponse.responseSetId = responseSetId;
        //console.log('fieldResponse', fieldResponse);
        this.formResponse.formResponses.push(fieldResponse);
      }
    }
    //console.log('individual formResponse', this.formResponse);
    //this.data.activity.formResponse.push(this.formResponse);
    if (this.data.quantity !== index) {
      this.checkboxResponses = [];
      this.radioResponses = [];
      this.radioFieldIds = [];
      this.checkboxFieldIds = [];
      this.addNewForm();
      this.selected.setValue(index + 1);
    }
  }

  async showAlert() {
    let alertRet = await Modals.alert({
      title: 'Stop',
      message: 'this is an error'
    });
  }

  //Changes boolean value for checkbox fieldType
  public showOptions(event, value, id) {
    console.log('event', event);
    console.log('value', value);
    console.log('id', id)

    if (this.checkboxResponses.length === 0) {
      this.checkboxFieldIds.push(id);
      let response = {
        fieldId: id,
        checked: [event.option.value]
      }
      this.checkboxResponses.push(response);
    } else {
      // console.log(this.checkboxFieldIds);
      // console.log('does it though', this.checkboxFieldIds.includes(id));
      if (this.checkboxFieldIds.includes(id)) {
        var i;
        for (i = 0; i < this.checkboxResponses.length; i++) {
          if (this.checkboxResponses[i].fieldId === id && this.checkboxResponses[i].checked.includes(event.option.value)) {
            var j;
            for (j = 0; j < this.checkboxResponses[i].checked.length; j++) {
              if (this.checkboxResponses[i].fieldId === id && this.checkboxResponses[i].checked[j] === event.option.value) {
                this.checkboxResponses[i].checked.splice(j, 1);
              }
            }
          } else {
            if (this.checkboxResponses[i].fieldId === id) {
              this.checkboxResponses[i].checked.push(event.option.value);
            }
          }
        }
      } else {
        this.checkboxFieldIds.push(id);
        let response = {
          fieldId: id,
          checked: [event.option.value]
        }
        this.checkboxResponses.push(response);
      }
    }
    console.log('checkbox responses', this.checkboxResponses);
  }

  //Returns an array of unique Form Fields 
  public getUniqueFormFields(value, index, self) {
    return self.indexOf(value) === index;
  }

  //Populates the fields with saved responses
  public populateFields(response: string) {
    this.askPrevious = false;
    console.log('yes or no?', response);
    this.uniqueFormFields = this.formFieldIds.filter(this.getUniqueFormFields);
    // console.log('uniqueFormFields', this.uniqueFormFields);
    // console.log('this.data.responses', this.data.responses);
    if (response == 'yes') {
      this.formTabs = this.builtFormGroup.get('formTabs') as FormArray;
      // console.log('responses when i open the form in /checkout', this.data.activity.formResponse);

      var a;
      for (a = 0; a < this.data.responses.length; a++) {
        // console.log('response set id', this.data.responses[a].responseSetId);
        // console.log('current tab selected', this.selected.value + 1);

        var b;
        for (b = 0; b < this.data.responses[a].formResponses.length; b++) {
          // console.log('response index:', b, 'for form index:', a, 'response:', this.data.responses[a].formResponses[b].response);
          if (this.builtForm.controls[b + this.missingControlCounter] == undefined) {
            b = b - 1;
            this.missingControlCounter++;
            // console.log('missing control counter', this.missingControlCounter);
          } else {
            //console.log('builtForm controls', this.builtForm.controls[b + this.missingControlCounter]);
            // console.log('b + this.missingControlCounter', b + this.missingControlCounter);
            this.builtForm.controls[b + this.missingControlCounter].setValue(this.data.responses[a].formResponses[b].response);
            // console.log('value that input has been set to', this.builtForm.controls[b + this.missingControlCounter].value);
            this.missingControlCounter = 0;
            this.selected.setValue(a + 1);
          }
        }
        if (this.selected.value + 1 === this.data.responses.length) {
          // console.log('tab selected', this.selected.value);
          this.selected.setValue(a);
        } else {
          // console.log('does this happen?')
          //this.submissions.push(this.data.form);
          this.selected.setValue(a + 1);
        }
        // console.log('tab selected', this.selected.value);
        // console.log('# of tabs', this.submissions.length);
      }
    } else {
      this.data.activity.formResponse = [];
      this.mrChange = {};
      this.mrChange.value = '';
      this.data.form.fields.sort((fieldA: Fields, fieldB: Fields) => {
        if (new Date(fieldA.displayOrder).valueOf() < new Date(fieldB.displayOrder).valueOf()) return -1;
        if (new Date(fieldA.displayOrder).valueOf() > new Date(fieldB.displayOrder).valueOf()) return 1;
        return 0;
      });
      // console.log('data on form dialog', this.data);
      this.submissions = [];
      //console.log('quantity', this.data.quantity);
      var i;
      for (i = 0; i < this.data.quantity; i++) {
        this.submissions.push(this.data.form);
      }
      // console.log(this.submissions);
      var k;
      for (k = 0; k < this.data.form.fields.length; k++) {
        if (this.data.form.fields[k].fieldType == 5) {
          //console.log('does this happen');
          this.sanitizedHTML = this.sanitizer.bypassSecurityTrustHtml(this.data.form.fields[k].fieldTextArea);
          //console.log('sanitized HTML', this.sanitizedHTML);
        }
      }
    }
  }
}
