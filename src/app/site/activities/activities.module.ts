import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesListComponent } from './activities-list.component';
import { ActivitiesDetailsComponent } from './activities-details.component';
import { ActivitiesDialogComponent } from './activities-dialog.component';
import { ActivitiesEmptyComponent } from './activities-empty.component';
import { ActivitiesFilterComponent } from './activities-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsDialogComponent } from './forms/forms-dialog/forms-dialog.component';
import { FormsService } from '../services/forms.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { PictureDialogComponent } from './picture-dialog.component';
import { ActivitiesRouting } from './activities.routes';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatChipsModule,
    NgxPaginationModule,
    MatRadioModule,
    MatDialogModule,
    ActivitiesRouting,
    MatBadgeModule
  ],
  declarations: [
    ActivitiesComponent,
    ActivitiesListComponent,
    ActivitiesDetailsComponent,
    ActivitiesEmptyComponent,
    ActivitiesDialogComponent,
    ActivitiesFilterComponent,
    FormsDialogComponent,
    PictureDialogComponent
  ],
  entryComponents: [
    ActivitiesDialogComponent,
    FormsDialogComponent,
    PictureDialogComponent
  ],
  providers: [
    FormsService
  ],
  exports: [
    FormsDialogComponent,
    PictureDialogComponent,
    ActivitiesDialogComponent
  ]

})
export class ActivitiesModule { }
