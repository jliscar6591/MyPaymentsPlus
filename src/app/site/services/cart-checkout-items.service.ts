import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs'
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../app.state';
//Local
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { CartItem, CartItemDetail, CheckoutItem } from '../model/index';
import { UtilityService, CurrentTokenService, CookieService, LoginStoreService  } from '../../shared/services/index'
import * as CartStoreActions from '../../shared/store/actions/cartStore.actions';

@Injectable()

export class CartCheckoutItemsService {
    //Contains district list
  public cartItem: CartItem;
  public checkOutItem: CheckoutItem;
    //Contains values read in from http call
    public loginResponse: LoginResponseModel;
    //True when http call returns
    public result: boolean = false;
    //Used to count retry 
    public count: number = 0;
    //Used to let other components know when cart is updated
    public cartUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
    //Used to let other components know when cart is valid
  public cartValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  public currentToken: string;
  public isGettingCheckOutItems: boolean;
  public checkoutResults: boolean;
  public cartResults: boolean;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public updateCart$: any;
  public newCartItem$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public cartStore: Observable<CartItem>;
  public cartState: any;
  public cartStateItems: CartItem;
  public subscription: Subscription;

    constructor(
        //private http: Http,
      private utilityService: UtilityService,
      private currTokenServ: CurrentTokenService,
      private httpC: HttpClient,
      private loginStoreSvc: LoginStoreService,
      private store: Store<AppState>,
      private state: State<AppState>
    ) {
      this.cartStore = store.select(state => state.cartStore)
    }

  //Returns a cartCheckoutItem
  //The cartItem will need to be set once the checkoutItem is set
  public postCartCheckoutReviewItemsNew(loginResponse: LoginResponseModel): Observable<any> {
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
    let failureMessage: string = 'Get Cart Checkout Items Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    let Url = Constants.WebApiUrl.Sale + '/checkoutSummary';  // URL to web API
    let body = JSON.stringify([{ "validationToken": '' }]);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.currentToken,
    });


    let options = { headers: headers };
   // console.log("URL: ", Url)
   // console.log("The Body: ", body)
   //console.log("Options: ", options)
 
    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       //  ,
      //  tap(data => console.log("I think we got a CartCheckoutItem: ", data))
      )
  }

  //Returns a checkoutItem
  public subscribeTopostCartCheckoutReviewItems(loginResponse) {
  // console.log("subscribeing to Post Cart Checkout Review Items")
    let loginResponseObj;
    this.isGettingCheckOutItems = true;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.postCartCheckoutReviewItemsNew(loginResponseObj)
      .subscribe(
      data => {
        this.checkOutItem = data;
      },
      error => {
       // console.log("Error: No Checkout Item: ", this.checkOutItem);
        if (this.checkOutItem) {
            this.loginStoreSvc.loadLogin(this.loginResponse);
            this.isGettingCheckOutItems = this.checkOutItem.merchants.length > 0;
            this.checkoutResults = true;
            this.cartUpdate.emit(true);
        } else {
          this.checkoutResults = false;
        }
        
      },
      () => {
        this.loginStoreSvc.loadLogin(this.loginResponse);
       // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
        this.isGettingCheckOutItems = this.checkOutItem.merchants.length > 0;
        this.checkoutResults = true;
        this.cartUpdate.emit(true);
        
      }
     )
  }

  //Returns a Cart Item
  public getCartCheckoutCartItem(loginResponse: LoginResponseModel): Observable<any> {
   // console.log("Did we get a loginResponse: ", loginResponse)
   // console.log("Did we get a accesToken: ", loginResponse.access_token)
   // console.log("Do we have the loginSrvc: ", this.loginStoreSvc.fixedLoginResponse)
    
    if (this.loginStoreSvc.fixedLoginResponse) {
      this.loginResponse = this.loginStoreSvc.fixedLoginResponse;

    } else {
      this.loginResponse = loginResponse;
    }

    let token = this.loginResponse.access_token;
    this.currentToken = token;
   // console.log("this.currentToken: ", this.currentToken)
    let testString = this.currentToken.match(/bearer/);
      if (testString) {
        this.currentToken = this.currentToken;
      } else {
        this.currentToken = 'bearer ' + this.currentToken;
      }

    //console.log("final currentToken: ", this.currentToken)

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse );

    let successMessage: string = '';
    let failureMessage: string = 'Get Student Meals Failed';
    let Url = Constants.WebApiUrl.Sale + '/Cart';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
      //  ,
      //tap(data => console.log("I think we got CartcheckoutCartItems: ", data))
      )
  }

  public subscribeToGetCartCheckoutCartItem(loginResponse) {
    //console.log("subscribeToGetCartcheckoutCartItem")
     let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

   // console.log("The loginResponseObj: ", loginResponseObj);
    this.getCartCheckoutCartItem(loginResponseObj)
      //.takeUntil(this.destroy$)
      .subscribe(
        data => {
          this.cartItem = data;
        },
      error => {
        console.log("Error: No Transfer Account: ", error);
        this.cartResults = false;
      },
          () => {
     
            this.cartResults = true;
            if (this.cartStateItems) {
              this.store.dispatch(new CartStoreActions.ClearCart())
            }
            if (this.cartItem) {
              this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartItem))
              this.cartStore.subscribe(c => this.cartState = c);
             // console.log("do we have a cartItem: ", this.cartState)
              if (this.cartState) {
                this.cartStateItems = this.cartState.data.items;
                //console.log("cartStateItems: ", this.cartStateItems)
              }
          }

          }
      )
  }

  public updateCartCheckoutItemsNew(cartItems: CartItemDetail[], loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = 'Updating Cart Failed';
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    var errHeader: any = {
      _body: '',
      status: ''
    }

    let Url = Constants.WebApiUrl.Sale + '/Cart';
    let body = JSON.stringify(cartItems)
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.put(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
          //,
          //tap(data => console.log("I think we got CartcheckoutCartItems: ", data))
      )
  }

  public subscribeToUpdateCartCheckOutItemsNew(cartItems: CartItemDetail[], loginResponse: LoginResponseModel) {
    //console.log("subscribeToUpdateCartCheckoutItem: ", cartItems)
    let loginResponseObj;
    let failureMessage: string = 'Updating Cart Failed';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }
    this.updateCart$ = this.updateCartCheckoutItemsNew(cartItems, loginResponse)
                      .subscribe(
                        data => {
                          this.cartItem = data;
                        },
                        error => {
                          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                          this.cartResults = true;
                        },
                        () => {
                          //processing the successful response
                          this.cartResults = true;
                          this.cartUpdate.emit(true);
                          this.newCartItem$.emit(true);
                        });
  }

  public cartValidity(valid: boolean) {
      //console.log("calling cartValidity")
           this.cartValid.emit(valid);
    }

  handleError(error, failureMessage) {
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
   console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
