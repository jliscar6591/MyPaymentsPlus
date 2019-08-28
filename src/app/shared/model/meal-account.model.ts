export interface MealAccount {
    accountBalanceID: string;
    categoryKey: string;
    categoryName: string;
    currentBalance: number;
    pendingBalance: number;
    transferPendingAmount: number;
    cartAmount: number;
    currentBalanceLastUpdated: string;
    isDepositable: boolean;
   //Used for view model
    accountKey: string;
    alert: boolean;
    addAmount: string;
    //Needed to control the spinner on desktop layout
    isAddCartAmountSaving: boolean;
    //Needed to control the api errors on desktop layout
    failedAddCartAmount: boolean;
    failedAddCartAmountMsg: string;
}
