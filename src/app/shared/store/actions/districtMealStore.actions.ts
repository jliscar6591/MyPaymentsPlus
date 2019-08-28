import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StudentMeal, MealAccount } from '../../model/index';

export const LOAD_DISTRICTMEALS = '[DISTRICTMEALSTORE] Load District Meals'
export const LOAD_DISTRICTMEALS_FAIL = '[DISTRICTMEALSTORE] Load District Meals Fail'
export const LOAD_DISTRICTMEALS_SUCCESS = '[DISTRICTMEALSTORE] LoadDistrict Meals Success'
export const CLEAR_DISTRICTMEALS = '[DISTRICTMEALSTORE] Clear District Meals'


export class LoadDistrictMeals implements Action {
  readonly type = LOAD_DISTRICTMEALS 
}

export class LoadDistrictMealsFail implements Action {
  readonly type = LOAD_DISTRICTMEALS_FAIL

  constructor(public payload: any) { }
}

export class LoadDistrictMealsSuccess implements Action {
  readonly type = LOAD_DISTRICTMEALS_SUCCESS

  constructor(public payload: StudentMeal) { }
}

export class ClearDistrictMeals implements Action {
  readonly type = CLEAR_DISTRICTMEALS
}
export type DistrictMealAction = LoadDistrictMeals | LoadDistrictMealsFail | LoadDistrictMealsSuccess | ClearDistrictMeals
