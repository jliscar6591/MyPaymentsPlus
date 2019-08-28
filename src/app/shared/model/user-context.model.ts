import { UserPaymentModel } from './user-payment.model';
import { AvailableDistricts } from '../../site/model/available-districts.model';

export interface UserContextModel {
    allPaymentsResumeDate: string;
    allPaymentsSuspended: boolean;
    cartItemCount: number;
    districtKey: string;
    districtName: string;
    expires_in: string;
    firstName: string;
    incidentId: string;
    isAchAllowed: boolean;
    isAlertsAllowedDistrict: boolean;
    isAutoPayEnabled: boolean;
    isBlockACH: boolean;
    isBlockPayments: boolean;
    isDisableMealPaymentsDistrict: boolean;
    isNewExperience: boolean;
    lastName: string;
    mealPaymentsResumeDate: string;
    mealPaymentsSuspended: boolean;
    requiresRelationship: boolean;
    requiresStudent: boolean;
    state: string;
  availableDistricts: AvailableDistricts[];
  districtHasActivities: boolean,
  districtHasFees: boolean,
  districtHasExams: boolean,
  isMobileMealsOnly: boolean

}


