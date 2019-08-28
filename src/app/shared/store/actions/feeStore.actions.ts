import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { FeesList, FeeItems } from '../../../site/model/fees.model';

export const LOAD_FEES = '[FEES] Load Fees';
export const LOAD_FEES_FAIL = '[FEES] Load Fees Fail';
export const LOAD_FEES_SUCCESS = '[FEES] Load Fees Success';
export const ADD_FEES_SUCCESS = '[FEES] Add Fees Success';
export const ADD_FEES_FAIL = '[FEES] Add Fees Fail';

export class LoadFees implements Action {
  readonly type = LOAD_FEES
}

export class LoadFeesFail implements Action {
  readonly type = LOAD_FEES_FAIL

  constructor(public payload: any) { }
}

export class LoadFeesSuccess implements Action {
  readonly type = LOAD_FEES_SUCCESS

  constructor(public payload: FeesList[]) { }
}

export class AddFeesSuccess implements Action {
  readonly type = ADD_FEES_SUCCESS

  constructor(public payload: FeesList[]) { }
}

export class AddFeesFail implements Action {
  readonly type = ADD_FEES_FAIL

  constructor(public payload:any) { }
}

export type FeesAction = LoadFees | LoadFeesFail | LoadFeesSuccess | AddFeesSuccess | AddFeesFail
