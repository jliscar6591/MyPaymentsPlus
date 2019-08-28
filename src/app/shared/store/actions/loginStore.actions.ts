import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LoginStoreModel } from '../model/login-store.model'


export const LOAD_LOGIN = '[LOGINSTORE] Load Login'
export const LOAD_LOGIN_FAIL = '[LOGINSTORE] Load Login Fail'
export const LOAD_LOGIN_SUCCESS = '[LOGINSTORE] Load Login Success'
export const CLEAR_LOGIN = '[LOGINSTORE] Clear Login'

export class LoadLogin implements Action {
  readonly type = LOAD_LOGIN

}

export class LoadLoginFail implements Action {
  readonly type = LOAD_LOGIN_FAIL

  constructor(public payload: any) { }
}

export class LoadLoginSuccess implements Action {
  readonly type = LOAD_LOGIN_SUCCESS

  constructor(public payload: LoginStoreModel) { }
}

export class ClearLogin implements Action {
  readonly type = CLEAR_LOGIN


}


export type LoginAction = LoadLogin | LoadLoginFail | LoadLoginSuccess | ClearLogin
