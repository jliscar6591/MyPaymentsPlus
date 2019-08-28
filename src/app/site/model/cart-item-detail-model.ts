export interface CartItemDetail {
  //Common with checkout summary
  liteItemType: string;
  //
  itemKey: string;
  districtKey: string;
  accountBalanceID: string;
  //Common with checkout summary
  studentName: string;
  itemName: string;
  itemAmount: number;
  amountInCart: number;
  bonusAmount: number;
  //
  netAmount: number;
  extendedAmount: number;
  mealCategoryKey: string;
  categoryName: string;
  quantity: number;
  isPartialPayEligible: boolean;
  isQuantity: boolean;
  minimumPayment: number;
  formResponse: any;
  activityFormId: any;
  s3UriFull: any;
  s3URIThumb: any;
  isAutoEnrolled: string;
  amountRemaining: number;
}

export interface CartItem {
  itemCount: number;
  total: number;
  //Checkout summary only
  subTotal: number;
  consumerFeeTotal: number;
  bonusTotal: number;
  validationToken: string;

  items: CartItemDetail[];
}

export interface CartAddAmount {
  amount: number;
}

