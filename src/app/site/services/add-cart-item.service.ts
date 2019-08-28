import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CartItemDetail, CartItem, CartResponse } from '../model/index';
import { UtilityService, CurrentTokenService, CookieService, TokenService, LoginStoreService } from '../../shared/services/index'
import { StudentMeal, MealAccount } from '../model/index';
import { FeeCartDetail, FeeCartItem } from 'app/site/model/fee-cart-detail.model';
import { FeeCartResponse } from 'app/site/model/fee-cart-response-item.model';
import { FeeItems, FeesList } from 'app/site/model/fees.model';
import { FeesDetailsComponent } from 'app/site/dashboard/fees/fees-details.component';
import { RefreshService } from '../../shared/services/refresh.service';
import { Activities } from 'app/site/model/activities.model';
import { ActivityCartDetail } from 'app/site/model/activity-cart-detail.model';

@Injectable()

export class AddCartItemService implements OnDestroy {
  public cartResponse: CartResponse;
  public feeCartResponse: CartResponse;
  //Contains values read in from http call
  public loginResponse: LoginResponseModel;
  //True when http call returns
  public result: boolean = false;
  //Used to count retry 
  public count: number = 0;
  //Used to let other components know when cart is updated
  public cartUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  public broadCastDetail;
  public currentToken: string;
  public itemRemoved: boolean = false;
  private subscription: Subscription;
  public deleteResult: boolean = false;
  public addedToCart: boolean = false;
  public cartGroupDetail: any;
  public feeDialog: boolean = false;

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private httpC: HttpClient,
    private currTokenServ: CurrentTokenService,
    private cookieService: CookieService,
    private refreshService: RefreshService,
    private tokenService: TokenService,
    private loginStoreSvc: LoginStoreService,

  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  ////Creates a Meal Item to be added to the cart
  private preProcessAddAmount(cartItem: MealAccount, accountBalanceID: string, studentName: string) {
    let cartItemDetail: CartItemDetail = {
      liteItemType: Constants.CartItemDefaults.liteItemType,
      itemKey: null,
      districtKey: this.loginResponse.districtKey,
      accountBalanceID: accountBalanceID,
      itemName: cartItem.categoryName,
      itemAmount: parseFloat(cartItem.addAmount),
      amountInCart: parseFloat(cartItem.addAmount),
      mealCategoryKey: cartItem.categoryKey,
      studentName: studentName,
      extendedAmount: 0,
      netAmount: 0,
      categoryName: cartItem.categoryName,
      bonusAmount: 5,
      minimumPayment: null,
      isPartialPayEligible: null,
      quantity: null,
      isQuantity: null,
      formResponse: null,
      activityFormId: null,
      s3UriFull: null,
      s3URIThumb: null,
      isAutoEnrolled: null,
      amountRemaining: null
    }
    this.broadCastCartItem(cartItemDetail);
    return cartItemDetail;
  }

  //Emits the CartItemDetail to SiteHome to help track changes to the cart count
  public broadCastCartItem(cartItemDetail) {
    this.broadCastDetail = cartItemDetail
    return this.broadCastDetail;
  }

  //Creates a FeeItem to be added to the cart
  private preProcessAddFeeAmount(cartItem: FeeItems, studentKey: string, name: string) {
    //console.log('is this being called');
    let cartFeeDetail: FeeCartDetail = {
      liteItemType: 'fee',
      itemKey: cartItem.feeTransactionKey,
      districtKey: this.loginResponse.districtKey,
      accountBalanceID: studentKey,
      itemName: cartItem.feeName,
      itemAmount: cartItem.amount,
      amountInCart: cartItem.amountInCart,
      amountToPay: cartItem.amount - cartItem.amountInCart,
      studentName: name,
      isPartialPayEligible: cartItem.supportsPartialPay,
      partialPayDue: cartItem.partialPayDue,
      minimumPayment: cartItem.minimumPayment

    }
    this.broadCastCartFeeItem(cartFeeDetail);
    return cartFeeDetail;
  }

  public broadCastCartFeeItem(cartFeeDetail) {
    this.broadCastDetail = cartFeeDetail
    return this.broadCastDetail;
  }

  private preProcessActivityAddAmount(cartItem: Activities, studentKey: string, studentName: string) {
    let cartActivityDetail: ActivityCartDetail = {
      liteItemType: 'activity',
      itemKey: cartItem.activityKey,
      districtKey: this.loginResponse.districtKey,
      accountBalanceID: cartItem.studentKey,
      itemName: cartItem.activityName,
      itemAmount: cartItem.amount,
      studentName: cartItem.studentName,
      isPartialPayEligible: cartItem.isPartialPay,
      partialPayDue: cartItem.partialPayDue,
      minimumPayment: cartItem.minimumPayment,
      amountInCart: cartItem.amountInCart,
      quantity: cartItem.quantity,
      formResponse: cartItem.formResponse,
      activityFormId: cartItem.activityFormId,
    }
    this.broadCastCartActivityItem(cartActivityDetail);
    return cartActivityDetail;
  }

  public broadCastCartActivityItem(cartActivityDetail) {
    this.broadCastDetail = cartActivityDetail
    return this.broadCastDetail;
  }


  public putCartItemNew(account: StudentMeal, params: any, loginResponse: LoginResponseModel): Observable<any> {
    //console.log("Putting Cart in Item: ", loginResponse)
    let i = params.outsideIndex;
    let j = params.insideIndex;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Add Cart Item Failed';
    var errHeader: any = {
      _body: '',
      status: ''
    }
    //Map to add cart Put signature
    let cartItemDetail: CartItemDetail = this.preProcessAddAmount(
      account[i].mealAccounts[j],
      account[i].accountBalanceID,
      account[i].firstName
    )

    let token = loginResponse.access_token;
    this.currentToken = this.tokenService.getCurrentToken(token);


    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Sale + '/CartItem';
    let body = JSON.stringify(cartItemDetail);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };

    //console.log("The Url: ", Url)
    //console.log("Da Body: ", body)
    //console.log("Options: ", options)


    return this.httpC.put(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       ,
        tap(data => this.cartResponse = data)
      )
  }

  //called by Fee details when you add a fee to cart
  public putCartFeeNew(account: FeesList, params: any, loginResponse: LoginResponseModel): Observable<any> {
    let newJwt: any;
    let i = params.outsideIndex;
    let j = params.insideIndex;
    this.loginResponse = loginResponse;
    //Map to add cart Put signature
    let cartFeeDetail: any = this.preProcessAddFeeAmount(
      account.fees[j],
      account.studentKey,
      account.name
    )

    //console.log('cart fee detail ', cartFeeDetail);
    let token = this.loginResponse.access_token;
    let successMessage: string = '';
    let failureMessage: string = 'Add Cart Item Failed';
    var errHeader: any = {
      _body: '',
      status: ''
    }
    let Url = Constants.WebApiUrl.Sale + '/CartItem';
    let body = JSON.stringify(cartFeeDetail);
    let headers = new Headers({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };
    this.http.put(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.cartResponse = data.json();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.cartItemCount = this.cartResponse.itemCount;
          this.count = this.loginResponse.cartItemCount;
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.messageTitle = 'Message: ';
          this.loginResponse.message = successMessage;
          this.result = true;
          this.cartUpdate.emit(true);
          //console.log('cartResponse', this.cartResponse);
        }
      );
    return Observable.interval(Constants.PollingInterval)
  }

  public putCartActivityNew(account: Activities, loginResponse: LoginResponseModel): Observable<any> {
    // console.log('account', account);
    // console.log('is in cart', account.isInCart);
    // account.amountInCart = account.amount;
    if (!account.isInCart) {
      //console.log("Putting Activity in cart")
      this.loginResponse = loginResponse;
      let cartActivityDetail: ActivityCartDetail = this.preProcessActivityAddAmount(
        account,
        account.studentKey,
        account.studentName
      )

      let token = loginResponse.access_token;
      this.currentToken = token;
      let successMessage: string = '';
      let failureMessage: string = 'Add Cart Item Failed';
      var errHeader: any = {
        _body: '',
        status: ''
      }

      this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
      let Url = Constants.WebApiUrl.Sale + '/CartItem';
      let body = JSON.stringify(cartActivityDetail);
      let headers = new HttpHeaders({
        'Content-Type': 'application/JSON',
        'Authorization': 'bearer ' + token
      });

      let options = { headers: headers };
      return this.httpC.put<any>(Url, body, options)
        .pipe(
          catchError((error: any) => this.handleError(error, failureMessage))
          ,
          tap(data => this.cartResponse = data)

        )
    } else {
      //console.log("Putting Activity in cart")
      this.loginResponse = loginResponse;
      let cartActivityDetail: ActivityCartDetail = this.preProcessActivityAddAmount(
        account,
        account.studentKey,
        account.studentName
      )

      let token = loginResponse.access_token;
      this.currentToken = token;
      let successMessage: string = '';
      let failureMessage: string = 'Add Cart Item Failed';
      var errHeader: any = {
        _body: '',
        status: ''
      }

      this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
      let Url = Constants.WebApiUrl.Sale + '/CartItem';
      let body = JSON.stringify(cartActivityDetail);
      //console.log('body on activity api call', body);
      let headers = new HttpHeaders({
        'Content-Type': 'application/JSON',
        'Authorization': 'bearer ' + token
      });

      let options = { headers: headers };
      return this.httpC.put<any>(Url, body, options)
        .pipe(
          catchError((error: any) => this.handleError(error, failureMessage))
          ,
          map(data => {
            if (!data) {
              console.log("NO item Added: ", data);
            }
          })
          ,
          tap(data => this.cartResponse = data)
      )

        
    }
  }

  //Add multiple items at once to cart
  public putCartGroupNew(group: any, loginResponse: LoginResponseModel): Observable<any> {
    let newJwt: any;
    //console.log('group', group);
    this.cartGroupDetail = [];
    //console.log("Putting Group in cart")
    this.loginResponse = loginResponse;
    var i;
    for (i = 0; i < group.length; i++) {
      if (group[i].feeTransactionKey) {
        let cartFeeDetail: any = this.preProcessAddFeeAmount(
          group[i],
          group[i].studentKey,
          group[i].name
        )
        if (cartFeeDetail !== undefined) {
          this.cartGroupDetail.push(cartFeeDetail);
        }
      } else if (group[i].activityKey) {
        let cartActivityDetail: any = this.preProcessActivityAddAmount(
          group[i],
          group[i].studentKey,
          group[i].studentName
        )
        if (cartActivityDetail !== undefined) {
          cartActivityDetail.formResponse = [];
          this.cartGroupDetail.push(cartActivityDetail)
        }
      }
    }
    //console.log('cartGroupDetail', this.cartGroupDetail);
    let token = loginResponse.access_token;
    this.currentToken = token;
    let successMessage: string = '';
    let failureMessage: string = 'Add Cart Item Failed';
    var errHeader: any = {
      _body: '',
      status: ''
    }

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Sale + '/Cart';
    let body = JSON.stringify(this.cartGroupDetail);
    //console.log('body on activity api call', body);
    let headers = new Headers({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };
    this.http.post(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.cartResponse = data.json();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.cartItemCount = this.cartResponse.itemCount;
          this.count = this.loginResponse.cartItemCount;
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.messageTitle = 'Message: ';
          this.loginResponse.message = successMessage;
          this.result = true;
          //console.log('cartResponse', this.cartResponse);
        }
      )
    return Observable.interval(Constants.PollingInterval)
  }

  public subscribeToPostCartGroup(group: any, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Transaction Failed';
    if (this.result === true) {
      this.result = false;
    }
    this.subscription =
      this.putCartGroupNew(group, loginResponse)
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
            this.count = this.loginResponse.cartItemCount;
            this.result = true;
            //console.log("The this.addCartItemService.result is: ", this.result);
            //console.log('cartResponse', this.cartResponse);
          }
        )
  }

  public deleteCartItemNew(itemKey: string, accountBalanceId: string, loginResponse: LoginResponseModel): Observable<any> {
    let newJwt: any;
    //console.log("Delete Cart Item New")
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Remove Cart Item Failed';
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }
    var errHeader: any = {
      _body: '',
      status: ''
    }

    let Url = Constants.WebApiUrl.Sale + '/CartItem/Delete';
    let body = {
      'itemKey': itemKey,
      'accountBalanceId': accountBalanceId
    }
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    //console.log('url for api', Url);
    //console.log('body for delete', body);
    let headers = new Headers({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };
    this.http.post(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.cartResponse = data.json();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.cartItemCount = this.cartResponse.itemCount;
          this.count = this.loginResponse.cartItemCount;
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.messageTitle = 'Message: ';
          this.loginResponse.message = successMessage;
          this.deleteResult = true;
          this.result = true;
          //this.cartUpdate.emit(true);
          this.itemRemoved = true;
          //console.log('cartResponse', this.cartResponse);
        }
      );
    return Observable.interval(Constants.PollingInterval)
  }

  public subscribeTodeleteCartItemNew(itemKey: string, accountBalanceID: string, loginResponse: LoginResponseModel) {
    let failureMessage: string = 'Transaction Failed';
    if (this.result === true) {
      this.result = false;
    }
    this.subscription =
      this.deleteCartItemNew(itemKey, accountBalanceID, loginResponse)
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
            this.count = this.loginResponse.cartItemCount;
            this.deleteResult = true;
            // console.log("do we have a deleteResult: ", this.deleteResult);
            this.result = true;
            //console.log("The this.addCartItemService.result is: ", this.result);
            this.cartUpdate.emit(true);
            this.itemRemoved = true;
            //console.log('cartResponse', this.cartResponse);
          }
        )
  }



  public putCartFeeItem(cartFeeDetails, loginResponse: LoginResponseModel): Observable<number> {
    // console.log("Put cart Fee Item Details: ", cartFeeDetails);
    this.loginResponse = loginResponse;
    let newJwt: any;
    let token = loginResponse.access_token;
    let successMessage: string = '';
    let failureMessage: string = 'Add Cart Item Failed';
    this.loginResponse = loginResponse;
    var errHeader: any = {
      _body: '',
      status: ''
    }
    let Url = Constants.WebApiUrl.Sale + '/CartItem';
    let body = JSON.stringify(cartFeeDetails);
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    this.http.put(Url, body, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.cartResponse = data.json()
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.cartItemCount = this.cartResponse.itemCount;
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.messageTitle = 'Message: ';
          this.loginResponse.message = successMessage;
          this.result = true;
          this.cartUpdate.emit(true);
        });
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)
  }

  private putTransferFeeItem(cartFeeDetails, loginResponse: LoginResponseModel): Observable<any> {
    //

    // console.log("putTransferFeeItem Login Resp: ", loginResponse);
    let failureMessage: string = 'Add Cart Item Failed';
    let token = loginResponse.access_token;
    this.currentToken = token;
    //console.log("This.CurrentToken: ", this.currentToken);
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    var errHeader: any = {
      _body: '',
      status: ''
    }

    let Url = Constants.WebApiUrl.Sale + '/CartItem';
    let body = JSON.stringify(cartFeeDetails);
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });
    let options = { headers: headers };

    //console.log("URL: ", Url)
    // console.log("CartItem Body: ", body)
    //console.log("Options: ", options)

    return this.httpC.put(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //  ,
        // tap(data => console.log("I think we added a Cart Item: ", data))
      )


  }

  public subscribeToPutTransferFee(cartFeeDetails, loginResponse) {
    let loginResponseObj;
    let successMessage: string = '';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.putTransferFeeItem(cartFeeDetails, loginResponseObj)
      .subscribe(
        data => {
          this.cartResponse = data;
          this.feeCartResponse = data;
        },
        error => {
          //console.log("Error: Failed to Add Item: ", this.feeCartResponse);
          this.result = true;
        },
        () => {
          loginResponseObj.cartItemCount = this.feeCartResponse.itemCount;
          loginResponseObj.messageType = Constants.Success;
          loginResponseObj.messageTitle = 'Message: ';
          loginResponseObj.message = successMessage;
          this.loginResponse = loginResponseObj;
          this.loginStoreSvc.loadLogin(this.loginResponse)
          // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
          this.result = true;
          this.cartUpdate.emit(true);
        }

      )


  }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
    console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
