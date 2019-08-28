export interface FeeCartDetail {
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
  amountInCart: number,
  amountToPay: number,
  isPartialPayEligible: boolean;
  partialPayDue: string;
 minimumPayment: number;


}

export interface FeeCartItem {
  itemCount: number;
  total: number;
  //Checkout summary only
  subTotal: number,
  consumerFeeTotal: number,
  bonusTotal: number,
  validationToken: string;

  items: FeeCartDetail[];
}

export interface FeeCartAddAmount {
  amount: number;
}
