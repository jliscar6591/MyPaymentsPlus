import { Action } from '@ngrx/store'
import { ActivitiesList, Categories } from '../../../site/model/activities.model'
import * as ActivityStoreActions from '../actions/activityStore.actions'

export interface ActivityState {
  data: ActivitiesList;
  loaded: boolean;
  loading: boolean;
}

export const initialState: ActivityState = {
  data: <ActivitiesList>{},
  loaded: false,
  loading: false
}

export function activityReducer(
  state = initialState,
  action: ActivityStoreActions.ActivitiesAction
): ActivityState {
  switch (action.type) {
    case ActivityStoreActions.LOAD_ACTIVITIES: {
      return {
        ...state,
        loading:true
      }
    }
    case ActivityStoreActions.LOAD_ACTIVITIES_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      }
    }
    case ActivityStoreActions.LOAD_ACTIVITIES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      }
    }
    default:
      return state;
  }
}
