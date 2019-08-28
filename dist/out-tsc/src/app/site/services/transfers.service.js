"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
var operators_1 = require("rxjs/operators");
//Local
var app_settings_1 = require("../../app.settings");
var add_cart_item_service_1 = require("../../site/services/add-cart-item.service");
var cart_checkout_service_1 = require("../../site/services/cart-checkout.service");
var index_1 = require("../../shared/services/index");
var TransfersService = /** @class */ (function () {
    function TransfersService(http, utilityService, addCartItemService, cartCheckOutSrvc, currTokenServ, tokenService, loginStoreSvc, httpC) {
        this.http = http;
        this.utilityService = utilityService;
        this.addCartItemService = addCartItemService;
        this.cartCheckOutSrvc = cartCheckOutSrvc;
        this.currTokenServ = currTokenServ;
        this.tokenService = tokenService;
        this.loginStoreSvc = loginStoreSvc;
        this.httpC = httpC;
        //True when http call returns
        this.result = false;
        this.feeCartCount = this.setFeeCartCount();
        this.cartProcessedEvt = this.cartCheckOutSrvc.cartProcessed;
        this.feeAddedToCart = new core_1.EventEmitter();
        this.xferProcessedEvt = new core_1.EventEmitter();
        this.gotStautsCode = false;
        this.isFeeAdded = false;
        this.setStatus = false;
        this.gotStatusCodeCount = 0;
        this.isTransferCallCnt = 0;
    }
    //Gets and formats values for Transfer From Field
    TransfersService.prototype.getTransferFrom = function (studentName, category, currBalance, balanceDate, outsideIndex, insideIndex, fromAccountKey, fromCategoryKey) {
        // console.log("You are getting the TransferFrm Object");
        this.transferFrmObj = { 'studentName': studentName, 'category': category, 'currentBal': currBalance, 'balanceDate': balanceDate, 'sourceAccountKey': fromAccountKey, 'sourceCategoryKey': fromCategoryKey };
        this.setIndex(outsideIndex, insideIndex);
        return this.transferFrmObj;
    };
    //Gets and formats selected Transfer to object 
    TransfersService.prototype.getTransferTo = function (studentName, category, currBalance, balanceDate, outsideIndex, insideIndex, toAccountKey, toCategoryKey) {
        this.transferToObj = { 'studentName': studentName, 'category': category, 'currentBal': currBalance, 'balanceDate': balanceDate, 'sourceToAccountKey': toAccountKey, 'sourceCategoryKey': toCategoryKey };
        this.setIndex(outsideIndex, insideIndex);
        return this.transferToObj;
    };
    //Checks to see if the district allows transfers
    TransfersService.prototype.getTransferStatus = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/Availability';
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.subscription = this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.transferStatus = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.availableStatus = _this.transferStatus;
            _this.result = true;
        });
        this.subscription.unsubscribe;
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    //Checks to see if the district allows transfers
    TransfersService.prototype.getTransferStatusNew = function (loginResponse) {
        var _this = this;
        //  console.log("about to call Avilability")
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transfer Status Not Found';
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/Availability';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        // tap(data => console.log('this.transferStatus', data))
        );
    };
    //Component calls this method to subscribe to getTransferStatusNew
    TransfersService.prototype.subscribeToGetTransferStatusNew = function (loginResponse) {
        var _this = this;
        //console.log("called subscribe to get TransferStatusNew")
        var failureMessage = 'Transaction FailedTransfer Status Not Found';
        this.subscription =
            this.getTransferStatusNew(loginResponse)
                .subscribe(function (data) {
                _this.transferStatus = data;
            }, function (error) {
                _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
                _this.result = true;
            }, function () {
                _this.availableStatus = _this.transferStatus;
                //  console.log("What is the available Status: ", this.availableStatus);
                _this.result = true;
                _this.subscription.unsubscribe;
            });
    };
    //Determines if the Transfer User Fee has been paid
    TransfersService.prototype.getTransferUser = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/TransferUserFee';
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.subscription = this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.transferUser = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.availableTransfer = _this.transferUser;
            // console.log("What is the Get Transfer User Status: ", this.availableTransfer);
            _this.result = true;
        });
        this.subscription.unsubscribe;
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    /*Retrieves the Tranfer Fee Info
     * userFeeItemKey : item code used in checkout process
     * price: user fee price
     * name:
     * description:
     * districtKey: key for the returned district used to identify district during checkout
     */
    TransfersService.prototype.getTransferUserFee = function (loginResponse) {
        var _this = this;
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        //console.log("This.CurrentToken: ", this.currentToken);
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var successMessage = '';
        var failureMessage = 'Transfer User Fee Info Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        // console.log("What is my Authorization: ",  this.currentToken);
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/TransferUserFee'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        // tap(data => console.log("I think we got TransferUserInfo: ", data))
        );
    };
    //Have they paid the Fee
    TransfersService.prototype.getTransferFeeStatus = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transfers Not Available';
        // let Url = Constants.WebApiUrl.Xfer + '/TransferUserFee';
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/Availability';
        this.currentToken = token;
        //console.log("This.CurrentToken: ", this.currentToken);
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        //tap(data => console.log("Called BY subcribeTogetTransferFeeStatus: ", data)),
        );
    };
    TransfersService.prototype.subscribeToGetTransferFeeStatusNew = function (loginResponse) {
        var _this = this;
        //console.log("called subscribe to get TransferStatusNew")
        var failureMessage = 'Transaction FailedTransfer Status Not Found';
        this.subscription =
            this.getTransferStatusNew(loginResponse)
                .subscribe(function (data) {
                _this.xferStatusCode = data;
            }, function (error) {
                console.log("Error: No Transfer Status Found: ", error);
                _this.result = false;
            }, function () {
                _this.loginStoreSvc.loadLogin(_this.loginStoreSvc.cookieStateItem);
                _this.gotStautsCode = true;
                // console.log("did the subscribe complete: ", this.xferStatusCode)
                _this.gotStatusCodeCount++;
                _this.xferLinkStatus = _this.xferStatusCode;
                //(this.xferLinkStatus) ? this.isTransfer(this.xferLinkStatus) : this.reply = false;
            });
    };
    //Gets the Guest Account to apply the transfer fee to
    TransfersService.prototype.getTransferAccount = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var availableAccount;
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/GuestAccount';
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        this.currTokenServ.setCurrentToken(this.currentToken, loginResponse);
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //  ,
        // tap(data => console.log("What is available Account: ", data))
        );
    };
    //Gets the value of the transfer user fee for the district
    TransfersService.prototype.getTransferUserInfo = function (loginResponse) {
        var _this = this;
        // console.log("You called GetTransferUserInfo");
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/TransferUserFee';
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        var options = new http_1.RequestOptions({ headers: headers });
        this.subscription = this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.userTransferInfo = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.testTransferUserInfo = _this.userTransferInfo;
            _this.result = true;
        });
        this.subscription.unsubscribe;
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    //Post the transfer
    TransfersService.prototype.postTransfer = function (xferItemDetail, loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        if (this.currentToken) {
            this.result = true;
        }
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/Transfer';
        var body = JSON.stringify(xferItemDetail);
        var theaders = new http_2.HttpHeaders().set('Content-Type', 'application/JSON');
        theaders = theaders.append('Authorization', this.currentToken);
        var options = { headers: theaders };
        //console.log("Url: ", Url)
        //console.log("body: ", body)
        //console.log("options: ", options)
        return this.httpC.post(Url, body, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        //  tap(data => { console.log("Emitting data: ", data) })
        );
    };
    TransfersService.prototype.subscribeToPostTransfer = function (xferItemDetail, loginResponse) {
        var _this = this;
        var loginResponseObj;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.postTransfer(xferItemDetail, loginResponseObj)
            .subscribe(function (data) {
            _this.xferCartResponse = data;
            _this.result = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = true;
            _this.xferProcessedEvt.emit(true);
        });
    };
    TransfersService.prototype.getNewRequest = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/NewRequests';
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        //  tap(data => { this.result = true; this.xferProcessedEvt.emit(this.result);})
        );
    };
    TransfersService.prototype.getTranferStudentMeals = function (loginResponse) {
        //console.log("Calling Transfer Student Remote: ", loginResponse);
        //console.log("Calling Student Remote Access: ", loginResponse.access_token);
        //console.log("Do we have a loginStore val: ", this.loginStoreSvc.cookieStateItem)
        var _this = this;
        var token;
        //  let tempLoginResponse: LoginResponseModel;
        if (this.loginStoreSvc.cookieStateItem) {
            this.loginResponse = this.loginStoreSvc.cookieStateItem;
            token = this.loginResponse.access_token;
        }
        else {
            this.loginResponse = loginResponse;
            token = this.loginResponse.access_token;
        }
        // console.log("getRemoteStudentMeals After access_Token added: ", this.loginResponse)
        // this.loginStoreSvc.fixedLoginResponse.access_token;
        //  console.log("What is the getRemoteStudentMeals token: ", token)
        this.currentToken = this.tokenService.getCurrentToken(token);
        //  console.log("CurrentToken After getRemoteStudentMeals tokenService: ", this.currentToken);
        var failureMessage = 'Get Student Meals Failed';
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        //console.log("Login Response before APICall: ", this.loginResponse)
        var Url = app_settings_1.Constants.WebApiUrl.Profile + '/CafeteriaAccounts/GetRemote'; // URL to web API
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': 'bearer ' + token
        });
        var options = { headers: headers };
        //console.log("Url: ", Url);
        //console.log("Options: ", options);
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        //,
        // tap(data => console.log("I think we got Transfer students: ", data.headers.keys()) )
        );
    };
    TransfersService.prototype.subscribeToGetNewRequest = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getTranferStudentMeals(loginResponseObj)
            .subscribe(function (data) {
            _this.newXferRequestObj = data;
            _this.xferReqResults = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.xferReqResults = false;
        }, function () {
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            _this.result = false;
            _this.xferProcessedEvt.emit(_this.xferReqResults);
        });
    };
    TransfersService.prototype.getPendingRequests = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        this.loginResponse = loginResponse;
        var token = loginResponse.access_token;
        this.currentToken = token;
        var testString = this.currentToken.match(/bearer/);
        if (testString) {
            this.currentToken = this.currentToken;
        }
        else {
            this.currentToken = 'bearer ' + this.currentToken;
        }
        this.currTokenServ.setCurrentToken(this.currentToken, this.loginResponse);
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/PendingRequests';
        var headers = new http_2.HttpHeaders({
            'Content-Type': 'application/JSON',
            'Authorization': this.currentToken
        });
        var options = { headers: headers };
        //console.log("Url: ", Url)
        //console.log("options: ", options)
        return this.httpC.get(Url, options)
            .pipe(operators_1.catchError(function (error) { return _this.handleError(error, failureMessage); })
        // ,
        // tap(data => { this.result = true; this.xferprocessedevt.emit(this.result); })
        //, tap(data => { console.log("Did we get a Pending Request: ", data)})
        );
    };
    TransfersService.prototype.subscribeToGetPendingRequests = function (loginResponse) {
        var _this = this;
        // console.log("subscribeToGetPendingRequests")
        var loginResponseObj;
        var successMessage = '';
        var failureMessage = 'Transfer Request Failed';
        var testPendingOBj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getPendingRequests(loginResponseObj)
            .subscribe(function (data) {
            // this.newXferRequestObj = data;
            testPendingOBj = data;
            // this.xferReqResults = true;
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.xferReqResults = false;
        }, function () {
            _this.loginResponse.messageType = app_settings_1.Constants.Success;
            _this.loginResponse.messageTitle = 'Message: ';
            _this.loginResponse.message = successMessage;
            // console.log("testPendingOBj: ", testPendingOBj)
            // this.result = false;
            // this.xferProcessedEvt.emit(this.xferReqResults);
        });
    };
    //Gets the Transfer History
    TransfersService.prototype.getTransferHistory = function (loginResponse) {
        var _this = this;
        var newJwt;
        var token = loginResponse.access_token;
        this.loginResponse = loginResponse;
        var successMessage = '';
        var failureMessage = 'Transaction Failed';
        var Url = app_settings_1.Constants.WebApiUrl.Xfer + '/TransferHistory';
        var headers = new http_1.Headers({ 'Content-Type': 'application/JSON' });
        headers.append('Authorization', 'bearer ' + token);
        headers.append('Accept', 'application/JSON');
        var options = new http_1.RequestOptions({ headers: headers });
        this.subscription = this.http.get(Url, options)
            .subscribe(function (data) {
            newJwt = data.headers.toJSON();
            _this.xferHistoryObj = data.json();
        }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.loginResponse.access_token = newJwt.jwt_refresh[0];
            _this.result = true;
        });
        this.subscription.unsubscribe;
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    //Opens the Transfer Fee view from the Request Transfer click event
    TransfersService.prototype.openFee = function (model, index, account, loginResponse) {
        this.feeModel = model;
        this.feeIndex = index;
        this.studentName = account.firstName;
        this.requestAccount = account;
        this.requestLogModel = loginResponse;
        this.studentName = account.firstName + " " + account.lastName;
    };
    //creates the Transfer Fee Cart Item
    TransfersService.prototype.createFeeCartItem = function (feeModel, studentName, guestAccount, transferFeeDetails) {
        var transferDetails;
        var failureMessage = 'No Transfers Found';
        var cartItemDetail = {
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
        };
        this.feeCartItem = cartItemDetail;
        return this.feeCartItem;
    };
    //Adds the user fee to the lite cart and count to the cart
    TransfersService.prototype.addFeeToCart = function (guestAccount, transferFeeDetails) {
        var _this = this;
        var cartFeeDetails;
        cartFeeDetails = this.createFeeCartItem(this.feeModel, this.studentName, guestAccount, transferFeeDetails);
        if (cartFeeDetails) {
            this.addCartItemService.subscribeToPutTransferFee(cartFeeDetails, this.loginResponse);
            this.cartFeeInterval = window.setInterval(function () {
                _this.transferFeeCartItem = _this.addCartItemService.feeCartResponse;
                if (_this.transferFeeCartItem) {
                    window.clearInterval(_this.cartFeeInterval);
                }
            }, 2000);
            if (this.addCartItemService.loginResponse) {
                this.loginStoreSvc.loadLogin(this.addCartItemService.loginResponse);
                //  this.cookieService.putObject(Constants.AuthCookieName, this.addCartItemService.loginResponse);
            }
            this.feeCartCount = 1;
            this.feeAddedToCart.emit(true);
            this.isFeeAdded = true;
        }
        else {
            this.feeCartCount = 0;
            this.feeAddedToCart.emit(false);
        }
        return this.feeCartCount;
    };
    TransfersService.prototype.setIndex = function (outsideIndex, insideIndex) {
        this.transferInIndex = insideIndex;
        this.transferOutIndex = outsideIndex;
    };
    //Sets the Cart count for the Transfer User Fee
    TransfersService.prototype.setFeeCartCount = function () {
        var cartTest = this.cartCheckOutSrvc.cartProcessed;
        if (cartTest.closed == true) {
            this.feeCartCount = 0;
        }
        else if (this.feeCartCount == undefined || this.feeCartCount == 1) {
            this.feeCartCount = 0;
        }
        else {
            this.feeCartCount = 1;
        }
        return this.feeCartCount;
    };
    //Gets the Guest Account to process the Transfer Fee
    TransfersService.prototype.getGhostAccount = function () {
        var _this = this;
        var gAccountObj;
        this.getTransferAccount(this.loginResponse)
            .subscribe(function (gAccountObj) {
            var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            seconds.subscribe(function (x) {
                if (x == 1) {
                }
                _this.transferAccount = _this.availableAccount;
            });
        });
        return this.transferAccount;
    };
    //Http Call Subscriptions Call these functions from your Components to subscribe to the needed API call
    //Subcribe to getTransferAccount returns the guestAccount that the transfer fee will be charged to
    TransfersService.prototype.subscribeTogetTransferAccount = function (loginResponse) {
        var _this = this;
        // console.log("Subscribing to getTransferAccount: ", loginResponse);
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getTransferAccount(loginResponseObj)
            .subscribe(function (data) {
            _this.transferAccount = data;
            _this.result = true;
        }, function (error) {
            console.log("Error: No Transfer Account: ", error);
            _this.result = false;
        }, function () {
            if (_this.result == false) {
                _this.result = false;
            }
            else {
                _this.loginStoreSvc.loadLogin(_this.loginResponse);
                // this.cookieService.putObject(Constants.AuthCookieName, this.loginResponse);
                _this.result = true;
            }
        });
    };
    //Calls getTransferUserFee to retrieving the district pricing info for the transfer user fee
    // Returns the districtXferFeeObj
    TransfersService.prototype.subscribeTogetTransferUserFee = function (loginResponse) {
        var _this = this;
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getTransferUserFee(loginResponseObj)
            .subscribe(function (data) {
            _this.districtXferFeeObj = data;
        }, function (error) {
            console.log("Error: No District Transfer Information Found: ", error);
            _this.result = false;
        }, function () {
            _this.loginStoreSvc.loadLogin(loginResponseObj);
            // this.cookieService.putObject(Constants.AuthCookieName, loginResponseObj);
            if (_this.districtXferFeeObj == undefined) {
                _this.result = false;
                _this.hasTransferInfo = false;
            }
            else {
                _this.result = true;
                _this.hasTransferInfo = true;
            }
            var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
            seconds.subscribe(function (x) {
                if (x == 1) {
                    _this.hasPaidTransFee = false;
                }
                else {
                    _this.hasPaidTransFee = true;
                }
                _this.xFerFeexPrice = _this.districtXferFeeObj.price;
            });
        });
        return this.districtXferFeeObj;
    };
    //Subcribe to getTransferFeeStatus -  returns the users transferFee Status to determine which transfer link should be displayed
    TransfersService.prototype.subcribeTogetTransferFeeStatus = function (loginResponse) {
        var _this = this;
        // console.log("Calling get TransferFeeStatus")
        if (this.setStatus) {
            this.setStatus = false;
        }
        var loginResponseObj;
        if (loginResponse) {
            loginResponseObj = loginResponse;
        }
        else {
            loginResponseObj = this.loginResponse;
        }
        this.getTransferFeeStatus(loginResponseObj)
            .subscribe(function (data) {
            _this.xferStatusCode = data;
        }, function (error) {
            console.log("Error: No Transfer Status Found: ", error);
            _this.result = false;
        }, function () {
            _this.loginStoreSvc.loadLogin(loginResponseObj);
            _this.gotStautsCode = true;
            // console.log("did the subscribe complete: ", this.xferStatusCode)
            _this.gotStatusCodeCount++;
        });
    };
    //Methods from Meal-List-Add-To-Cart
    TransfersService.prototype.getTransferLinkStatus = function (loginResponse) {
        var _this = this;
        // console.log("Calling getTransferLinkStatus")
        this.subcribeTogetTransferFeeStatus(loginResponse);
        this.getXferInterval = window.setInterval(function () {
            if (_this.gotStautsCode == true && (_this.isTransferCallCnt < _this.gotStatusCodeCount)) {
                window.clearInterval(_this.getXferInterval);
                _this.xferLinkStatus = _this.xferStatusCode;
                (_this.xferLinkStatus) ? _this.isTransfer(_this.xferLinkStatus) : _this.reply = false;
                //  console.log("xferLinkStatus: ", this.xferLinkStatus)
                _this.isTransferCallCnt++;
                //  console.log("isTransferCallCnt: ", this.isTransferCallCnt)
            }
        }, 500);
    };
    //Sets the isTransfer allowed flag
    TransfersService.prototype.isTransfer = function (rtrnstatus) {
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
        }
        else {
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
    };
    //Determines if Transfers are allowed
    TransfersService.prototype.whatsTheStatus = function (status) {
        var sentStatus = status;
        // 3;
        //status.status;
        var statusSwitch;
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
    };
    //Is the Transfer Fee Paid
    TransfersService.prototype.transferLinkStatus = function (status) {
        var sentStatus = status;
        var statusSwitch;
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
    };
    TransfersService.prototype.requestTransfer = function (studentName, category, currBalance, balDate, outsideIndex, insideIndex, fromAccountKey, fromCategoryKey) {
        // console.log("Calling Request Transfer: ", studentName)
        this.getTransferFrom(studentName, category, currBalance, balDate, outsideIndex, insideIndex, fromAccountKey, fromCategoryKey);
    };
    TransfersService.prototype.handleError = function (error, failureMessage) {
        // console.log("R we handling an error: ", error)
        this.utilityService.processApiErr(error, this.loginResponse, failureMessage);
        console.log(this.loginResponse.message);
        return rxjs_1.Observable.throwError(this.loginResponse.message);
    };
    TransfersService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            index_1.UtilityService,
            add_cart_item_service_1.AddCartItemService,
            cart_checkout_service_1.CartCheckoutService,
            index_1.CurrentTokenService,
            index_1.TokenService,
            index_1.LoginStoreService,
            http_2.HttpClient])
    ], TransfersService);
    return TransfersService;
}());
exports.TransfersService = TransfersService;
//# sourceMappingURL=transfers.service.js.map