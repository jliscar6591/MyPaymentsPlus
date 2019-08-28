import { BalanceAlert } from './index';

export interface StudentBalanceAlertModel {   
    lastName: string;
    firstName: string;    
    accountBalanceId: string;   
    balanceAlerts: BalanceAlert[];    
}

