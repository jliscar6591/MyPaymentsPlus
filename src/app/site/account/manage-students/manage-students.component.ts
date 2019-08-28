import { Component, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DistrictViewModel } from '../../../shared/model/index';
import { StudentModel, StudentAddDetailModel, RegistrationViewModel } from '../../../registration/model/index';
import { Constants } from '../../../app.settings';
import { LoginModel, LoginResponseModel } from '../../../login/model/index';
import { StudentListService, StudentAddService, DistrictContentService, } from '../../../registration/services/index';
import { UserContextService } from '../services/index';
import { UserContextModel } from '../meal-purchases/model/index';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';
import { MultiDistrictService } from '../../services/multi-district.service';
import { DistrictListService } from '../../../shared/services/district-list.service';
import { StateProvinceListService } from '../../../shared/services/state-province-list.service';
import {
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  DistrictLoginDerivedService,
  MessageProcessorService,
  LoginStoreService
} from '../../../shared/services/index';
import { window } from 'rxjs-compat/operator/window';

@Component({
  moduleId: module.id,
  selector: 'relative-path',
  templateUrl: 'manage-students.component.html',
  styleUrls: ['manage-students.less']
})

export class ManageStudentsComponent implements OnDestroy {
  private addStudentForm: FormGroup;
  public showAddStudent: boolean = false;
  private stateLoading: boolean = true;
  private showDistrictDdl: boolean = false;
  private showNoDistrictWarning: boolean = false;
  private loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  private studentAddDetail: StudentAddDetailModel = { districtKey: '', lastName: '', studentID: '' };
  private studentDetail: StudentModel;
  private registrationView: RegistrationViewModel = {
    district: '',
    email: '',
    firstName: '',
    lastName: '',
    newPassword: '',
    state: ''
  };
  private isAdding: boolean = false;
  public failedtoAdd: boolean = false;
  private failedtoAddMsg: string = '';
  public failedtoDelete: boolean = false;
  public hasStudents: boolean = true;
  private delStudentFname: string;
  private delStudentLname: string;
  private delStudentDName: string;
  private delStudentAccountId: string;
  private teststrings: string[];
  private defState: string;
  public showSpinner: boolean = false;
  private showIDDialog: boolean;
  public selectedDistrict: any;
  public addStudentsCntr: number = 0;
  public addStudentInterval: any;
  public districtInterval: any;
  public stateInterval: any;
  public loadingDistricts: boolean;
  public districtList: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    public districtListService: DistrictListService,
    private stateProvinceListService: StateProvinceListService,
    private cookieService: CookieService,
    private studentAddService: StudentAddService,
    private validateCookie: ValidateCookieService,
    public studentListService: StudentListService,
    private messageProcessorService: MessageProcessorService,
    private dialogService: SimpleDialogService,
    private districtContentService: DistrictContentService,
    private viewContainerRef: ViewContainerRef,
    private loginStoreSrvc: LoginStoreService,

  ) {
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

  ngOnInit() {
    this.getState();

    this.addStudentForm = this.formBuilder.group({
      'id': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'district': ['', [Validators.required]]
    });

    //this.getstudents();
    this.studentListService.subscribeToGetStudentsNew(this.loginResponse);

    this.addStudentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.getDistrict(this.loginResponse.state);
    if (!this.studentAddDetail.districtKey) {
      this.studentAddDetail.districtKey = this.loginResponse.districtKey;
    }


  }

  ngDoCheck() {
    // console.log("Ok Maybe Now: ", this.multiDistrictSrvc.multiDistrictFlag);
    if (this.studentListService.result == true) {
      if (this.studentListService.loginResponse.messageType === Constants.Error) {
        this.loginStoreSrvc.loadLogin(this.studentListService.loginResponse);
        this.hasStudents = false;
      } else {
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
  }

  onValueChanged(data?: any) {
    if (!this.addStudentForm) { return; }
    const form = this.addStudentForm;

    for (const field in this.formErrors) {

      let control: any;
      // clear previous error message (if any)
      this.formErrors[field] = '';
      control = form.get(field);
      //console.log("What is the control: ", control);
      // if (control && control.dirty && !control.valid) {
      if (control.status == "INVALID") {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  public overrideDerivedDistrict(selectedDistrictValue: string) {
    //  console.log("Calling overrideDerivedDistrict: ", selectedDistrictValue)
    this.selectedDistrict = selectedDistrictValue;
  }

  updatePaymentMethod() {
    this.showAddStudent = false;
  }


  getState() {
    this.stateLoading = true;
    let subscription = this.stateProvinceListService.getState(this.loginResponse)
      .subscribe(() => {
        if (this.stateProvinceListService.result == true) {
          subscription.unsubscribe();
          if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSrvc.loadLogin(this.stateProvinceListService.loginResponse);
            //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
            this.messageProcessorService.messageHandler();
          } else {
            //processing the successful response
            this.stateLoading = false;
            //enable the state selector.
            this.addStudentForm.controls['state'].enable();
          }
        } else {
          ++this.stateProvinceListService.count;
        }
      });
  }

  getDistrict(stateId: string) {
    let districtViewModel: DistrictViewModel = { stateId: stateId };
    this.districtListService.result = false;
    this.loadingDistricts = true;
    if (stateId) {

      let subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
        .subscribe(() => {
          if (this.districtListService.result == true) {
            subscription.unsubscribe();
            if (this.districtListService.loginResponse.messageType === Constants.Error) {
              this.loginStoreSrvc.loadLogin(this.districtListService.loginResponse);
              // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
              this.messageProcessorService.messageHandler();
              this.loadingDistricts = false;
            } else {
              //processing the successful response
              this.showDistrictDdl = this.districtListService.districtList.length > 0;
              this.showNoDistrictWarning = !this.showDistrictDdl;
              this.districtList = this.districtListService.districtList;              
              //console.log(this.districtList);
              this.loadingDistricts = false;
            }
          } else {
            ++this.districtListService.count;
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


  }


  addStudent() {
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
    this.addStudentInterval = setInterval(() => {
      if (this.studentAddService.addStudentResult == true) {
        this.studentAddDetail.districtKey = this.loginResponse.districtKey
        // let subscription = this.studentAddService.addStudent(this.studentAddDetail, this.loginResponse)

        this.isAdding = false;
        if (this.studentAddService.loginResponse.messageType === Constants.Error) {
          this.failedtoAddMsg = this.studentAddService.loginResponse.message;
          this.failedtoAdd = true;
          //this.studentAddDetail.lastName = ' ';
          // this.studentAddDetail.studentID = ' ';
          this.formErrors.lastname;
          this.formErrors.id;
        } else {
          //Updates Cookie Object with the updated loginResponse
          this.loginStoreSrvc.loadLogin(this.studentAddService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
          this.studentAddDetail.lastName = ' ';
          this.studentAddDetail.studentID = ' ';
          this.failedtoAdd = false;
          // this.getstudents();
          this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
          this.hasStudents = true;
          this.showAddStudent = false;
          clearInterval(this.addStudentInterval);
        }

      } else {
        ++this.studentAddService.count;
      }



    }, 200)


    //})

    this.studentAddService.studentAdded$.subscribe(() => {
      if (this.studentAddService.addStudentResult === true && this.addStudentsCntr < 2) {
        setTimeout(() => {
          this.studentAddDetail.districtKey = this.loginResponse.districtKey
          this.isAdding = false;
          this.studentAddDetail.lastName = ' ';
          this.studentAddDetail.studentID = ' ';
          this.failedtoAdd = false;
          // this.getstudents();
          this.studentListService.subscribeToGetStudentsNew(this.loginResponse);
          this.hasStudents = true;
          this.showAddStudent = false;

        }, 500)

      }

      this.addStudentsCntr++;

    })

  }

  showDeleteDialog(fname, lname, district, accountId) {
    // console.log("Do we have the Managed Student List: ", this.studentListService.students);
    //console.log("What is the accountID: ", accountId);
    var dialogContent = '<p>Please confirm that you would like to delete the following student:</p>';
    dialogContent += '<br/><p><b>' + fname + ' ' + lname + '</b></p><p>' + district + '</p>';
    this.dialogService.open("Delete Student", dialogContent, 'Delete', null, this.viewContainerRef)
      .subscribe(result => {
        if (result) {
          this.deleteStudent(accountId);
        };
      });
  }

  deleteStudent(accountBalanceId: string) {
    this.studentAddService.subscribeToDeleteStudent(accountBalanceId, this.loginResponse);
  }

  //Sets the District Name of the student to be removed so we can remove all accounts with that district
  setDeleteDistrict(accountBalanceId: string) {
    // console.log("What is the AccountBalanceId: ", accountBalanceId);
    let districtName;
    for (let i = 0; i < this.studentListService.students.length; i++) {
      if (this.studentListService.students[i].accountBalanceId == accountBalanceId) {
        // console.log("My name Is: ", this.studentListService.students[i].firstName);
        // console.log("My district is: ", this.studentListService.students[i].districtName);
        districtName = this.studentListService.students[i].districtName;
      }
    }
    return districtName;
  }
  //Creates a list of all accountId's that belong to the district of the selected student
  createDeleteList(districtName: string) {
    let removeList = [];
    for (let i = 0; i < this.studentListService.students.length; i++) {
      if (this.studentListService.students[i].districtName == districtName) {
        removeList.push(this.studentListService.students[i].accountBalanceId);
      }

    }
    // console.log("Do I have a Remove List: ", removeList);
    return removeList;

  }

  //activateStudent() {


  //}


  formErrors = {
    'state': '',
    'district': '',
    'id': '',
    'lastname': ''
  };

  validationMessages = {
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


  closeDialog(close: boolean) {
    this.showIDDialog = false;
  }

  getDistrictContent() {
    let subscription = this.districtContentService.getContent(this.studentAddDetail.districtKey, this.loginResponse)
      .subscribe(() => {
        if (this.districtContentService.result == true) {
          subscription.unsubscribe();

          if (this.districtContentService.loginResponse.messageType === Constants.Error) {
            this.loginStoreSrvc.loadLogin(this.districtContentService.loginResponse)
            // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);

          } else {
            this.districtContentService.districtContent;
            this.showIDDialog = true;
            this.loginStoreSrvc.loadLogin(this.districtContentService.loginResponse)
            // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);

            var dialogContent;
            var content: string = this.districtContentService.districtContent
            if (!content) {
              dialogContent = '<p>If you do not know the Student ID, it may be available from one of the following<br/>resources or you may contact your institution directly for this information:</p><ul><li>Report card</li><li>Student schedule</li><li>Student ID card</li><li>Transcripts</li></ul>';
            }
            else {
              dialogContent = content;
            }
            this.dialogService.open("Where to find Student ID", dialogContent, null, null, this.viewContainerRef)
              .subscribe(result => {
                if (result) { };
              });

          }
        } else {
          ++this.districtContentService.count;
        }
      });


  }

  ngOnDestroy() {
    this.addStudentsCntr = 0;
  }
}
