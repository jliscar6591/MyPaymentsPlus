import { Action } from '@ngrx/store'
import { CartItem } from '../../../site/model/cart-item-detail-model';
import * as CartStoreActions from './../actions/cartStore.actions'

export interface CartState {
  data: CartItem;
  loaded: boolean;
  loading: boolean;
}

export const initialState: CartState = {
  data: <CartItem>{},
  loaded: false,
  loading: false
}

export function cartReducer(
  state = initialState,
  action: CartStoreActions.CartAction
): CartState {
  switch (action.type) {
    case CartStoreActions.LOAD_CART: 
      return {
        ...state,
        loaded: false,
        loading: true
      };
    
    case CartStoreActions.LOAD_CART_SUCCESS: 
      return {
        data: action.payload,
        loading: false,
        loaded: true
      };
    
    case CartStoreActions.LOAD_CART_FAIL: 
      return {
        ...state,
        loading: false,
        loaded: false
      };

    case CartStoreActions.CLEAR_CART: {
      return {
        data: <CartItem>{},
        loaded: true,
        loading: false

      }
    }
  }
}
