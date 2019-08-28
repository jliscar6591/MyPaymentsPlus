import { ActionReducerMap } from '@ngrx/store'
import * as feesStore from '../reducers/FeeStore.reducer';
import * as cartStore from '../reducers/cartStore.reducer';
import * as mealStore from '../reducers/mealStore.reducer';
import * as districMealtStore from '../reducers/districtMealStore.reducer';
import * as loginStore from '../reducers/loginStore.reducers';
import * as cookieStore from '../reducers/cookieStore.reducer';

export interface SiteState {
  fees: feesStore.FeesState;
  cart: cartStore.CartState;
  meals: mealStore.StudentsState;
  districtMeals: districMealtStore.StudentsState;
  loginObj: loginStore.LoginState;
  cookieObj: cookieStore.CookieState;
};

export const reducers: ActionReducerMap<SiteState> = {
  fees: feesStore.feeReducer,
  cart: cartStore.cartReducer,
  meals: mealStore.mealReducer,
  districtMeals: districMealtStore.districtMealReducer,
  loginObj: loginStore.loginReducer,
  cookieObj: cookieStore.cookieReducer
};
