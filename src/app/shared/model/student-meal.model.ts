import {MealAccount} from './meal-account.model'
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
}
