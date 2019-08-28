import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptService } from './receipt.service';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions';
import { CartItem, CartResponse } from '../../../site/model/index';
import { ReceiptModel } from '../../model';
import { CartCheckoutService } from "../../../site/services/index";
import { LoginStoreService } from '../../../shared/services/index';
import { RefreshService } from '../../../shared/services/refresh.service';
import { PaymentHistoryService } from '../../../site/account/services';
import { AddCartItemService } from '../../../site/services/add-cart-item.service';
import { PageLoadingService } from '../../../shared/components/page-loading/page-loading.service';
import { clearInterval } from 'timers';
//import { clearInterval } from 'timers';
//import { setInterval } from 'timers';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptComponent implements OnInit {
  @Input() displayReceipt: boolean = true;
  @Input() displayHistoryReceipt: boolean = true;
  @Output() changeReceipt: EventEmitter<boolean> = new EventEmitter<boolean>();
  public receiptList: any;
  public areas: any;
  public students: any;
  public items: any;
  public receiptUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  public generalReceiptList: any;
  //Local variables
  public showHistoryReceipt: boolean;
  //Tells us if receipt is a purchase or history recepit
  public receiptType: any;
  public isbonusAmount: boolean = true;
  public receiptReady: boolean = false;
  private subscription: Subscription;
  private receiptDataCounter: number = 0;
  public cartStore: Observable<CartItem>;
  public cartState: CartResponse;
  public tempCartState: any;
  public transactions: any;
  public receiptCall: number = 0;
  private receiptDetailInterval: any;
  constructor(
    public receiptService: ReceiptService,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private state: State<AppState>,
    private refreshService: RefreshService,
    private loginStoreSvc: LoginStoreService,
    private cartCheckoutService: CartCheckoutService,
    private router: Router,
    private addCartItemService: AddCartItemService,
    public paymentHistoryService: PaymentHistoryService,
    private pageLoadingService: PageLoadingService,
  ) { this.cartStore = store.select(state => state.cartStore); }

  ngOnInit() {
   // console.log("Calling Receipt Component:", this.receiptService.transactions)
    this.pageLoadingService.show("Getting Receipt Details");
    if (this.receiptService.transactions) {
      //console.log('Receipt trasactions on page load', this.receiptService.transactions);
      //console.log(this.receiptService.receiptType);
      //console.log('what is this', this.cartCheckoutService.saleTransactionResponse);
      //console.log(this.receiptService.showReceipt);

      // clearInterval(this.receiptDetailInterval);
      this.receiptType = this.receiptService.receiptType;
      this.transactions = this.receiptService.transactions;
      this.cd.markForCheck();
      this.receiptReady = true;
        //console.log("Do we have details yet: ", this.receiptService.receiptDetail)
      if (this.receiptService.receiptDetail) {
        // console.log("What is the detail: ", this.receiptService.receiptDetail)
        if (this.receiptType == 'purchase') {
          if (this.transactions) {
            //console.log('whats the receipt type - purchase');
            //  console.log("Displaying the Receipt: ", this.transactions)
            this.displayReceipt = true;
            this.displayHistoryReceipt = false;
            // console.log("Setting show Receipt")
            this.pageLoadingService.hide();
          }

        } else {
          //console.log('whats the receipt type - history');
          // console.log("Displaying the Receipt from timeOut: ", this.transactions)
          this.displayReceipt = false;
          this.displayHistoryReceipt = true;
          this.pageLoadingService.hide();

        }
       // console.log('cartResponse: ', this.addCartItemService.cartResponse)
        //if (this.addCartItemService.cartResponse) {
        //  this.addCartItemService.cartResponse.itemCount = 0;
        //}
        //} else {
        //  const cartRespIntrvl =
        //    setInterval(() => {
        //      if (this.addCartItemService.cartResponse) {
        //        this.addCartItemService.cartResponse.itemCount = 0;
        //        clearInterval(cartRespIntrvl);
        //      }

        //    }, 500)
        //}
        
      } else {
        this.displayHistoryReceipt = true;
        this.displayReceipt = true;
      }
    } else {
      this.displayReceipt = false;

    }

  }

  ngAfterViewInit() {



  }

  ngDoCheck() {
    // console.log("Do we know the receipt type: ", this.receiptType);
    if (this.receiptType == 'history') {
      //  console.log("What is Show Receipt: ", this.showReceipt);
      let printDiv = document.querySelector('.history-receipt');
      this.receiptService.openTabReceipt(printDiv);
    }
  }

  setReceiptReady() {
    return true;
  }

  printReceipt() {
    let printDiv = document.querySelector('.receipt-container');
    //console.log("Here is the print content: ", printDiv.innerHTML);
    //removed width and height detail to force window to open in a new tab
    let windowObject = window.open("", '_blank');
    windowObject.document.write('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />');
    windowObject.document.writeln(printDiv.innerHTML)

    windowObject.document.write('<link rel="stylesheet" type="text/css" href="../../assets/css/print.css">');

    let btnContainer = windowObject.document.createElement('div');
    btnContainer.id = 'printBtnContainer';
    windowObject.document.body.appendChild(btnContainer);
    let btnHTML = '<div class="print-button-row">';
    btnHTML += '<button id="print" onclick="window.focus(); window.print(); window.close()">Print</button>';
    btnHTML += '<button id="cancel" onclick="window.close();">Cancel</button>';
    btnHTML += '</div>';
    btnContainer.innerHTML = btnHTML;
    windowObject.document.close();
    this.receiptService.result = false;
  }

  closeReceipt() {
    //console.log('does this happen');
    this.displayReceipt = false;
    this.displayHistoryReceipt = false;
    this.changeReceipt.emit(this.displayHistoryReceipt);
    this.receiptUpdate.emit(this.displayHistoryReceipt);
    this.receiptReady = false;
    this.receiptService.hide();
    this.loginStoreSvc.cookieStateItem.cartItemCount = 0;
    this.receiptService.result = false;

    this.store.dispatch(new CartStoreActions.ClearCart());
    this.cartStore.subscribe(c => this.cartState = c);
    let temptState = this.cartState;
    this.displayHistoryReceipt = false;
    this.displayReceipt = false;
    this.changeReceipt.emit(this.displayHistoryReceipt);
    this.receiptDataCounter = 0;
    this.receiptService.transactions = [];
    this.receiptService.refreshDash = true;
    this.refreshService.refreshCart();
    this.addCartItemService.cartResponse.itemCount = 0;

  }

  closeHistoryReceipt() {
    //console.log('or does this');
    this.displayReceipt = false;
    this.displayHistoryReceipt = false;
    this.changeReceipt.emit(this.displayHistoryReceipt);
    this.receiptUpdate.emit(this.displayHistoryReceipt);
    this.receiptReady = false;
    this.receiptService.hideHistory();
    let paymentType = this.receiptService.paymentType;
    this.receiptService.result = false;
    this.displayHistoryReceipt = false;
    this.displayReceipt = false;
    this.changeReceipt.emit(this.displayHistoryReceipt);
    this.receiptDataCounter = 0;
    this.receiptService.transactions = [];
    this.refreshService.refreshCart();

  }



  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}

