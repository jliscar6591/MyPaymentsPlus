import { Action } from '@ngrx/store';
import { LoginStoreModel } from '../model/login-store.model';
import * as LoginStoreActions from '../actions/loginStore.actions';

export interface LoginState {
  data: LoginStoreModel;
  loaded: boolean;
  loading: boolean;
}

export const initialState: LoginState = {
  data: <LoginStoreModel>{},
  loaded: false,
  loading: false
}

export function loginReducer(
  state = initialState,
  action: LoginStoreActions.LoginAction
): LoginState {
  switch (action.type) {
    case LoginStoreActions.LOAD_LOGIN: {
      return {
        ...state,
        loaded: false,
        loading: true
      };
    }
    case LoginStoreActions.LOAD_LOGIN_SUCCESS: {
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    }
    case LoginStoreActions.LOAD_LOGIN_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case LoginStoreActions.CLEAR_LOGIN: {
      return {
        data: <LoginStoreModel>{},
        loaded: true,
        loading: false

      }
    }
  }
}
