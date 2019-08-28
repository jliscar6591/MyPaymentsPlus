import { Injectable } from '@angular/core';
@Injectable()


export class AutopaySetupModel {
    studentName: string;
    accountBalanaceId: string;
    categoryKey: string;
    categoryName: string;
    walletKey: string;
    accountMinBalance: number;
    paymentAmount: number;
    walletNickname: string;
    autoPaySettingsKey: string;
    isActive: boolean;
}