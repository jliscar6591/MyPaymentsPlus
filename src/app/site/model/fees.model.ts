export interface FeesList {
  name: string,
  studentKey: string,
  fees: FeeItems[];
}

export interface FeeItems {
  feeTransactionKey: string,
  description: null,
  dueDate: null,
  notificationType: number;
  feeName: null,
  minimumPayment: number,
  partialPayDue: null,
  supportsPartialPay: boolean,
  amount: number,
  amountInCart: number,
  amountToPay: number,
  isInCart: boolean
}


