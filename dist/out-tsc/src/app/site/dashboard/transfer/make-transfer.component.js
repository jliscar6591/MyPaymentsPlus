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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_settings_1 = require("../../../app.settings");
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var refresh_service_1 = require("../../../shared/services/refresh.service");
var MakeTransferComponent = /** @class */ (function () {
    function MakeTransferComponent(router, formBuilder, addCartItemService, utilityService, studentMealsService, studentMealsServiceRemote, tranferService, loginStoreSvc, refreshService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.addCartItemService = addCartItemService;
        this.utilityService = utilityService;
        this.studentMealsService = studentMealsService;
        this.studentMealsServiceRemote = studentMealsServiceRemote;
        this.tranferService = tranferService;
        this.loginStoreSvc = loginStoreSvc;
        this.refreshService = refreshService;
        this.addCartItemDesktop = new core_1.EventEmitter();
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
        this.isStudentsGetting = false;
        this.getStudentErr = false;
        this.getStudentErrMsg = '';
        this.isStudentsRemoteGetting = false;
        this.getStudentRemoteErr = false;
        this.getStudentRemoteErrMsg = '';
        this.transferAmountInput = '';
        this.canMakeXfer = true;
        this.formErrors = {
            'transferToAmount': 'Insufficient Funds in Selected Account for this Transaction'
        };
        this.validationMessages = {
            'transferToAmount': {
                'pattern': 'Only numbers are allowed.'
            },
        };
    }
    ;
    MakeTransferComponent.prototype.ngOnInit = function () {
        var _this = this;
        var studentMealsList = this.studentMealsService.studentMeals;
        var feeModel = this.tranferService.feeModel;
        this.mobile = (window.innerWidth < 960) ? true : false;
        console.log(feeModel);
        this.todaysDate = this.getToday();
        this.makeTransferForm = new forms_1.FormGroup({
            'transferFromSelector': new forms_1.FormControl('', forms_1.Validators.required),
            'transferToSelector': new forms_1.FormControl('', forms_1.Validators.required),
            'transferToAmount': new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])
        });
        this.isValid = true;
        this.studentSelectList = this.getNames();
        this.studentSelectFromList = this.getNames();
        this.studentSelectToList = this.getNames();
        this.transferAmount = 0;
        //Validation reporting
        this.makeTransferForm.valueChanges
            .subscribe(function (data) { return _this.utilityService.onValueChanged(_this.makeTransferForm, _this.formErrors, _this.validationMessages); });
    }; //End of inIt
    MakeTransferComponent.prototype.getToday = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            var x = '0' + dd;
            dd = parseInt(x);
        }
        if (mm < 10) {
            var x = '0' + mm;
            mm = parseInt(x);
        }
        var formatedDte = mm + '/' + dd + '/' + yyyy;
        return formatedDte;
    };
    //for desktop browser component
    MakeTransferComponent.prototype.initListItem = function () {
        return this.formBuilder.group({
            'addAmount': [null, [forms_1.Validators.pattern(app_settings_1.Constants.DecimalPattern)]]
        });
    };
    MakeTransferComponent.prototype.btnClick = function () {
        if (this.mobile) {
            this.router.navigateByUrl('/meals');
            this.refreshService.refreshMeals();
        }
        else {
            this.router.navigateByUrl('/dashboard');
            this.refreshService.refreshMeals();
        }
    };
    //Gets the names for the Account To dropdown
    MakeTransferComponent.prototype.getNames = function () {
        var studentList = this.studentMealsServiceRemote.studentMeals;
        var nameList = [];
        var catList = [];
        var toNamesList = [];
        for (var i = 0; i < studentList.length; i++) {
            //Removes the selected account from the To list
            var mealAccountListLength = studentList[i]['mealAccounts'].map(function (a) { return a.categoryName; }).length;
            var mealCategoryNames = studentList[i]['mealAccounts'].map(function (a) { return a.categoryName; });
            for (var j = 0; j < mealAccountListLength; j++) {
                //Filters out the Bonus acct since we cannot transfer money to the Bonus account
                if (mealCategoryNames[j] != 'Bonus' && studentList[i]['mealAccounts'][j].isDepositable) {
                    catList.push(studentList[i]['mealAccounts'][j].categoryName);
                    var currBalNumber = Number(studentList[i]['mealAccounts'][j].currentBalance);
                    toNamesList.push({ name: studentList[i]['firstName'], category: studentList[i]['mealAccounts'][j].categoryName, currBalance: currBalNumber });
                }
            }
        }
        return toNamesList;
    };
    MakeTransferComponent.prototype.enableTransfer = function (event) {
        this.transferAmountInput = event;
        var valid = false;
        return valid;
    };
    //Takes the selected value from the To dropdown and displays only the balance of the selected account
    MakeTransferComponent.prototype.getSelectedToObj = function () {
        this.studentSelectToList = this.studentSelectList;
        this.stringToGrp = this.makeTransferForm.controls.transferToSelector.value.slice(17);
        console.log('what is this', this.stringToGrp);
        var toAccountBal = this.stringToGrp;
        this.accountToOrigBal = toAccountBal.trim();
        var selectedToName = this.makeTransferForm.controls.transferToSelector.value.split("-", 2);
        this.selectedToAccount = this.getTransferToObj(selectedToName);
        console.log("What is the Account To Obj: ", this.selectedToAccount);
        if (!this.selectedFromAccount) {
            this.spliceTheFromList();
        }
        return this.selectedToAccount;
    };
    MakeTransferComponent.prototype.spliceTheFromList = function () {
        if (this.selectedToAccount) {
            var i;
            for (i = 0; i < this.studentSelectFromList.length; i++) {
                console.log('name', this.studentSelectFromList[i].name.includes(this.selectedToAccount.studentName));
                console.log('category', this.studentSelectFromList[i].category.includes(this.selectedToAccount.category));
                if (this.selectedToAccount.studentName.includes(this.studentSelectFromList[i].name) && this.studentSelectFromList[i].category.includes(this.selectedToAccount.category)) {
                    this.studentSelectFromList.splice(i, 1);
                }
            }
        }
    };
    MakeTransferComponent.prototype.getSelectedFromObj = function () {
        this.studentSelectFromList = this.studentSelectList;
        console.log(this.studentSelectFromList);
        console.log('what is this', this.makeTransferForm.controls.transferFromSelector.value);
        this.stringFromGrp = this.makeTransferForm.controls.transferFromSelector.value.slice(17);
        console.log('what is this', this.stringFromGrp);
        var fromAccountBal = this.stringFromGrp;
        this.accountFromOrigBal = fromAccountBal.trim();
        var selectedFromName = this.makeTransferForm.controls.transferFromSelector.value.split("-", 2);
        this.selectedFromAccount = this.getTransferFromObj(selectedFromName);
        console.log("What is the Account From Obj: ", this.selectedFromAccount);
        if (!this.selectedToAccount) {
            this.spliceTheToList();
        }
        return this.selectedFromAccount;
    };
    MakeTransferComponent.prototype.spliceTheToList = function () {
        var i;
        for (i = 0; i < this.studentSelectToList.length; i++) {
            // console.log('name', this.studentSelectToList[i].name.includes(this.selectedFromAccount.studentName));
            // console.log('category', this.studentSelectToList[i].category.includes(this.selectedFromAccount.category));
            if (this.selectedFromAccount.studentName.includes(this.studentSelectToList[i].name) && this.studentSelectToList[i].category.includes(this.selectedFromAccount.category)) {
                this.studentSelectToList.splice(i, 1);
            }
        }
    };
    //Update cart amount on the client side.
    MakeTransferComponent.prototype.updateCartAmount = function (j) {
        //console.log("WE are going to update the Cart: ", this.account.mealAccounts[j].cartAmount);
        var cartSum = this.account.mealAccounts[j].cartAmount;
        this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
        this.makeTransferForm.reset();
    };
    MakeTransferComponent.prototype.addCartItem = function () {
        // console.log("Calling Add Cart Item");
        this.regexMoney = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
        console.log("What is Transfer From: ", this.selectedFromAccount);
        console.log("What is the Transfer To: ", this.selectedToAccount);
        console.log("What is the transfer To Balance: ", this.accountToOrigBal);
        var formatToBal = this.accountToOrigBal;
        this.transferAmount = this.transferAmountInput;
        console.log("This is the entered Transfer Amount: ", this.transferAmount);
        console.log(this.regexMoney.test(this.transferAmount));
        if (this.transferAmount > this.selectedFromAccount.currBalance || this.selectedFromAccount.currentBalance < 0) {
            this.makeTransferForm.invalid;
            this.canMakeXfer = false;
            this.formErrors.transferToAmount = 'Insufficient Funds in Selected Account for this Transaction';
        }
        else if (this.transferAmount < 1) {
            this.makeTransferForm.invalid;
            this.canMakeXfer = false;
            this.formErrors.transferToAmount = 'Cannot transfer a negative amount';
        }
        else {
            var newBalance = this.selectedFromAccount.currentBal - this.transferAmount;
            this.makeTransferForm.valid;
            this.canMakeXfer = true;
        }
        if (this.canMakeXfer === true && this.regexMoney.test(this.transferAmount)) {
            this.transferDetails = this.createTransferRequest(this.selectedFromAccount, this.selectedToAccount, this.transferAmount);
            //console.log("transferDetails: ", this.transferDetails)
            this.tranferService.subscribeToPostTransfer(this.transferDetails, this.loginResponse);
            // postTransfer(this.transferDetails);
            if (this.tranferService.xferProcessedEvt) {
                //checks to see if the call to '/Transfer'  has processed before looking for the pending New Transfer Request
                if (this.tranferService.result) {
                    // console.log("The transfer processed: ", this.tranferService.result)
                    this.goToConfirmation();
                    this.tranferService.subscribeToGetTransferFeeStatusNew(this.loginResponse);
                    //this.tranferService.subscribeToGetPendingRequests(this.loginResponse);
                    //If the new Request is completed right away go to Confirmation otherwise we checkForRequest to complete and then go to Confirmation Screen
                    //if (this.tranferService.xferReqResults) {
                    //  //console.log("We got a New Transfer on the Component: ", this.tranferService.newXferRequestObj);         
                    //  this.goToConfirmation();
                    //} else {
                    // // console.log("We don't have the New Request: ", this.tranferService.newXferRequestObj);
                    //  this.checkForRequest();
                    //}
                }
                else {
                    this.canMakeXfer = false;
                    this.formErrors.transferToAmount = 'This operation is unavailable at this time. Please Try again later.';
                }
            }
        }
    };
    //Takes the user to the confirmation screen once the New Request has been created and put in the queue for processing
    //checkForRequest() {
    // // console.log("Calling checkForRequest")
    //  let checkRequestInterval: any;
    //  checkRequestInterval = window.setInterval(()=> {
    //    if (this.tranferService.newXferRequestObj) {
    //  console.log("We Got Tranfers: ", this.tranferService.newXferRequestObj);
    //      window.clearInterval(checkRequestInterval);
    //      this.goToConfirmation();
    //    } 
    //  }, 1000)
    //}
    MakeTransferComponent.prototype.goToConfirmation = function () {
        this.router.navigate(['/transfer-confirmation']);
    };
    MakeTransferComponent.prototype.clearDefault = function () {
        this.transferAmount = this.makeTransferForm.value;
    };
    MakeTransferComponent.prototype.onKey = function (event) {
        this.transferAmount = event.target.value;
        this.isValid = this.enableTransfer(event.target.value);
        return this.isValid;
    };
    MakeTransferComponent.prototype.getTransferToObj = function (selectedToName) {
        var studentList = this.studentMealsService.studentMeals;
        var name = selectedToName[0];
        //console.log("What is the selected To Name: ", name.trim());
        var category = selectedToName[1].split(" ", 2);
        // console.log("What is the selected to Category: ", category[1]);
        var selectedItemList = [];
        var today = this.getToday();
        var xferToAccount;
        for (var i = 0; i < studentList.length; i++) {
            var testName = studentList[i].firstName;
            if (name.trim() == testName) {
                for (var j = 0; j < studentList[i].mealAccounts.length; j++) {
                    var testCategory = studentList[i].mealAccounts[j].categoryName;
                    //  console.log("What is the Category Name: ", testCategory);
                    if (category[1] == testCategory) {
                        // console.log("We have a matching Category: ", testCategory + '=' + category[1]);
                        selectedItemList.push({ 'studentName': name, 'category': category[1], 'currentBal': studentList[i].mealAccounts[j].currentBalance, 'balanceDate': studentList[i].mealAccounts[j].currentBalanceLastUpdated, 'targetAccountKey': studentList[i].mealAccounts[j].accountBalanceID, 'targetCategoryKey': studentList[i].mealAccounts[j].categoryKey });
                        // console.log("What is the Selected Item: ", selectedItemList);
                    }
                }
            }
        }
        if (selectedItemList) {
            var formatedToObj = {
                studentName: selectedItemList[0]['studentName'],
                category: selectedItemList[0]['category'],
                currentBal: selectedItemList[0]['currentBal'],
                balanceDate: selectedItemList[0]['balanceDate'],
                targetAccountKey: selectedItemList[0]['targetAccountKey'],
                targetCategoryKey: selectedItemList[0]['targetCategoryKey']
            };
            xferToAccount = formatedToObj;
        }
        else {
            xferToAccount = null;
        }
        return xferToAccount;
    };
    MakeTransferComponent.prototype.getTransferFromObj = function (selectedFromName) {
        var studentList = this.studentMealsService.studentMeals;
        var name = selectedFromName[0];
        //console.log("What is the selected To Name: ", name.trim());
        var category = selectedFromName[1].split(" ", 2);
        // console.log("What is the selected to Category: ", category[1]);
        var selectedItemList = [];
        var today = this.getToday();
        var xferFromAccount;
        for (var i = 0; i < studentList.length; i++) {
            var testName = studentList[i].firstName;
            if (name.trim() == testName) {
                for (var j = 0; j < studentList[i].mealAccounts.length; j++) {
                    var testCategory = studentList[i].mealAccounts[j].categoryName;
                    //  console.log("What is the Category Name: ", testCategory);
                    if (category[1] == testCategory) {
                        // console.log("We have a matching Category: ", testCategory + '=' + category[1]);
                        selectedItemList.push({ 'studentName': name, 'category': category[1], 'currentBal': studentList[i].mealAccounts[j].currentBalance, 'balanceDate': studentList[i].mealAccounts[j].currentBalanceLastUpdated, 'targetAccountKey': studentList[i].mealAccounts[j].accountBalanceID, 'targetCategoryKey': studentList[i].mealAccounts[j].categoryKey });
                        // console.log("What is the Selected Item: ", selectedItemList);
                    }
                }
            }
        }
        if (selectedItemList) {
            var formatedFromObj = {
                studentName: selectedItemList[0]['studentName'],
                category: selectedItemList[0]['category'],
                currentBal: selectedItemList[0]['currentBal'],
                balanceDate: selectedItemList[0]['balanceDate'],
                targetAccountKey: selectedItemList[0]['targetAccountKey'],
                targetCategoryKey: selectedItemList[0]['targetCategoryKey']
            };
            xferFromAccount = formatedFromObj;
        }
        else {
            xferFromAccount = null;
        }
        return xferFromAccount;
    };
    MakeTransferComponent.prototype.createTransferRequest = function (xferFrmObj, xferToObj, xferAmount) {
        var obj;
        obj = {
            "sourceAccountKey": xferFrmObj.targetAccountKey,
            "sourceCategoryKey": xferFrmObj.targetCategoryKey,
            "targetAccountKey": xferToObj.targetAccountKey,
            "targetCategoryKey": xferToObj.targetCategoryKey,
            "amountRequested": xferAmount
        };
        return obj;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], MakeTransferComponent.prototype, "makeTransferForm", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MakeTransferComponent.prototype, "fromStudent", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MakeTransferComponent.prototype, "transferAmount", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], MakeTransferComponent.prototype, "addCartItemDesktop", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MakeTransferComponent.prototype, "insideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MakeTransferComponent.prototype, "outsideIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MakeTransferComponent.prototype, "account", void 0);
    MakeTransferComponent = __decorate([
        core_1.Component({
            selector: 'make-transfer',
            templateUrl: './make-transfer.component.html',
            styleUrls: ['./make-transfer.component.less']
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forms_1.FormBuilder,
            index_1.AddCartItemService,
            index_2.UtilityService,
            index_1.StudentMealsService,
            index_1.StudentMealsServiceRemote,
            index_1.TransfersService,
            index_2.LoginStoreService,
            refresh_service_1.RefreshService])
    ], MakeTransferComponent);
    return MakeTransferComponent;
}());
exports.MakeTransferComponent = MakeTransferComponent;
//# sourceMappingURL=make-transfer.component.js.map