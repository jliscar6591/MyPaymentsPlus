export interface PaymentMethodViewModel {
    walletType: string;
    accountType: string;
    walletKey: string;
    accountHolderName: string;
    walletNickname: string;
    email: string;
    accountTail: string;
    expiryMonth: string;
    expiryYear: string;
    billingAddress: string;
    billingAddress2: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingPhone: string;
    isDefault: boolean;
}
