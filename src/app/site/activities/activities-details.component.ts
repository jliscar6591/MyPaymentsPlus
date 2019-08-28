import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivitiesDialogComponent } from './activities-dialog.component';
import { Observable } from 'rxjs';
import { LoginModel, LoginResponseModel } from '../../login/model/index';
import { Constants } from '../../app.settings';
import { ActivitiesService } from '../services/activities.service';
import { ActivitiesList, Activities, Categories, Accounts, Resources } from 'app/site/model/activities.model';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as ActivityStoreActions from '../../shared/store/actions/activityStore.actions'
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';
import { PictureDialogComponent } from './picture-dialog.component';

export interface ActivityDetails {
  accountKey: string;
  studentFirstName: string;
  activityKey: string;
  activityName: string;
  description: string;
  startDate: string;
  endDate: string;
  resources: Resources[];
  isQuantity: boolean;
  isVariable: boolean;
  isPartialPay: boolean;
  partialPayDue: string;
  minimumPayment: number;
  activityFormId: number;
  productImageId: number;
  signupEndDate: string;
  amount: number;
  isInCart: boolean;
  quantity: number;
}

@Component({
  selector: 'activities-details',
  templateUrl: './activities-details.component.html',
  styleUrls: ['./activities-details.component.less']
})
export class ActivitiesDetailsComponent implements OnInit {
  public mobile: boolean = false;
  public activityStore: Observable<ActivitiesList>;
  public activitiesList: ActivitiesList[];
  public activities: Activities[];
  public activityState: any;
  public activitiesReady: boolean = false;
  public accountKey: string;
  public studentFirstName: string;
  public activityKey: string;
  public activityName: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public isQuantity: boolean;
  public isVariable: boolean;
  public isPartialPay: boolean;
  public partialPayDue: string;
  public minimumPayment: number;
  public activityFormId: number;
  public productImageId: number;
  public amount: number;
  public insideIndex: number;
  public outsideIndex: number;
  public isInCart: boolean;
  public quantity: number;

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
  ) { this.activityStore = store.select(state => state.activityStore); }

  @Input() model: Activities;

  ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.activityStore.subscribe(c => this.activityState = c);
    this.activitiesList = this.activityState.data;
    this.activitiesReady = true;

  }

  public formatActivityDetails() {
    this.openActivityDialog();
  }

  public openActivityDialog() {
    const dialogRef = this.dialog.open(ActivitiesDialogComponent, {
      width: '750px',
      data: this.model,
    });
  }

  public openPictureDialog() {
    if (this.mobile) {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '300px',
        height: '300px',
        data: this.model.s3UriFull
      })
    } else {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '600px',
        data: this.model.s3UriFull
      })
    }
  }
}
