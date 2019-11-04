import { FieldResponse } from "../activities/forms/formResponse.model";
import { Form } from "./forms.model";

export interface ActivitiesList {
  category: string,
  subCategory: Categories[],
  accounts: Accounts[],
}

export interface Categories {
  category: string,
  accounts: Accounts[],
}

export interface Accounts {
  accountKey: string,
  studentFirstName: string,
  studentLastName: string,
  activities: Activities[],
}

export interface Activities {
  activityKey: string,
  amountInCart: number,
  activityName: string,
  description: string,
  startDate: string,
  endDate: string,
  isQuantity: boolean,
  isInCart: boolean,
  isVariable: boolean,
  isPartialPay: boolean,
  partialPayDue: string,
  minimumPayment: number,
  signupEndDate: string;
  activityFormId: number,
  productImageId: number,
  location: string,
  amount: number,
  formModel: Form,
  resources: Resources[],
  category: string,
  quantity: number;
  subCategory: string,
  studentName: string,
  studentKey: string,
  formResponse: FieldResponse[],
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  isAutoAddToCart: boolean,
  s3UriFull: string,
  s3URIThumb: string
}

export interface Resources {
  link: string,
  label:string,
}
