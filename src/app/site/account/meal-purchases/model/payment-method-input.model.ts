import { CreditCard, Ach }  from './index';
import { Injectable } from '@angular/core';
@Injectable()



export class PaymentMethodInputModel {
    isDefault: boolean;
    nickname: string;    
    firstName: string;
    lastName: string;
    company: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    creditCard: CreditCard;
    ach: Ach;
    //For use with payment-method-dialog.component
    saveMethod: boolean;
}


