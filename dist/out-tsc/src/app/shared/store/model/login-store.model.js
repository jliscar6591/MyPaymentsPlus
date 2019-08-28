"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This model is the same as the LoginResponse Model with the addition of the isMultiDistrict property
var LoginStoreModel = /** @class */ (function () {
    function LoginStoreModel(access_token, expires_in, status, incidentId, message, messageType, 
    //messageTitle: string = '',
    //showCloseButton: boolean = false,
    //closeHtml: string = '',
    requiresStudent, requiresRelationship, firstName, lastName, cartItemCount, districtKey, districtName, districtHasActivities, districtHasExams, districtHasFees, isNewExperience, allPaymentsSuspended, allPaymentsResumeDate, mealPaymentsSuspended, mealPaymentsResumeDate, isBlockACH, isBlockPayments, state, isAchAllowed, isAutoPayEnabled, isAlertsAllowedDistrict, isDisableMealPaymentsDistrict, isFroEnabled, externalNavRequest, isOldExperienceAllowed, isMultiDistrict) {
        if (access_token === void 0) { access_token = ''; }
        if (expires_in === void 0) { expires_in = ''; }
        if (status === void 0) { status = ''; }
        if (incidentId === void 0) { incidentId = ''; }
        if (message === void 0) { message = ''; }
        if (messageType === void 0) { messageType = ''; }
        if (requiresStudent === void 0) { 
        //messageTitle: string = '',
        //showCloseButton: boolean = false,
        //closeHtml: string = '',
        requiresStudent = false; }
        if (requiresRelationship === void 0) { requiresRelationship = false; }
        if (firstName === void 0) { firstName = ''; }
        if (lastName === void 0) { lastName = ''; }
        if (cartItemCount === void 0) { cartItemCount = 0; }
        if (districtKey === void 0) { districtKey = ''; }
        if (districtName === void 0) { districtName = ''; }
        if (districtHasActivities === void 0) { districtHasActivities = false; }
        if (districtHasExams === void 0) { districtHasExams = false; }
        if (districtHasFees === void 0) { districtHasFees = false; }
        if (isNewExperience === void 0) { isNewExperience = false; }
        if (allPaymentsSuspended === void 0) { allPaymentsSuspended = true; }
        if (allPaymentsResumeDate === void 0) { allPaymentsResumeDate = ''; }
        if (mealPaymentsSuspended === void 0) { mealPaymentsSuspended = true; }
        if (mealPaymentsResumeDate === void 0) { mealPaymentsResumeDate = ''; }
        if (isBlockACH === void 0) { isBlockACH = false; }
        if (isBlockPayments === void 0) { isBlockPayments = false; }
        if (state === void 0) { state = ''; }
        if (isAchAllowed === void 0) { isAchAllowed = false; }
        if (isAutoPayEnabled === void 0) { isAutoPayEnabled = false; }
        if (isAlertsAllowedDistrict === void 0) { isAlertsAllowedDistrict = false; }
        if (isDisableMealPaymentsDistrict === void 0) { isDisableMealPaymentsDistrict = false; }
        if (isFroEnabled === void 0) { isFroEnabled = false; }
        if (externalNavRequest === void 0) { externalNavRequest = ''; }
        if (isOldExperienceAllowed === void 0) { isOldExperienceAllowed = true; }
        if (isMultiDistrict === void 0) { isMultiDistrict = false; }
    }
    return LoginStoreModel;
}());
exports.LoginStoreModel = LoginStoreModel;
//# sourceMappingURL=login-store.model.js.map