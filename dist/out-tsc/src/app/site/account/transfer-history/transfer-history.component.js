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
var index_1 = require("../../services/index");
var index_2 = require("../../../shared/services/index");
var app_settings_1 = require("../../../app.settings");
var rxjs_1 = require("rxjs");
require("rxjs/add/observable/interval");
//import { MatTableDataSource } from '@angular/material';
var TransferHistoryComponent = /** @class */ (function () {
    function TransferHistoryComponent(transferService, validateCookie, cookieService, utilityService, loginStoreService) {
        this.transferService = transferService;
        this.validateCookie = validateCookie;
        this.cookieService = cookieService;
        this.utilityService = utilityService;
        this.loginStoreService = loginStoreService;
        //= this.validateCookie.validateCookie();
        this.getTransferErr = false;
        //table variables
        this.displayedColumns = ['requestDate', 'from', 'to', 'status', 'amount', 'requestID'] || [];
        this.dataSource = this.xferHistoryData || [];
        this.loginResponse = this.loginStoreService.cookieStateItem;
    }
    TransferHistoryComponent.prototype.ngOnInit = function () {
        this.xferHistoryData = this.getXferHistory();
        this.dataSource = this.xferHistoryData;
        this.transferHistoryStatus();
    };
    TransferHistoryComponent.prototype.transferHistoryStatus = function () {
        /*Using because server is down
          Will need to use commented code
          Once testing is completed*/
        //if (this.transferData) {
        //  this.isTransferHistory = true;
        //} else {
        //  this.isTransferHistory = false;
        //  }
        this.isTransferHistory = true;
        return this.isTransferHistory;
    };
    TransferHistoryComponent.prototype.getXferHistory = function () {
        var _this = this;
        var subscription = this.transferService.getTransferHistory(this.loginResponse)
            .subscribe(function () {
            if (_this.transferService.result == true) {
                subscription.unsubscribe();
                if (_this.transferService.loginResponse.messageType === app_settings_1.Constants.Error) {
                    _this.getTransferErrMsg = _this.transferService.loginResponse.message;
                    _this.getTransferErr = true;
                    _this.utilityService.clearErrorMessage(_this.transferService.loginResponse);
                }
                else {
                    _this.loginStoreService.loadLogin(_this.transferService.loginResponse);
                    //this.cookieService.putObject(Constants.AuthCookieName, this.transferService.loginResponse);
                    if (_this.transferService.xferHistoryObj == undefined) {
                        _this.isTransferHistory = false;
                    }
                    else if (_this.transferService.xferHistoryObj) {
                        _this.isTransferHistory = true;
                    }
                    var seconds = rxjs_1.Observable.interval(app_settings_1.Constants.SpinnerDelayIncrement);
                    seconds.subscribe(function (x) {
                        if (x == 1) {
                            _this.isTransferHistory = false;
                        }
                        _this.xferHistoryData = _this.transferService.xferHistoryObj;
                        _this.isTransferHistory = true;
                    });
                }
            }
        });
        return this.xferHistoryData;
    };
    TransferHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-transfer-history',
            templateUrl: './transfer-history.component.html',
            styleUrls: ['./transfer-history.component.less']
        }),
        __metadata("design:paramtypes", [index_1.TransfersService,
            index_2.ValidateCookieService,
            index_2.CookieService,
            index_2.UtilityService,
            index_2.LoginStoreService])
    ], TransferHistoryComponent);
    return TransferHistoryComponent;
}());
exports.TransferHistoryComponent = TransferHistoryComponent;
//# sourceMappingURL=transfer-history.component.js.map