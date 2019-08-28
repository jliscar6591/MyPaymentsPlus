import { Component, OnInit } from '@angular/core';
import { StudentMealsService, StudentMealsServiceRemote, AddCartItemService, TransfersService } from "../../services/index";
import { RefreshService } from '../../../shared/services/refresh.service';

@Component({
  selector: 'transfer-confirmation',
  templateUrl: './transfer-confirmation.component.html',
  styleUrls: ['./transfer-confirmation.component.less']
})
export class TransferConfirmationComponent implements OnInit {

  constructor(
    public tranferService: TransfersService,
    public refreshService: RefreshService
  ) { }

  public transferFrom: any;
  private todaysDate: any;

  ngOnInit() {
    if (this.tranferService.transferFrmObj) {
      this.transferFrom = this.tranferService.transferFrmObj;
    } else {
      let feeModel = this.tranferService.feeModel;
     // console.log("The Fee Model");
      let nowDate = this.getToday();
      let studentName = this.tranferService.studentName.substring(0, 6);
      let category = feeModel.categoryName;
      let currentBalance = feeModel.amountInCart;
      let fromTransfer = {
        balanceDate: nowDate,
        category: category,
        studentName: studentName,
        currentBal: currentBalance
      };
      this.transferFrom = fromTransfer;
    }

    
    this.todaysDate = this.getToday();
  }

  public goToDashboard() {
    console.log("We need to start the Transfer Refresh check")
    this.refreshService.refreshTransfers();
  }

  getToday() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      let x = '0' + dd;
      dd = parseInt(x);
    }

    if (mm < 10) {
      let x = '0' + mm;
      mm = parseInt(x);
    }

    let formatedDte = mm + '/' + dd + '/' + yyyy;
    return formatedDte;
  }

}
