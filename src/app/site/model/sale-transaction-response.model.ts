export interface CartResults {
    confirmationNumber: string;
    isSuccess: boolean,
    error: string
}

export interface SaleTransactionResponse {
    isSuccess: boolean;
  cartResults: CartResults[];
}
