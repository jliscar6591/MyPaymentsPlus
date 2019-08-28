export interface TransferStatus {
  status: number;
}


export interface UserFeeItem {
  userFeeItemKey: string;
  price: number;
  description: string;
  districtKey: string;
}

//Guest Account Model
export interface TransferAccount {
  accountBalanceID: any;
  firstName: string;
  lastName: string;
}

export interface TransferUser {
  user: TransferAccount[];
}
export interface TransferHistory {
   requestDate: string;
   statusDate: string;
   from: string;
   to: string;
   amount: number;
   status: string;
   requestID: number;
}

export interface TransferItem {
  sourceAccountKey: string,
  sourceCategoryKey: string,
  targetAccountKey: string,
  targetCategoryKey: string,
  amountRequested: 0
}


export interface TransferHistoryItem {
  requestDate: string,
  statusDate: string,
  from: string,
  to: string,
  amount: 0,
  status: string,
  requestID: string
}

export interface TransferRequests {
  requestBatchId: string,
  transfers: Transfers[]
}

export interface Transfers {
  solanaDistrictId: 0,
  balanceTransferRequestKey: string,
  sourceExternalAccountId: string,
  sourceExternalCategoryId: string,
  targetExternalAccountId: string,
  targetExternalCategoryId: string,
  amount: 0,
  requestTimestamp: string,
  parent: Parent[]
}

export interface Parent {
  name: string,
  email: string,
  phone: string
}


