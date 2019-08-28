import { Component, Input, Output, EventEmitter, ViewContainerRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StudentMeal, MealAccount } from '../../model/index';
import { Constants } from '../../../app.settings';
import { LoginResponseModel } from '../../../login/model/index';
import { CartItemDetail, CartItem, CheckoutItem } from '../../model/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { SimpleDialogService } from '../../../shared/components/simple-dialog/simple-dialog.service';
import { AddCartItemService, CartCheckoutItemsService, ValidCartCountService, TransfersService } from '../../services/index';
import {
  CookieService,
  ValidateCookieService,
  MessageProcessorService,
  UtilityService,
  LoginStoreService
} from '../../../shared/services/index';
import { Store, State } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as CartStoreActions from '../../../shared/store/actions/cartStore.actions'
import { setTimeout } from 'timers';
import { tap } from 'rxjs/internal/operators/tap';
import { state } from '@angular/animations/src/animation_metadata';
import { Form, Fields, Choices } from '../../model/forms.model';
import { FormResponse, FieldResponse } from '../../activities/forms/formResponse.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormsService } from '../../services/forms.service';
import { FormsDialogComponent } from '../../activities/forms/forms-dialog/forms-dialog.component';
import { PictureDialogComponent } from '../../activities/picture-dialog.component';


@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.less'],
  providers: [FormsDialogComponent]
})

export class CartItemComponent {
  public fields: Fields[];
  public choices: Choices[];
  public mobile: boolean = false;
  private pipe: boolean = true;
  public isReview: boolean = false;
  private failedAddCartAmount: boolean = false;
  private failedAddCartAmountMsg: string = '';
  private isAddCartAmountSaving: boolean = false;
  private loginResponse: LoginResponseModel;
  //= this.validateCookie.validateCookie();
  public isTransfer: any;
  public isCanEdit: boolean = true;
  public cartStore: Observable<CartItem>;
  public form: any;
  public cartState: any;
  public cartItem: CartItem;
  public cartStateItems: CartItem;
  public item: CartItemDetail;
  public i: number;
  public hasCounter: number = 0;
  public invalidQuantity: boolean = false;
  public responses: any;
  public uniqueResponses: any;
  public uniqueForms: any;
  public getcartItemInterval: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private formsService: FormsService,
    private addCartItemService: AddCartItemService,
    // private validateCookie: ValidateCookieService,
    private cookieService: CookieService,
    private utilityService: UtilityService,
    private dialogService: SimpleDialogService,
    private viewContainerRef: ViewContainerRef,
    private cartCheckoutItemsService: CartCheckoutItemsService,
    public formBuilder: FormBuilder,
    private transferSrvc: TransfersService,
    private validCartCountService: ValidCartCountService,
    private loginStoreSvc: LoginStoreService,
    private store: Store<AppState>,
    private state: State<AppState>
  ) {
    this.loginResponse = this.loginStoreSvc.cookieStateItem;
    this.cartStore = store.select(state => state.cartStore);

  };
  @Input() quantityForm: FormGroup;
  @Input() model: CartItemDetail;
  @Input() insideIndex: number;
  @Input() checkout: CheckoutItem;
  @Input() isMobile: EventEmitter<any> = new EventEmitter<any>();
  @Output() updated: EventEmitter<CartItemDetail> = new EventEmitter<CartItemDetail>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();


  async ngOnInit() {
    this.mobile = (window.innerWidth < 960) ? true : false;
    this.isMobile.subscribe(value => {
      this.mobile = value;
    });
    this.form = this.createEditForm();
    if (this.router.url == '/checkout') {
      //console.log("What is the Model: ", this.model);
    }

    if (this.router.url == '/review') {
      this.isReview = true;
      //console.log("What is the Model: ", this.model);
    }

    if (!this.isReview) {
      if (this.form) {
        await this.form.valueChanges
          .subscribe(data => this.utilityService.onValueChanged(this.form, this.formErrors, this.validationMessages));
      }


    }

    //this.quantityForm = new FormGroup({
    //  quantity: new FormControl()
    //});
    // console.log("About to subscribeToGetCartCheckoutCartItem - CartItem1:  ", this.cartCheckoutItemsService.cartItem)
    if (this.cartCheckoutItemsService.cartItem) {
      this.cartStore.subscribe(c => this.cartState = c);
      this.cartStateItems = this.cartCheckoutItemsService.cartItem;
    } else {
      this.getcartItemInterval = window.setInterval(() => {
        if (this.cartCheckoutItemsService.cartItem) {
          let newCartItem = this.cartCheckoutItemsService.cartItem;
          this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem))
          this.cartStore.subscribe(c => this.cartState = c);
          this.cartStateItems = this.cartState.data;
          window.clearInterval(this.getcartItemInterval);
        }

      }, 1000)
    }

    // this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);

    //this.cartCheckoutItemsService.getCartCheckoutCartItem(this.loginResponse)
    //  .subscribe(
    //    data => {
    //      this.cartCheckoutItemsService.cartItem = data;
    //    },
    //    error => {
    //      console.log("Error: No Transfer Account: ", error);
    //      this.cartCheckoutItemsService.cartResults = false;
    //    },
    //    () => {

    //      this.cartCheckoutItemsService.cartResults = true;
    //      if (this.cartStateItems) {
    //        this.store.dispatch(new CartStoreActions.ClearCart())
    //      }
    //      if (this.cartCheckoutItemsService.cartItem) {
    //        this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartCheckoutItemsService.cartItem))
    //        this.cartStore.subscribe(c => this.cartState = c);
    //        // console.log("do we have a cartItem: ", this.cartState)
    //        if (this.cartState) {
    //          this.cartStateItems = this.cartState.data.items;
    //          // console.log("cartStateItems: ", this.cartStateItems)
    //        }
    //      }

    //    }
    //  )

    //window.setTimeout(() => {
    //  let newCartItem = this.cartCheckoutItemsService.cartItem;
    //  this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem))
    //  this.cartStore.subscribe(c => this.cartState = c);
    //  this.cartStateItems = this.cartState.data;
    //  //console.log('cartStateItems', this.cartStateItems);
    //}, 2000
    //);
  }

  public createEditForm() {
    const group = new FormGroup({});
    group.addControl('editAmount' + this.insideIndex, new FormControl(''));
    return group;
  }

  ngDoCheck() {

    if (this.addCartItemService.cartResponse && this.hasCounter < 4) {
      let newCartItem = this.cartCheckoutItemsService.cartItem;
      this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem))
      this.cartStore.subscribe(c => this.cartState = c);
      this.cartStateItems = this.cartState.data;
      this.hasCounter++;
    }
  }

  ngAfterViewInit() {
    if (this.transferSrvc.feeCartItem) {
      // this.isTransfer = this.getCartItemType();
      window.setTimeout(() => {
        this.getCartItemType();
      }, 1000)
      // console.log("Is this a transferFee: ", this.isTransfer)
    }
  }


  validate() {
    this.utilityService.onValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  //Determine in the row is a meal
  isMeal(liteItemType: string): boolean {
    return liteItemType == 'meal';
  }

  isFee(liteItemType: string): boolean {
    return liteItemType == 'fee';
  }

  isActivity(liteItemType: string): boolean {
    return liteItemType == 'activity';
  }

  confirmRemove(item: CartItemDetail) {
    var dialogContent = '<p>Please confirm that you would like to remove the following item from your cart:</p>';
    if (this.isMeal(item.liteItemType)) {
      dialogContent += '<br/><p><b>' + item.studentName + "'s meal plan</b></p><p>" + item.itemName + "</p>";
      if (!isNaN(item.amountInCart)) {
        dialogContent += "<p>Remove $" + item.itemAmount + "</p>";
        //console.log(item.itemAmount);
      }
    }
    else if (this.isFee(item.liteItemType)) {
      dialogContent += '<br/><p><b>' + item.itemName + "</b></p><p>$" + item.amountInCart + '</p>';
    } else if (this.isActivity(item.liteItemType)) {
      dialogContent += '<br/><p><b>' + item.itemName + "</b></p><p>$" + item.amountInCart + '</p>';
    }
    this.dialogService.open("Delete Item", dialogContent, 'Delete', null, this.viewContainerRef)
      .subscribe(result => {
        if (result) {
          this.remove.emit({
            item: item,
            index: this.insideIndex
          });
          // console.log("What is result: ", result)
          //console.log("About to subscribeToGetCartCheckoutCartItem - CartItem2: ")
          this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
          window.setTimeout(() => {
            let newCartItem = this.cartCheckoutItemsService.cartItem;
            this.store.dispatch(new CartStoreActions.LoadCartSuccess(newCartItem))
            this.cartStore.subscribe(c => this.cartState = c);
            this.cartStateItems = this.cartState.data;
            this.updateCartStore(item)

          }, 1000
          );

          //console.log(result);
          this.addCartItemService.deleteCartItemNew(item.itemKey, item.accountBalanceID, this.loginResponse);
          //this.cartCheckoutItemsService.subscribeToGetCartCheckoutCartItem(this.loginResponse);
          window.setTimeout(() => {
            this.updateCartStore(item);
          },1000
          );


        };
      });
  }

  private updateCartStore(item: CartItemDetail) {
    //  console.log("What is our Item: ", item);
    this.cartStore.subscribe(c => this.cartState = c);
    if (this.cartState) {
      this.cartStateItems = this.cartState.data;
      // console.log('cartstate',this.cartStateItems);
    }


    //  console.log("Do we have cartStateItem: ", this.cartStateItems)
    if (this.cartStateItems.items) {
      // console.log("Do we have cartStateItem.Items: ", this.cartStateItems.items.length)
      this.cartStateItems.items.length
      for (let i = 0; i < this.cartStateItems.itemCount; i++) {
        let x = 0;
        if (item.itemKey == this.cartStateItems.items[i].itemKey && item.accountBalanceID == this.cartStateItems.items[i].accountBalanceID) {
          // console.log("What is I and I: ", i);
          let removedTotal = this.cartStateItems.items[i].amountInCart;
          if (this.cartStateItems.subTotal) {
            this.cartStateItems.subTotal = this.cartStateItems.total - removedTotal;
          } else {
            this.cartStateItems.subTotal = 0;
          }

          if (this.cartStateItems.total < 1) {
            this.cartStateItems.total = 0;
            this.cartStateItems.consumerFeeTotal = 0;
          }
          x = i + 1;
          if (this.cartStateItems.items.length > 0) {
            this.store.dispatch(new CartStoreActions.ClearCart())
            //console.log('is store clear', this.cartState);
            //console.log('whats going in here?', this.cartStateItems)
            this.loginResponse.cartItemCount = this.cartStateItems.itemCount;
            this.store.dispatch(new CartStoreActions.LoadCartSuccess(this.cartStateItems))
            this.cartStore.subscribe(c => this.cartState = c);
            this.cartStateItems = this.cartState.data;
            //console.log('cartStateItems after dispatch', this.cartStateItems);
            //console.log('this.model', this.model);
          } else {
            this.store.dispatch(new CartStoreActions.ClearCart())
            this.cartStore.subscribe(c => this.cartState = c);
            this.cartStateItems = this.cartState.data;
          }
          this.cartCheckoutItemsService.cartItem = this.cartStateItems;
        }

      }
    }

  }

  public formErrors = {
    'editAmount': ''
  };


  validationMessages = {
    'editAmount': {
      'pattern': 'Amount must be valid.',
      'required': 'Amount must be valid.',
      'minimumAmount': 'Amount must be greater than 0.'
    },
  };

  isNaN(num) {
    return isNaN(num) || (num == '');
  }


  update(item, insideIndex) {
    this.item = item;
    //console.log('update this.item', this.item);
    //console.log('what is this?', Number(this.form.get('editAmount' + insideIndex).value));
    //console.log('this.form', this.form);
    if (this.form.get('editAmount' + insideIndex).value !== '') {
      if (this.item.liteItemType === 'meal') {
        //this.model.itemAmount = Number(this.form.get('editAmount' + insideIndex).value);
        this.item.itemAmount = Number(this.form.get('editAmount' + insideIndex).value);
        this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
      } else if (this.item.liteItemType === 'fee') {
        if (Number(this.form.get('editAmount' + insideIndex).value) < this.model.minimumPayment) {
          this.form.controls['editAmount' + insideIndex].status = 'INVALID';
          this.formErrors = {
            'editAmount': 'Amount must be greater than' + this.model.minimumPayment,
          };
        } else if (Number(this.form.get('editAmount' + insideIndex).value) > this.item.itemAmount) {
          this.form.controls['editAmount' + insideIndex].status = 'INVALID';
          this.formErrors = {
            'editAmount': 'Amount must be less than' + this.item.itemAmount,
          };
        } else {
          this.form.status = 'VALID';
          //console.log(this.model.itemKey);
          //console.log(this.item.itemKey);
          //console.log('no its me', this.form.get('editAmount' + insideIndex).value);
          this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
          //this.model.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
          this.form.controls['editAmount' + insideIndex].setValue(Number(this.form.get('editAmount' + insideIndex).value));
        }

      } else if (this.item.liteItemType === 'activity') {
        if (Number(this.form.get('editAmount' + insideIndex).value) < this.model.minimumPayment) {
          this.form.controls['editAmount' + insideIndex].status = 'INVALID';
          this.formErrors = {
            'editAmount': 'Amount must be greater than' + this.model.minimumPayment,
          };
        } else if (Number(this.form.get('editAmount' + insideIndex).value) > this.item.itemAmount) {
          this.form.controls['editAmount' + insideIndex].status = 'INVALID';
          this.formErrors = {
            'editAmount': 'Amount must be less than' + this.item.itemAmount,
          };
        } else {
          this.form.status = 'VALID';
          //console.log('model key', this.model.itemKey);
          //console.log('item key', this.item.itemKey);
          //console.log('no its me', this.form.get('editAmount' + insideIndex).value);
          this.item.amountInCart = Number(this.form.get('editAmount' + insideIndex).value);
          //this.model.amountInCart = this.form.get('editAmount' + insideIndex).value;
          this.form.controls['editAmount' + insideIndex].setValue(Number(this.form.get('editAmount' + insideIndex).value));
        }

      } else if (this.form.get('editAmount' + insideIndex).value === NaN) {
        if (this.item.liteItemType === 'meal') {
          this.item.itemAmount = this.model.itemAmount;
          this.item.amountInCart = this.model.amountInCart;
        } else {
          //console.log('me', this.model.amountInCart);
          this.item.amountInCart = this.model.amountInCart;
          this.form.controls['editAmount' + insideIndex].setValue(this.model.amountInCart);
        }
      }
      if (this.form.controls['editAmount' + insideIndex].status === 'VALID') {
        this.updated.emit(this.item);
        //console.log('updated item', this.item);
        //sets cart validity on components listening to cart
        this.cartCheckoutItemsService.cartValidity(true);
      } else {
        this.cartCheckoutItemsService.cartValidity(false);
      }
      //Removed quantity changer for now will add back later
      //if (this.model.isQuantity) {
      //  if (this.quantityForm.value.quantity <= 1) {
      //    this.invalidQuantity = true;
      //  } else if (this.quantityForm.value.quanity !== '') {
      //    this.invalidQuantity = false;
      //    this.item.quantity = this.quantityForm.value.quantity;
      //    this.item.amountInCart = this.model.itemAmount;
      //    this.model.quantity = this.quantityForm.value.quantity
      //  } else {
      //    this.invalidQuantity = false;
      //    this.item.quantity = this.model.quantity;
      //    this.item.amountInCart = this.model.itemAmount;
      //  }
      //}
      //console.log('what is the value of the edit form', this.form.get('editAmount' + insideIndex).value);

      //  console.log(this.item);
      //if (this.form.valid) {
      //  //emits when item gets updated to save
      //  this.updated.emit(this.item);
      //  console.log('updated item', item);
      //  //sets cart validity on components listening to cart
      //  this.cartCheckoutItemsService.cartValidity(true);
      //}
      //else {
      //  this.cartCheckoutItemsService.cartValidity(false);
      //}
    }
  }

  focusAmount($event) {
    //remove pipe on focus to avoid trying to format invalid values
    this.pipe = false;
    //adds back trailing .00 if needed
    //if (this.form.get('editAmount').value !== '' && this.form.get('editAmount').value !== 0) {
    //  this.form.get('editAmount').setValue(parseFloat(this.form.get('editAmount').value).toFixed(2));
    //}
    //selects entire input on focus
    $event.target.select();
  }

  getCartItemType() {
    // console.log("What is feeCartItem: ", this.transferSrvc.feeCartItem);
    if (this.transferSrvc.feeCartItem) {

      let cartType = this.transferSrvc.feeCartItem['liteItemType'];
      //If true disable the input
      if (cartType == "userFee") {
        this.isTransfer = true;
        this.isCanEdit = false;
      } else {
        this.isTransfer = false;
        this.isCanEdit = true;
      }
    } else {
      this.isCanEdit = true;
      this.isTransfer = false;
    }
    //console.log("What is isTransfer: ", this.isTransfer);
    // console.log("What is CanEdit: ", this.isCanEdit)
  }

  public populateForm(formId: number, ) {
    this.uniqueResponses = [];
    this.uniqueForms = [];
    this.responses = this.model.formResponse;
    //console.log('formId', this.model.activityFormId);
    //console.log('responses', this.responses);
    this.formsService.subscribeToGetForm(this.loginResponse, this.model.activityFormId, this.model.accountBalanceID);
    var i;
    for (i = 0; i < this.responses.length; i++) {
      this.uniqueResponses.push(this.responses[i].responseSetId);
    }
    this.uniqueForms = this.uniqueResponses.filter(this.getUniqueResponses);
    //console.log('number of forms to dislplay in tabs', this.uniqueForms.length);
    this.openFormsDialogFixed();
  }

  public getUniqueResponses(value, index, self) {
    return self.indexOf(value) === index;
  }

  public openFormsDialogFixed(): void {
    window.setTimeout(() => {
      //console.log('form', this.formsService.form);
      let config = new MatDialogConfig();

      config.panelClass = 'my-class';
      config.width = '750px'
      config.data = {
        form: this.formsService.form,
        activity: this.model,
        responses: this.responses,
        quantity: this.uniqueForms.length,
        uniqueForms: this.uniqueForms
      }
      config.disableClose = true;
      const dialogRef = this.dialog.open(FormsDialogComponent, config);
    }, 1000);
  }

  public openPictureDialog() {
    if (this.mobile) {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '200px',
        height: '300px',
        data: this.model.s3UriFull
      })
    } else {
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        width: '600px',
        data: this.model.s3UriFull
      })
    }
  }
}
