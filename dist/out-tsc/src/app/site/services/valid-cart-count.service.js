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
var rxjs_1 = require("rxjs");
var fees_service_1 = require("../../site/services/fees.service");
var add_cart_item_service_1 = require("../services/add-cart-item.service");
var index_1 = require("../../shared/services/index");
var ValidCartCountService = /** @class */ (function () {
    function ValidCartCountService(feesService, addCartItemService, 
    // private validateCookie: ValidateCookieService,
    // private authGuardService: AuthGuardService,
    // private cookieService: CookieService,
    // private messageProcessorService: MessageProcessorService,
    loginStoreSvc) {
        this.feesService = feesService;
        this.addCartItemService = addCartItemService;
        this.loginStoreSvc = loginStoreSvc;
        //this.validateCookie.validateCookie();
        this.cartNeedsFix = new core_1.EventEmitter();
        this.fixCartNow = false;
        this.loginResponse = this.loginStoreSvc.cookieStateItem;
    }
    ValidCartCountService.prototype.fixCart = function (studentMealsObj, studentFeesObj) {
        var validCartAmount;
        var studentList = studentMealsObj;
        var feesList = studentFeesObj;
        //console.log('what is the feesList here???:', feesList);
        //console.log("What is the studentList Sent to FixCart: ", studentList);
        var cartAmountList = [];
        var studentMealAccounts;
        var studentFees = feesList;
        if (!(studentList instanceof rxjs_1.Observable)) {
            studentMealAccounts = this.getMealAccounts(studentList);
        }
        else {
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
        }
        else {
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
    };
    //Returns a list of meal Accounts from the studentMeals object
    ValidCartCountService.prototype.getMealAccounts = function (studentMealsList) {
        //console.log("Do we have a StudentMeal List: ", studentMealsList);
        var mealAccounts = [];
        if (studentMealsList) {
            for (var i = 0; i < studentMealsList.length; i++) {
                //console.log("Is this something: ", studentMealsList[i]['mealAccounts']);
                mealAccounts.push(studentMealsList[i]['mealAccounts']);
            }
        }
        //console.log("What is MealAccounts: ", mealAccounts);
        return mealAccounts;
    };
    ValidCartCountService.prototype.getFeesList = function (studentFeesList) {
        //console.log('do we have a studentFeesList', studentFeesList);
        if (studentFeesList) {
            var fees = [];
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
    };
    ValidCartCountService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [fees_service_1.FeesService,
            add_cart_item_service_1.AddCartItemService,
            index_1.LoginStoreService])
    ], ValidCartCountService);
    return ValidCartCountService;
}());
exports.ValidCartCountService = ValidCartCountService;
//# sourceMappingURL=valid-cart-count.service.js.map