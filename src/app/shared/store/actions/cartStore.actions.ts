import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CartItemDetail } from '../../../site/model/cart-item-detail-model';
import { CartItem } from 'app/site/model/cart-item-detail-model';

export const LOAD_CART = '[CARTSTORE] Load Cart'
export const LOAD_CART_FAIL = '[CARTSTORE] Load Cart Fail'
export const LOAD_CART_SUCCESS = '[CARTSTORE] Load Cart Success'
export const CLEAR_CART = '[CARTSTORE] Clear Cart'


export class LoadCart implements Action {
  readonly type = LOAD_CART

}

export class LoadCartFail implements Action {
  readonly type = LOAD_CART_FAIL

  constructor(public payload: any) { }
}

export class LoadCartSuccess implements Action {
  readonly type = LOAD_CART_SUCCESS

  constructor(public payload: CartItem) { }
}

export class ClearCart implements Action {
  readonly type = CLEAR_CART

  
}

export type CartAction = LoadCart | LoadCartFail | LoadCartSuccess | ClearCart

