import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, throwError as _throw, pipe } from 'rxjs';
import 'rxjs/add/observable/interval';
import { catchError, map, tap } from 'rxjs/operators';

//Local
import { Constants } from '../../app.settings';
import { AddCartItemService } from '../../site/services/add-cart-item.service';
import { CartCheckoutService } from '../../site/services/cart-checkout.service'
import { LoginResponseModel } from '../../login/model/index';
import {
  CartItemDetail, CartItem, CartResponse, TransferStatus, TransferHistory, TransferHistoryItem, UserFeeItem,
  TransferAccount, TransferUser, TransferItem, GuestAccount, TransferRequests
} from '../model/index';
import { UtilityService, CurrentTokenService, TokenService, LoginStoreService } from '../../shared/services/index'
import { StudentMeal, MealAccount } from '../model/index';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class TransfersService {
  public mealAccounts;
  public transferFrmObj;
  public transferToObj;
  public loginResponse: LoginResponseModel;
  public availableStatus: any;
  public availableTransfer: any;
  public availableAccount: any;
  //True when http call returns
  public result: boolean = false;
  public transferStatus: TransferStatus;
  public transferUser: TransferUser;
  //Guest Account
  public transferAccount: TransferAccount;
  public transferAmount: number;
  public feeModel: CartItemDetail;
  public feeIndex: number;
  public feeCartItem;
  public studentName;
  public transferOutIndex: number;
  public transferInIndex: number;
  public requestAccount: any;
  public requestLogModel: any;
  public feeCartCount: number = this.setFeeCartCount();
  public cartProcessedEvt: EventEmitter<boolean> = this.cartCheckOutSrvc.cartProcessed;
  public transferHistoryObj: TransferHistory;
  public feeAddedToCart: EventEmitter<boolean> = new EventEmitter<boolean>();
  public userTransferInfo: any;
  public testTransferUserInfo: any;
  public xferCartResponse: any;
  public xferProcessedEvt: EventEmitter<boolean> = new EventEmitter<boolean>();
  public xferRequestItems: any;
  public xferHistoryObj: TransferHistoryItem;
  public guestAcctObj: GuestAccount;
  public postTransferResult: boolean;
  public xferStatusCode: number;
  public gotStautsCode: boolean = false;
  public currentToken: string;
  public hasTransferInfo: boolean;
  public hasPaidTransFee: boolean;
  public districtXferFeeObj: any;
  public xFerFeexPrice: any;
  public isFeeAdded: boolean = false;
  public transferFeeCartItem: any;
  public cartFeeInterval: any;
  public newXferRequestObj: TransferRequests;
  public xferReqResults: boolean;
  public getXferInterval: any;
  public doWeHaveStatus: boolean;
  public xferLinkStatus: any;
  public reply: boolean;
  public pendingTransfer: boolean;
  public isXferFeePaid: boolean;
  public setStatus: boolean = false;
  public gotStatusCodeCount: number = 0;
  public isTransferCallCnt: number = 0;
  private subscription: Subscription;

  constructor(
    private http: Http,
    private utilityService: UtilityService,
    private addCartItemService: AddCartItemService,
    private cartCheckOutSrvc: CartCheckoutService,
    private currTokenServ: CurrentTokenService,
    private tokenService: TokenService,
    private loginStoreSvc: LoginStoreService,
    private httpC: HttpClient
  ) {

  }
  //Gets and formats values for Transfer From Field
  getTransferFrom(studentName: string, category: string, currBalance: number, balanceDate: any, outsideIndex: number, insideIndex: number, fromAccountKey: any, fromCategoryKey: any): any {
    // console.log("You are getting the TransferFrm Object");
    this.transferFrmObj = { 'studentName': studentName, 'category': category, 'currentBal': currBalance, 'balanceDate': balanceDate, 'sourceAccountKey': fromAccountKey, 'sourceCategoryKey': fromCategoryKey };
    this.setIndex(outsideIndex, insideIndex);
    return this.transferFrmObj;
  }
  //Gets and formats selected Transfer to object 
  getTransferTo(studentName: string, category: string, currBalance: number, balanceDate: any, outsideIndex: number, insideIndex: number, toAccountKey: any, toCategoryKey: any): any {
    this.transferToObj = { 'studentName': studentName, 'category': category, 'currentBal': currBalance, 'balanceDate': balanceDate, 'sourceToAccountKey': toAccountKey, 'sourceCategoryKey': toCategoryKey };
    this.setIndex(outsideIndex, insideIndex);
    return this.transferToObj;
  }
  //Checks to see if the district allows transfers
  getTransferStatus(loginResponse: LoginResponseModel): Observable<number> {
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';

    let Url = Constants.WebApiUrl.Xfer + '/Availability';
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    let options = new RequestOptions({ headers: headers });
    this.subscription = this.http.get(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.transferStatus = data.json()
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {
          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.availableStatus = this.transferStatus;
          this.result = true;
        });
        this.subscription.unsubscribe;
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)

  }

  //Checks to see if the district allows transfers
  getTransferStatusNew(loginResponse: LoginResponseModel): Observable<any> {
  //  console.log("about to call Avilability")
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Status Not Found';
    let token = loginResponse.access_token;
    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    let Url = Constants.WebApiUrl.Xfer + '/Availability';
    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
     //,
     // tap(data => console.log('this.transferStatus', data))
      )
  }

  //Component calls this method to subscribe to getTransferStatusNew
  subscribeToGetTransferStatusNew(loginResponse: LoginResponseModel) {
    //console.log("called subscribe to get TransferStatusNew")
    let failureMessage: string = 'Transaction FailedTransfer Status Not Found';
    this.subscription =
      this.getTransferStatusNew(loginResponse)
        .subscribe(
          data => {
            this.transferStatus = data;
          },
          error => {
            this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
            this.result = true;
          },
          () => {
            this.availableStatus = this.transferStatus;
            //  console.log("What is the available Status: ", this.availableStatus);
            this.result = true;
            this.subscription.unsubscribe;
            
          }
        )

  }

  //Determines if the Transfer User Fee has been paid
  getTransferUser(loginResponse: LoginResponseModel): Observable<number> {
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Xfer + '/TransferUserFee';
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    let options = new RequestOptions({ headers: headers });

    this.subscription = this.http.get(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.transferUser = data.json();
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {

          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.availableTransfer = this.transferUser;
          // console.log("What is the Get Transfer User Status: ", this.availableTransfer);
          this.result = true;
        });
    this.subscription.unsubscribe;
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval)

  }

  /*Retrieves the Tranfer Fee Info
   * userFeeItemKey : item code used in checkout process
   * price: user fee price
   * name:
   * description:
   * districtKey: key for the returned district used to identify district during checkout 
   */
  public getTransferUserFee(loginResponse: LoginResponseModel): Observable<any> {
    this.loginResponse = loginResponse;
    let token = loginResponse.access_token;
    this.currentToken = token;
    //console.log("This.CurrentToken: ", this.currentToken);
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }

    let successMessage: string = '';
    let failureMessage: string = 'Transfer User Fee Info Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
    // console.log("What is my Authorization: ",  this.currentToken);


    let Url = Constants.WebApiUrl.Xfer + '/TransferUserFee'; // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //  ,
        // tap(data => console.log("I think we got TransferUserInfo: ", data))
      )
  }
  //Have they paid the Fee
  getTransferFeeStatus(loginResponse: LoginResponseModel): Observable<any> {
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transfers Not Available';
    // let Url = Constants.WebApiUrl.Xfer + '/TransferUserFee';
    let Url = Constants.WebApiUrl.Xfer + '/Availability';
    this.currentToken = token;
    //console.log("This.CurrentToken: ", this.currentToken);
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });
    let options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
      //  ,
      //tap(data => console.log("Called BY subcribeTogetTransferFeeStatus: ", data)),
      )

  }

  subscribeToGetTransferFeeStatusNew(loginResponse: LoginResponseModel) {
    //console.log("called subscribe to get TransferStatusNew")
    let failureMessage: string = 'Transaction FailedTransfer Status Not Found';
    this.subscription =
      this.getTransferStatusNew(loginResponse)
        .subscribe(
      data => {
        this.xferStatusCode = data;
      },
      error => {
        console.log("Error: No Transfer Status Found: ", error);
        this.result = false;
      },
      () => {
        this.loginStoreSvc.loadLogin(this.loginStoreSvc.cookieStateItem);
        this.gotStautsCode = true;
        // console.log("did the subscribe complete: ", this.xferStatusCode)
        this.gotStatusCodeCount++;    
        this.xferLinkStatus = this.xferStatusCode;
        //(this.xferLinkStatus) ? this.isTransfer(this.xferLinkStatus) : this.reply = false;

      }
        )

  }

  //Gets the Guest Account to apply the transfer fee to
  getTransferAccount(loginResponse: LoginResponseModel): Observable<any> {
    let newJwt: any;
    let token = loginResponse.access_token;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let availableAccount: any;
    let Url = Constants.WebApiUrl.Profile + '/GuestAccount';

    this.currentToken = token;
    let testString = this.currentToken.match(/bearer/);
    if (testString) {
      this.currentToken = this.currentToken;
    } else {
      this.currentToken = 'bearer ' + this.currentToken;
    }
    this.currTokenServ.setCurrentToken(this.currentToken, loginResponse);
  
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });

    let options = { headers: headers };

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
     //  ,
        // tap(data => console.log("What is available Account: ", data))
      )


  }






  //Gets the value of the transfer user fee for the district
  getTransferUserInfo(loginResponse: LoginResponseModel): Observable<number> {
    // console.log("You called GetTransferUserInfo");
    let newJwt: any;
    let token = loginResponse.access_token;
    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Xfer + '/TransferUserFee';
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    let options = new RequestOptions({ headers: headers });

    this.subscription = this.http.get(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.userTransferInfo = data.json()
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {

          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.testTransferUserInfo = this.userTransferInfo;
          this.result = true;
        });
    this.subscription.unsubscribe;
    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval);


  }

  //Post the transfer
  postTransfer(xferItemDetail: TransferItem, loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';
   
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

    if (this.currentToken) {
      this.result = true;
    }

    let Url = Constants.WebApiUrl.Xfer + '/Transfer';
    let body = JSON.stringify(xferItemDetail);
  
    let theaders = new HttpHeaders().set('Content-Type', 'application/JSON');
    theaders = theaders.append('Authorization', this.currentToken);
    const options = { headers: theaders };
    //console.log("Url: ", Url)
    //console.log("body: ", body)
    //console.log("options: ", options)
    return this.httpC.post(Url, body, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       // ,
    //  tap(data => { console.log("Emitting data: ", data) })
        
      )
  }

  public subscribeToPostTransfer(xferItemDetail: TransferItem, loginResponse: LoginResponseModel) {
    let loginResponseObj: LoginResponseModel;
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';
      if (loginResponse) {
        loginResponseObj = loginResponse;
      } else {
      loginResponseObj = this.loginResponse;
    }
   
    this.postTransfer(xferItemDetail, loginResponseObj)
      .subscribe(
                  data => {
                    this.xferCartResponse = data;
                    this.result = true;
                  },
                  error => {
                  this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
                  this.result = true;
                  },
      () => {      
                    this.loginResponse.messageType = Constants.Success;
                    this.loginResponse.messageTitle = 'Message: ';
                    this.loginResponse.message = successMessage;
                    this.result = true;
                    this.xferProcessedEvt.emit(true);
                  }
      )

  }

  getNewRequest(loginResponse: LoginResponseModel): Observable <any> {
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';

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
    let Url = Constants.WebApiUrl.Xfer + '/NewRequests';
    const headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });
    const options = { headers: headers };
    return this.httpC.get(Url, options)
      .pipe(
      catchError((error: any) => this.handleError(error, failureMessage))
     // ,
    //  tap(data => { this.result = true; this.xferProcessedEvt.emit(this.result);})

      )
      
  }

  public getTranferStudentMeals(loginResponse: LoginResponseModel): Observable<any> {
    //console.log("Calling Transfer Student Remote: ", loginResponse);
    //console.log("Calling Student Remote Access: ", loginResponse.access_token);
    //console.log("Do we have a loginStore val: ", this.loginStoreSvc.cookieStateItem)

    let token: any;
    //  let tempLoginResponse: LoginResponseModel;

    if (this.loginStoreSvc.cookieStateItem) {
      this.loginResponse = this.loginStoreSvc.cookieStateItem;
      token = this.loginResponse.access_token;
    } else {
      this.loginResponse = loginResponse;
      token = this.loginResponse.access_token;
    }


    // console.log("getRemoteStudentMeals After access_Token added: ", this.loginResponse)

    // this.loginStoreSvc.fixedLoginResponse.access_token;
    //  console.log("What is the getRemoteStudentMeals token: ", token)
    this.currentToken = this.tokenService.getCurrentToken(token);
    //  console.log("CurrentToken After getRemoteStudentMeals tokenService: ", this.currentToken);


    let failureMessage: string = 'Get Student Meals Failed';

    this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);

    //console.log("Login Response before APICall: ", this.loginResponse)



    let Url = Constants.WebApiUrl.Profile + '/CafeteriaAccounts/GetRemote';  // URL to web API
    let headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': 'bearer ' + token
    });

    let options = { headers: headers };

    //console.log("Url: ", Url);
    //console.log("Options: ", options);


    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
        //,
        // tap(data => console.log("I think we got Transfer students: ", data.headers.keys()) )
      )

  }

  subscribeToGetNewRequest(loginResponse: LoginResponseModel) {
    let loginResponseObj: LoginResponseModel;
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getTranferStudentMeals(loginResponseObj)
      .subscribe(
        data => {
          this.newXferRequestObj = data;
          this.xferReqResults = true;
        },
      error => {
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        this.xferReqResults = false;
      },
      () => {
        this.loginResponse.messageType = Constants.Success;
        this.loginResponse.messageTitle = 'Message: ';
        this.loginResponse.message = successMessage;
        this.result = false;
        this.xferProcessedEvt.emit(this.xferReqResults);
      }
      )

  }

  getPendingRequests(loginResponse: LoginResponseModel): Observable<any> {
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';

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
    let Url = Constants.WebApiUrl.Xfer + '/PendingRequests';
    const headers = new HttpHeaders({
      'Content-Type': 'application/JSON',
      'Authorization': this.currentToken
    });
    const options = { headers: headers };
    //console.log("Url: ", Url)
    //console.log("options: ", options)

    return this.httpC.get(Url, options)
      .pipe(
        catchError((error: any) => this.handleError(error, failureMessage))
       // ,
       // tap(data => { this.result = true; this.xferprocessedevt.emit(this.result); })
        //, tap(data => { console.log("Did we get a Pending Request: ", data)})

      )

  }

  subscribeToGetPendingRequests(loginResponse: LoginResponseModel) {
   // console.log("subscribeToGetPendingRequests")
    let loginResponseObj: LoginResponseModel;
    let successMessage: string = '';
    let failureMessage: string = 'Transfer Request Failed';
    let testPendingOBj: any;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getPendingRequests(loginResponseObj)
      .subscribe(
        data => {
         // this.newXferRequestObj = data;
          testPendingOBj = data;
         // this.xferReqResults = true;
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.xferReqResults = false;
        },
        () => {
          this.loginResponse.messageType = Constants.Success;
          this.loginResponse.messageTitle = 'Message: ';
          this.loginResponse.message = successMessage;
         // console.log("testPendingOBj: ", testPendingOBj)
         // this.result = false;
         // this.xferProcessedEvt.emit(this.xferReqResults);
        }
      )
  }


  //Gets the Transfer History
  getTransferHistory(loginResponse: LoginResponseModel): Observable<number> {
    let newJwt: any;
    let token = loginResponse.access_token;

    this.loginResponse = loginResponse;
    let successMessage: string = '';
    let failureMessage: string = 'Transaction Failed';
    let Url = Constants.WebApiUrl.Xfer + '/TransferHistory';
    let headers = new Headers({ 'Content-Type': 'application/JSON' });
    headers.append('Authorization', 'bearer ' + token);
    headers.append('Accept', 'application/JSON');
    let options = new RequestOptions({ headers: headers });

    this.subscription = this.http.get(Url, options)
      .subscribe(
        data => {
          newJwt = data.headers.toJSON();
          this.xferHistoryObj = data.json()
        },
        error => {
          this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
          this.result = true;
        },
        () => {

          //processing the successful response
          this.loginResponse.access_token = newJwt.jwt_refresh[0];
          this.result = true;
        });
    this.subscription.unsubscribe;

    //Return to calling program every polling interval
    return Observable.interval(Constants.PollingInterval);
  }

  //Opens the Transfer Fee view from the Request Transfer click event
  openFee(model, index, account, loginResponse) {
    this.feeModel = model;

    this.feeIndex = index;
    this.studentName = account.firstName;
    this.requestAccount = account;
    this.requestLogModel = loginResponse;
    this.studentName = account.firstName + " " + account.lastName;

  }
  //creates the Transfer Fee Cart Item
  createFeeCartItem(feeModel, studentName, guestAccount, transferFeeDetails) {
    let transferDetails;
    let failureMessage = 'No Transfers Found';
    let cartItemDetail: any = {
      liteItemType: "userFee",
      itemKey: transferFeeDetails.userFeeItemKey,
      districtKey: transferFeeDetails.districtKey,
      //districtKey: this.loginResponse.districtKey,(Using For testing until Elton's api Fixed is pushed)
      accountBalanceID: guestAccount.accountBalanaceID,
      itemName: transferFeeDetails.name,
      itemAmount: transferFeeDetails.price,
      amountInCart: transferFeeDetails.price,
      mealCategoryKey: "",
      studentName: guestAccount.firstName + " " + guestAccount.lastName,
      extendedAmount: 0,
      netAmount: 0,
      categoryName: "",
      bonusAmount: 0,
      minimumPayment: 0,
      quantity: null,
      isQuantity: null,
      isPartialPayEligible: null,
      formResponse: null,
      activityFormId: null,
      s3UriFull: null,
      s3URIThumb: null

    }
    this.feeCartItem = cartItemDetail;
    return this.feeCartItem;
  }

  //Adds the user fee to the lite cart and count to the cart
  addFeeToCart(guestAccount, transferFeeDetails) {
    let cartFeeDetails: CartItemDetail;
    cartFeeDetails = this.createFeeCartItem(this.feeModel, this.studentName, guestAccount, transferFeeDetails);
    if (cartFeeDetails) {
      this.addCartItemService.subscribeToPutTransferFee(cartFeeDetails, this.loginResponse);
      this.cartFeeInterval = window.setInterval(() => {
             this.transferFeeCartItem = this.addCartItemService.feeCartResponse;
             if (this.transferFeeCartItem) {
                window.clearInterval(this.cartFeeInterval);
              }
      }, 2000);

      if (this.addCartItemService.loginResponse) {
        this.loginStoreSvc.loadLogin(this.addCartItemService.loginResponse);
        //  this.cookieService.putObject(Constants.AuthCookieName, this.addCartItemService.loginResponse);
        }

      this.feeCartCount = 1;
      this.feeAddedToCart.emit(true);
      this.isFeeAdded = true;
    } else {
      this.feeCartCount = 0;
      this.feeAddedToCart.emit(false);
    }
    return this.feeCartCount;
  }

  setIndex(outsideIndex: number, insideIndex: number) {
    this.transferInIndex = insideIndex;
    this.transferOutIndex = outsideIndex;
  }
  //Sets the Cart count for the Transfer User Fee
  setFeeCartCount(): number {
    let cartTest: any = this.cartCheckOutSrvc.cartProcessed;
    if (cartTest.closed == true) {
      this.feeCartCount = 0;
    } else if (this.feeCartCount == undefined || this.feeCartCount == 1) {
      this.feeCartCount = 0;
    } else {
      this.feeCartCount = 1;
    }
    return this.feeCartCount;
  }
  //Gets the Guest Account to process the Transfer Fee
  getGhostAccount(): any {
    let gAccountObj;
    this.getTransferAccount(this.loginResponse)
      .subscribe(gAccountObj => {
        let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
        seconds.subscribe(
          x => {
            if (x == 1) {

            }
            this.transferAccount = this.availableAccount;
          })
      });

   
    return this.transferAccount;

  }

  //Http Call Subscriptions Call these functions from your Components to subscribe to the needed API call
  //Subcribe to getTransferAccount returns the guestAccount that the transfer fee will be charged to
  subscribeTogetTransferAccount(loginResponse) {
    // console.log("Subscribing to getTransferAccount: ", loginResponse);
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }

    this.getTransferAccount(loginResponseObj)
      .subscribe(
        data => {
          this.transferAccount = data;
          this.result = true;
        },
        error => {
          console.log("Error: No Transfer Account: ", error);
          this.result = false;
        },
        () => {
          if (this.result == false) {
              this.result = false;
          } else {
            this.loginStoreSvc.loadLogin(this.loginResponse);
           // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
            this.result = true;

          }
        }
      )
  }

  //Calls getTransferUserFee to retrieving the district pricing info for the transfer user fee
  // Returns the districtXferFeeObj
  subscribeTogetTransferUserFee(loginResponse) {
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }
    this.getTransferUserFee(loginResponseObj)
      .subscribe(
        data => {
          this.districtXferFeeObj = data;
        },
        error => {
          console.log("Error: No District Transfer Information Found: ", error);
          this.result = false;
        },
        () => {
          this.loginStoreSvc.loadLogin(loginResponseObj);
         // this.cookieService.putObject(Constants.AuthCookieName, loginResponseObj);
          if (this.districtXferFeeObj == undefined) {
            this.result = false;
            this.hasTransferInfo = false;
          } else {
            this.result = true;
            this.hasTransferInfo = true;
          }

          let seconds = Observable.interval(Constants.SpinnerDelayIncrement);
          seconds.subscribe(
            x => {
              if (x == 1) {
                this.hasPaidTransFee = false;
              } else {
                this.hasPaidTransFee = true;
              }

              this.xFerFeexPrice = this.districtXferFeeObj.price;
            }
          )
        }
      );
    return this.districtXferFeeObj;
  }

  //Subcribe to getTransferFeeStatus -  returns the users transferFee Status to determine which transfer link should be displayed
  subcribeTogetTransferFeeStatus(loginResponse: LoginResponseModel) {
   // console.log("Calling get TransferFeeStatus")
    if (this.setStatus) {
      this.setStatus = false;
    }
    let loginResponseObj;
    if (loginResponse) {
      loginResponseObj = loginResponse;
    } else {
      loginResponseObj = this.loginResponse;
    }
    this.getTransferFeeStatus(loginResponseObj)
      .subscribe(
        data => {
          this.xferStatusCode = data;
        },
        error => {
          console.log("Error: No Transfer Status Found: ", error);
          this.result = false;
        },
      () => {
        this.loginStoreSvc.loadLogin(loginResponseObj);
        this.gotStautsCode = true;
       // console.log("did the subscribe complete: ", this.xferStatusCode)
        this.gotStatusCodeCount++;
        }
      )
  }

  //Methods from Meal-List-Add-To-Cart
  public getTransferLinkStatus(loginResponse) {
   // console.log("Calling getTransferLinkStatus")
    this.subcribeTogetTransferFeeStatus(loginResponse);
       this.getXferInterval = window.setInterval(() => {
      if (this.gotStautsCode == true && (this.isTransferCallCnt < this.gotStatusCodeCount)) {
        window.clearInterval(this.getXferInterval);
        this.xferLinkStatus = this.xferStatusCode;
        (this.xferLinkStatus) ? this.isTransfer(this.xferLinkStatus) : this.reply = false;

      //  console.log("xferLinkStatus: ", this.xferLinkStatus)
        this.isTransferCallCnt++;
      //  console.log("isTransferCallCnt: ", this.isTransferCallCnt)
             
      }
    }, 500)
  }

  //Sets the isTransfer allowed flag
  isTransfer(rtrnstatus): boolean {

    //Prevents reply from being set before the status has been returned from the transfersService
    if (rtrnstatus) {
      this.reply = this.whatsTheStatus(rtrnstatus.status);
     // console.log("Whats the Status: ", this.reply);
      if (rtrnstatus.status == 2) {
        this.pendingTransfer = true;
      }

      if (rtrnstatus.status == 3 || rtrnstatus.status == 4) {
        //If transfers are allowed need to determine if the transfer fee has been paid
        this.isXferFeePaid = this.transferLinkStatus(rtrnstatus.status);
        //console.log("Is the Transfer Fee Paid: ", this.isXferFeePaid);
      }

    } else {
      //If no Return status Transfers are not available
      this.reply = false;
      //Setting transfer fee Paid to false as transfers are not allowed here
      this.isXferFeePaid = false;
    }

    //For Testing and Development only
 // this.reply = true;
    //For testing Purposes Only
   // this.isXferFeePaid = true;
   // console.log("What is isTransfer: ", this.reply);
    return;

  }

  //Determines if Transfers are allowed
  whatsTheStatus(status): boolean {
    let sentStatus = status;
    // 3;
    //status.status;
    let statusSwitch;
    /*
    	1 – Not available for district (do not show transfer UI)
    	2 – Not available – pending transfer.  Show explanation in UI.
    	3 – Available
    	4 – Available, requires fee
    	5 – Service suspended.
      6 - District Not communicating with MPP
      7 - User has been blocked
    */
    switch (sentStatus) {
      case 1:
        statusSwitch = false;
        break;
      case 2:
        statusSwitch = false;
        break;
      case 3:
        statusSwitch = true;
        break;
      case 4:
        statusSwitch = true;
        break;
      case 5:
        statusSwitch = false;
        break;
      case 6:
        statusSwitch = false;
        break;
      case 7:
        statusSwitch = false;
        break;
      default:
        statusSwitch = false;
        break;
    }

    return statusSwitch;
  }

  //Is the Transfer Fee Paid
  transferLinkStatus(status): boolean {
    let sentStatus = status;
    let statusSwitch;
    // console.log("What is linkStatus: ", sentStatus);

    //Theoratically now the sentStatus should be either 3 or 4 here
    switch (sentStatus) {
      case 1:
        statusSwitch = false;
        break;
      case 2:
        statusSwitch = false;
        break;
      case 3:
        statusSwitch = true;
        break;
      case 4:
        statusSwitch = false;
        break;
      case 5:
        statusSwitch = false;
        break;
      case 6:
        statusSwitch = false;
        break;
      default:
        statusSwitch = false;
        break;
    }
    //coment out for testing purposes
    return statusSwitch;
    //Used this value for testing only
    // return true;
  }

  requestTransfer(studentName: string, category: string, currBalance: number, balDate: any, outsideIndex: number, insideIndex: number, fromAccountKey: any, fromCategoryKey: any) {
   // console.log("Calling Request Transfer: ", studentName)
    this.getTransferFrom(studentName, category, currBalance, balDate, outsideIndex, insideIndex, fromAccountKey, fromCategoryKey);
  }


  private handleError(error, failureMessage) {
  // console.log("R we handling an error: ", error)
    this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
   console.log(this.loginResponse.message);
    return Observable.throwError(this.loginResponse.message);
  }
}
