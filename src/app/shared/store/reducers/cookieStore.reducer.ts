import { Action } from '@ngrx/store';
import { LoginResponseModel } from '../../../login/model/index';
import * as LoginStoreActions from '../actions/loginStore.actions';
import * as CookieStoreActions from '../actions/cookieStore.actions';

export interface CookieState {
  data: LoginResponseModel;
  loaded: boolean;
  loading: boolean;
}

export const initialState: CookieState = {
  data: <LoginResponseModel>{},
  loaded: false,
  loading: false
}

export function cookieReducer(
  state = initialState,
  action: CookieStoreActions.CookieAction
): CookieState {
  switch (action.type) {
    case CookieStoreActions.LOAD_COOKIE: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case CookieStoreActions.LOAD_COOKIE_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    }
    case CookieStoreActions.LOAD_COOKIE_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case CookieStoreActions.CLEAR_COOKIE: {
      return {
        data: <LoginResponseModel>{},
        loaded: true,
        loading: false

      }
    }
  }
}
