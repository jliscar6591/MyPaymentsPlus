export interface FormResponse {
  responseSetId: string,
  formResponses: FormResponses[]
}

export interface FormResponses {
  formRespsonses: FieldResponse
}

export interface FieldResponse {
  activityFormKey: string,
  formFieldId: number,
  response: any,
  responseSetId: string
}
