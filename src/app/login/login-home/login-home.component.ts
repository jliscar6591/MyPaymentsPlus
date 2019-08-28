import { Component, HostListener, OnInit, AfterViewChecked, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageProcessorService } from '../../shared/services/index';
import { LoginResponseModel } from '../model/index';
import { PageLoadingService } from '../../shared/components/page-loading/page-loading.service';
import { LoginStoreService } from '../../shared/services/login-store.service';
import { LoginComponent } from './login.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.less', './login.component.less']
})

export class LoginHomeComponent implements OnInit, AfterViewChecked {
  private title: string = 'My Payments Plus Login';
  private signInAvailable: boolean;
  private loginResponse: LoginResponseModel;
  private homeNotification: boolean;
  public isSimulate: boolean = false;
  public isModal: boolean = false;
  public deviceInfo: any;
  public isMobileApp: boolean;

  //Support toast in this component
  constructor(
    private router: Router,
    private messageProcessorService: MessageProcessorService,
    private activatedRoute: ActivatedRoute,
    private pageLoadingService: PageLoadingService,
    private loginComponent: LoginComponent,
    public deviceService: DeviceDetectorService,
   public  loginStoreService: LoginStoreService
  )
  {


  }

  //No toast support in this component
  //constructor() { }

  async ngOnInit() {
    const { SplashScreen } = Plugins;
    // this.pageLoadingService.show("Loading the flux capacitor");
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
 //  console.log('What is the device from Login-Home: ', this.deviceInfo)
    this.loginStoreService.deviceModel = this.deviceInfo.model;
    this.loginStoreService.devicePlatform = this.deviceInfo.platform;
    this.loginStoreService.deviceManufact = this.deviceInfo.manufacturer;
    //var google = require('googleapis');
    //var urlshortener = google.urlshortener('v1');
    if (this.deviceInfo.platform === 'web') {
      this.isMobileApp = false;
    } else {
      this.isMobileApp = true;
      SplashScreen.hide();
    }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let jwt: string = params['id'];
      if (jwt) {
        //this.pageLoadingService.show("Loading the flux capacitor");
        this.loginComponent.authenticationService.loginResponse = new LoginResponseModel();
        this.loginComponent.authenticationService.loginResponse.access_token = jwt;
        this.isSimulate = true;
        //this.loginComponent.getDefaults(this.loginComponent.authenticationService.loginResponse);
        this.loginComponent.getDefaultsNew(this.loginComponent.authenticationService.loginResponse)
      } else {
        //this.showLogin = true;
      }
    });


    //Checks whether to show the sign in card inline
    this.signInAvailable = (window.innerWidth < 960) ? false : true;
  }

  ngAfterViewChecked() {
    //Support toast in this component
    // this.messageProcessorService.messageHandler();
  }

  //Checks on whether or not to show the sign in card inline
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth > 960) {
      this.signInAvailable = (window.innerWidth < 960) ? false : true;
    }
  }

  showSignIn(status) {
    this.signInAvailable = status;
    if(this.isModal === false) {
        this.isModal = true;
     } else {
         this.isModal = false
    }
  }

  


}
