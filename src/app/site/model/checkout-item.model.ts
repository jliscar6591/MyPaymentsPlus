export interface CheckoutItem {
  bonusTotal: number,
  consumerFeeTotal: number,
  itemCount: number,
  total: number,
  subTotal: number,
  validationToken: string,
  totalTax: number,
  discountTotal: number,
  isDiscountAvailable: boolean,
  merchants: Merchant[],
  discounts: Discounts[]
}

export interface Merchant {
  dba: string,
  convenienceFee: number,
  itemGroups: ItemGroup[]
}

export interface ItemGroup {
  itemGroupName: string,
  items: item[]
}

export interface item {
  liteItemType: string,
  studentName: string,
  itemName: string,
  itemAmount: number,
  bonusAmount: number,
  quantity: number,
  dueBy: number,
  isPartialPay: boolean,
  amountRemaining: number,
  discountCode: string
  discountAmount: number,
  isDiscounted: boolean
}

export interface Discounts {
  discountDescription: string,
  quantity: number,
  discountedItemDescription: string,
  discountedItenKey: string,
  discountCode: string,

}
