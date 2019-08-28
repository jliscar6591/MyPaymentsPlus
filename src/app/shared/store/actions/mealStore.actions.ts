import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StudentMeal, MealAccount } from '../../model/index';

export const LOAD_MEALS = '[MEALSTORE] Load Meals'
export const LOAD_MEALS_FAIL = '[MEALSTORE] Load Meals Fail'
export const LOAD_MEALS_SUCCESS = '[MEALSTORE] Load Meals Success'
export const CLEAR_MEALS = '[MEALSTORE] Clear Meals'


export class LoadMeals implements Action {
  readonly type = LOAD_MEALS
}

export class LoadMealsFail implements Action {
  readonly type = LOAD_MEALS_FAIL

  constructor(public payload: any) { }
}

export class LoadMealsSuccess implements Action {
  readonly type = LOAD_MEALS_SUCCESS

  constructor(public payload: StudentMeal) { }
}

export class ClearMeals implements Action {
  readonly type = CLEAR_MEALS
}
export type MealAction = LoadMeals | LoadMealsFail | LoadMealsSuccess | ClearMeals
