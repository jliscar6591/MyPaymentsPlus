import { Injectable, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Constants } from '../../../app.settings';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import 'rxjs/add/observable/interval';

import { CartCheckoutItemsService, CartCheckoutService, TransfersService, StudentMealsService, MultiDistrictService } from '../../../site/services/index';
import { SaleTransaction } from '../../../site/model/index';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItem } from '../../../site/model/index';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { UtilityService,TokenService, CurrentTokenService } from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service';
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as CartStoreActions from '../../store/actions/cartStore.actions';

//Local
import { ReceiptModel, Areas, Students, Items } from '../../model/index';

@Injectable()
export class ReceiptService implements OnDestroy {
  //show receipt flag
  public showReceipt: boolean = false;
  //True when http call returns
  public result: boolean = false;
  //Receipt values
  public receiptDetail: ReceiptModel;
  public transactions: any = [];
  public areas: Areas;
  public students: Students;
  public items: Items;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  public receiptUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  private subscription: ISubscription;
  public clearCart: boolean = false;
  public howManyClearCarts: number = 0;
  public paymentType: string;
  public receiptType: string;
  public currentToken: string;
  public processedPayment: EventEmitter<boolean> = new EventEmitter<boolean>();
  public refreshDash: boolean = false;
  public cartStore: Observable<CartItem>;



  constructor(
    private router: Router,
    private http: Http,
    private utilityService: UtilityService,
    public cartCheckoutService: CartCheckoutService,
    public cartCheckoutItemsService: CartCheckoutItemsService,
    private transferService: TransfersService,
    private currTokenServ: CurrentTokenService,
    private tokenService: TokenService,
    public zone: NgZone,
    private httpC: HttpClient,
    public studentMealsService: StudentMealsService,
    public multiDistrictSvc: MultiDistrictService,
    private pageLoadingService: PageLoadingService,
    private refreshService: RefreshService,
    public store: Store<AppState>,
  ) { this.cartStore = store.select(state => state.cartStore) }


  getReceiptMod(confirmation: any, loginResponse: LoginResponseModel, paymentType: any): Observable<any> {
    // console.log("Getting Receipt: ", loginResponse)
    this.receiptType = 'purchase';
    //Confirmation number is the same per transaction, just need the first one in the list
    let token = loginResponse.access_token;
    // console.log("Receipt Data token: ", token)
    this.currentToken = this.tokenService.getCurrentToken(token);
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmation;

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });
    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //,
       // tap(data => console.log("We got Receipt Data: ", data))
       
        // map(data => testJwt = data['headers']),
        //tap(testJwt => console.log("Did we get any testJWt: ", testJwt))
      )
  }

  subscribeGetReceipt(confirmation: any, loginResponse: LoginResponseModel, paymentType: any) {
    let failureMessage: string = 'Transaction Failed';
    if (!this.result) {
      this.subscription =
        this.getReceiptMod(confirmation, loginResponse, paymentType)
          .subscribe(
            data => {
              // newJwt = data.headers;
              this.receiptDetail = data;
              this.result = true;
            },
            error => {
              this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
              this.showReceipt = false;
            },
            () => {
              this.transactions.push(this.receiptDetail);
              //console.log('transactions Length', this.transactions.length);
              //console.log("CartResults length: ", this.cartCheckoutService.saleTransactionResponse.cartResults.length)
              if (this.result == true && this.transactions.length === this.cartCheckoutService.saleTransactionResponse.cartResults.length) {
                //console.log("Show receipt now: ", this.result)
                
                this.receiptUpdate.emit(true);
                this.processedPayment.emit(true);
                this.showReceipt = this.result;
              this.cartCheckoutService.saleTransactionResponse.cartResults = [];
              }

              if (this.receiptDetail && this.receiptDetail.areas[0]['area'] == 'USERFEE') {
                this.receiptDetail['convenienceFee'] = 0;
                this.receiptDetail['totalAmount'] = this.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
              }

             
              // console.log("What district is getting the Receipt: ", loginResponse);
              this.multiDistrictSvc.processedDistrict = loginResponse.districtName;
              //  console.log("The Processed District: ", this.multiDistrictSvc.processedDistrict);

            });
    }

  }


  getHistoryReceiptMod(confirmation: any, loginResponse: LoginResponseModel): Observable<any> {
    this.receiptType = 'history';
    this.receiptUpdate.emit(true);
    let confirmNum = confirmation;
    this.showReceipt = true;
    //Confirmation number is the same per transaction, just need the first one in the list

    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmNum;
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });
    let options = { headers: headers };
    newJwt = headers.get('Authorization');
    this.loginResponse.access_token = newJwt;
    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
      //  ,
       // tap(data => console.log("We got Receipt Data: ", data))

      )

  }


  subscribeToGetHistoryReceipt(confirmation: any, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Record Not Found';
    this.getHistoryReceiptMod(confirmation, loginResponse)
      .subscribe(
        data => {
          this.receiptDetail = data;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
          this.showReceipt = false;
        },
        () => {
          //processing the successful response
          this.result = true;
          this.transactions.push(this.receiptDetail);
         // console.log('receipt details', this.receiptDetail);
          this.showReceipt = true;
          if (this.receiptDetail && this.receiptDetail.areas[0]['area'] == 'USERFEE') {
            this.receiptDetail['convenienceFee'] = 0;
            this.receiptDetail['totalAmount'] = this.receiptDetail.areas[0]['students'][0].items[0].itemAmount;
            this.receiptDetail['bonusTotal'] = 0;
          }
        });
  }


  getHistoryReceipt(confirmation: any, loginResponse: LoginResponseModel): Observable<number> {
    this.receiptType = 'history';
    let confirmNum = confirmation;
    this.showReceipt = true;
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';

    let Url = Constants.WebApiUrl.Sale + '/ReceiptData/' + confirmNum;
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    this.subscription = this.http.get(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.receiptDetail = data.json()
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
          this.showReceipt = false;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0]
          this.result = true;
          if (this.result == true) {
            this.receiptUpdate.emit(this.showReceipt);
          }

        });

    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)
  }

  public displayReceipt(): boolean {
    return this.showReceipt;
  }
  public displayHistoryReceipt(): boolean {
    return this.showReceipt;
  }

  public hide(): boolean {
    //console.log("Go hide");

    //If the receipt was generated by a transfer we need to change the liteItemType so all other payments process correctly

    //This may be revisited as we begin to process other types of fees and payments
    if (this.transferService.feeCartItem) {
      if (this.transferService.feeCartItem.liteItemType == 'userFee') {
        this.transferService.feeCartItem['liteItemType'] = 'meal';
        this.transferService.feeCartCount = 0;
      }
    }
    this.showReceipt = false;
    //If a checkout has processed a clear cart event has occured
    if (this.cartCheckoutService.result == true) {
      this.cartCheckoutService.result = false;
      this.clearCart = true;
      this.howManyClearCarts += 1;
    } else {
      this.cartHasCleared();
      this.howManyClearCarts = 0;
    }

    //  this.studentMealsService.subscribeToGetMeals(this.loginResponse);
    if (!this.refreshDash) {
      this.store.dispatch(new CartStoreActions.ClearCart());
    }
      this.store.dispatch(new CartStoreActions.ClearCart());
      this.refreshService.refreshCart();

    //console.log('going to dashboard')
    this.router.navigate(['/dashboard']);

    return this.showReceipt;

  }

  public hideHistory(): boolean {
    //console.log("Go hide");

    //If the receipt was generated by a transfer we need to change the liteItemType so all other payments process correctly

    //This may be revisited as we begin to process other types of fees and payments
    if (this.transferService.feeCartItem) {
      if (this.transferService.feeCartItem.liteItemType == 'userFee') {
        this.transferService.feeCartItem['liteItemType'] = 'meal';
        this.transferService.feeCartCount = 0;
      }
    }
    this.showReceipt = false;
    //If a checkout has processed a clear cart event has occured
    if (this.cartCheckoutService.result == true) {
      this.cartCheckoutService.result = false;
      this.clearCart = true;
      this.howManyClearCarts += 1;
    } else {
      this.cartHasCleared();
      this.howManyClearCarts = 0;
    }

    //  this.studentMealsService.subscribeToGetMeals(this.loginResponse);
    if (!this.refreshDash) {
      this.store.dispatch(new CartStoreActions.ClearCart());
    }
      this.store.dispatch(new CartStoreActions.ClearCart());
      this.refreshService.refreshCart();

    return this.showReceipt;

  }

  public cartHasCleared() {

    this.clearCart = true;
    this.result = false;
    return this.clearCart;
  }

  getReceiptUpdateEvent() {
    return this.receiptUpdate;
  }

  goToMakeTransfer() {
    this.zone.run(() => this.router.navigate(['/make-transfer']));
    this.paymentType = null;

  }

  openTabReceipt(html) {
    // console.log("did we get any HTML: ", html)
  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.cartCheckoutItemsService.destroy$.next(true);
    this.cartCheckoutItemsService.destroy$.unsubscribe();
    this.result = false;
    this.clearCart = false;


  }
}
