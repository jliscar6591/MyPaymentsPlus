import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartCheckoutItemsService, CartCheckoutService, MultiDistrictService } from "../../services/index";
import { LoginModel, LoginResponseModel } from "../../../login/model/index";
import {
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { PaymentMethodModel, PaymentMethodInputModel, CreditCard, Ach } from '../../account/meal-purchases/model/index';
import { PaymentMethodService, PaymentAddService, PaymentUtilityService } from '../../account/services/index';
import { Constants } from "../../../app.settings";
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { PaymentMethodDialogService } from '../../services/payment-method-dialog.service';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import { CartItem, CartItemDetail, CartResponse, WalletTransaction, CardTransaction, ACHTransaction, SaleTransaction, CheckoutItem, Discounts, Merchant } from '../../model/index';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions'
import { SiteHomeComponent } from '../../site-home.component';
import { RefreshService } from '../../../shared/services/refresh.service';
import { window } from 'rxjs/operators';
import { DiscountService } from '../../services/discount.service';
import { Plugins } from '@capacitor/core';
//import { clearInterval } from 'timers';

@Component({
  selector: 'review-cart',
  templateUrl: './review-cart.component.html',
  styleUrls: ['./review-cart.component.less']
})

export class ReviewCartComponent implements OnInit {

  private isBank: boolean;
  private isCard: boolean;
  public applyingDiscount: boolean = false;
  public persistDefaultCheckBox: boolean = false;
  public paymentMethodForm: FormGroup;
  public hasWallets: boolean = true;
  public paymentAddDetail: PaymentMethodInputModel = new PaymentMethodInputModel();
  public paymentMethodDetail: PaymentMethodModel;
  private loginResponse: LoginResponseModel;
  public loadingPayments: boolean = false;
  private getWalletsErr: boolean = false;
  private getWalletsErrMsg: string;
  private selectedPaymentMethod: PaymentMethodModel;
  private isCartTotals: boolean;
  private cartItem: CartItem;
  private checkOutItem: CheckoutItem;
  private processPaymentError: boolean;
  private processErrorMessage: string;
  public discountsApplied: any;
  private isCartItems: boolean;
  public deviceInfo: any;
  public web: boolean;
  public isCartItemsGetting: boolean;
  private getCartItemsErr: boolean;
  private getCartItemsErrMsg: string;
  private isCheckoutItems: boolean;
  public discountFailed: boolean = false;
  public clearDiscounts: boolean = false;
  public isCheckoutItemsGetting: boolean;
  private getCheckoutItemsErr: boolean;
  private getCheckoutItemsErrMsg: string;
  private emitterCounter: number = 0;
  private backToDashboardCounter: number = 0;
  private seconds = Observable.interval(Constants.SpinnerDelayIncrement);
  private getReceiptCounter: number = 0;
  public discountErrorMsg: string;
  public discountError: boolean = false;
  public supportAvailable: boolean;
  public noMoreDiscounts: boolean = false;
  private selectPaymentErr: boolean;
  private selectPaymentErrMsg: string;
  private subscriptionSaleT: any;
  public discountCall: number = 0;
  public isUpdating: boolean;
  public isReview: boolean = false;
  private validationToken: string;
  public cCount: number;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public tempCartState: any;
  private subscription: Subscription;
  public walletInterval: any;
  public cartResultInterval: any;
  public saleInterval: any;
  public showReceipt: boolean = false;
  private cardTransaction: CardTransaction = {
    paymentType: '',
    nameOnAccount: '',
    company: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryYear: '',
    expiryMonth: '',
    cardCode: ''
  };
  private achTransaction: ACHTransaction = {
    paymentType: '',
    nameOnAccount: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    account: '',
    accountType: '',
    routing: ''
  };
  private walletTransaction: WalletTransaction = {
    paymentType: '',
    key: ''
  };

  private emptyCartItem: CartItem = {
    itemCount: 0,
    items: [],
    total: 0,
    bonusTotal: 0,
    subTotal: 0,
    consumerFeeTotal: 0,
    validationToken: ''
  }


  private emptyCheckOutItem: CheckoutItem = {
    bonusTotal: 0,
    consumerFeeTotal: 0,
    itemCount: 0,
    total: 0,
    subTotal: 0,
    validationToken: '',
    totalTax: 0,
    discountTotal: 0,
    isDiscountAvailable: false,
    merchants: [],
    discounts: []
  }

  public discountCodeForm = new FormGroup({
    discount: new FormControl()
  });

  constructor(
    private router: Router,
    private paymentMethodService: PaymentMethodService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private paymentMethodDialogService: PaymentMethodDialogService,
    private viewContainerRef: ViewContainerRef,
    private pageLoadingService: PageLoadingService,
    private receiptService: ReceiptService,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    private cartCheckoutService: CartCheckoutService,
    private discountService: DiscountService,
    private store: Store<AppState>,
    private state: State<AppState>,
    private refreshService: RefreshService,
    private loginStoreSrvc: LoginStoreService,
    private multiDistrictSvc:  MultiDistrictService
  ) {
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    this.cartStore = store.select(state => state.cartStore);
  }

  async ngOnInit() {
    const { Device } = Plugins;
    this.deviceInfo = await Device.getInfo();
   // console.log(this.deviceInfo);
    if (this.deviceInfo.platform === 'web') {
      this.web = true;
    }
    if (this.discountService.CheckoutItem) {
      this.clearDiscounts = true;
      this.discountsApplied = false;
    }
    this.getPaymentMethods();
    if (this.router.url == '/review') {
    //console.log("does Review have a cartCheckoutItemsService CartItem: ", this.cartCheckoutItemsService.cartItem)
      // console.log("does Review have a CartItem: ", this.cartItem)
  // console.log("Do we have checkout Items: ", this.checkOutItem)
      //setTimeout(() => { this.getCartListReview(); }, 0);
      this.getCartListReview();
      // console.log("Calling postCartCheckoutReviewItems: ", this.loginResponse)
      if (this.loginResponse.cartItemCount) {
        this.cCount = this.loginResponse.cartItemCount;
      }
     // console.log("Was  subscribeTopostCartCheckoutReviewItems - ReviewCart1: ", this.cartCheckoutItemsService.checkOutItem)
      let trueTotal: number = 0;
      this.isReview = true;
    //  console.log("Do we have the checkoutItems: ", this.checkOutItem)
      if (this.cartCheckoutItemsService.cartItem) {
     //   console.log('merchant info', this.cartCheckoutItemsService.checkOutItem)
        if (this.cartCheckoutItemsService.cartItem.itemCount > 0) {
          for (let i = 0; i < this.cartCheckoutItemsService.cartItem.items.length; i++) {
            // console.log("What is my amount in Cart: ", this.cartCheckoutItemsService.cartItem.items[i].amountInCart)
            if (this.cartCheckoutItemsService.cartItem.items[i].amountInCart > 0 && this.cartCheckoutItemsService.cartItem.total == 0) {
              trueTotal += this.cartCheckoutItemsService.cartItem.items[i].amountInCart;
            }
          }

          this.cartCheckoutItemsService.cartItem.total = trueTotal;

          //console.log("New cartCheckoutItemsService.cartItem B4 dispatch: ", this.cartCheckoutItemsService.cartItem);


        }
        this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
        this.cartStore.subscribe(c => this.cartState = c);
        let temptState: any;
        temptState = this.cartState;
        this.cartItem = temptState.data;
        // console.log("DoesStore Have cartItem: ", this.cartItem)
      } else {
        this.cartStore.subscribe(c => this.cartState = c);
        let temptState: any;
        temptState = this.cartState;
        this.cartItem = temptState.data;
        // console.log("Do we have an else cartItem: ", this.cartItem)
      }


    //  setTimeout(() => { this.getCartListReview(); }, 0);

    }
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    this.supportAvailable = (currentDay > 0 && currentDay < 6) ? true : false;
    if (this.supportAvailable) {
      var currentTime = currentDate.getHours();
      var startSupportHours = new Date();
      startSupportHours.setHours(7, 30, 0); // 7:30 am
      var endSupportHours = new Date();
      endSupportHours.setHours(17, 30, 0); // 5.30 pm
      this.supportAvailable = (currentDate >= startSupportHours && currentDate <= endSupportHours) ? true : false;
    }
    this.createDiscountForm();
  }

  ngDoCheck() {
    if (this.applyingDiscount === true && this.discountService.result === true && this.discountCall === 0) {
      //console.log("Checking for Discounts")
      setTimeout(() => {
        if (this.discountService.CheckoutItem.discountTotal === 0) {
          this.pageLoadingService.hide();
          this.checkOutItem = this.cartCheckoutItemsService.checkOutItem;
          this.discountError = true;
          this.discountsApplied = false;
          this.discountErrorMsg = "Discount Code Incorrect";
        } else {
          //   console.log('discount response', this.discountService.CheckoutItem);
          this.discountError = false;
          this.discountErrorMsg = '';
          this.checkOutItem = this.discountService.CheckoutItem;
          this.discountsApplied = true;
          this.pageLoadingService.hide();
          this.discountCall = 1;
        }
      }, 500);
    }
  }

  createDiscountForm() {
    this.discountCodeForm = this.formBuilder.group({
      discount: '',
    });
  }

  getCartListReview() {
   //console.log("Reviewing the Cart");
    this.isCheckoutItemsGetting = true;
    this.cartCheckoutItemsService.result = false;

    if (this.cartCheckoutItemsService.checkOutItem) {
     // console.log("Do we have checkoutItemsNow: ", this.cartCheckoutItemsService.checkOutItem)
      if (this.cartCheckoutItemsService.loginResponse.messageType === Constants.Error) {
        this.isCartItems = true;
        this.getCartItemsErr = true;
        this.getCartItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
        this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
        this.isCheckoutItems = true;
        this.getCheckoutItemsErr = true;
        this.getCheckoutItemsErrMsg = this.cartCheckoutItemsService.loginResponse.message;
        this.utilityService.clearErrorMessage(this.cartCheckoutItemsService.loginResponse);
      } else {
        this.loginStoreSrvc.loadLogin(this.cartCheckoutItemsService.loginResponse);
       // console.log("What is the Loaded store-Cookie: ", this.loginStoreSrvc.cookieStateItem)
        // this.cookieService.putObject(Constants.AuthCookieName, this.cartCheckoutItemsService.loginResponse);
        this.checkOutItem = this.cartCheckoutItemsService.checkOutItem;
    //  console.log("Do we have checkoutItemsNow: ", this.checkOutItem)
        this.isCheckoutItems = this.cartCheckoutItemsService.checkOutItem.merchants[0].itemGroups.length > 0;
        this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
        // let tCartState: any = this.cartState
        if (this.cartItem) {
          if (this.cartItem.items[0].liteItemType == 'userFee') {
            if (this.cartItem.consumerFeeTotal > 0) {
              this.cartItem.consumerFeeTotal = 0;
            } else {
              this.cartItem.consumerFeeTotal = 0;
            }
            this.cartItem.subTotal = this.cartItem.items[0].amountInCart;
            this.cartItem.total = this.cartItem.items[0].amountInCart + this.cartItem.consumerFeeTotal;
            this.checkOutItem.consumerFeeTotal = 0;
            this.checkOutItem.subTotal = this.cartItem.items[0].amountInCart;
            this.checkOutItem.total = this.cartItem.total;
          }
         //console.log("Was checkoutItem Changed: ", this.checkOutItem)
        }

      }





      let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
      seconds.subscribe(
        x => {
          if (x == Constants.SpinnerDelay) {
            this.isCartItemsGetting = false;
          }
        });
    } else {
      this.cartItem = this.cartCheckoutItemsService.cartItem;
      if (this.cartItem.items[0].liteItemType == 'userFee') {
        //  let newTotal = this.cartItem.total;
        if (this.cartItem.consumerFeeTotal > 0) {
          this.cartItem.consumerFeeTotal = 0;
        }
        this.cartItem.total = this.cartItem.subTotal + this.cartItem.consumerFeeTotal;
      }
      ++this.cartCheckoutItemsService.count;
    }
  }

  getPaymentMethods() {
    this.persistDefaultCheckBox = true;
    this.loadingPayments = true;
    this.paymentMethodService.result = false;
    this.paymentMethodService.paymentMethods = [];
    this.hasWallets = false;
    this.loginResponse = this.loginStoreSrvc.cookieStateItem;
    let failureMessage: string = 'Updating Cart Failed';

    //console.log("What is the subscribeToGetPaymentMethods LoginResponse: ", this.loginResponse)
    //this.paymentMethodService.subscribeToGetPaymentMethods(this.loginResponse);


    this.paymentMethodService.getPaymentMethodsNew(this.loginResponse)
      .subscribe(
        data => {
          this.paymentMethodService.paymentMethods = data;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage)
          this.getWalletsErrMsg = this.paymentMethodService.loginResponse.message;
          this.getWalletsErr = true;
          this.utilityService.clearErrorMessage(this.paymentMethodService.loginResponse);
        },
        () => {
          //  console.log("What R these paymentMethods: ", this.paymentMethods)
          this.paymentMethodService.result = true;
          this.loginStoreSrvc.loadLogin(this.paymentMethodService.loginResponse);
          this.hasWallets = this.paymentMethodService.paymentMethods.length > 0;

          this.paymentMethodService.paymentMethods.forEach(method => {
            if (method.isDefault) {
              this.selectedPaymentMethod = method;
            }
          });

          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          seconds.subscribe(
            x => {
              if (x == Constants.SpinnerDelay) {
                this.loadingPayments = false;
              }
            });

        }
      )



  }



  selectPayment(payment: PaymentMethodModel) {
    //Not expired credit card.
    if (!this.utilityService.isAch(payment.walletKey, this.paymentMethodService.paymentMethods) && !payment.isExpired) {
      this.selectedPaymentMethod = payment;
    } else if (!this.utilityService.isAchBlocked(this.loginResponse)) {
      this.selectedPaymentMethod = payment;
    }
    this.selectPaymentErr = false;
  }

  //Includes listener
  showMethodDialog() {
    //save selected
    this.paymentMethodDialogService.open(this.viewContainerRef)
      .subscribe((result: any) => {
        if (result) {
          if (result.action != 'cancel') {
            if (result.methodValues.saveMethod) {
              //New method, was saved successfully, get fresh list
              this.getPaymentMethods();
            } else {
              //New method, one time use, add to list
              this.mapNewPayMethod(result.methodValues);
            }
          } else {
            this.restoreSelected(this.selectedPaymentMethod)
          }
        }
      });
  }

  restoreSelected(selected: PaymentMethodModel) {
    //When the dialog is popped the selected payment radio button 
    //selected indication vanishes
    //This is the Hack to cause refresh when there is no change
    //like when one clicks cancel in the dialog.
    //Just changing the object proved to not be enough
    //however when exchanging the entire array it refreshes proper

    //This doesn't work and is here for example
    //if (this.paymentMethodService.paymentMethods[0]) {
    //    this.paymentMethodService.paymentMethods[0].isDefault = !this.paymentMethodService.paymentMethods[0].isDefault;
    //    let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
    //    seconds.subscribe(
    //        x => {
    //            if (x == Constants.SpinnerDelay) {
    //                this.paymentMethodService.paymentMethods[0].isDefault = !this.paymentMethodService.paymentMethods[0].isDefault;
    //            }
    //        });

    //}

    let pm: PaymentMethodModel[] = this.paymentMethodService.paymentMethods;
    this.paymentMethodService.paymentMethods = [];
    let seconds = Observable.interval(0);
    seconds.subscribe(
      x => {
        if (x == Constants.SpinnerDelay) {
          this.paymentMethodService.paymentMethods = pm;
        }
      });
  }

  //Mapping to the payment method list.
  mapNewPayMethod(methodValues: any) {
    let oneTimePaymentMethod: PaymentMethodModel = new PaymentMethodModel();
    oneTimePaymentMethod.accountHolderName = methodValues.firstName + ' ' + methodValues.lastName;
    oneTimePaymentMethod.walletNickname = methodValues.nickname;
    oneTimePaymentMethod.saveMethod = false;
    oneTimePaymentMethod.isDefault = true;

    if (methodValues.ach) {
      oneTimePaymentMethod.walletType = 'ACH';
      oneTimePaymentMethod.accountType = methodValues.ach.accountType.toLocaleLowerCase();
      oneTimePaymentMethod.accountTail = methodValues.ach.account.slice(-4, methodValues.ach.account.length);
      this.selectedPaymentMethod = oneTimePaymentMethod;
      this.achTransaction.account = methodValues.ach.account;
      this.achTransaction.routing = methodValues.ach.routing;
      this.isCard = false;
    } else if (methodValues.creditCard) {
      // console.log("The CC methodValues: ", methodValues )
      oneTimePaymentMethod.walletType = 'CreditCard';
      oneTimePaymentMethod.accountType = methodValues.creditCard.cardType.toLocaleLowerCase();
      oneTimePaymentMethod.expiryMonth = methodValues.creditCard.expiryMonth;
      oneTimePaymentMethod.expiryYear = methodValues.creditCard.expiryYear;
      oneTimePaymentMethod.accountTail = methodValues.creditCard.cardNumber.slice(-4, methodValues.creditCard.cardNumber.length);
      this.selectedPaymentMethod = oneTimePaymentMethod;
      this.cardTransaction.cardNumber = methodValues.creditCard.cardNumber;
      this.cardTransaction.cardCode = methodValues.creditCard.cardCode;
      this.cardTransaction.street = methodValues.billingAddress;
      this.cardTransaction.street2 = methodValues.billingAddress2;
      this.cardTransaction.city = methodValues.billingCity;
      this.cardTransaction.state = methodValues.billingState;
      this.cardTransaction.zip = methodValues.billingZip;
      this.isCard = true;
    }
    this.paymentMethodService.paymentMethods.push(oneTimePaymentMethod);
  }

  //proposed never used
  isChecked(tail: string) {
    if (tail == this.selectedPaymentMethod.accountTail) {
      return true;
    } else {
      return false;
    }
  }

  //adds discount code
  public applyDiscount() {
    if (!this.discountService.CheckoutItem || this.clearDiscounts) {
      this.applyingDiscount = true;
      this.pageLoadingService.show("Applying Discount Code...");
      //  console.log('discount code applied', this.discountCodeForm.value.discount);
      let code = this.discountCodeForm.value.discount;
      this.discountService.subscribeToApplyDiscount(this.loginResponse, code);
      this.discountCodeForm.reset();
    } else if (this.discountService.CheckoutItem && this.discountService.CheckoutItem.discounts.length > 0) {
      this.noMoreDiscounts = true;
    }
  }

  prepareToPay() {
    //console.log('prepareToPay');
    var payMethod: SaleTransaction = {
      payment: null,
      paymentChannel: '',
      validationToken: ''
    };
    if (this.selectedPaymentMethod &&
      this.selectedPaymentMethod.walletType.toLocaleLowerCase() == 'ach' &&
      this.utilityService.isAchBlocked(this.loginResponse)) {
      this.selectPaymentErr = true;
      this.selectPaymentErrMsg = "Please select a payment method.";
    } else if (this.selectedPaymentMethod) {
      if (this.selectedPaymentMethod.hasOwnProperty('walletKey')) {
        payMethod.payment = this.walletTransaction;
        payMethod.payment.paymentType = 'wallet';
        payMethod.payment.key = this.selectedPaymentMethod.walletKey;
      }
      else {
        if (this.isCard) {
          this.cardTransaction.paymentType = 'credit';
          this.cardTransaction.nameOnAccount = this.selectedPaymentMethod.accountHolderName;
          this.cardTransaction.company = null;
          this.cardTransaction.expiryMonth = this.selectedPaymentMethod.expiryMonth;
          this.cardTransaction.expiryYear = this.selectedPaymentMethod.expiryYear;
          if (this.selectedPaymentMethod.billingAddress2 == undefined) {
            this.cardTransaction.street2 = '';
          }
          payMethod.payment = this.cardTransaction;
        }
        else {
          this.achTransaction.paymentType = 'ach';
          this.achTransaction.nameOnAccount = this.selectedPaymentMethod.accountHolderName;
          this.achTransaction.accountType = this.selectedPaymentMethod.accountType;
          payMethod.payment = this.achTransaction;
        }
      }

      //This is the correct way to handle the validationToken commenting out for development purposes
      if (this.discountService.CheckoutItem) {
        payMethod.validationToken = this.discountService.CheckoutItem.validationToken;
      } else if (this.cartCheckoutItemsService.checkOutItem.validationToken) {
        payMethod.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
      } else {
        payMethod.validationToken = this.validationToken;
      }

      //Use for development to force first pay attempt to fail to test error handling
      //if (this.validationToken) {
      //  payMethod.validationToken = this.validationToken;

      //} else {
      //  payMethod.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
      //}

      this.processpayNew(payMethod);
    } else {
      this.selectPaymentErr = true;
      this.selectPaymentErrMsg = "Please select a payment method.";
    }
  }

  processpayNew(payMethod: SaleTransaction) {
    //console.log('processPayNew')
    // console.log("The PayMethod: ", payMethod);
    let paymentType = this.cartCheckoutItemsService.cartItem.items[0]['liteItemType'];
    if (!this.selectPaymentErr) {
      this.pageLoadingService.show("Processing Payment...");
      if (this.web) {
        payMethod.paymentChannel = 'WEB'
      } else {
        payMethod.paymentChannel = 'MOBIL'
      }
     // this.subscriptionSaleT = this.cartCheckoutService.subscribeToPostSaleTransactionNew(payMethod, this.loginResponse);
      let failureMessage: string = 'Transaction Failed';
      this.cartCheckoutService.postSaleTransactionNew(payMethod, this.loginResponse)
        .subscribe(
          data => {
            this.cartCheckoutService.saleTransactionResponse = data;
          },
          error => {
            this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
            this.cartCheckoutService.postSaleResult = true;
            this.cartCheckoutService.saleProcessed.emit(this.cartCheckoutService.postSaleResult);
          },
          () => {
           //console.log("Does this call complete: ", this.loginResponse)
            this.cartCheckoutService.isPayPosted = true;
            this.cartCheckoutService.postSaleResult = true;
            this.cartCheckoutService.saleProcessed.emit(this.cartCheckoutService.postSaleResult);
            this.selectPaymentErr = false;
            this.selectPaymentErrMsg = '';
       //This piece of code allows us to detect errors on checkouts when the payment method is created at time of checkout but not saved
      //In this scenario the payment method is only validated when the payment is posted and we need to subscribe to the event emitter in the event
      //The payment method is Invalid and handle the error
            //console.log("Did the sale Process? ", this.cartCheckoutService.postSaleResult)
            if (this.cartCheckoutService.postSaleResult) {
              if (this.cartCheckoutService.postSaleResult == true) {
                if (this.cartCheckoutService.loginResponse.messageType === Constants.Error) {
                  this.pageLoadingService.hide();
                  this.processPaymentError = true;
                  this.processErrorMessage = this.cartCheckoutService.loginResponse.message;
                  //if there is an conflict error, re-pull order summary (heavy cart) to show up to date info
                  // console.log("do we have an error message: ", this.cartCheckoutService.loginResponse.status)
                  if (this.cartCheckoutService.loginResponse.status == '409') {
                    // console.log("We thAT 409: ", this.cartCheckoutService.isPayPosted);
                    this.cartCheckoutService.result = false;
                    // this.cartCheckoutService.subscribeToPostSaleTransactionNew(payMethod, this.loginResponse);
                    //Gets the transaction again in teh event of a 409 error
                    this.subscription =
                      this.cartCheckoutService.postSaleTransactionNew(payMethod, this.loginResponse)
                        .subscribe(
                          data => {
                            this.cartCheckoutService.saleTransactionResponse = data;
                          },
                          error => {
                            this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                            this.cartCheckoutService.postSaleResult = true;
                            this.cartCheckoutService.saleProcessed.emit(this.cartCheckoutService.postSaleResult);
                          },
                          () => {
                            // console.log("Does this call complete: ", this.loginResponse)
                            this.cartCheckoutService.isPayPosted = true;
                            this.cartCheckoutService.postSaleResult = true;
                            this.cartCheckoutService.saleProcessed.emit(this.cartCheckoutService.postSaleResult);
                            this.getCartListReview();
                            this.subscription.unsubscribe();
                          }
                        )


                    this.cartCheckoutService.result = false;
                  }
                  this.utilityService.clearErrorMessage(this.cartCheckoutService.loginResponse);

                } else {
                  if (this.cartCheckoutService.loginResponse.status == '409' || this.cartCheckoutService.loginResponse.status == '500') {
                    //  console.log("We had an error get CheckoutSummary Again")
                    this.cartCheckoutService.result = false;
                    // console.log("About subscribeTopostCartCheckoutReviewItems - ReviewCart2")
                   // this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                   // setTimeout(() => {
                      // console.log("We got a new checkout Summary:  ", this.cartCheckoutItemsService.checkOutItem)
                      
                    //}, 2000)

                    this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
                      .subscribe(
                        data => {
                          this.cartCheckoutItemsService.checkOutItem = data;
                        },
                        error => {
                          // console.log("Error: No Checkout Item: ", this.checkOutItem);
                          if (this.cartCheckoutItemsService.checkOutItem) {
                            this.loginStoreSrvc.loadLogin(this.loginResponse);
                            this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                            this.cartCheckoutItemsService.checkoutResults = true;
                            this.cartCheckoutItemsService.cartUpdate.emit(true);
                          } else {
                            this.cartCheckoutItemsService.checkoutResults = false;
                          }

                        },
                        () => {
                          this.loginStoreSrvc.loadLogin(this.loginResponse);
                          // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                          this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                          this.cartCheckoutItemsService.checkoutResults = true;
                          this.cartCheckoutItemsService.cartUpdate.emit(true);
                          this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
                          this.cartCheckoutService.loginResponse.status = '';
                          this.prepareToPay();
                          this.cartCheckoutService.result = true;

                        }
                    )

                   
                  }
                  //  console.log('Review Cart about to add a Cookie: ', this.cartCheckoutService.loginResponse)
                  this.loginStoreSrvc.loadLogin(this.cartCheckoutService.loginResponse);
                  this.processPaymentError = false;

                  //console.log("saleTransactionResponse: ", this.cartCheckoutService.saleTransactionResponse.cartResults)
                  if (this.cartCheckoutService.saleTransactionResponse.cartResults) {
                    var i;
                    for (i = 0; i < this.cartCheckoutService.saleTransactionResponse.cartResults.length; i++) {
                      //console.log("Do we have a cookieStateItemHere: ", this.loginStoreSrvc.cookieStateItem)
                      //console.log("The cartCheckout LoginResponse: ", this.cartCheckoutService.loginResponse)
                      let cCount: number = this.loginStoreSrvc.cookieStateItem.cartItemCount;
                      // console.log("cCount: ", cCount)
                      if (this.loginResponse.cartItemCount === undefined) {
                        //console.log("cartItemCount is undefined: ", this.loginResponse)
                        //console.log("cCount = ", this.cCount)
                        this.cartCheckoutService.loginResponse.cartItemCount = this.cCount;
                      }
                      
                      if (!this.receiptService.result) {
                        //console.log("About to get the receipt")
                        this.subscription =
                          this.receiptService.getReceiptMod(this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, this.cartCheckoutService.loginResponse, paymentType)
                            .subscribe(
                              data => {
                                this.receiptService.receiptDetail = data;
                                this.receiptService.result = true;
                              },
                              error => {
                                this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                                this.receiptService.showReceipt = false;
                              },
                              () => {
                                this.receiptService.transactions.push(this.receiptService.receiptDetail);
                                //console.log('transactions Length', this.transactions.length);
                                //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
                                if (this.receiptService.result == true && this.receiptService.transactions.length === this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                                  //console.log("Show receipt now: ", this.result)

                                  this.receiptService.receiptUpdate.emit(true);
                                  this.receiptService.processedPayment.emit(true);
                                  this.receiptService.showReceipt = this.receiptService.result;
                                  this.showReceipt = this.receiptService.showReceipt;
                                  //console.log("Show receipt now: ", this.showReceipt )
                                  this.cartCheckoutService.saleTransactionResponse.cartResults = [];
                                }

                                if (this.receiptService.receiptDetail && this.receiptService.receiptDetail.areas[0]['area'] == 'USERFEE') {
                                  this.receiptService.receiptDetail['convenienceFee'] = 0;
                                  this.receiptService.receiptDetail['totalAmount'] = this.receiptService.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                                }


                                // console.log("What district is getting the Receipt: ", loginResponse);
                                this.multiDistrictSvc.processedDistrict = this.cartCheckoutService.loginResponse.districtName;
                                //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);

                              });
                      }



                    }
                    if (!this.receiptService.refreshDash) {
                      if (this.loginResponse) {
                        this.loginResponse.cartItemCount = 0;
                        this.loginStoreSrvc.loadLogin(this.loginResponse);
                        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                        //  console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                        this.store.dispatch(new CartStoreActions.ClearCart());
                      } else {
                        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                        // console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                        this.loginResponse.cartItemCount = 0;
                        this.loginStoreSrvc.loadLogin(this.loginResponse);
                        //After setting cartItemCount want to get the updated cookieStateItem
                        this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                        // console.log("After Receipt Closes Ow what is LoginResponse: ", this.loginResponse);
                        this.store.dispatch(new CartStoreActions.ClearCart());
                      }
                      this.getReceiptCounter++;
                    }

                    //setTimeout(() => {
                    //  if (this.backToDashboardCounter < 1 && this.receiptService.processedPayment) {
                    //    this.pageLoadingService.hide();
                    //    this.cartCheckoutItemsService.cartItem = <CartItem>{};
                    //    //console.log("Going back to DASHBOARD")
                    //    this.router.navigate(['/dashboard']);
                    //    this.cartCheckoutService.cartProcessed.emit(true);
                    //    this.refreshService.refreshCart();
                    //    this.backToDashboardCounter++;
                    //  }
                    //}, 2000)

               

                  } else {
                    this.cartResultInterval = setInterval(() => {
                      if (this.cartCheckoutService.saleTransactionResponse.cartResults && this.getReceiptCounter < 2) {
                        clearInterval(this.cartResultInterval);
                        // console.log("What are the saleTrans Cartresults: ", this.cartCheckoutService.saleTransactionResponse.cartResults)
                        var i;
                        for (i = 0; i < this.cartCheckoutService.saleTransactionResponse.cartResults.length; i++) {
                          //console.log("Do we have a cookieStateItemHere: ", this.loginStoreSrvc.cookieStateItem)
                          //console.log("The cartCheckout LoginResponse: ", this.cartCheckoutService.loginResponse)
                          let cCount: number = this.loginStoreSrvc.cookieStateItem.cartItemCount;
                          // console.log("cCount: ", cCount)
                          if (this.loginResponse.cartItemCount === undefined) {
                            //console.log("cartItemCount is undefined: ", this.loginResponse)
                            //console.log("cCount = ", this.cCount)
                            this.cartCheckoutService.loginResponse.cartItemCount = this.cCount;
                          }
                          // this.receiptService.subscribeGetReceipt(this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, this.cartCheckoutService.loginResponse, paymentType);

                          if (!this.receiptService.result) {
                            //console.log("About to get the receipt")
                            this.subscription =
                              this.receiptService.getReceiptMod(this.cartCheckoutService.saleTransactionResponse.cartResults[i].confirmationNumber, this.cartCheckoutService.loginResponse, paymentType)
                                .subscribe(
                                  data => {
                                    // newJwt = data.headers;
                                    this.receiptService.receiptDetail = data;
                                    this.receiptService.result = true;
                                  },
                                  error => {
                                    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                                    this.receiptService.showReceipt = false;
                                  },
                                  () => {
                                    this.receiptService.transactions.push(this.receiptService.receiptDetail);
                                    //console.log('transactions Length', this.transactions.length);
                                    //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
                                    if (this.receiptService.result == true && this.receiptService.transactions.length === this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                                      //console.log("Show receipt now: ", this.result)

                                      this.receiptService.receiptUpdate.emit(true);
                                      this.receiptService.processedPayment.emit(true);
                                      this.receiptService.showReceipt = this.receiptService.result;
                                      this.showReceipt = this.receiptService.showReceipt;
                                      // console.log("Show receipt now: ", this.showReceipt )
                                      this.cartCheckoutService.saleTransactionResponse.cartResults = [];
                                    }

                                    if (this.receiptService.receiptDetail && this.receiptService.receiptDetail.areas[0]['area'] == 'USERFEE') {
                                      this.receiptService.receiptDetail['convenienceFee'] = 0;
                                      this.receiptService.receiptDetail['totalAmount'] = this.receiptService.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
                                    }


                                    // console.log("What district is getting the Receipt: ", loginResponse);
                                    this.multiDistrictSvc.processedDistrict = this.cartCheckoutService.loginResponse.districtName;
                                    //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);

                                  });
                          }



                        }
                        if (!this.receiptService.refreshDash) {
                          if (this.loginResponse) {
                            this.loginResponse.cartItemCount = 0;
                            this.loginStoreSrvc.loadLogin(this.loginResponse);
                            this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                            //  console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                            this.store.dispatch(new CartStoreActions.ClearCart());
                          } else {
                            this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                            // console.log("After Receipt Closes LoginResponse: ", this.loginResponse);
                            this.loginResponse.cartItemCount = 0;
                            this.loginStoreSrvc.loadLogin(this.loginResponse);
                            //After setting cartItemCount want to get the updated cookieStateItem
                            this.loginResponse = this.loginStoreSrvc.cookieStateItem;
                            // console.log("After Receipt Closes Ow what is LoginResponse: ", this.loginResponse);
                            this.store.dispatch(new CartStoreActions.ClearCart());
                          }
                          this.getReceiptCounter++;
                        }

                        //setTimeout(() => {
                        //  if (this.backToDashboardCounter < 1 && this.receiptService.processedPayment) {
                        //    this.pageLoadingService.hide();
                        //    this.cartCheckoutItemsService.cartItem = <CartItem>{};
                        //    //console.log("Going back to DASHBOARD")
                        //    this.router.navigate(['/dashboard']);
                        //    this.cartCheckoutService.cartProcessed.emit(true);
                        //    this.refreshService.refreshCart();
                        //    this.backToDashboardCounter++;
                        //  }
                        //}, 2000)

                      }
                    }, 500)

                  }


                  //Stop
                 
                }
              } else {
                // console.log("We got an error: ", this.selectPaymentErr)
                if (this.cartCheckoutService.loginResponse.status === '409') {

                  this.cartCheckoutService.result = false;
                  // console.log("About subscribeTopostCartCheckoutReviewItems - ReviewCart3")
                  //this.cartCheckoutItemsService.subscribeTopostCartCheckoutReviewItems(this.loginResponse);
                  //setTimeout(() => {
                  //  // console.log("We got a new checkout Summary:  ", this.cartCheckoutItemsService.checkOutItem)
                  //  this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
                  //  this.cartCheckoutService.loginResponse.status = '';
                  //  this.prepareToPay();
                  //}, 1000)

                  this.cartCheckoutItemsService.postCartCheckoutReviewItemsNew(this.loginResponse)
                    .subscribe(
                      data => {
                        this.cartCheckoutItemsService.checkOutItem = data;
                      },
                      error => {
                        // console.log("Error: No Checkout Item: ", this.checkOutItem);
                        if (this.cartCheckoutItemsService.checkOutItem) {
                          this.loginStoreSrvc.loadLogin(this.loginResponse);
                          this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                          this.cartCheckoutItemsService.checkoutResults = true;
                          this.cartCheckoutItemsService.cartUpdate.emit(true);
                        } else {
                          this.cartCheckoutItemsService.checkoutResults = false;
                        }

                      },
                      () => {
                        this.loginStoreSrvc.loadLogin(this.loginResponse);
                        // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                        this.cartCheckoutItemsService.isGettingCheckOutItems = this.cartCheckoutItemsService.checkOutItem.merchants.length > 0;
                        this.cartCheckoutItemsService.checkoutResults = true;
                        this.cartCheckoutItemsService.cartUpdate.emit(true);
                        this.validationToken = this.cartCheckoutItemsService.checkOutItem.validationToken;
                        this.cartCheckoutService.loginResponse.status = '';
                        this.prepareToPay();
                       // this.cartCheckoutService.result = true;

                      }
                    )


                  ++this.cartCheckoutService.count;
                } else {
                  ++this.cartCheckoutService.count;
                }
              }//
            } else {
              this.selectPaymentErr = true;
              clearInterval(this.saleInterval);
              this.pageLoadingService.hide();
              this.selectPaymentErrMsg = 'Not Acceptable. Please re-enter Your Payment Information.'
            }



           
          
          }
        )


  }
 }//End of process pay


  ngOnDestroy() {
    if (this.subscriptionSaleT) {
      this.subscriptionSaleT.unsubscribe();
      this.cartCheckoutService.saleTransactionResponse.cartResults = [];
      this.cartCheckoutItemsService.cartItem = this.emptyCartItem;
      this.checkOutItem = this.emptyCheckOutItem;
      this.cartItem = this.cartCheckoutItemsService.cartItem;
    }
    this.backToDashboardCounter = 0;
    this.getReceiptCounter = 0;
  }
}
