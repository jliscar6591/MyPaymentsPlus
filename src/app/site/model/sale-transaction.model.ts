export interface CardTransaction {
    paymentType: string;
    nameOnAccount: string;
    company: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    cardCode: string;
}

export interface ACHTransaction {
    paymentType: string;
    nameOnAccount: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    account: string;
    accountType: string;
    routing: string;
}

export interface WalletTransaction {
    paymentType: string;
    key: string;
}

export interface SaleTransaction {
  payment: (CardTransaction | ACHTransaction | WalletTransaction);
  paymentChannel: string;
    validationToken: string;
}
