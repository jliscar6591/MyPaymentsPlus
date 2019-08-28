import { StudentModel } from '../../registration/model/index';

export interface StudentMealPurchaseSearchModel {
    startDate: string;
    endDate: string;
    student: StudentModel;
}
