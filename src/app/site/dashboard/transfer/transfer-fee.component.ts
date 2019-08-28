import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TransfersService, CartCheckoutItemsService } from '../../services/index';
import { LoginResponseModel } from '../../../login/model/index';
import { TransferStatus, UserFeeItem, TransferAccount, TransferUser, CartResponse, CartItem } from '../../model/index';
import { ReceiptService } from '../../../shared/components/receipt/receipt.service';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';

import { Constants } from '../../../app.settings';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions'


@Component({
  selector: 'app-transfer-fee',
  templateUrl: './transfer-fee.component.html',
  styleUrls: ['./transfer-fee.component.less']
})
export class TransferFeeComponent implements OnInit {

  constructor(private router: Router,
    private transferService: TransfersService,
    private validateCookie: ValidateCookieService,
    private cartCheckoutItmServc: CartCheckoutItemsService,
    private receiptService: ReceiptService,
    private utilityService: UtilityService,
    private cookieService: CookieService,
    private messageProcessorService: MessageProcessorService,
    private loginStoreSrvc: LoginStoreService,
    private store: Store<AppState>,
    private state: State<AppState>

  ) { this.cartStore = store.select(state => state.cartStore); }

  @Output() addCartItemDesktop: EventEmitter<any> = new EventEmitter<any>();

  private loginResponse: LoginResponseModel = this.loginStoreSrvc.cookieStateItem;
  //this.validateCookie.validateCookie();

  public hasPaidTransFee: boolean;
  public feeExpiresDate: any;
  public isValid: boolean;
  public accpetFee: boolean;
  public transferAccount: TransferAccount;
  public transferUserObj: any;
  private getTransferErr: boolean = false;
  private getTransferErrMsg: string;
  private hasTransferInfo: boolean = true;
  public transferFeePrice: UserFeeItem;
  public xFerAccountInfo: any;
  public guestAccount: TransferAccount;
  public gAccountInfo: any;
  public testAccount: any;
  private checkCartResults: any;
  private stopChecking: boolean = false;
  public cartCallCount: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public tempCartState: any;
  public cartFeeInterval: any;
  public throwTransferFeeError: boolean = false;

  ngOnInit() {
    this.hasPaidTransFee = true;
    this.isValid = false;
    this.throwTransferFeeError = false;
    this.setExpirationDate();
    this.getGuestAccoount();
    this.getTransferUserInfo();
    this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.loginResponse);


  }

  //ngDoCheck() {
  //  if (this.cartCheckoutItmServc.cartResults && this.stopChecking == false ) {

  //    this.stopChecking = true;
  //  }
  //}

  getGuestAccoount() {
    //console.log("Calling 65 Guest Account"); 
    this.transferService.subscribeTogetTransferAccount(this.loginResponse);
  }

  btnClick() {
    this.router.navigateByUrl('/dashboard');
  }



  isTransferPaid(): boolean {
    if (this.hasPaidTransFee === true) {
      return false;
    } else {
      return true;
    }

  }

  setExpirationDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear() + 1;

    //Sets the expiration date back one day if the current date is 02/29/XXXX of a leap year
    if (dd == 29 && mm == 2) {
      dd = dd - 1;
    }

    if (dd < 10) {
      let x = '0' + dd;
      dd = parseInt(x);
    }

    if (mm < 10) {
      let x = '0' + mm;
      mm = parseInt(x);
    }

    this.feeExpiresDate = mm + '/' + dd + '/' + yyyy;

    return this.feeExpiresDate;
  }

  feeAccepted() {
    // console.log("You accepted the fee");

    if (this.isValid == true) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
    if (this.receiptService.howManyClearCarts = 1) {
      this.receiptService.howManyClearCarts = 0;
    }
    console.log(this.cartCheckoutItmServc.cartItem.items.length);
    console.log(this.throwTransferFeeError);
    if (this.cartCheckoutItmServc.cartItem.items.length > 0 && this.throwTransferFeeError === false) {
      console.log('does this happen when i click the3 yes button')
      this.throwTransferFeeError = true;
    } else if (this.throwTransferFeeError === true) {
      console.log('does this happen when i click the yes button')
      this.throwTransferFeeError = false;
      this.transferService.addFeeToCart(this.transferService.transferAccount, this.transferService.districtXferFeeObj);
      this.updateCart();
      if (this.transferService.feeCartItem) {
        this.cartFeeInterval = window.setInterval(() => {
          if (this.transferService.transferFeeCartItem) {
            this.cartStore.subscribe(c => this.tempCartState = c);
            if (this.tempCartState) {
              this.cartState = this.tempCartState.data;
              if (this.cartState && !this.cartState.items) {
                let temptState;
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.transferService.transferFeeCartItem))
                this.cartStore.subscribe(c => this.cartState = c);
                temptState = this.cartState;
                this.transferService.transferFeeCartItem = temptState.data;
              }
            } else {
              let temptState;
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.transferService.transferFeeCartItem))
              this.cartStore.subscribe(c => this.cartState = c);
              temptState = this.cartState;
              this.transferService.transferFeeCartItem = temptState.data;
            }
          } else {
            let temptState: any;
            this.cartStore.subscribe(c => this.cartState = c);
            if (this.cartState) {
              temptState = this.cartState;
              this.transferService.transferFeeCartItem = temptState.data;
            }
          }
          window.clearInterval(this.cartFeeInterval);
        }, 2000);


      }

    } else if (this.cartCheckoutItmServc.cartItem.items.length === 0 && this.throwTransferFeeError === false) {
      console.log('does this happen when i click the yes button')
      this.throwTransferFeeError = false;
      this.transferService.addFeeToCart(this.transferService.transferAccount, this.transferService.districtXferFeeObj);
      this.updateCart();
      if (this.transferService.feeCartItem) {
        this.cartFeeInterval = window.setInterval(() => {
          if (this.transferService.transferFeeCartItem) {
            this.cartStore.subscribe(c => this.tempCartState = c);
            if (this.tempCartState) {
              this.cartState = this.tempCartState.data;
              if (this.cartState && !this.cartState.items) {
                let temptState;
                this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.transferService.transferFeeCartItem))
                this.cartStore.subscribe(c => this.cartState = c);
                temptState = this.cartState;
                this.transferService.transferFeeCartItem = temptState.data;
              }
            } else {
              let temptState;
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.transferService.transferFeeCartItem))
              this.cartStore.subscribe(c => this.cartState = c);
              temptState = this.cartState;
              this.transferService.transferFeeCartItem = temptState.data;
            }
          } else {
            let temptState: any;
            this.cartStore.subscribe(c => this.cartState = c);
            if (this.cartState) {
              temptState = this.cartState;
              this.transferService.transferFeeCartItem = temptState.data;
            }
          }
          window.clearInterval(this.cartFeeInterval);
        }, 2000);


      }

      return this.isValid;
    }
  }

  updateCart() {
    this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.transferService.requestLogModel);
    this.goCheckout();


  }

  goCheckout() {
    // console.log("GO Go checkout");
    let i = this.transferService.feeIndex;
    let j = this.transferService.feeIndex;
    this.addCartItemDesktop.emit({
      valid: true,
      outsideIndex: i,
      insideIndex: j
    });

    this.loginResponse.cartItemCount = 1;
    this.cartCheckoutItmServc.subscribeToGetCartCheckoutCartItem(this.transferService.requestLogModel);
    this.cartCheckoutItmServc.subscribeTopostCartCheckoutReviewItems(this.transferService.requestLogModel);
    this.hasPaidTransFee = this.isTransferPaid();

    this.checkCartResults = window.setInterval(() => this.goToCheckOut(), 3000);




  }

  goToCheckOut() {
    if (this.cartCheckoutItmServc.cartResults) {
      window.clearInterval(this.checkCartResults);
      this.router.navigate(['/checkout']);

    }
  }

  //Retrieves the User Transfer Fee Info and sets the transferFee price
  getTransferUserInfo(): any {
    this.transferService.subscribeTogetTransferUserFee(this.loginResponse);
    let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
    seconds.subscribe(
      x => {
        if (x == 1) {
          this.xFerAccountInfo = this.transferService.districtXferFeeObj;
          if (this.xFerAccountInfo) {
            this.transferFeePrice = this.xFerAccountInfo.price;
          }
        }

      }
    );
  }

  getGuestAccount(): any {
    //console.log("Calling 207 Gurest Account");
    let subscription = this.transferService.getTransferAccount(this.loginResponse)
      .subscribe(() => {
        if (this.transferService.result == true) {
          subscription.unsubscribe();
          if (this.transferService.loginResponse.messageType === Constants.Error) {
            this.getTransferErrMsg = this.transferService.loginResponse.message;
            this.getTransferErr = true;
            this.utilityService.clearErrorMessage(this.transferService.loginResponse);
          } else {
            this.loginStoreSrvc.loadLogin(this.transferService.loginResponse);
            // this.cookieService.putObject(Constants.AuthCookieName, this.transferService.loginResponse);
            if (this.transferService.availableAccount == undefined) {
              this.hasTransferInfo = false;
            } else if (this.transferService.availableAccount) {
              //   let gAccountTest = this.transferService.availableAccount;
              this.hasTransferInfo = true;
            }

            let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
            seconds.subscribe(
              x => {
                if (x == 1) {
                  this.hasPaidTransFee = false;
                }
                this.guestAccount = this.transferService.availableAccount;

              });


          }
        }
      });
  }

  ngOnDestroy() {
    this.stopChecking = false;
  }


}
