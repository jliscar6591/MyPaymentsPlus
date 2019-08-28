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
    bonusAmount: number;
}

export interface StudentMeal {
    accountBalanceID: string;
    firstName: string;
    lastName: string;
    balanceDate: string;
    mealAccounts: MealAccount[];
    //Needed to control the spinner on mobile layout
    isAddCartAmountSaving: boolean;
    //Needed to control the api errors on mobile layout
    failedAddCartAmount: boolean;
    failedAddCartAmountMsg: string;
    categoryDescription: string;
    bonusAmount: number;
}
