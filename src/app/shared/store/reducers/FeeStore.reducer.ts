import { Action } from '@ngrx/store'
import { FeesList } from '../../../site/model/fees.model'
import * as FeeStoreActions from './../actions/feeStore.actions'

export interface FeesState {
  data: FeesList[];
  loaded: boolean;
  loading: boolean;
};

export const initialState: FeesState = {
  data: [],
  loaded: false,
  loading: false
};

export function feeReducer(
  state = initialState,
  action: FeeStoreActions.FeesAction
): FeesState {
  switch (action.type) {
    case FeeStoreActions.LOAD_FEES: {
      return {
        data: [],
        loading: true,
        loaded: false
      };
    }
    case FeeStoreActions.LOAD_FEES_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded:true
      };
    }
    case FeeStoreActions.LOAD_FEES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case FeeStoreActions.ADD_FEES_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    }
    case FeeStoreActions.ADD_FEES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    default:
      return state;
  }
}
