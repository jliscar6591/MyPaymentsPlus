import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { ROUTES, Router, Route, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
export let browserRefresh = false;
import { LoginStoreService } from '../app/shared/services/login-store.service';
import { Constants } from '../app/app.settings';



@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.less']
})




export class AppComponent implements OnInit , OnDestroy, DoCheck {
  constructor(private router: Router,
    private loginStoreSvc: LoginStoreService
  ) { }


  title = 'app';
  private subscription: Subscription;

  ngOnInit() {
  //console.log("Calling app component")
    //this.subscription = this.router.events.subscribe((event) => {
    //  if (event instanceof NavigationStart) {
    //    browserRefresh = !this.router.navigated;
    //    console.log("What is browserRefresh: ", browserRefresh);
    //  }

    //  if (browserRefresh == true) {
    //    let data = sessionStorage.getItem(Constants.AuthCookieName);
    //    console.log("Did we get a sessionStorageItem: ", data)
    //    if (data) {
    //      this.loginStoreSvc.loadLogin(data);
    //      grantAccess = true;
    //     let link = ['/dashboard'];
    //    this.router.navigate(link);
    //    }
    //   // this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    //    console.log("We are true: ", this.loginStoreSvc.cookieStateItem)
    // //   grantAccess = true;
    //    // let link = ['/dashboard'];
    //    // this.router.navigate(link);
    //  } else {
    //    //grantAccess = false;

    //   // let link = ['/welcome'];
    //   // this.router.navigate(link);
    //  }

    //});
  }

  ngDoCheck() {
    //window.onbeforeunload = function (e) {
    //  var e = e || window.event;

    //  // For IE and Firefox
    //  if (e) {
    //    e.returnValue = 'Leaving the page';
    //  }

    //  // For Safari
    //  return 'Leaving the page';
    //};
  }

  ngOnDestroy() {
  
    //console.log("CallingngOnDestroy")
    let destroyTest = this.loginStoreSvc.getLoginResponse();
   // console.log("Destroying the store: ", destroyTest);
  }
}
