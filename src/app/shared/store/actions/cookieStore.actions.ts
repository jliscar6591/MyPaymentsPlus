import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LoginResponseModel } from '../../../login/model/index';


export const LOAD_COOKIE = '[COOKIESTORE] Load Cookie'
export const LOAD_COOKIE_FAIL = '[COOKIESTORE] Load Cookie Fail'
export const LOAD_COOKIE_SUCCESS = '[COOKIESTORE] Load Cookie Success'
export const CLEAR_COOKIE = '[COOKIESTORE] Clear Cookie'

export class LoadCookie implements Action {
  readonly type = LOAD_COOKIE

}

export class LoadCookieFail implements Action {
  readonly type = LOAD_COOKIE_FAIL

  constructor(public payload: any) { }
}

export class LoadCookieSuccess implements Action {
  readonly type = LOAD_COOKIE_SUCCESS

  constructor(public payload: LoginResponseModel) { }
}

export class ClearCookie implements Action {
  readonly type = CLEAR_COOKIE


}


export type CookieAction = LoadCookie | LoadCookieFail | LoadCookieSuccess | ClearCookie
