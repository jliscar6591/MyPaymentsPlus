"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoginResponseModel = /** @class */ (function () {
    function LoginResponseModel(access_token, expires_in, status, incidentId, message, messageType, messageTitle, showCloseButton, closeHtml, requiresStudent, requiresRelationship, firstName, lastName, cartItemCount, districtKey, districtName, isNewExperience, allPaymentsSuspended, allPaymentsResumeDate, mealPaymentsSuspended, mealPaymentsResumeDate, isBlockACH, isBlockPayments, state, isAchAllowed, isAutoPayEnabled, isAlertsAllowedDistrict, isDisableMealPaymentsDistrict, isFroEnabled, externalNavRequest, isOldExperienceAllowed) {
        if (access_token === void 0) { access_token = ''; }
        if (expires_in === void 0) { expires_in = ''; }
        if (status === void 0) { status = ''; }
        if (incidentId === void 0) { incidentId = ''; }
        if (message === void 0) { message = ''; }
        if (messageType === void 0) { messageType = ''; }
        if (messageTitle === void 0) { messageTitle = ''; }
        if (showCloseButton === void 0) { showCloseButton = false; }
        if (closeHtml === void 0) { closeHtml = ''; }
        if (requiresStudent === void 0) { requiresStudent = false; }
        if (requiresRelationship === void 0) { requiresRelationship = false; }
        if (firstName === void 0) { firstName = ''; }
        if (lastName === void 0) { lastName = ''; }
        if (cartItemCount === void 0) { cartItemCount = 0; }
        if (districtKey === void 0) { districtKey = ''; }
        if (districtName === void 0) { districtName = ''; }
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
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.status = status;
        this.incidentId = incidentId;
        this.message = message;
        this.messageType = messageType;
        this.messageTitle = messageTitle;
        this.showCloseButton = showCloseButton;
        this.closeHtml = closeHtml;
        this.requiresStudent = requiresStudent;
        this.requiresRelationship = requiresRelationship;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cartItemCount = cartItemCount;
        this.districtKey = districtKey;
        this.districtName = districtName;
        this.isNewExperience = isNewExperience;
        this.allPaymentsSuspended = allPaymentsSuspended;
        this.allPaymentsResumeDate = allPaymentsResumeDate;
        this.mealPaymentsSuspended = mealPaymentsSuspended;
        this.mealPaymentsResumeDate = mealPaymentsResumeDate;
        this.isBlockACH = isBlockACH;
        this.isBlockPayments = isBlockPayments;
        this.state = state;
        this.isAchAllowed = isAchAllowed;
        this.isAutoPayEnabled = isAutoPayEnabled;
        this.isAlertsAllowedDistrict = isAlertsAllowedDistrict;
        this.isDisableMealPaymentsDistrict = isDisableMealPaymentsDistrict;
        this.isFroEnabled = isFroEnabled;
        this.externalNavRequest = externalNavRequest;
        this.isOldExperienceAllowed = isOldExperienceAllowed;
    }
    return LoginResponseModel;
}());
exports.LoginResponseModel = LoginResponseModel;
//# sourceMappingURL=login-response.model.js.map