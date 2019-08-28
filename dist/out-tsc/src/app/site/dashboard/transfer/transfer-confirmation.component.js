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
var refresh_service_1 = require("../../../shared/services/refresh.service");
var TransferConfirmationComponent = /** @class */ (function () {
    function TransferConfirmationComponent(tranferService, refreshService) {
        this.tranferService = tranferService;
        this.refreshService = refreshService;
    }
    TransferConfirmationComponent.prototype.ngOnInit = function () {
        if (this.tranferService.transferFrmObj) {
            this.transferFrom = this.tranferService.transferFrmObj;
        }
        else {
            var feeModel = this.tranferService.feeModel;
            // console.log("The Fee Model");
            var nowDate = this.getToday();
            var studentName = this.tranferService.studentName.substring(0, 6);
            var category = feeModel.categoryName;
            var currentBalance = feeModel.amountInCart;
            var fromTransfer = {
                balanceDate: nowDate,
                category: category,
                studentName: studentName,
                currentBal: currentBalance
            };
            this.transferFrom = fromTransfer;
        }
        this.todaysDate = this.getToday();
    };
    TransferConfirmationComponent.prototype.goToDashboard = function () {
        console.log("We need to start the Transfer Refresh check");
        this.refreshService.refreshTransfers();
    };
    TransferConfirmationComponent.prototype.getToday = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            var x = '0' + dd;
            dd = parseInt(x);
        }
        if (mm < 10) {
            var x = '0' + mm;
            mm = parseInt(x);
        }
        var formatedDte = mm + '/' + dd + '/' + yyyy;
        return formatedDte;
    };
    TransferConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'transfer-confirmation',
            templateUrl: './transfer-confirmation.component.html',
            styleUrls: ['./transfer-confirmation.component.less']
        }),
        __metadata("design:paramtypes", [index_1.TransfersService,
            refresh_service_1.RefreshService])
    ], TransferConfirmationComponent);
    return TransferConfirmationComponent;
}());
exports.TransferConfirmationComponent = TransferConfirmationComponent;
//# sourceMappingURL=transfer-confirmation.component.js.map