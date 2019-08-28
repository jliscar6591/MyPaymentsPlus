    export interface CartResponseItem {
        liteItemType: string;
        itemKey: string;
        districtKey: string;
        accountBalanceID: string;
        studentName: string;
        itemName: string;
        amountInCart: number;
        netAmount: number;
        extendedAmount: number;
    }

    export interface CartResponse {
        itemCount: number;
        total: number;
        items: CartResponseItem[];
    }
