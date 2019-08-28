import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { StudentMeal, MealAccount, TransferItem } from '../../model/index';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem } from '../../model/index';
import { Observable } from 'rxjs';

import { StudentMealsService, StudentMealsServiceRemote, AddCartItemService, TransfersService } from "../../services/index"
import {
  UtilityService,
  LoginStoreService,
} from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service'
import { CustomValidators } from '../../../shared/validators/custom-validators';


@Component({
  selector: 'make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.component.less']
})
export class MakeTransferComponent implements OnInit {
  selectedFromAccount: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private addCartItemService: AddCartItemService,
    private utilityService: UtilityService,
    private studentMealsService: StudentMealsService,
    public studentMealsServiceRemote: StudentMealsServiceRemote,
    public tranferService: TransfersService,
    private loginStoreSvc: LoginStoreService,
    private refreshService: RefreshService



  ) { };

  // @Input() form: FormGroup;
  @Input() makeTransferForm: FormGroup;
  @Input() fromStudent: string;
  @Input() transferAmount: any;
  @Output() addCartItemDesktop: EventEmitter<any> = new EventEmitter<any>();
  @Input() insideIndex: number;
  @Input() outsideIndex: number;
  @Input() account: StudentMeal;

  private loginResponse: LoginResponseModel = this.loginStoreSvc.cookieStateItem;
  //this.validateCookie.validateCookie();
  // public students: any = this.studentMealsService.studentMeals;
  // public makeTransferForm: FormGroup;
  private addTransferAmountForm: FormGroup;
  public addTransferAmountMobileForm: FormGroup;
  public isStudentsGetting: boolean = false;
  public getStudentErr: boolean = false;
  private getStudentErrMsg: string = '';
  public isStudents: boolean;
  public isValid: boolean;
  public studentSelectToList: any;
  public isStudentsRemoteGetting: boolean = false;
  public getStudentRemoteErr: boolean = false;
  private getStudentRemoteErrMsg: string = '';
  private isStudentsRemote: boolean;
  public transferFrom: any;
  public todaysDate: any;
  public studentSelectList: any;
  public studentSelectFromList: any;
  public selectedAccount: string;
  private stringToGrp: any;
  private stringFromGrp: any;
  public selectedToAccount: any;
  public transferAmountInput: any = '';
  public accountToOrigBal: number;
  public accountFromOrigBal: number;
  public transferDetails: TransferItem;
  public canMakeXfer: boolean = true;
  public mobile: boolean;
  public regexMoney: any;

  ngOnInit() {
    let studentMealsList = this.studentMealsService.studentMeals;
    let feeModel = this.tranferService.feeModel;
    this.mobile = (window.innerWidth < 960) ? true : false;
    console.log(feeModel);
    this.todaysDate = this.getToday();
    this.makeTransferForm = new FormGroup({
      'transferFromSelector': new FormControl('', Validators.required),
      'transferToSelector': new FormControl('', Validators.required),
      'transferToAmount': new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')])
    });
    this.isValid = true;
    this.studentSelectList = this.getNames();
    this.studentSelectFromList = this.getNames();
    this.studentSelectToList = this.getNames();
    this.transferAmount = 0;
    //Validation reporting
    this.makeTransferForm.valueChanges
      .subscribe(data => this.utilityService.onValueChanged(this.makeTransferForm, this.formErrors, this.validationMessages));
  }//End of inIt

  public formErrors = {
    'transferToAmount': 'Insufficient Funds in Selected Account for this Transaction'
  };

  validationMessages = {
    'transferToAmount': {
      'pattern': 'Only numbers are allowed.'
    },
  };

  getToday() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      let x = '0' + dd;
      dd = parseInt(x);
    }

    if (mm < 10) {
      let x = '0' + mm;
      mm = parseInt(x);
    }

    let formatedDte = mm + '/' + dd + '/' + yyyy;
    return formatedDte;
  }

  //for desktop browser component
  initListItem() {
    return this.formBuilder.group({
      'addAmount': [null, [Validators.pattern(Constants.DecimalPattern)]]
    });
  }

  btnClick() {
    if (this.mobile) {
      this.router.navigateByUrl('/meals');
      this.refreshService.refreshMeals();
    } else {
      this.router.navigateByUrl('/dashboard');
      this.refreshService.refreshMeals();
    }


  }

  //Gets the names for the Account To dropdown
  getNames() {
    let studentList = this.studentMealsServiceRemote.studentMeals;
    let nameList = [];
    let catList = [];
    let toNamesList = [];
    for (let i = 0; i < studentList.length; i++) {

      //Removes the selected account from the To list
      let mealAccountListLength: number = studentList[i]['mealAccounts'].map(a => a.categoryName).length;
      let mealCategoryNames: any = studentList[i]['mealAccounts'].map(a => a.categoryName);
      for (let j = 0; j < mealAccountListLength; j++) {
        //Filters out the Bonus acct since we cannot transfer money to the Bonus account
        if (mealCategoryNames[j] != 'Bonus' && studentList[i]['mealAccounts'][j].isDepositable) {
          catList.push(studentList[i]['mealAccounts'][j].categoryName);
          let currBalNumber: number = Number(studentList[i]['mealAccounts'][j].currentBalance);
          toNamesList.push({ name: studentList[i]['firstName'], category: studentList[i]['mealAccounts'][j].categoryName, currBalance: currBalNumber });
        }
      }
    }
    return toNamesList;
  }

  enableTransfer(event) {
    this.transferAmountInput = event;
    let valid = false;
    return valid;
  }

  //Takes the selected value from the To dropdown and displays only the balance of the selected account
  getSelectedToObj() {
    this.studentSelectToList = this.studentSelectList;
    this.stringToGrp = this.makeTransferForm.controls.transferToSelector.value.slice(17);
    console.log('what is this', this.stringToGrp);
    let toAccountBal = this.stringToGrp;
    this.accountToOrigBal = toAccountBal.trim();
    let selectedToName = this.makeTransferForm.controls.transferToSelector.value.split("-", 2);
    this.selectedToAccount = this.getTransferToObj(selectedToName);
    console.log("What is the Account To Obj: ", this.selectedToAccount);
    if (!this.selectedFromAccount) {
      this.spliceTheFromList();
    }
    return this.selectedToAccount;
  }

  public spliceTheFromList() {
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
  }

  getSelectedFromObj() {
    this.studentSelectFromList = this.studentSelectList;
    console.log(this.studentSelectFromList);
    console.log('what is this', this.makeTransferForm.controls.transferFromSelector.value);
    this.stringFromGrp = this.makeTransferForm.controls.transferFromSelector.value.slice(17);
    console.log('what is this', this.stringFromGrp);
    let fromAccountBal = this.stringFromGrp;
    this.accountFromOrigBal = fromAccountBal.trim();
    let selectedFromName = this.makeTransferForm.controls.transferFromSelector.value.split("-", 2);
    this.selectedFromAccount = this.getTransferFromObj(selectedFromName);
    console.log("What is the Account From Obj: ", this.selectedFromAccount);
    if (!this.selectedToAccount) {
      this.spliceTheToList();
    }
    return this.selectedFromAccount;

  }

  public spliceTheToList() {
    var i;
    for (i = 0; i < this.studentSelectToList.length; i++) {
      // console.log('name', this.studentSelectToList[i].name.includes(this.selectedFromAccount.studentName));
      // console.log('category', this.studentSelectToList[i].category.includes(this.selectedFromAccount.category));
      if (this.selectedFromAccount.studentName.includes(this.studentSelectToList[i].name) && this.studentSelectToList[i].category.includes(this.selectedFromAccount.category)) {
        this.studentSelectToList.splice(i, 1);
      }
    }
  }

  //Update cart amount on the client side.
  updateCartAmount(j: number) {
    //console.log("WE are going to update the Cart: ", this.account.mealAccounts[j].cartAmount);
    let cartSum: number = this.account.mealAccounts[j].cartAmount;
    this.account.mealAccounts[j].cartAmount = cartSum + parseFloat(this.account.mealAccounts[j].addAmount);
    this.makeTransferForm.reset();
  }

  addCartItem() {
    // console.log("Calling Add Cart Item");
    this.regexMoney = new RegExp('^[0-9]+(\.[0-9]{1,2})?$');
    console.log("What is Transfer From: ", this.selectedFromAccount);
    console.log("What is the Transfer To: ", this.selectedToAccount);
    console.log("What is the transfer To Balance: ", this.accountToOrigBal);
    let formatToBal = this.accountToOrigBal;
    this.transferAmount = this.transferAmountInput;
    console.log("This is the entered Transfer Amount: ", this.transferAmount);
    console.log(this.regexMoney.test(this.transferAmount));
    if (this.transferAmount > this.selectedFromAccount.currBalance || this.selectedFromAccount.currentBalance < 0) {
      this.makeTransferForm.invalid;
      this.canMakeXfer = false;
      this.formErrors.transferToAmount = 'Insufficient Funds in Selected Account for this Transaction';
    } else if (this.transferAmount < 1) {
      this.makeTransferForm.invalid;
      this.canMakeXfer = false;
      this.formErrors.transferToAmount = 'Cannot transfer a negative amount';
    } else {
      let newBalance = this.selectedFromAccount.currentBal - this.transferAmount;
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
        } else {
          this.canMakeXfer = false;
          this.formErrors.transferToAmount = 'This operation is unavailable at this time. Please Try again later.'
        }
      }
    }
  }

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

  goToConfirmation() {
    this.router.navigate(['/transfer-confirmation']);
  }

  clearDefault() {
    this.transferAmount = this.makeTransferForm.value;
  }

  onKey(event: any) { // without type info
    this.transferAmount = event.target.value;
    this.isValid = this.enableTransfer(event.target.value);
    return this.isValid;
  }

  getTransferToObj(selectedToName) {
    let studentList = this.studentMealsService.studentMeals;
    let name = selectedToName[0];
    //console.log("What is the selected To Name: ", name.trim());
    let category = selectedToName[1].split(" ", 2);
    // console.log("What is the selected to Category: ", category[1]);

    let selectedItemList = [];
    let today = this.getToday();
    let xferToAccount;

    for (let i = 0; i < studentList.length; i++) {
      let testName = studentList[i].firstName;
      if (name.trim() == testName) {


        for (let j = 0; j < studentList[i].mealAccounts.length; j++) {
          let testCategory = studentList[i].mealAccounts[j].categoryName;
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
      let formatedToObj = {
        studentName: selectedItemList[0]['studentName'],
        category: selectedItemList[0]['category'],
        currentBal: selectedItemList[0]['currentBal'],
        balanceDate: selectedItemList[0]['balanceDate'],
        targetAccountKey: selectedItemList[0]['targetAccountKey'],
        targetCategoryKey: selectedItemList[0]['targetCategoryKey']

      }

      xferToAccount = formatedToObj;
    } else {
      xferToAccount = null;
    }

    return xferToAccount;
  }

  getTransferFromObj(selectedFromName) {
    let studentList = this.studentMealsService.studentMeals;
    let name = selectedFromName[0];
    //console.log("What is the selected To Name: ", name.trim());
    let category = selectedFromName[1].split(" ", 2);
    // console.log("What is the selected to Category: ", category[1]);

    let selectedItemList = [];
    let today = this.getToday();
    let xferFromAccount;

    for (let i = 0; i < studentList.length; i++) {
      let testName = studentList[i].firstName;
      if (name.trim() == testName) {


        for (let j = 0; j < studentList[i].mealAccounts.length; j++) {
          let testCategory = studentList[i].mealAccounts[j].categoryName;
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
      let formatedFromObj = {
        studentName: selectedItemList[0]['studentName'],
        category: selectedItemList[0]['category'],
        currentBal: selectedItemList[0]['currentBal'],
        balanceDate: selectedItemList[0]['balanceDate'],
        targetAccountKey: selectedItemList[0]['targetAccountKey'],
        targetCategoryKey: selectedItemList[0]['targetCategoryKey']

      }

      xferFromAccount = formatedFromObj;
    } else {
      xferFromAccount = null;
    }

    return xferFromAccount;
  }

  createTransferRequest(xferFrmObj, xferToObj, xferAmount) {
    let obj;
    obj = {
      "sourceAccountKey": xferFrmObj.targetAccountKey,
      "sourceCategoryKey": xferFrmObj.targetCategoryKey,
      "targetAccountKey": xferToObj.targetAccountKey,
      "targetCategoryKey": xferToObj.targetCategoryKey,
      "amountRequested": xferAmount
    }
    return obj;

  }



}
