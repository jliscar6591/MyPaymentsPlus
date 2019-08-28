import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { routing, appRoutingProviders } from './app.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { BonusAdDialogComponent } from './site/dashboard/bonus-ad/bonus-ad-dialog/bonus-ad-dialog.component';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { PrivacyDialogComponent } from './registration/privacy-dialog/privacy-dialog.component';
import { TermsDialogComponent } from './registration/terms-dialog/terms-dialog.component';
import { HttpIntercept } from './shared/http-inteceptors/http-intercept';
import { FeesService } from './site/services/index';
import { RefreshService } from './shared/services/refresh.service';
import { TokenService } from './shared/services/token.service';
import { LoginStoreService } from './shared/services/login-store.service';
import { FormsService } from './site/services/forms.service';
import { MealsComponent } from './site/dashboard/meals/meals.component';



//Materials
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatSelectModule,
  MatFormFieldModule,
  MatRadioModule,
  MatDialogModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
//import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
    //{ provide: MATERIAL_COMPATIBILITY_MODE, useValue: true },

//Modules
import { LoginModule } from './login/login.module';
import { SupplementalModule } from './site/supplemental/supplemental.module';
import { RegistrationModule } from './registration/registration.module';
import { SiteModule } from './site/site.module';
import { SiteGuard } from './site-guard.service';
import { StoreModule } from '@ngrx/store';


//Other

import {
  CookieService,
  CookieOptions,
  CookieModule,
  ToasterModule,
  UtilityService,
  MessageProcessorService,
} from './shared/services/index';

//Local
import { AppComponent } from './app.component';
import { BonusScheduleService } from 'app/site/services';
import { ShowErrorsComponent } from './shared/components/show-errors/show-errors.component';
import { feeReducer } from '../app/shared/store/reducers/FeeStore.reducer';
import { cartReducer } from '../app/shared/store/reducers/cartStore.reducer';
import { mealReducer } from './shared/store/reducers/mealStore.reducer';
import { districtMealReducer } from './shared/store/reducers/districtMealStore.reducer';
import { loginReducer } from './shared/store/reducers/loginStore.reducers';
import { FormsDialogComponent } from './site/activities/forms/forms-dialog/forms-dialog.component';
import { activityReducer } from 'app/shared/store/reducers/activityStore.reducer';
import { SnackBarComponent } from './shared/components/components/snack-bar/snack-bar.component';
import { cookieReducer } from './shared/store/reducers/cookieStore.reducer';
import { NotificationCenterComponent } from './shared/notification-center/notification-center.component';
import { MealsAddBottomSheetComponent } from 'app/site/dashboard/meals/meals-add-bottom-sheet.component';


@NgModule({
  imports: [
    CookieModule.forRoot(),
    BrowserModule,
    routing,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    HttpModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    HttpClientModule,
    LoginModule,
    MatRadioModule,
    BrowserAnimationsModule,
    SupplementalModule,
    SiteModule,
    RegistrationModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxPaginationModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    StoreModule.forRoot({
      feeStore: feeReducer,
      cartStore: cartReducer,
      mealStore: mealReducer,
      districtMealStore: districtMealReducer,
      loginStore: loginReducer,
      cookieStore: cookieReducer,
      activityStore: activityReducer
    }),
    MatBottomSheetModule  
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
     ShowErrorsComponent,
     SnackBarComponent,
     NotificationCenterComponent
    
  ],
  entryComponents: [
    BonusAdDialogComponent,
    PrivacyDialogComponent,
    TermsDialogComponent,
    FormsDialogComponent,
    MealsAddBottomSheetComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
    SiteGuard,
    CookieService,
    UtilityService,
    MessageProcessorService,
    BonusScheduleService,
    ToasterService,
    FeesService,
    RefreshService,
    TokenService,
    LoginStoreService,
    FormsService,
    MatBottomSheetModule,
    MealsComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
