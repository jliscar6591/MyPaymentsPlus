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
var page_loading_component_1 = require("../../../shared/components/page-loading/page-loading.component");
var page_loading_service_1 = require("../../../shared/components/page-loading/page-loading.service");
var card_1 = require("@angular/material/card");
var button_1 = require("@angular/material/button");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var icon_1 = require("@angular/material/icon");
var PageLoadingModule = /** @class */ (function () {
    function PageLoadingModule() {
    }
    PageLoadingModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                card_1.MatCardModule,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                progress_spinner_1.MatProgressSpinnerModule
            ],
            declarations: [
                page_loading_component_1.PageLoadingComponent
            ],
            providers: [
                page_loading_service_1.PageLoadingService
            ],
            exports: [
                page_loading_component_1.PageLoadingComponent
            ],
            entryComponents: [
                page_loading_component_1.PageLoadingComponent
            ]
        })
    ], PageLoadingModule);
    return PageLoadingModule;
}());
exports.PageLoadingModule = PageLoadingModule;
//# sourceMappingURL=page-loading.module.js.map