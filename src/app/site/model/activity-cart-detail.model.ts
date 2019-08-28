import { CartItem } from "./cart-item-detail-model";

export interface ActivityCartDetail {
  liteItemType: string;
  itemKey: string;
  districtKey: string;
  accountBalanceID: string;
  studentName: string;
  itemName: string;
  itemAmount: number;
  amountInCart: number,
  isPartialPayEligible: boolean;
  partialPayDue: string;
  minimumPayment: number;
  quantity: number;
  formResponse: any;
  activityFormId: number;
}
