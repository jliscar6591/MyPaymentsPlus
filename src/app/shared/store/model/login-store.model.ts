//This model is the same as the LoginResponse Model with the addition of the isMultiDistrict property
export class LoginStoreModel {
  access_token: string;
  expires_in: string;
  status: string;
  incidentId: string;
  message: string;
  messageType: string;
  //messageTitle: string = '';
  //showCloseButton: boolean = false;
  //closeHtml: string = '';
  requiresStudent: boolean;
  requiresRelationship: boolean;
  firstName: string;
  lastName: string;
  cartItemCount: number;
  districtKey: string;
  districtName: string;
  districtHasActivities: boolean;
  districtHasExams: boolean;
  districtHasFees: boolean;
  isNewExperience: boolean;
  allPaymentsSuspended: boolean;
  allPaymentsResumeDate: string;
  mealPaymentsSuspended: boolean;
  mealPaymentsResumeDate: string;
  isBlockACH: boolean;
  isBlockPayments: boolean;
  state: string;
  isAchAllowed: boolean;
  isAutoPayEnabled: boolean;
  isAlertsAllowedDistrict: boolean;
  isDisableMealPaymentsDistrict: boolean;
  isFroEnabled: boolean;
  externalNavRequest: string;
  isOldExperienceAllowed: boolean;
  isMultiDistrict: boolean;
  constructor(access_token: string = '',
    expires_in: string = '',
    status: string = '',
    incidentId: string = '',
    message: string = '',
    messageType: string = '',
    //messageTitle: string = '',
    //showCloseButton: boolean = false,
    //closeHtml: string = '',
    requiresStudent: boolean = false,
    requiresRelationship: boolean = false,
    firstName: string = '',
    lastName: string = '',
    cartItemCount: number = 0,
    districtKey: string = '',
    districtName: string = '',
    districtHasActivities: boolean = false,
    districtHasExams: boolean = false,
    districtHasFees: boolean = false,
    isNewExperience: boolean = false,
    allPaymentsSuspended: boolean = true,
    allPaymentsResumeDate: string = '',
    mealPaymentsSuspended: boolean = true,
    mealPaymentsResumeDate: string = '',
    isBlockACH: boolean = false,
    isBlockPayments: boolean = false,
    state: string = '',
    isAchAllowed: boolean = false,
    isAutoPayEnabled: boolean = false,
    isAlertsAllowedDistrict: boolean = false,
    isDisableMealPaymentsDistrict: boolean = false,
    isFroEnabled: boolean = false,
    externalNavRequest: string = '',
    isOldExperienceAllowed: boolean = true,
    isMultiDistrict: boolean = false) { }
}
