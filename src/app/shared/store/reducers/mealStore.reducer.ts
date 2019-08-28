import { Action } from '@ngrx/store'
import { StudentMeal, MealAccount } from '../../model/index';
import * as MealStoreActions from './../actions/mealStore.actions'

export interface StudentsState {
  data: StudentMeal;
  loaded: boolean;
  loading: boolean;
};

export const initialState: StudentsState = {
  data: <StudentMeal>{},
  loaded: false,
  loading: false
};

export function mealReducer(
  state = initialState,
  action: MealStoreActions.MealAction
): StudentsState {
  switch (action.type) {
    case MealStoreActions.LOAD_MEALS: {
      return {
        ...state,
        loading: true
      };
    }
    case MealStoreActions.LOAD_MEALS_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    }
    case MealStoreActions.LOAD_MEALS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case MealStoreActions.CLEAR_MEALS: {
      return {
        data: <StudentMeal>{},
        loaded: true,
        loading: false

      }
    }
  
    default:
      return state;
  }
}
