import { CartItem } from "./cart-item-detail-model";

export interface ExamCartDetail {
  liteItemType: string;
  itemKey: string;
  districtKey: string;
  accountBalanceID: string;
  studentName: string;
  itemName: string;
  examScheduleKey: string,
  needSpecialAccomodation : boolean,
  isSpecialProgramExam : boolean
}
