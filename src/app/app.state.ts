import { FeesList, FeeItems } from '../app/site/model/fees.model';
import { CartItem } from '../app/site/model/cart-item-detail-model';
import { StudentMeal, MealAccount } from '../app/site/model/index';
import { LoginStoreModel } from '../app/shared/store/model/login-store.model';
import { LoginResponseModel } from '../app/login/model/index';
import { ActivitiesList } from 'app/site/model/activities.model';

export interface AppState {
  readonly feeStore: FeesList[];
  readonly cartStore: CartItem;
  readonly mealStore: StudentMeal;
  readonly districtMealStore: StudentMeal;
  readonly loginStore: LoginStoreModel;
  readonly cookieStore: LoginResponseModel;
  readonly activityStore: ActivitiesList;
}
