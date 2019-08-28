import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


//Locals
import { Constants } from '../../app.settings';
import { LoginResponseModel } from '../../login/model/index';
import { StudentMealsService } from '../../site/services/student-meals.service';
import { FeesService } from '../../site/services/fees.service';
import { AddCartItemService } from '../services/add-cart-item.service';
import { CartCheckoutService } from '../services/cart-checkout.service';
import {
  AuthGuardService,
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../shared/services/index';
import { CartCheckoutItemsService } from 'app/site/services';

@Injectable()

export class ValidCartCountService {
  //Contains the cartItemCount
  public loginResponse: LoginResponseModel;
    //this.validateCookie.validateCookie();
  public cartNeedsFix: EventEmitter<boolean> = new EventEmitter<boolean>();
  public fixCartNow: boolean = false;

  constructor(public feesService: FeesService,
    public addCartItemService: AddCartItemService,
   // private validateCookie: ValidateCookieService,
   // private authGuardService: AuthGuardService,
   // private cookieService: CookieService,
   // private messageProcessorService: MessageProcessorService,
    private loginStoreSvc: LoginStoreService


  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
  }

  public fixCart(studentMealsObj: any, studentFeesObj: any): number {
    let validCartAmount;
    let studentList = studentMealsObj;
    let feesList = studentFeesObj;
    //console.log('what is the feesList here???:', feesList);
    //console.log("What is the studentList Sent to FixCart: ", studentList);
    let cartAmountList = [];
    let studentMealAccounts;
    let studentFees = feesList;
    if (!(studentList instanceof Observable)) {
      studentMealAccounts = this.getMealAccounts(studentList);
    } else {
      studentMealAccounts = '';
    }
    if (!studentFees) {
      studentFees = this.feesService.getFeesList(this.loginResponse);
    }
    //console.log("What are studentMealAccounts: ", studentMealAccounts);
    //Pulls the cartAmounts for each meal Account Array
    //for (let i = 0; i < studentMealAccounts.length; i++) {
    //  let list = studentMealAccounts[i];
    //  let listCartAmount = list.map(c => c.cartAmount);

      //Creates a list of any account that has a Cart Amount
    //  for (let j = 0; j < list.length; j++) {
    //    if (listCartAmount[j] > 0) {
    //      cartAmountList.push(listCartAmount[j]);
    //    }
    //  }
    //}
    if (this.addCartItemService.cartResponse && this.addCartItemService.count === 0) {
      validCartAmount = this.addCartItemService.cartResponse.itemCount;
    }
    else if (this.addCartItemService.count == 0 || this.addCartItemService.count > 0) {
      validCartAmount = this.addCartItemService.count;
     // console.log('ARE YOU GETTING THIS VALUE SET?????');
    } else {
      validCartAmount = this.loginResponse.cartItemCount;
    }
    //if (cartAmountList.length > 0) {
    //  if (this.cartCheckoutItemsService.result) {
    //    //console.log('cartCheckoutResult', this.cartCheckoutItemsService.result);
    //    validCartAmount = this.cartCheckoutItemsService.cartItem.items.length;
    //  }
      //.reduce((a, b) => a + b, 0)
      //
    //} else if (this.addCartItemService.itemRemoved) {
    //  validCartAmount = this.cartCheckoutItemsService.cartItem.items.length;
    //} else {
    //  validCartAmount = 0;
    //}
    //this.addCartItemService.itemRemoved = false;
    //console.log("What does Fix Cart Amount Return: ", validCartAmount);
    return validCartAmount;

  }


  //Returns a list of meal Accounts from the studentMeals object
  getMealAccounts(studentMealsList: any): string {
    //console.log("Do we have a StudentMeal List: ", studentMealsList);
    let mealAccounts: any = [];
    if (studentMealsList) {
    
      for (var i = 0; i < studentMealsList.length; i++) {
        //console.log("Is this something: ", studentMealsList[i]['mealAccounts']);
        mealAccounts.push(studentMealsList[i]['mealAccounts']);
      }
    }
    

    //console.log("What is MealAccounts: ", mealAccounts);

    return mealAccounts;
  }

  getFeesList(studentFeesList: any): string {
    //console.log('do we have a studentFeesList', studentFeesList);
    if (studentFeesList) {
      let fees: any = [];
      var i;
      for (i = 0; i < studentFeesList.length; i++) {
        var j;
        for (j = 0; j < studentFeesList[i].fees; j++) {
          if (studentFeesList[i].fees[j].isSelected === true) {
            fees.push(studentFeesList[i]['fees']);
          }
        }
        //console.log('fees', fees)
      }
      return fees;
    }
  }

  //getCartItemsCount() {
  //  this.cartCheckoutItemsService.getCartCheckoutItems(this.loginResponse);
  //}

}
