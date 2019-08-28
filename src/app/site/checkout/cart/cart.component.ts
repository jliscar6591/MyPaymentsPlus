import { Component, OnInit, HostListener, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartCheckoutItemsService, AddCartItemService, TransfersService, StudentMealsService } from '../../services/index';
import { LoginResponseModel } from '../../../login/model/index';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService

} from '../../../shared/services/index';
import { Validators, ValidatorFn, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { Constants } from "../../../app.settings";
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { map } from 'rxjs/operators';
import { CartItemDetail, CartItem, CartResponseItem, FeeCartDetail, FeeCartAddAmount, FeeCartItem, CheckoutItem, CartResponse } from '../../model/index';
import { StudentMeal } from '../../model/index';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions';
import * as MealStoreActions from '../../../shared/store/actions/mealStore.actions';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';
import { window } from 'rxjs-compat/operator/window';
import { RefreshService } from '../../../shared/services/refresh.service';

import { DiscountService } from '../../services/discount.service';


@Component({
  moduleId: module.id,
  selector: 'shopping-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less', './cart-item.component.less']
})

export class CartComponent implements OnInit {
  private editCartAmountForm: FormGroup;
  private loginResponse: LoginResponseModel;
  public isCartItemsGetting: boolean = false;
  public getCartItemsErr: boolean = false;
  private getCartItemsErrMsg: string = '';
  private isCartItems: boolean;
  public mobile: boolean = false;
  private checkMobile: EventEmitter<any> = new EventEmitter<any>();
  public failedToUpdate: boolean = false;
  private failedToUpdateMsg: string;
  public isUpdating: boolean;
  private isReview: boolean = false;
  //private clearIntervalInstance: any;

  public isChekoutItemsGetting: boolean = false;
  public getChekoutItemsErr: boolean = false;
  private getChekoutErrMsg: string = '';
  private isChekoutItems: boolean;
  public haveCartItems: boolean;
  public checkoutItems: any;
  public showCartItems: boolean;
  public showCheckOutItems: boolean;
  public isDelete: boolean = false;
  public showSpinner: boolean;
  public cartCallCount: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public tempCartState: any;
  public testcount: number = 0;
  public cartStateCounter: number = 0;
  public stopSoon: any;
  private removeVal: any;
  private removeIndex: any;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public mealStateMeals: StudentMeal;
  public discountCall: number = 0;
  public removeInterval: any;
  public deleteInterval: any;
  public checkoutInterval: any;
  public checkoutItemsInterval: any;
  public cartGettingInterval: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public cartCheckoutItemsService: CartCheckoutItemsService,
    private utilityService: UtilityService,
    private addCartItemService: AddCartItemService,
    private studentMealsService: StudentMealsService,
    private discountService: DiscountService,
    private transferService: TransfersService,
    private refreshService: RefreshService,
    private loginStoreSvc: LoginStoreService,
    private pageLoadingService: PageLoadingService,
    private store: Store<AppState>,
    private state: State<AppState>,

  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.cartStore = store.select(state => state.cartStore);
    this.mealStore = store.select(state => state.mealStore);
  }

  @Input() cartItem: CartItem;
  @Input() checkoutItem: CheckoutItem;
  @Input() remove: EventEmitter<any> = new EventEmitter<any>();

  async ngOnInit() {
    this.discountService.result = false;
    //console.log("Loading Cart Component: ", this.cartItem)
    console.log("do we have a Service CartItem Here: ", this.cartCheckoutItemsService.cartItem)
    this.editCartAmountForm = this.formBuilder.group({});
    if (this.router.url == '/checkout') {
      if (!this.cartItem && !this.cartCheckoutItemsService.cartItem) {
        //console.log("About to subscribeToGetCartCheckoutCartItem - Cart1 ")
        this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
      }

      if (this.cartCallCount < 4) {
        this.getCartList();
      }

      await this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
        .subscribe(
          data => {
            this.cartCheckoutItemsService.checkOutItem = data;
          },
          error => {
            // console.log("Error: No Checkout Item: ", this.checkOutItem);
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
            this.cartCheckoutItemsService.checkoutResults = true;
            this.cartCheckoutItemsService.cartUpdate.emit(true);
            if (this.cartItem.items) {
              this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
              this.showCartItems = true;
              this.showCheckOutItems = false;
              this.isCartItemsGetting = true;
              this.isReview = false;
              this.cartItem = this.cartCheckoutItemsService.cartItem;
              // console.log("Do we have cartItem: ", this.cartItem);
              //console.log("Do we have CheckOut Items: ", this.cartCheckoutItemsService.checkOutItem)

              // if (this.cartItem) {

              this.cartStore.subscribe(c => this.tempCartState = c);
              if (this.tempCartState) {
                if (this.tempCartState.data == undefined) {
                  let temptState;
                  this.cartState = this.cartItem;
                  if (this.cartItem.items == undefined) {
                    this.cartItem.items.length = 0;
                  }
                  this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))

                  this.cartStore.subscribe(c => this.cartState = c);
                  temptState = this.cartState;
                  this.cartItem = temptState.data;
                } else {
                  this.cartState = this.tempCartState.data;
                  //  this.cartItem = this.cartState;
                }

                //  console.log("tempCartState B4 Error on length: ", this.cartState)
                if (this.cartState.items !== undefined) {
                  if (this.cartState.items.length == 0) {
                    let temptState;
                    this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))
                    this.cartStore.subscribe(c => this.cartState = c);
                    temptState = this.cartState;
                    this.cartItem = temptState.data;
                    console.log("Do we have a State CartItems: ", this.cartItem);
                  }
                }
                this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
              }
            } else {
              let temptState: any;
              this.cartStore.subscribe(c => this.cartState = c);
              if (this.cartState) {
                temptState = this.cartState;
                this.cartItem = temptState.data;
                this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
              }


              console.log("Do we have a Else State CartItems: ", this.cartItem);
            }


          }//End of Complete
        )

      // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
      // }



      if (this.cartItem && this.cartItem.items.length > 0) {
        if (this.cartItem.items[0].liteItemType == "userFee") {
          this.cartItem.consumerFeeTotal = 0;
        }
      }
    }

    if (this.router.url === '/review') {
      //Calls the checkoutItem
      // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
      //Calls for the CartItem
      if (!this.cartItem) {
        let temptState: any;
        this.cartStore.subscribe(c => this.cartState = c);
        if (this.cartState) {
          temptState = this.cartState;
          this.cartItem = temptState.data;
        } else {
          // console.log("About to subscribeToGetCartCheckoutCartItem - Cart2 ")
          this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
          setTimeout(() => {
            if (this.cartCheckoutItemsService.cartItem) {
              this.store.dispatch(new CartStoreActions.ClearCart())
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
              let temptState: any;
              this.cartStore.subscribe(c => this.cartState = c);
              if (this.cartState) {
                temptState = this.cartState;
                this.cartItem = temptState.data;
                // console.log("Review has a cartIyem: ", this.cartItem)
              }
            }
          }, 1000)
        }

      }

      //checkOutItem
      this.isReview = true;
      this.showCheckOutItems = true;
      this.showCartItems = false;
      this.isDelete = false;
      this.showSpinner = true;
    }
    //  console.log("Cart Component: ", this.cartItem)
  }

  ngAfterViewInit() {
    this.cartStore.subscribe(c => this.cartState = c);
    this.tempCartState = this.cartState;
    if (this.tempCartState) {
      this.cartItem = this.tempCartState.data;
    }
    this.cartGettingInterval = setInterval(() => {
      if (this.cartItem.items || this.cartCheckoutItemsService.checkOutItem) {
        this.isCartItemsGetting = false;
        clearInterval(this.cartGettingInterval);
      }
    }, 500);

  }

  ngDoCheck() {
    if (this.discountService.result === true && this.discountCall === 0) {
      setTimeout(() => {
        if (this.discountService.CheckoutItem.discountTotal === 0) {
          this.cartItem = this.cartCheckoutItemsService.cartItem;
        } else {
          //  console.log('discount response', this.discountService.CheckoutItem);
          this.checkoutItems = this.discountService.CheckoutItem;
          this.cartItem.subTotal = this.discountService.CheckoutItem.subTotal;
          this.cartItem.consumerFeeTotal = this.discountService.CheckoutItem.consumerFeeTotal;
          this.cartItem.total = this.discountService.CheckoutItem.total;
          this.checkoutItems.totalTax = this.discountService.CheckoutItem.totalTax;

          this.discountCall = 1;
        }
      }, 1000);
    }

    if (this.cartCallCount < 2 && this.cartCheckoutItemsService.checkoutResults) {
      // console.log("Do we have cartResults: ", this.cartCheckoutItemsService.checkoutResults)
      this.cartItem = this.cartCheckoutItemsService.cartItem
      let tempCart: any;
      tempCart = this.addCartItemService.cartResponse;
      if (!this.cartItem) {
        this.cartItem = tempCart;
      }
      this.getCartList();
      this.cartCheckoutItemsService.cartResults = false;
      this.checkoutItems = this.cartCheckoutItemsService.checkOutItem;
      setTimeout(() => { this.isChekoutItemsGetting = true; }, 1000)
      if (this.checkoutItems) {
        this.cartCheckoutItemsService.cartResults = (this.checkoutItems.merchants.length > 0) ? true : false;
        this.cartCallCount++;
      } else {
        this.cartCheckoutItemsService.cartResults = false;
      }

      this.checkoutItems = this.cartCheckoutItemsService.checkOutItem;


      if (this.checkoutItems.itemCount > 0) {
        //console.log("What is the checkoutItems: ", this.checkoutItems)
        this.isChekoutItemsGetting = (this.checkoutItems.merchants.length > 0) ? true : false;
        this.cartCallCount++;
      } else {
        this.checkChecOutItems();
      }
      setTimeout(() => { this.isChekoutItemsGetting = true; }, 1000);
      if (this.cartItem) {
        //If we have a cartItem we must have a storeItem,
        this.cartStore.subscribe(c => this.tempCartState = c);
        //  console.log("What is tempCartState: ", this.tempCartState);
        //sometimes tempCartState has tempCartState.data.items other times it is just temptCartState.items.
        //TODO: Make tempCartState consistent
        if (this.tempCartState) {
          // console.log("Do we have a tempState: ", this.tempCartState)
          if (this.tempCartState.data !== undefined) {
            this.cartState = this.tempCartState.data;
          } else {
            this.cartState = this.tempCartState;
          }
          // console.log("What is CartState: ", this.cartState)
          // console.log("What is Cart State for Transfer FEE: ", this.cartState);
          if (this.cartState.items.length > 0) {
            if (this.cartState.items[0].liteItemType == 'userFee') {
              this.cartState.total = this.cartState.items[0].amountInCart;
              let upDateCartState: any = this.cartState;
              // console.log("Did we update Our State: ", upDateCartState);
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(upDateCartState))
              this.cartStore.subscribe(c => this.cartState = c);
              this.tempCartState = this.cartState;
              this.cartItem = this.tempCartState.data;
              //  console.log("Do we have a CartState After passing the Update: ", this.cartState);
            }
          } else {

            let testState: any = this.cartState;

            if (testState.liteItemType == 'userFee') {
              this.cartState.total = testState.amountInCart;
              let upDateCartState: any = this.cartState;
              // console.log("Did we update Our State: ", upDateCartState);
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(upDateCartState))
              this.cartStore.subscribe(c => this.cartState = c);
              this.tempCartState = this.cartState;
              this.cartItem = this.tempCartState.data;
              this.cartCallCount++;
              //  console.log("Do we have a CartState After passing the Update: ", this.cartState);
            }
          }

        } else {
          this.cartState = undefined;
        }

        //If the Cart Store is empty load this.cartItem into the store
        //if (!this.cartState || this.cartState == undefined) {
        //  this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))
        //  this.cartStore.subscribe(c => this.cartState = c);
        //  this.tempCartState = this.cartState;
        //  this.cartItem = this.tempCartState.data;
        //} else {

        //  this.tempCartState = this.cartState;

        //  if (this.tempCartState.data == undefined) {
        //    this.cartItem = this.tempCartState;
        //  } else {
        //    this.cartItem = this.tempCartState.data;
        //  }

        //  if (this.router.url == '/review' && this.cartItem.items[0].liteItemType != 'userFee') {
        //    // console.log("Do we have Checkout-CartITMES: ", this.cartItem);
        //    //console.log("Do we have CheckoutItems2: ", this.cartCheckoutItemsService.checkOutItem);
        //    this.cartItem.subTotal = this.checkoutItems.subTotal;
        //    this.cartItem['consumerFeeTotal'] = this.checkoutItems.consumerFeeTotal;
        //    this.cartItem.total = this.checkoutItems.total;

        //  }


        //  if (this.cartItem.items !== undefined) {
        //    if (this.cartItem && this.cartItem.items.length > 0) {
        //      if (this.cartItem.items[0].liteItemType == "userFee") {
        //        this.cartItem.consumerFeeTotal = 0;
        //        this.cartItem.subTotal = this.cartItem.total;
        //        this.cartItem.items[0].amountInCart = this.cartItem.total;
        //      }
        //    }
        //  }
        //}

        this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
        this.isCartItemsGetting = false;
        this.showSpinner = false;
        this.isUpdating = false;
      }



      //if (this.addCartItemService.result == true && this.testcount < 4) {
      //  // this.removeItem;
      //  let temptState: any;
      //  this.cartStore.subscribe(c => this.cartState = c);
      //  if (this.cartState) {
      //    temptState = this.cartState;
      //    this.cartItem = temptState.data;
      //    this.testcount++;
      //    // console.log("update Cart Component: ", this.cartItem)
      //  }
      //  this.isUpdating = false;
      //  this.isCartItemsGetting = false;
      //}

    }
    //
    if (this.addCartItemService.itemRemoved === true) {
      // console.log("Calling  this.removeItem ", this.cartCheckoutItemsService.cartItem);
      this.removeItem(this.cartCheckoutItemsService.cartItem);
    }

    if (this.cartCheckoutItemsService.updateCart$) {

      this.cartCheckoutItemsService.newCartItem$.subscribe(() => {
        if (this.cartCheckoutItemsService.cartResults == true) {
          //  console.log("Did we get an update: ", this.cartCheckoutItemsService.cartResults)
          //  console.log("The cartItem: ", this.cartCheckoutItemsService.cartItem);
          if (this.cartCheckoutItemsService.cartItem) {
            this.store.dispatch(new CartStoreActions.ClearCart());
            const tempUpdatedCart: CartItem = this.updateCartList(this.cartItem, this.cartCheckoutItemsService.cartItem);

            this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempUpdatedCart))
            this.cartStore.subscribe(c => this.cartState = c);
            this.tempCartState = this.cartState;
            this.cartItem = this.tempCartState.data;
            this.getCartList();
            this.isUpdating = false;
            //console.log("Do we have a new CartItem: ", this.cartItem);
          }
          //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse)
          // console.log("Do we have a value: ", this.cartCheckoutItemsService.updateCart$);
          this.cartCheckoutItemsService.cartResults = false;
          this.cartCheckoutItemsService.newCartItem$.emit(false);
          this.cartCheckoutItemsService.updateCart$.unsubscribe();
        }
      });
    }
  }

  initListItem() {
    // console.log("Building Cart Form")
    return this.formBuilder.group({
      'editAmount': [null, [Validators.pattern(Constants.DecimalPattern), this.minimumAmount()]]
    });
  }

  public updateCartOnDelete() {
    /*if (this.addCartItemService.cartResponse && this.addCartItemService.deleteResult === true || this.cartCheckoutItemsService.cartItem && this.addCartItemService.deleteResult === true)*/ {
      this.cartItem.items = this.cartCheckoutItemsService.cartItem.items;
      //console.log('list', this.cartCheckoutItemsService.cartItem.items);
      this.deleteInterval = setInterval(() => {
        if (this.cartCheckoutItemsService.cartItem) {
          this.cartItem = this.cartCheckoutItemsService.cartItem;
          this.isUpdating = false;
          this.addCartItemService.deleteResult = false;
          clearInterval(this.deleteInterval);
        }
      }, 1000);
    }
  }

  private getCartList() {
    // console.log  ("Creating the cart list")
    this.cartCallCount++;
    //  console.log("Do we have a cartCallCount: ", this.cartCallCount)
    if (!this.isUpdating) {
      this.isCartItemsGetting = false;
    }
    if (this.cartCheckoutItemsService.cartResults === true && this.cartCheckoutItemsService.cartItem.items) {
      // console.log("GetCartList CartItem: ", this.cartCheckoutItemsService.cartItem)
      if (this.addCartItemService.deleteResult === true) {
        let tempCartItem: any = this.addCartItemService.cartResponse;
        this.cartCheckoutItemsService.cartItem = tempCartItem;
        // console.log("Did we fix cartItem: ", this.cartCheckoutItemsService.cartItem);
      }
      this.cartCheckoutItemsService.cartItem.subTotal = this.cartCheckoutItemsService.cartItem.total;

      //Build up form
      for (let i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
        //For use with the mobile version
        this.editCartAmountForm.addControl('editAmountGroup' + i, this.initListItem())
      }

      // console.log("do we have a oginResponse:  ", this.loginStoreSvc.fixedLoginResponse);
      if (this.loginStoreSvc.fixedLoginResponse) {
        this.cartCheckoutItemsService.loginResponse = this.loginStoreSvc.fixedLoginResponse;
      }

      if (this.cartCheckoutItemsService.loginResponse.messageType === Constants.Error) {
        this.isCartItems = true;
        this.getCartItemsErr = true;
        this.getCartItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
        this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
      } else {
        // console.log("Creating a cookie: ", this.cartCheckoutItemsService.loginResponse)
        this.loginStoreSvc.loadLogin(this.cartCheckoutItemsService.loginResponse);
        // this.cookieService.putObject(Constants.AuthCookieName, this.cartCheckoutItemsService.loginResponse);
        this.isCartItems = this.cartCheckoutItemsService.cartItem.items.length > 0;
      }
      let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
      this.cartItem = this.cartCheckoutItemsService.cartItem;
      //console.log(this.cartItem);
      this.stopSoon = setInterval(() => {
        seconds.subscribe(
          x => {
            if (x == Constants.SpinnerDelay) {
              this.isCartItemsGetting = false;
              this.isUpdating = false;
              if (this.router.url == '/checkout') {
                this.isReview = false;
              } else {
                this.isReview = true;
              }
            }
          if(this.checkoutItems){
            if (this.checkoutItems.items && this.isReview) {
              if (this.cartItem.items[0].liteItemType == 'userFee') {
                this.cartItem.subTotal = this.cartItem.items[0].amountInCart;
                this.cartItem.consumerFeeTotal = 0;
                this.cartItem.total = this.cartItem.subTotal;
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))
              } else {
                this.cartItem.consumerFeeTotal = this.checkoutItems.consumerFeeTotal;
                this.cartItem.total = this.checkoutItems.total;
                this.isUpdating = false;
              }
            } else {
              this.cartItem.consumerFeeTotal = 0;
              this.addCartItemService.itemRemoved = false;
            }
            clearInterval(this.stopSoon);
          }
          });
        
      }, 1000);
    


    } else {
      ++this.cartCheckoutItemsService.count;
    }




  }

  //index
  removeItem(value) {
    //   console.log("Remove me NOW")

    if (value.item !== undefined) {
      if (value.item.liteItemType == "userFee") {
        this.transferService.feeCartCount = 0;
        // console.log("What is the feeCartItem Here: ", this.transferService.feeCartItem)
        // console.log("Does Remove have a CartState: ", this.cartState)
        this.transferService.feeCartItem = {};
      }

      this.isUpdating = true;
      this.failedToUpdate = false;

      if (!this.addCartItemService.deleteResult) {
        this.addCartItemService.deleteCartItemNew(value.item.itemKey, value.item.accountBalanceID, this.loginResponse);
      }

    }
    //this.removeInterval = setInterval(() => {

      if (this.addCartItemService.cartResponse || this.addCartItemService.deleteResult == true) {
        // console.log("What is the CartResponse After subscribeToDelete: ", this.addCartItemService.cartResponse);
        if (this.addCartItemService.cartResponse.itemCount == 0) {
          this.store.dispatch(new CartStoreActions.ClearCart());
          this.store.dispatch(new MealStoreActions.ClearMeals());
          //Refresh meals Store after cart item removed
          this.refreshService.refreshMeals();
          //clearInterval(this.removeInterval);
        } else {
          let tempCartResponse: any = this.addCartItemService.cartResponse;
          this.store.dispatch(new CartStoreActions.LoadCartSuccess(tempCartResponse));
          this.updateCartOnDelete();
          //clearInterval(this.removeInterval);
        }
        if (this.addCartItemService.loginResponse.messageType === Constants.Error) {
          this.failedToUpdateMsg = this.addCartItemService.loginResponse.message;
          this.failedToUpdate = true;
          this.isUpdating = false;
          //console.log('is there an error here');
          this.utilityService.clearErrorMessage(this.addCartItemService.loginResponse);
          //clearInterval(this.removeInterval);
        } else {
          //on success update cart items, count, etc.
          this.addCartItemService.loginResponse.access_token.trim();
          // console.log("Creating a cookie: ", this.addCartItemService.loginResponse)
          this.loginStoreSvc.loadLogin(this.addCartItemService.loginResponse);
          // this.cookieService.putObject(Constants.AuthCookieName, this.addCartItemService.loginResponse);
          // console.log("Do we have a cart response: ", this.addCartItemService.cartResponse);
          if (this.addCartItemService.cartResponse) {
            //console.log('cartResponse during remove', this.addCartItemService.cartResponse);
            this.isCartItems = (this.addCartItemService.cartResponse.items.length > 0) ? true : false;
            this.failedToUpdate = false;
            this.cartItem.subTotal = this.addCartItemService.cartResponse.total;
            //Copied from commented code below
            this.isUpdating = false;
            this.updateCartOnDelete();
            //clearInterval(this.removeInterval);
            this.loginResponse.cartItemCount = this.addCartItemService.cartResponse.itemCount;
            // console.log("Our New Subtotal: ", this.cartItem.subTotal);
            // console.log("About to subscribeToGetCartCheckoutCartItem - CartItem3 ")
            //this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
            this.getCartList();
            this.addCartItemService.itemRemoved = false;
          }
        }
        this.addCartItemService.deleteResult = false;
        this.haveCartItems = (this.cartItem.items.length > 0) ? true : false;
        //clearInterval(this.removeInterval);
      } else {
        this.addCartItemService.count++;
        //clearInterval(this.removeInterval);
      }
    //}, 1000);
  }

  goBackToDashboard() {
    // console.log("Going Back to Dashboard No CartItems: ", this.cartItem)
    this.addCartItemService.deleteResult = false;
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.studentMealsService.getStudentMealsNew(this.loginResponse);
    this.pageLoadingService.show("Returning to Dashboard");
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
      this.pageLoadingService.hide();
    }, 1000)


  }


  updateItem(item) {
    //console.log("Calling updateItem: ", item);
    //console.log("updatedItem cartItem: ", this.cartCheckoutItemsService.cartItem)

    let subscription: any;
    for (let i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
      if (this.cartCheckoutItemsService.cartItem.items[i].accountBalanceID == item.accountBalanceID && this.cartCheckoutItemsService.cartItem.items[i].itemKey === item.itemKey) {
        //  console.log("updateItem ForLoop: ", this.cartCheckoutItemsService.cartItem.items[i]);
        this.cartCheckoutItemsService.cartItem.items[i].amountInCart = Number(item.amountInCart);
        this.cartCheckoutItemsService.cartItem.items[i].extendedAmount = Number(item.amountInCart);
        this.cartCheckoutItemsService.cartItem.items[i].itemAmount = Number(item.itemAmount);
      }
    }

    let updateList: any = this.cartCheckoutItemsService.cartItem.items;
    subscription = this.cartCheckoutItemsService.subscribeToUpdateCartCheckOutItemsNew(updateList, this.loginResponse);

    this.checkoutInterval = setInterval(() => {
      if (this.cartCheckoutItemsService.result == true) {
        this.cartItem.subTotal = this.cartCheckoutItemsService.cartItem.total;
        this.cartCheckoutItemsService.updateCart$.unsubscribe();
        //this.getCartList();
        // console.log("About subscribeTopostCartCheckoutReviewItems - Cart3")
        //If we updated the ViewCart(CartItems) the ReviewCart(CheckOutItems) needs to be refreshed
        //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse)
        this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
          .subscribe(
            data => {
              this.cartCheckoutItemsService.checkOutItem = data;
            },
            error => {
              // console.log("Error: No Checkout Item: ", this.checkOutItem);
              if (this.cartCheckoutItemsService.checkOutItem) {
                this.loginStoreSvc.loadLogin(this.loginResponse);
                this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                this.cartCheckoutItemsService.checkoutResults = true;
                this.cartCheckoutItemsService.cartUpdate.emit(true);
              } else {
                this.failedToUpdateMsg = this.cartCheckoutItemsService.loginResponse.message;
                this.isUpdating = false;
                this.failedToUpdate = true;
                this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
                this.cartCheckoutItemsService.checkoutResults = false;
              }

            },
            () => {
              this.loginStoreSvc.loadLogin(this.loginResponse);
              // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
              this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
              this.cartCheckoutItemsService.checkoutResults = true;
              this.cartCheckoutItemsService.cartUpdate.emit(true);


              this.isUpdating = false;
            }
        )
        clearInterval(this.checkoutInterval);
      } else {
        this.cartCheckoutItemsService.count++;
      }
    }, 1000)
  }

  checkCartStore() {
    if (this.cartItem) {
      this.cartStore.subscribe(c => this.tempCartState = c);
      if (this.tempCartState) {
        this.cartState = this.tempCartState.data;

        if (this.cartState.items) {
          let temptState;
          this.store.dispatch(new CartStoreActions.ClearCart());
          this.cartStore.subscribe(c => this.cartState = c);
          temptState = this.cartState;
          this.cartItem = temptState.data;
        }
      }
    } else {
      let temptState: any;
      this.cartStore.subscribe(c => this.cartState = c);
      if (this.cartState) {
        temptState = this.cartState;
        this.cartItem = temptState.data;
      }

    }
  }

  //custom validator that will check to make sure values are greater than 0
  minimumAmount(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      var goodToGo: boolean = true;
      const selection = control.value;
      if (isNaN(selection)) {
        //other validation will catch this case
      } else if (selection <= 0 && selection !== '') {
        goodToGo = false;
      }

      return goodToGo ? null : { 'minimumAmount': { selection } };
    };
  }


  private completeUpdateList(updatedItem, currentList) {
    let completeList: any = {};
    let unChangedItems: any;
    unChangedItems = this.isUnchangedItem(updatedItem, currentList);
    return completeList;
  }


  private isUnchangedItem(currentItem, fullList) {
    let unChangedList: any = [];
    for (let i = 0; i < fullList.length; i++) {

      if (fullList[i].accountBalanceID !== currentItem.accountBalanceID) {
        unChangedList.push(fullList[i]);
      }
    }
    return unChangedList;
  }

  private updateCartList(currentCartList: CartItem, updateCartItem: CartItem) {
    //  console.log("Updating CartList: ", currentCartList)
    //   console.log("the updated Item: ", updateCartItem)
    let updatedItemId = updateCartItem.items[0].accountBalanceID;
    const newCartItemsList: any = <any>[];
    for (let i = 0; i < currentCartList.items.length; i++) {
      if (updatedItemId == currentCartList.items[i].accountBalanceID) {
        let fixedItem = this.amendItem(currentCartList.items[i], updateCartItem.items[0]);
        newCartItemsList.push(fixedItem)
      } else {
        newCartItemsList.push(currentCartList.items[i]);
      }

    }
    currentCartList.items = newCartItemsList;
    currentCartList = this.upDateSubTotal(currentCartList);
    return currentCartList;
  }

  private amendItem(currentCartItem: CartItemDetail, changedCartItem: CartItemDetail) {
    if (currentCartItem.amountInCart == changedCartItem.amountInCart) {
      currentCartItem = currentCartItem;
    } else {
      currentCartItem.amountInCart = changedCartItem.amountInCart;

    }
    return currentCartItem;
  }

  private upDateSubTotal(currentCartList: CartItem) {
    let tempCartList: any = currentCartList;
    let temptItemList = tempCartList.items;
    temptItemList = temptItemList.map(a => parseInt(a.amountInCart))
    let amountList = temptItemList.reduce((acc, temptItemList) => acc + temptItemList, 0)
    currentCartList.subTotal = amountList;
    currentCartList.total = this.getNewTotal(currentCartList.subTotal, currentCartList.consumerFeeTotal);
    return currentCartList;
  }

  private getNewTotal(subTotal, consumerFee) {
    let tempConsumerFee: any
    let tempSubTotal: any = subTotal;
    if (consumerFee) {
      tempConsumerFee = consumerFee
    } else {
      tempConsumerFee = 0;
    }
    let newTotal = Number(tempSubTotal) + Number(tempConsumerFee);
    return newTotal;
  }

  private checkChecOutItems() {
    //  console.log("calling checkout Items")
    this.checkoutItemsInterval = setInterval(() => {
      this.checkoutItems = this.cartCheckoutItemsService.checkOutItem;
      if (this.checkoutItems.itemCount > 0) {
        // console.log("What is the checkoutItems: ", this.checkoutItems)
        this.isChekoutItemsGetting = (this.checkoutItems.merchants.length > 0) ? true : false;
        clearInterval(this.checkoutItemsInterval);
      } else {
        this.isChekoutItemsGetting = false;
        clearInterval(this.checkoutItemsInterval);
      }

      this.cartCheckoutItemsService.cartResults = false;

    }, 1000);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let element = event.currentTarget as Window;
    this.mobile = (element.innerWidth < 960) ? true : false;
    this.checkMobile.emit(this.mobile);
  }

  ngOnDestroy() {
    this.addCartItemService.cartUpdate.emit(false);
    this.addCartItemService.result = false;
    this.isChekoutItemsGetting = false;
  }
}
