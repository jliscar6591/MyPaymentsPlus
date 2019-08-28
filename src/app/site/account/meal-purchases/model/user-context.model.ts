import { UserPaymentModel } from './user-payment.model';

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
  isFroEnabled: boolean;
  isOldExperienceAllowed: boolean;
  isMobileMealsOnly: boolean;
  districtHasFees: boolean;
  districtHasActivities: boolean;
  districtHasExams: boolean;
availableDistricts: AvailableDistricts[];
}

export interface AvailableDistricts {
  districtKey: string;
  districtName: string;
}



