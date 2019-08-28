import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartCheckoutItemsService, AddCartItemService } from "../../services/index"
import { LoginResponseModel } from "../../../login/model/index"
import {  UtilityService,  LoginStoreService } from '../../../shared/services/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { Constants } from "../../../app.settings";
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap, first } from 'rxjs/operators';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions';
import { CartItemDetail, CartItem, CartResponseItem, FeeCartDetail, FeeCartAddAmount, FeeCartItem, CheckoutItem, CartResponse } from '../../model/index';
import { MatSnackBar } from '@angular/material';
import { OrientationService } from '../../services/orientation.service';
//import { clearInterval } from 'timers';
//import { setInterval, clearInterval } from 'timers';




@Component({
  moduleId: module.id,
  selector: 'view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.less']
})

export class ViewCartComponent implements OnInit {
  private loginResponse: LoginResponseModel;
  public showProceed: boolean = false;
  private proceedValid: boolean = true;
  public setProceed: any;
  public checkOutProceed: any;
  public cartValidProceed: any;
  public cartCallCount: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public tempCartState: any;
  public testcount: number = 0;
  public cartStateCounter: number = 0;
  public subscription: Subscription;
  public readyForCheckout: boolean = true;
  private proceedInterval: any;
  public cartUpdate$: Observable<boolean>;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private cartCheckoutItemsService: CartCheckoutItemsService,
      private utilityService: UtilityService,
      private pageLoadingService: PageLoadingService,
      private addCartItemService: AddCartItemService,
      private snackBar: MatSnackBar,
      private loginStoreSvc: LoginStoreService,
      private store: Store<AppState>,
      public orientationService: OrientationService,
      private state: State<AppState>
    ) { this.cartStore = store.select(state => state.cartStore); }


    ngOnInit() {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
      
      // console.log("view cart : ", this.addCartItemService.cartResponse);

      if (this.addCartItemService.cartResponse) {
        this.subscription = this.addCartItemService.cartUpdate.subscribe(() => {
          if (this.addCartItemService.cartResponse) {
            this.showProceed = (this.addCartItemService.cartResponse.items.length > 0) ? true : false;
          } else {
            let temptState: any;
            let tempCartItem: CartItem;
            this.cartStore.subscribe(c => this.cartState = c);
            temptState = this.cartState;
            if (temptState) {
              tempCartItem = temptState.data;
              this.showProceed = (tempCartItem.items.length > 0) ? true : false;
            }
          }
        });
      //  console.log("ShowProceed: ", this.showProceed)
      } else {
        this.cartStore.subscribe(c => this.cartState = c);
        if (this.cartCheckoutItemsService.cartItem && this.cartCheckoutItemsService.cartItem.itemCount > 0 && !this.cartState) {
          this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
        }

      }
    

    //this.subscription = this.cartCheckoutItemsService.cartUpdate.subscribe(() => {
    //  let listLength: number;


    //  let temptState: any;
    //  let tempCartItem: CartItem;
    //  this.cartStore.subscribe(c => this.cartState = c);
    //  temptState = this.cartState;
    //  if (temptState) {
    //    tempCartItem = temptState.data;
    //    //console.log("What is the tempCartItem: ", tempCartItem);
    //    this.showProceed = (tempCartItem.items.length > 0) ? true : false;
    //  } else {
    //    if (this.cartCheckoutItemsService.cartItem.items) {
    //      listLength = this.cartCheckoutItemsService.cartItem.items.length;
    //      //  console.log(this.cartCheckoutItemsService.cartItem)
    //    } else {
    //      listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
    //      // console.log(this.cartCheckoutItemsService.checkOutItem)
    //    }
    //    this.showProceed = (listLength > 0) ? true : false;
    //    //console.log("ShowProceed2: ", this.showProceed)
    //  }
    //});
      let cartUpdateInterval = setInterval(() => {
        if (this.cartCheckoutItemsService.checkOutItem) {
          clearInterval(cartUpdateInterval);
          // console.log("checkoutResults: ", this.cartCheckoutItemsService.checkoutResults)
          //this.cartUpdate$.subscribe(() => {
            let listLength: number;
            let temptState: any;
            let tempCartItem: CartItem;
            this.cartStore.subscribe(c => this.cartState = c);
            temptState = this.cartState;
            if (temptState) {
              tempCartItem = temptState.data;
            //  console.log("What is the tempCartItem: ", tempCartItem);
              this.showProceed = (tempCartItem.items.length > 0) ? true : false;
            } else {
              if (this.cartCheckoutItemsService.cartItem.items) {
                listLength = this.cartCheckoutItemsService.cartItem.items.length;
                //  console.log(this.cartCheckoutItemsService.cartItem)
              } else {
                listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
                // console.log(this.cartCheckoutItemsService.checkOutItem)
              }
              this.showProceed = (listLength > 0) ? true : false;
              //console.log("ShowProceed2: ", this.showProceed)
            }
          //});
        }
        

      }, 500)
   

    this.checkOutProceed =
      this.subscription = this.cartCheckoutItemsService.cartUpdate.subscribe(() => {
      //  console.log("Subscribing to Checkout CartUpdate")
        let listLength: number;
      if (this.cartCheckoutItemsService.cartItem.items) {
        listLength = this.cartCheckoutItemsService.cartItem.items.length;
      } else {
        //listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
        listLength = this.cartState.itemCount;
      }
      this.showProceed = (listLength > 0) ? true : false;
 //console.log("Show Proceed: ", this.showProceed);

      });
    this.subscription = this.cartCheckoutItemsService.cartValid.subscribe(valid => {
      this.proceedValid = valid;
    })
  }

  ngDoCheck() {
    let listLength: number;
    if (this.cartCheckoutItemsService.cartItem.items) {
      listLength = this.cartCheckoutItemsService.cartItem.items.length;
    } else {
      //listLength = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups[0].items.length;
      listLength = this.cartState.itemCount;
    }
    this.showProceed = (listLength > 0) ? true : false;
  }

  proceed() {
    // console.log('proceed: ', this.proceedValid)
    this.pageLoadingService.show("Going To Checkout...");
    let temptState: any;
    this.cartStore.subscribe(c => this.cartState = c);
    temptState = this.cartState;
    if (this.proceedValid) {
    // console.log("About subscribeTopostCartCheckoutReviewItems - ViewCart1")
     // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);


      this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
        .subscribe(
          data => {
            this.cartCheckoutItemsService.checkOutItem = data;
           // console.log("we got checkOutItem data: ", this.cartCheckoutItemsService.checkOutItem)
          },
          error => {
            if (this.cartCheckoutItemsService.checkOutItem) {
              this.loginStoreSvc.loadLogin(this.loginResponse);
              this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
              this.cartCheckoutItemsService.checkoutResults = true;
              this.cartCheckoutItemsService.cartUpdate.emit(true);
            } else {
              this.cartCheckoutItemsService.checkoutResults = false;
            }
          },

          () => {
            this.loginStoreSvc.loadLogin(this.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
            this.cartUpdate$ = new Observable(observer => {
              observer.next(true);
              observer.complete();
            });
            this.cartUpdate$.pipe(
              first(data => data == true)
            );
            this.cartCheckoutItemsService.checkoutResults = true;
            this.cartCheckoutItemsService.cartUpdate.emit(true);
            this.pageLoadingService.hide();
            this.router.navigate(['/review']);
            
          }
        )
    } else {
      this.pageLoadingService.hide();
      this.openErrorSnackBar();
    }
  }

  public openErrorSnackBar() {
    this.snackBar.open('Please correct errors in cart','', {
      duration: 3000,
    });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    this.addCartItemService.cartUpdate.emit(false);
  }

}
