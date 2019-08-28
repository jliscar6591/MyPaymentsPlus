import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserContextService } from '../../site/account/services/index';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { LoginStoreService } from '../../shared/services/login-store.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ClipboardService } from 'ngx-clipboard'
import { Plugins } from '@capacitor/core';



//local
import {
  AuthenticationService,
  CookieService,

  MessageProcessorService, UtilityService
} from '../../shared/services/index';

import { LoginResponseModel, LoginModel } from '../model/index';
import { Constants } from '../../app.settings';
import { PageLoadingService } from '../../shared/components/page-loading/page-loading.service';
import { clearInterval } from 'timers';
import { MultiDistrictService } from '../../site/services/multi-district.service';
import { loginReducer } from '../../shared/store/reducers/loginStore.reducers';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [AuthenticationService,
    CookieService,
    FormBuilder
  ]
})

export class LoginComponent implements OnInit {
  private title: string = 'My Payments Plus Login';
  private loginForm: FormGroup;
  private loginDetail: LoginModel = { username: '', password: '' };

  private isLoading: boolean = false;
  public showLogin: boolean = false;
  private enableerrormsg: boolean = false;
  private inlineLoginFailMessage: string = '';
  private isGetDefaultsErr: boolean = false;
  private isGetDefaultsMsg: string = '';
  private loginResponse: LoginResponseModel;
  //= new LoginResponseModel();
  private loginCounter: number = 0;
  public deviceInfo: any = null;
  public isIE: boolean = false;



  constructor(private router: Router,
    //private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private messageProcessorService: MessageProcessorService,
    public userContextService: UserContextService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private pageLoadingService: PageLoadingService,
    private multiDistrictSvc: MultiDistrictService,
    private loginStoreService: LoginStoreService,
    public deviceService: DeviceDetectorService,
    private _clipboardService: ClipboardService
  ) {
    //this.toasterService = toasterService;
    //Validation using form builder
    this.loginForm = this.formBuilder.group({
      'username': ['', [Validators.required, Validators.maxLength(100)]], //When isNew, no validation
      'password': ['', Validators.required]
    });

    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.loginResponse = new LoginResponseModel();



  }

  async ngOnInit() {
    // this.loginResponse = this.authenticationService.loginResponse;
    // console.log("What is the loginResponse on Login: ", this.loginResponse)
    const { Device, Storage } = Plugins;
    this.deviceInfo = await Device.getInfo();

    // console.log(login);
    if (this.deviceInfo.platform !== 'web') {
      const ret = await Storage.get({ key: 'login' });
      const login = JSON.parse(ret.value);
      if (login) {
        this.loginDetail.username = login.username;
        this.loginDetail.password = login.password;
      }
    }
    //console.log('What is the device: ', this.deviceInfo)
    this.loginStoreService.deviceModel = this.deviceInfo.model;
    this.loginStoreService.devicePlatform = this.deviceInfo.platform;
    this.loginStoreService.deviceManufact = this.deviceInfo.manufacturer;
    this.activatedRoute.queryParams.subscribe((params: Params) => {

      //console.log('login.component ngOnInit: ', params);
      //console.log(params)
      //console.log(params['districtId'])
      let nav: string = params['nav'];
      if (nav == Constants.externalNavRequest.login) {
        this.loginResponse.externalNavRequest = nav;
        this.loginStoreService.loadLogin(this.loginResponse);
      }

      let jwt: string = params['id'];
      if (jwt) {
        this.authenticationService.loginResponse.access_token = jwt;
        if (!this.userContextService.result) {
          this.getDefaultsNew(this.authenticationService.loginResponse);
        }

      } else {
        this.showLogin = true;
      }
    });
    //App.addListener('appStateChange', (state: AppState) => {
    //  // state.isActive contains the active state
    //  console.log('App state changed. Is active?', state.isActive);
    //});

  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
          this.enableerrormsg = false;
          this.inlineLoginFailMessage = '';
        }
      }
    }
  }

  checkforErrors() {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'username': '',
    'password': ''
  };

  validationMessages = {
    'username': {
      'required': 'Email Address is required.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };

  login() {
    this.inlineLoginFailMessage = ''
    this.checkforErrors();
    if (this.loginForm.valid) {
      if (this.deviceInfo.platform !== 'web') {
        this.setObject(this.loginDetail);
      }
      this.isLoading = true;
      this.enableerrormsg = false;
      this.authenticationService.subscribeToAuthenticate(this.loginDetail, this.loginResponse);


      let subscription = window.setInterval(() => {
        if (this.authenticationService.result == true) {
          if (this.authenticationService.loginResponse.messageType === Constants.Error) {
            this.isLoading = false;
            //Override Toast messaging
            this.enableerrormsg = true;
            this.inlineLoginFailMessage = this.authenticationService.loginResponse.message;
            this.authenticationService.loginResponse.message = '';
            this.loginStoreService.loadLogin(this.authenticationService.loginResponse);
          } else {
            //Get the defaults
            this.getDefaultsNew(this.authenticationService.loginResponse);
          }
          window.clearInterval(subscription);
        } else {
          ++this.authenticationService.count;
        }
        ;
      }, 2000);

    } else {
      //show the error of my ways
      for (const control in this.loginForm.controls) {
        this.loginForm.controls[control].markAsDirty();
        this.onValueChanged();
      }
    }
  }

  async setObject(loginDetail: any) {
    // console.log('loginDetail', loginDetail);
    const { Storage } = Plugins;
    await Storage.set({
      key: 'login',
      value: JSON.stringify({
        username: loginDetail.username,
        password: loginDetail.password
      })
    });
  }

  public getDefaults(loginResponse: LoginResponseModel): boolean {
    let status: boolean = false;
    let subscription = this.userContextService.deriveDefaults(loginResponse)
      .subscribe(() => {
        if (this.userContextService.result == true) {
          subscription.unsubscribe();
          if (this.authenticationService.loginResponse.messageType === Constants.Error) {
            this.isGetDefaultsMsg = this.authenticationService.loginResponse.message;
            this.isGetDefaultsErr = true;
            this.isLoading = false;
            this.utilityService.clearErrorMessage(this.authenticationService.loginResponse);

          } else {
            //Navigate to the old asp horizon site
            this.loginStoreService.loadLogin(this.authenticationService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.authenticationService.loginResponse);
            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == Constants.SpinnerDelay) {
                  this.isLoading = false;
                  if (this.authenticationService.loginResponse.requiresRelationship === true) {
                    let link = ['/setup/relationship'];
                    this.router.navigate(link);
                  } else {
                    if (this.authenticationService.loginResponse.isNewExperience || this.deviceInfo.platform !== 'web') {
                      if (this.authenticationService.loginResponse.externalNavRequest == Constants.externalNavRequest.login) {
                        let link = ['account/fro-launch'];
                        this.router.navigate(link);
                      } else {
                        let link = ['dashboard'];
                        this.router.navigate(link);
                      }
                    } else if (!this.authenticationService.loginResponse.isNewExperience && this.deviceInfo.platform === 'web') {
                      let cleanToken = this.authenticationService.loginResponse.access_token.trim();
                      window.location.href = Constants.ParentPaymentsUrl + '?id=' + cleanToken;

                    }
                  }
                }
              });

          }
        } else {
          ++this.userContextService.count;
        }
      });
    return status;
  }

  public getDefaultsNew(loginResponse: LoginResponseModel): boolean {
    let status: boolean = false;
    let tempLogo: LoginResponseModel = new LoginResponseModel();
    tempLogo.access_token = loginResponse.access_token;
    tempLogo.cartItemCount = loginResponse.cartItemCount;
    tempLogo.districtKey = loginResponse.districtKey;
    tempLogo.districtName = loginResponse.districtName;
    tempLogo.isNewExperience = loginResponse.isNewExperience;
    tempLogo.isOldExperienceAllowed = false;
    this.userContextService.subscribeToGetDeriveDefaultsNew(loginResponse);
    let subscription = window.setInterval(() => {
      if (this.userContextService.result) {
        window.clearInterval(subscription);
        if (this.authenticationService.loginResponse.messageType === Constants.Error) {
          this.isGetDefaultsMsg = this.authenticationService.loginResponse.message;
          this.isGetDefaultsErr = true;
          this.isLoading = false;
          this.utilityService.clearErrorMessage(this.authenticationService.loginResponse);
        } else {
          //Navigate to the old asp horizon site
          this.loginStoreService.loadLogin(this.authenticationService.loginResponse);
          this.loginStoreService.createLoginObj(this.userContextService.defaultData, this.loginStoreService.cookieStateItem);
          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          seconds.subscribe(
            x => {
              if (x == Constants.SpinnerDelay) {
                this.isLoading = false;
                if (this.authenticationService.loginResponse.requiresRelationship === true) {
                  let link = ['/setup/relationship'];
                  this.router.navigate(link);
                } else {
                  if (this.authenticationService.loginResponse.isNewExperience || this.deviceInfo.platform !== 'web') {
                    if (this.authenticationService.loginResponse.externalNavRequest == Constants.externalNavRequest.login) {
                      let link = ['account/fro-launch'];
                      this.router.navigate(link);
                    } else {
                      let link = ['dashboard'];
                      this.router.navigate(link);
                    }
                  } else if (!this.authenticationService.loginResponse.isNewExperience && this.deviceInfo.platform === 'web') {
                    window.location.href = Constants.ParentPaymentsUrl + '?id=' + this.authenticationService.loginResponse.access_token;
                  }
                }
              }

            });
        }
      } else {
        ++this.userContextService.count;
      }
    }, 2000)

    return status;

  }



  copy(text: string) {
    // console.log("calling Copy: ", text)
    this._clipboardService.copyFromContent(text);

  }

  copyUrl() {
    // console.log("Calling copyUrl");
    let url = window.location.href;

    this.copy(url);



  }



}
