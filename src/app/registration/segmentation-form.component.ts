import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Constants } from '../app.settings';

//import { RegistrationSetupComponent } from './registration-setup.component'

import { LoginResponseModel } from '../login/model/index';
import { SegmentationDetailModel } from './model/index';
import { SegmentationSaveService } from './services/index';
import {
  ToasterService,
  Toast,
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  DistrictLoginDerivedService,
  LoginStoreService
} from '../shared/services/index';
import { RegistrationBreadcrumbsService } from './services/index'

@Component({
  selector: 'segmentation-form',
  templateUrl: './segmentation-form.component.html',

  providers: [ValidateCookieService,
    CookieService
  ]
})

export class SegmentationFormComponent implements OnInit {
  private schoolDistrict: string;
  private loginResponse: LoginResponseModel = new LoginResponseModel();
  private segmentationDetail: SegmentationDetailModel = { isGuest: false, isParent: false, isStaff: false, isStudent: false };
  public relationshipForm: FormGroup;
  public formError: boolean;
  public isGuestUser: boolean;
  //move this to use real model
  public relationships: any = { isParent: false, isStudent: false, isStaff: false, isGuest: false };
  public deviceInfo: any = null;

  //constructor( @Inject(forwardRef(() => RegistrationSetupComponent)) registrationSetupComponent: RegistrationSetupComponent,
  constructor(
    private toasterService: ToasterService,
    private cookieService: CookieService,
    private validateCookie: ValidateCookieService,
    private messageProccessor: MessageProcessorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private breadcrumbService: RegistrationBreadcrumbsService,
    private segmentationSaveService: SegmentationSaveService,
    public districtLoginDerivedService: DistrictLoginDerivedService,
    private loginStoreService: LoginStoreService
  ) {

  }

  async ngOnInit() {
    console.log('SegmentationFormComponent')
    this.loginResponse = this.loginStoreService.cookieStateItem;
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
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
  }


  checkboxRequired(group: FormGroup) {
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
  }

  saveRelationship() {
    if (!this.checkboxRequired(this.relationshipForm)) {
      this.formError = false;

      //SAVE ALL MY CHOICES HERE
      //Mapping
      this.segmentationDetail.isGuest = this.relationshipForm.controls['guest'].value;
      this.segmentationDetail.isParent = this.relationshipForm.controls['parent'].value;
      this.segmentationDetail.isStudent = this.relationshipForm.controls['student'].value;
      this.segmentationDetail.isStaff = this.relationshipForm.controls['staff'].value;



      let subscription = this.segmentationSaveService.saveSegmentation(this.segmentationDetail, this.loginResponse)
        .subscribe(() => {
          if (this.segmentationSaveService.result == true) {

            subscription.unsubscribe();

            if (this.loginResponse.messageType === Constants.Error) {
              this.loginStoreService.loadLogin(this.loginResponse);
             // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);

            } else {
              this.loginStoreService.loadLogin(this.loginResponse);
            //  this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
              //After saving routing
              if (this.isGuestUser) {
                //this is a guest user, take me to the site
                if (this.loginResponse.isNewExperience || this.deviceInfo.platform !== 'web') {
                  let link = ['dashboard'];
                  this.router.navigate(link);
                } else if (!this.loginResponse.isNewExperience && this.deviceInfo.platform === 'web'){
                  let cleanToken = this.loginResponse.access_token.trim();
                  window.location.href = Constants.ParentPaymentsUrl + '?id=' + cleanToken;
                }
              }
              else {
                console.log('setRelationshipState')
                this.breadcrumbService.setRelationshipState(true);
                this.router.navigate(['/setup/add-student']);
              }

            }

          } else {
            ++this.segmentationSaveService.count;
          }
        });




    }
    else {
      this.formError = true;
    }
  }

  checkGuestUser() {
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
  }

}
