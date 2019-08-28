export interface ReceiptModel {

  payorReferenceNum: number;
  nameOnPayment: string;
  userFirstName: string;
  convenienceFee: number;
  subtotalAmount: number;
  totalAmount: number;
  transactionDetailNum: number;
  transactionDate: string;
  accountTail: string;
  cardType: string;
  itemAmount: number;
  paymentCategory: string;
  quantity: string;
  studentFirstName: string;
  transactionDesc: string;
  totalBonus: number;
  dba: string;
  areas: Areas[];
}

export interface Areas {
  areas: [
    {
      area: string;
      students: Students[];
    } 
    ]
}

export interface Students {
  students: [
    {
      studentFirstName: string;
      studentSubtotal: number;
      items: Items[];
   }
  ]  
}

export interface Items {
  items: [
    {
      itemAmount: number;
      bonusAmount: number;
      quantity: number;
      transactionDesc: string;
    }
  ]
}
