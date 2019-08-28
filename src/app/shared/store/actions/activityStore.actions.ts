import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ActivitiesList, Categories } from '../../../site/model/activities.model';

export const LOAD_ACTIVITIES = '[ACTIVITIESSTORE] Load Activities'
export const LOAD_ACTIVITIES_FAIL = '[ACTIVITIESSTORE] Load Activities Fail'
export const LOAD_ACTIVITIES_SUCCESS = '[ACTIVITIESSTORE] Load Activities Success'

export class LoadActivities implements Action {
  readonly type = LOAD_ACTIVITIES
}

export class LoadActivitiesFail implements Action {
  readonly type = LOAD_ACTIVITIES_FAIL

  constructor(public payload: any) { }

}

export class LoadActivitiesSuccess implements Action {
  readonly type = LOAD_ACTIVITIES_SUCCESS

  constructor(public payload: ActivitiesList) { }

}

export type ActivitiesAction = LoadActivities | LoadActivitiesFail | LoadActivitiesSuccess
