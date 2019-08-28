export interface PaymentMethodDetailModel {
    walletType: string;
    accountType: string;
    walletKey: string;
    walletNickname: string;
    accountTail: string;
    expiryMonth: string;
    expiryYear: string;
    cardCode: string;
    isExpired: boolean;
    accountHolderName: string;
    email: string;
    billingAddress: string;
    billingAddress2: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingPhone: string;
    isDefault: boolean;
        
}

