"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var select_1 = require("@angular/material/select");
var input_1 = require("@angular/material/input");
var card_1 = require("@angular/material/card");
var icon_1 = require("@angular/material/icon");
var button_1 = require("@angular/material/button");
var list_1 = require("@angular/material/list");
var checkbox_1 = require("@angular/material/checkbox");
var chips_1 = require("@angular/material/chips");
var activities_component_1 = require("./activities.component");
var activities_list_component_1 = require("./activities-list.component");
var activities_details_component_1 = require("./activities-details.component");
var activities_dialog_component_1 = require("./activities-dialog.component");
var activities_empty_component_1 = require("./activities-empty.component");
var activities_filter_component_1 = require("./activities-filter.component");
var expansion_1 = require("@angular/material/expansion");
var ngx_pagination_1 = require("ngx-pagination");
var forms_dialog_component_1 = require("./forms/forms-dialog/forms-dialog.component");
var forms_service_1 = require("../services/forms.service");
var radio_1 = require("@angular/material/radio");
var tabs_1 = require("@angular/material/tabs");
var dialog_1 = require("@angular/material/dialog");
var picture_dialog_component_1 = require("./picture-dialog.component");
var activities_routes_1 = require("./activities.routes");
var badge_1 = require("@angular/material/badge");
var ActivitiesModule = /** @class */ (function () {
    function ActivitiesModule() {
    }
    ActivitiesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                card_1.MatCardModule,
                select_1.MatSelectModule,
                input_1.MatInputModule,
                progress_spinner_1.MatProgressSpinnerModule,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                list_1.MatListModule,
                tabs_1.MatTabsModule,
                expansion_1.MatExpansionModule,
                checkbox_1.MatCheckboxModule,
                chips_1.MatChipsModule,
                ngx_pagination_1.NgxPaginationModule,
                radio_1.MatRadioModule,
                dialog_1.MatDialogModule,
                activities_routes_1.ActivitiesRouting,
                badge_1.MatBadgeModule
            ],
            declarations: [
                activities_component_1.ActivitiesComponent,
                activities_list_component_1.ActivitiesListComponent,
                activities_details_component_1.ActivitiesDetailsComponent,
                activities_empty_component_1.ActivitiesEmptyComponent,
                activities_dialog_component_1.ActivitiesDialogComponent,
                activities_filter_component_1.ActivitiesFilterComponent,
                forms_dialog_component_1.FormsDialogComponent,
                picture_dialog_component_1.PictureDialogComponent
            ],
            entryComponents: [
                activities_dialog_component_1.ActivitiesDialogComponent,
                forms_dialog_component_1.FormsDialogComponent,
                picture_dialog_component_1.PictureDialogComponent
            ],
            providers: [
                forms_service_1.FormsService
            ],
            exports: [
                forms_dialog_component_1.FormsDialogComponent,
                picture_dialog_component_1.PictureDialogComponent,
                activities_dialog_component_1.ActivitiesDialogComponent
            ]
        })
    ], ActivitiesModule);
    return ActivitiesModule;
}());
exports.ActivitiesModule = ActivitiesModule;
//# sourceMappingURL=activities.module.js.map