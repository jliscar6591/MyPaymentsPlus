import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  SubscriptionLike as ISubscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import "rxjs/add/operator/do";
import 'rxjs/add/observable/throw'
import { catchError, map, tap } from 'rxjs/operators';
//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CartItemDetail, CartItem, CartResponse, SaleTransactionResponse, StudentMeal, SaleTransaction } from '../model/index';
import { UtilityService, CurrentTokenService, LoginStoreService } from '../../shared/services/index';

@Injectable()

export class CartCheckoutService implements OnDestroy {
    public cartResponse: CartResponse;
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;
    //checkout response
    public saleTransactionResponse: SaleTransactionResponse;
    private subscription: ISubscription;
  public cartProcessed: EventEmitter<boolean> = new EventEmitter<boolean>();
  public currentToken: string;
  public isPayPosted: boolean =  false;
  public postSaleResult: boolean;
  public saleProcessed: EventEmitter<boolean> = new EventEmitter <boolean>();

    constructor(
      private utilityService: UtilityService,
      private httpC: HttpClient,
      private currTokenServ: CurrentTokenService,
      private loginStoreSvc:  LoginStoreService
       // private transferService: TransfersService
    ) { }


  public putCartItemNew(cartItemDetail: CartItemDetail, loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }
      let successMessage: string = '';
      let failureMessage: string = 'Add Cart Item Failed';
      this.loginResponse = loginResponse;
      var errHeader: any = {
        _body: '',
        status: ''
      }
      let Url = Constants.WebApiUrl.Sale + '/CartItem';
      let body = cartItemDetail;
        //JSON.stringify(cartItemDetail);
      this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

      let headers = new HttpHeaders({
        'Content-Type': 'application/JSON',
        'Authorization': this.currentToken
      });

      let options = { headers: headers };

      return this.httpC.put(Url, body, options)
        .pipe(
          catchError((error: any) => this.handlePostSalesError(error, failureMessage))
          // ,
          // tap(data => console.log("What is Put Cart Item: ", data))
         
        )
  }

  public subscribeToputCartItemNew(cartItemDetail: CartItemDetail, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Add Cart Item Failed';
    let successMessage: string = '';
   // console.log("What is the loginResponse sent to putCartItem: ", loginResponse);
   // let subscription =
    this.subscription =
      this.putCartItemNew(cartItemDetail, loginResponse)
        .subscribe(
            data => {
              this.cartResponse = data;
            },
            error => {
              this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
              this.result = false;
            },
            () => {
              //processing the successful response
              this.loginResponse.cartItemCount = this.cartResponse.itemCount;
              this.loginResponse.messageType = Constants.Success;
              this.loginResponse.messageTitle = 'Message: ';
              this.loginResponse.message = successMessage;
              this.result = true;
              //console.log("What is the LoginResponse After putting Item In Cart: ", this.loginResponse);
            }
        )
  }

  public postSaleTransactionNew(payment: SaleTransaction, loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
      if (testString) {
        this.currentToken = this.currentToken;
      } else {
        this.currentToken = 'bearer ' + this.currentToken;
      }

    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Sale + '/saleTransaction';  // URL to web API
    let body = payment;
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    var errHeader: any = {
      _body: '',
      status: ''
    }
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    //Saving for debugging purposes
    //console.log("URL: ",Url)
    //console.log("SaleTransaction Body: ", body)
    //console.log("Options: ", options)
  
    return this.httpC.post(Url, body, options)
      .pipe(
      catchError((error: any) => this.handlePostSalesError(error, failureMessage))
       //  ,
    // tap(data => console.log("What is Post Sale: ", data))
       )
    
  }

  public subscribeToPostSaleTransactionNew(payment: SaleTransaction, loginResponse: LoginResponseModel) {
   // console.log("subscribeToPostSaleTransactionNew - loginResponse: ", loginResponse)
  //  console.log("Do we have a Store Cookie: ", this.loginStoreSvc.cookieStateItem)
    if (loginResponse.cartItemCount == undefined) {
      loginResponse.cartItemCount = 1;
      this.loginStoreSvc.loadLogin(loginResponse);
    }
    
    let failureMessage: string = 'Transaction Failed';
    this.subscription =
    this.postSaleTransactionNew(payment, loginResponse)
      .subscribe(
          data => {
            this.saleTransactionResponse = data;
           },
          error => {
            this.utilityService.processApiErr(error, loginResponse, failureMessage);
            this.postSaleResult = true;
            this.saleProcessed.emit(this.postSaleResult);
          },
      () => {
      //  console.log("Does this call complete: ", loginResponse)
            this.isPayPosted = true;
            this.postSaleResult = true;
        this.saleProcessed.emit(this.postSaleResult);
       //this.subscription.unsubscribe();
          }
     )

  }

    getCartProcessedEvent() {
     // console.log("Get Cart Processed Event: ", this.cartProcessed);
      return this.cartProcessed;
  }

  private handleError(error, failureMessage) {
      this.result = false;
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
  
    return Observable.throwError(this.loginResponse.message);
  }

  private handlePostSalesError(error, failureMessage) {
   //console.log("We got an Error: ", error);
    this.postSaleResult = false;
    this.isPayPosted = false;
    //console.log("Was pay Posted: ", this.isPayPosted);
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);

    return Observable.throwError(this.loginResponse.message);
  }

    ngOnDestroy() {
      this.subscription.unsubscribe;
    }
}
