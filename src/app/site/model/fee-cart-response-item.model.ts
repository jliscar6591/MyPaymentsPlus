export interface FeeCartResponseItem {
  liteItemType: string;
  itemKey: string;
  districtKey: string;
  accountBalanceID: string;
  studentName: string;
  itemName: string;
  itemAmount: number;
  netAmount: number;
  extendedAmount: number;
}

export interface FeeCartResponse {
  itemCount: number;
  total: number;
  items: FeeCartResponseItem[];
}
