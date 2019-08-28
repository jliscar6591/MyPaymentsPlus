import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentMeal } from '../model/index';
import { CartItem } from "../../site/model/cart-item-detail-model";
import { StudentMealsServiceRemote } from "../../site/services/student-meals.service-remote";
import { AppState } from 'app/app.state';
import { Store, State } from '@ngrx/store';
import * as MealStoreActions from '../store/actions/mealStore.actions';
import { UserContextService } from '../../site/account/services/user-context.service';
import { CartCheckoutItemsService } from '../../site/services/cart-checkout-items.service';
import * as CartStoreActions from '../../shared/store/actions/cartStore.actions';





@Injectable()

export class RefreshService  {
  public mealRefresh: boolean = false;
  public mealEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public cartRefresh: boolean = false;
  public cartEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mealRefreshCounter: number = 0;
  public mealStore: Observable<StudentMeal>;
  public mealState: any;
  public cartStore: Observable<CartItem>;
  public cartState: any;
  public cartStateItems: CartItem;
  public xferRefresh: boolean = false;
  public xferEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public siteRefreshNow: boolean = false;
  public multiDistrictRefresh: boolean = false;
  public multiDistrictEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public haveUserContext: boolean;
  public mealsListRefresh: boolean = false;
  public mealsListEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public errorRefreshCnt: number = 0; 
  public refreshFeesCnter: number = 0;

 

  constructor(
    public store: Store<AppState>,
    private state: State<AppState>,
    public studentMealsServiceRemote: StudentMealsServiceRemote,
    private router: Router,
    public userContextService: UserContextService,
    public cartCheckoutItemsService: CartCheckoutItemsService
        
  ) {
    this.mealStore = store.select(state => state.mealStore)
    this.cartStore = store.select(state => state.cartStore)
  }

  public refreshMeals() {
   // console.log("Refresh Meals is Clearing the Meal Store")
    this.store.dispatch(new MealStoreActions.ClearMeals());
    this.mealStore.subscribe(c => this.mealState = c);
    //For testing ClearMeals
    // if (this.mealState) {
     // console.log("Meal Store Should B Empty: ", this.mealState)
   // }

    this.mealRefresh = true;
    this.mealEvent$.emit(this.mealRefresh);
    this.mealRefreshCounter++;
  }

  public stopRefreshMeals() {
    this.mealRefreshCounter = 1;
    this.mealRefresh = false;
    this.mealEvent$.emit(this.mealRefresh);
   // this.mealRefreshCounter = 0;
  }

  public refreshCart() {
    // console.log("Refreshing the Cart")
    if (this.userContextService.defaultData) {
      this.store.dispatch(new CartStoreActions.ClearCart());
      // this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))

      if (this.cartCheckoutItemsService.cartItem) {
        this.cartCheckoutItemsService.count = this.userContextService.defaultData.cartItemCount;
        this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
      }
    }
    this.cartStore.subscribe(c => this.cartState = c);
    this.cartRefresh = true;
    this.cartEvent$.emit(this.cartRefresh);

  }

  public stopCartRefresh() {
      this.cartRefresh = false;
      this.cartEvent$.emit(this.cartRefresh);
  }

  public refreshTransfers() {
    console.log("Calling Refresh transfers")
    this.xferRefresh = true;
    this.siteRefreshNow = true;
    //is.mealRefresh = true;
    this.xferEvent$.emit(this.xferRefresh);
  }
  public stopTransferRefresh() {
    this.xferRefresh = false;
    this.siteRefreshNow = false;
    this.xferEvent$.emit(this.xferRefresh);
  }

  public multiDistrictMealRefresh() {
    this.mealStore.subscribe(c => this.mealState = c);
  //console.log("Meal State from multiDistrictMealRefresh: ", this.mealState.data);
    this.multiDistrictRefresh = false;

    return this.mealState.data;
  }

  public refreshMealsList(loginResponse) {
    console.log("Refresh MealsList subscribeToGetMeals ")
    this.studentMealsServiceRemote.subscribeToGetMeals(loginResponse);
   // window.setTimeout(() => {
      if (this.studentMealsServiceRemote.result === true) {
        let newMealList: any = this.studentMealsServiceRemote.studentMeals;
        if (newMealList) {
          this.store.dispatch(new MealStoreActions.ClearMeals());
          this.store.dispatch(new MealStoreActions.LoadMealsSuccess(newMealList));
          this.mealStore.subscribe(c => this.mealState = c);
            //For testing ClearMeals
             if (this.mealState) {
           //   console.log("Meal Store Should B Empty: ", this.mealState)
            }
        }

        this.mealsListRefresh = true;
        this.mealsListEvent$.emit(this.mealsListRefresh);     
      }
    
  //  }, 0)
    window.setTimeout(() => {
      //  console.log("Going to Dashboard")
      this.router.navigate(['/dashboard']);
    }, 2000)
 
  }

  public stopMealsListRefresh() {
    this.mealsListRefresh = false;
    this.mealsListEvent$.emit(this.mealsListRefresh);
  }


}
