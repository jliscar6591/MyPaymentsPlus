//import { Injectable } from '@angular/core';
//@Injectable()

import { AutoPay } from './index';

export interface AutopayStudent {
    lastName: string;
    firstName: string;
    accountBalanceID: string;
    settings: AutoPay[];   
}

