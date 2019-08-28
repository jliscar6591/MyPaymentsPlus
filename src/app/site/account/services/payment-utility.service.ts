import { Injectable } from '@angular/core';
@Injectable()

export class PaymentUtilityService {
    constructor() { }


    monthNumber(): string[] {
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    }

    yearNumber(): Array<string> {
        var currentDate = new Date();
        let year: Array<string> = new Array();
        for (var i = 0; i < 15; i++) {
            year.push((currentDate.getFullYear() + i).toString());
        }
        return year;
    }

    currencyList(): number[] {
        return [10, 20, 30, 40, 50];
    }

    autoPayAmountList(): number[] {
        return [25, 50, 75, 100];
    }

    autoPayMinBalList(): number[] {
        return [10, 20, 30, 40, 50];
    }

    paymentList():  string[] {
        return ['25', '50', '75', '100'];
    }

    balanceList(): string[] {
        return ['20', '30', '40', '50'];
    }
}