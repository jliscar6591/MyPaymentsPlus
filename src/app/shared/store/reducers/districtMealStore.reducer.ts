import { Action } from '@ngrx/store'
import { StudentMeal, MealAccount } from '../../model/index';
import * as DistrictMealStoreActions from './../actions/districtMealStore.actions'

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

export function districtMealReducer(
  state = initialState,
  action: DistrictMealStoreActions.DistrictMealAction
): StudentsState {
  switch (action.type) {
    case DistrictMealStoreActions.LOAD_DISTRICTMEALS: {
      return {
        ...state,
        loading: true
      };
    }
    case DistrictMealStoreActions.LOAD_DISTRICTMEALS_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    }
    case DistrictMealStoreActions.LOAD_DISTRICTMEALS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case DistrictMealStoreActions.CLEAR_DISTRICTMEALS: {
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
