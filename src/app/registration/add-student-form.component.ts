import { Component, OnInit, AfterViewChecked, ViewContainerRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

//Local
import { Constants } from '../app.settings';
import { LoginModel, LoginResponseModel } from '../login/model/index';
import { StudentModel, SegmentationDetailModel, StudentAddDetailModel } from './model/index';
import { DistrictViewModel } from '../shared/model/index';
import { StudentListService, StudentAddService, DistrictContentService } from './services/index';
import { SimpleDialogService } from '../shared/components/simple-dialog/simple-dialog.service';

import {
  StateProvinceListService,
  DistrictListService,
  CookieService,
  ToasterService,
  Toast,
  ValidateCookieService,
  MessageProcessorService,
  DistrictLoginDerivedService,
  LoginStoreService
} from '../shared/services/index';

@Component({
  selector: 'add-student-form',
  templateUrl: './add-student-form.component.html',
  styleUrls: ['./add-student-form.component.css']
})

export class AddStudentFormComponent implements OnInit {
  private schoolDistrict: string;
  public deviceInfo: any = null;
  public addStudentForm: FormGroup;
  private formError: boolean;
  private isGuestUser: boolean;
  private loginResponse: LoginResponseModel;
    //= this.validateCookie.validateCookie();

  private stateLoading: boolean = true;
  public showStateDistrict: boolean = false;
  public studentAddDetail: StudentAddDetailModel = { districtKey: '', lastName: '', studentID: '' };
  private showIDDialog: boolean;
  private state: string = '';
  private showDistrictDdl: boolean = false;
  private showNoDistrictWarning: boolean = false;
  public isAdding: boolean = false;
  public failedtoAdd: boolean = false;
  public loginResponseInterval: any;

  //move this to use real model
  private studentForm: any = { id: '', last: '', state: '', district: '' };

  private students: StudentModel[] = [];

  constructor(private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private districtListService: DistrictListService,
    private stateProvinceListService: StateProvinceListService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProcessorService: MessageProcessorService,
    public districtLoginDerivedService: DistrictLoginDerivedService,
    private studentAddService: StudentAddService,
    public studentListService: StudentListService,
    private districtContentService: DistrictContentService,
    private dialogService: SimpleDialogService,
    private viewContainerRef: ViewContainerRef,
    private loginStoreService: LoginStoreService
  ) {
    this.loginResponse = this.loginStoreService.cookieStateItem;
  }

  async ngOnInit() {
    //for now this has to go at the top
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
    console.log('AddStudentFormComponent')

    this.getState();
    this.schoolDistrict = '[School District Name Here]'
    this.showIDDialog = false;

    this.addStudentForm = this.formBuilder.group({
      'id': ['', [Validators.required]],
      'last': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'district': ['', [Validators.required]]
    });
    this.getstudents();
   
  }


    
  formErrors = {
    'id': '',
    'last': '',
    'state': '',
    'district': ''
 
  };

  ngDoCheck() {
    this.addStudentForm.get('district').valueChanges.subscribe(value => { this.overrideDerivedDistrict(value) });
  }


  public overrideDerivedDistrict(selectedDistrictValue: string) {
   // console.log("Calling overrideDerivedDistrict: ", selectedDistrictValue)
    for (var x = 0; x < this.districtListService.districtList.length; x++) {
      if (this.districtListService.districtList[x].districtKey === selectedDistrictValue) {
        this.districtLoginDerivedService.districtName = this.districtListService.districtList[x].districtName;
        break;
      }
    }
  }

  //Get the students for the current logged in user
  getstudents() {
    this.studentListService.result = false;
    this.studentListService.students = [];
    this.studentListService.subscribeToGetStudentsNew(this.loginResponse)
    window.setTimeout(() => {
      if (this.studentListService.result) {
        if (this.studentListService.loginResponse.messageType === Constants.Error) {
          this.loginStoreService.loadLogin(this.studentListService.loginResponse);
         // this.cookieService.putObject(Constants.AuthCookieName, this.studentListService.loginResponse);
          this.messageProcessorService.messageHandler();
          this.clearErrorMessage()
        }

      } else {
        ++this.studentListService.count;
      }
    }, 2000)
  }

  getState() {
    this.stateLoading = true;
    let subscription = this.stateProvinceListService.getState(this.loginResponse)
      .subscribe(() => {
        if (this.stateProvinceListService.result == true) {
          subscription.unsubscribe();
          if (this.stateProvinceListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.stateProvinceListService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.stateProvinceListService.loginResponse);
            this.messageProcessorService.messageHandler();
            this.clearErrorMessage()

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

    this.showNoDistrictWarning = true;

    let districtViewModel: DistrictViewModel = { stateId: stateId };
    this.districtListService.result = false;

    let subscription = this.districtListService.getDistrict(districtViewModel, this.loginResponse)
      .subscribe(() => {
        if (this.districtListService.result == true) {
          subscription.unsubscribe();
          if (this.districtListService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.districtListService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.districtListService.loginResponse);
            this.messageProcessorService.messageHandler();
            this.clearErrorMessage()

          } else {
            //processing the successful response
            this.showDistrictDdl = this.districtListService.districtList.length > 0;
          }
        } else {
          ++this.districtListService.count;
        }
      });
  }

  addStudent() {
    console.log("Trying to Add a Student");
    this.isAdding = true;
    this.failedtoAdd = false;
    this.studentAddService.result = false;

    this.studentAddService.subscribeToAddStudentNew(this.studentAddDetail, this.loginResponse)
     window.setTimeout(() => {
      if (this.studentAddService.result) {
        if (this.studentAddService.loginResponse.messageType === Constants.Error) {
          this.clearErrorMessage()
          this.isAdding = false;
          this.failedtoAdd = true;

        } else {
          this.loginStoreService.loadLogin(this.studentAddService.loginResponse);
         // this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
          this.studentAddDetail.lastName = '';
          this.studentAddDetail.studentID = '';
          this.studentAddDetail.districtKey = '';
          this.isAdding = false;
          this.failedtoAdd = false;
          this.getstudents();
        }

      } else {
        ++this.studentAddService.count;
      }
    }, 2000)
  }

  closeDialog(close: boolean) {
    this.showIDDialog = false;
  }

  deleteStudent(accountBalanceId: string) {
    let subscription = this.studentAddService.deleteStudentNew(accountBalanceId, this.loginResponse)
      .subscribe(() => {
        if (this.studentAddService.result == true) {
          subscription.unsubscribe();

          if (this.studentAddService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.studentAddService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
            this.messageProcessorService.messageHandler();
            this.clearErrorMessage()

          } else {
            this.loginStoreService.loadLogin(this.studentAddService.loginResponse);
          //  this.cookieService.putObject(Constants.AuthCookieName, this.studentAddService.loginResponse);
            this.getstudents();
          }
        } else {
          ++this.studentAddService.count;
        }
      });

  }

  clearErrorMessage() {
    this.loginResponse.message = '';
    this.loginResponse.messageType = '';
    this.loginResponse.messageTitle = '';
    this.loginResponse.message = '';
    this.loginResponse.showCloseButton = false;
    this.loginResponse.closeHtml = '';
  }

  getDistrictContent() {
    let subscription = this.districtContentService.getContent(this.studentAddDetail.districtKey, this.loginResponse)
      .subscribe(() => {
        if (this.districtContentService.result == true) {
          subscription.unsubscribe();

          if (this.districtContentService.loginResponse.messageType === Constants.Error) {
            this.loginStoreService.loadLogin(this.districtContentService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);
            this.messageProcessorService.messageHandler();
            this.clearErrorMessage()

          } else {
            this.districtContentService.districtContent;
            this.showIDDialog = true;
            this.loginStoreService.loadLogin(this.districtContentService.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.districtContentService.loginResponse);

            var dialogContent;
            if (!this.districtContentService.districtContent) {
              dialogContent = '<p>If you do not know the Student ID, it may be available from one of the following<br/>resources or you may contact your institution directly for this information:</p><ul><li>Report card</li><li>Student schedule</li><li>Student ID card</li><li>Transcripts</li></ul>';
            }
            else {
              dialogContent = this.districtContentService.districtContent;
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

  navHome() {
    console.log(this.loginResponse);
    //alert('check it out')
    this.loginResponseInterval = setInterval(()=>{
      if(this.loginResponse !== undefined){
        if (this.loginResponse.isNewExperience || this.deviceInfo.platform !== 'web') {
          let link = ['dashboard'];
          this.router.navigate(link);
          clearInterval(this.loginResponseInterval);
        } else if (!this.loginResponse.isNewExperience && this.deviceInfo.platform === 'web'){
          this.loginResponse = this.loginStoreService.cookieStateItem;
            //this.validateCookie.validateCookie();
          let cleanToken = this.loginResponse.access_token.trim();
          window.location.href = Constants.ParentPaymentsUrl + '?id=' + cleanToken;
          clearInterval(this.loginResponseInterval);
        }
      }
    })

  }

}
