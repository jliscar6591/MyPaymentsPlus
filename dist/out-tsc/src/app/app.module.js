"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/platform-browser/animations");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var ngx_pagination_1 = require("ngx-pagination");
var ngx_device_detector_1 = require("ngx-device-detector");
var app_routes_1 = require("./app.routes");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var chips_1 = require("@angular/material/chips");
var http_2 = require("@angular/common/http");
var page_not_found_component_1 = require("./shared/components/page-not-found/page-not-found.component");
var bonus_ad_dialog_component_1 = require("./site/dashboard/bonus-ad/bonus-ad-dialog/bonus-ad-dialog.component");
var angular2_toaster_1 = require("angular2-toaster/angular2-toaster");
var privacy_dialog_component_1 = require("./registration/privacy-dialog/privacy-dialog.component");
var terms_dialog_component_1 = require("./registration/terms-dialog/terms-dialog.component");
var http_intercept_1 = require("./shared/http-inteceptors/http-intercept");
var index_1 = require("./site/services/index");
var refresh_service_1 = require("./shared/services/refresh.service");
var token_service_1 = require("./shared/services/token.service");
var login_store_service_1 = require("./shared/services/login-store.service");
var forms_service_1 = require("./site/services/forms.service");
var meals_component_1 = require("./site/dashboard/meals/meals.component");
//Materials
var material_1 = require("@angular/material");
var datepicker_1 = require("@angular/material/datepicker");
var material_2 = require("@angular/material");
var tabs_1 = require("@angular/material/tabs");
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
//import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
//{ provide: MATERIAL_COMPATIBILITY_MODE, useValue: true },
//Modules
var login_module_1 = require("./login/login.module");
var supplemental_module_1 = require("./site/supplemental/supplemental.module");
var registration_module_1 = require("./registration/registration.module");
var site_module_1 = require("./site/site.module");
var site_guard_service_1 = require("./site-guard.service");
var store_1 = require("@ngrx/store");
//Other
var index_2 = require("./shared/services/index");
//Local
var app_component_1 = require("./app.component");
var services_1 = require("app/site/services");
var show_errors_component_1 = require("./shared/components/show-errors/show-errors.component");
var FeeStore_reducer_1 = require("../app/shared/store/reducers/FeeStore.reducer");
var cartStore_reducer_1 = require("../app/shared/store/reducers/cartStore.reducer");
var mealStore_reducer_1 = require("./shared/store/reducers/mealStore.reducer");
var districtMealStore_reducer_1 = require("./shared/store/reducers/districtMealStore.reducer");
var loginStore_reducers_1 = require("./shared/store/reducers/loginStore.reducers");
var forms_dialog_component_1 = require("./site/activities/forms/forms-dialog/forms-dialog.component");
var activityStore_reducer_1 = require("app/shared/store/reducers/activityStore.reducer");
var snack_bar_component_1 = require("./shared/components/components/snack-bar/snack-bar.component");
var cookieStore_reducer_1 = require("./shared/store/reducers/cookieStore.reducer");
var notification_center_component_1 = require("./shared/notification-center/notification-center.component");
var meals_add_bottom_sheet_component_1 = require("app/site/dashboard/meals/meals-add-bottom-sheet.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                index_2.CookieModule.forRoot(),
                platform_browser_1.BrowserModule,
                app_routes_1.routing,
                forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
                http_1.HttpModule,
                material_1.MatButtonModule,
                material_1.MatToolbarModule,
                material_1.MatCardModule,
                material_1.MatInputModule,
                tabs_1.MatTabsModule,
                material_1.MatSelectModule,
                material_1.MatIconModule,
                material_1.MatDialogModule,
                chips_1.MatChipsModule,
                http_2.HttpClientModule,
                login_module_1.LoginModule,
                material_1.MatRadioModule,
                animations_1.BrowserAnimationsModule,
                supplemental_module_1.SupplementalModule,
                site_module_1.SiteModule,
                registration_module_1.RegistrationModule,
                datepicker_1.MatDatepickerModule,
                material_2.MatNativeDateModule,
                ngx_pagination_1.NgxPaginationModule,
                ngx_device_detector_1.DeviceDetectorModule.forRoot(),
                forms_1.FormsModule,
                store_1.StoreModule.forRoot({
                    feeStore: FeeStore_reducer_1.feeReducer,
                    cartStore: cartStore_reducer_1.cartReducer,
                    mealStore: mealStore_reducer_1.mealReducer,
                    districtMealStore: districtMealStore_reducer_1.districtMealReducer,
                    loginStore: loginStore_reducers_1.loginReducer,
                    cookieStore: cookieStore_reducer_1.cookieReducer,
                    activityStore: activityStore_reducer_1.activityReducer
                }),
                bottom_sheet_1.MatBottomSheetModule
            ],
            declarations: [
                app_component_1.AppComponent,
                page_not_found_component_1.PageNotFoundComponent,
                show_errors_component_1.ShowErrorsComponent,
                snack_bar_component_1.SnackBarComponent,
                notification_center_component_1.NotificationCenterComponent
            ],
            entryComponents: [
                bonus_ad_dialog_component_1.BonusAdDialogComponent,
                privacy_dialog_component_1.PrivacyDialogComponent,
                terms_dialog_component_1.TermsDialogComponent,
                forms_dialog_component_1.FormsDialogComponent,
                meals_add_bottom_sheet_component_1.MealsAddBottomSheetComponent
            ],
            providers: [
                { provide: http_2.HTTP_INTERCEPTORS, useClass: http_intercept_1.HttpIntercept, multi: true },
                site_guard_service_1.SiteGuard,
                index_2.CookieService,
                index_2.UtilityService,
                index_2.MessageProcessorService,
                services_1.BonusScheduleService,
                angular2_toaster_1.ToasterService,
                index_1.FeesService,
                refresh_service_1.RefreshService,
                token_service_1.TokenService,
                login_store_service_1.LoginStoreService,
                forms_service_1.FormsService,
                bottom_sheet_1.MatBottomSheetModule,
                meals_component_1.MealsComponent
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map