
import { MealAccount } from '../../shared/model/index';
import { StudentMealPurchaseModel} from '../../shared/model/index';
export interface StudentModel {

    studentId: string;
    lastName: string;
    firstName: string;
    districtName: string;
    accountBalanceId: string;
    accountId: number;
    mealAccounts: MealAccount[];
    studentMealPurchases: StudentMealPurchaseModel[];
    isActive: boolean;
    total: number;
    kaput: boolean;
}


