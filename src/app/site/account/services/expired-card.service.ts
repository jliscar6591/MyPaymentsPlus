import {Injectable }     from '@angular/core';
@Injectable()

export class ExpiredCard {
    constructor() { }

    cardExpireValidator(expiryMonth: any, expiryYear: any): boolean {
        var currentDate = new Date();
        var newDate = new Date(expiryYear, expiryMonth);
        if (currentDate < newDate) {
            return true;
        } else {
            return false;
        }
    }

}