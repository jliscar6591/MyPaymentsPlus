"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
//Local
var app_settings_1 = require("../../app.settings");
var utility_service_1 = require("./utility.service");
var DateRangeSelectorService = /** @class */ (function () {
    function DateRangeSelectorService(http, utilityService) {
        this.http = http;
        this.utilityService = utilityService;
        //True when http call returns
        this.result = false;
        //Used to count retry 
        this.count = 0;
    }
    DateRangeSelectorService.prototype.getDateRangeSelections = function (loginResponse) {
        var _this = this;
        var successMessage = '';
        var failureMessage = 'Date range selection list failed';
        this.loginResponse = loginResponse;
        this.http.request('/assets/data/date-range-selector.data.json')
            .subscribe(function (data) { _this.dateRangeSelectorModel = data.json(); }, function (error) {
            _this.utilityService.processApiErr(error, _this.loginResponse, failureMessage);
            _this.result = true;
        }, function () {
            //processing the successful response
            _this.result = true;
        });
        //Return to calling program every polling interval
        return rxjs_1.Observable.interval(app_settings_1.Constants.PollingInterval);
    };
    DateRangeSelectorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            utility_service_1.UtilityService])
    ], DateRangeSelectorService);
    return DateRangeSelectorService;
}());
exports.DateRangeSelectorService = DateRangeSelectorService;
//# sourceMappingURL=date-range-selector.service.js.map