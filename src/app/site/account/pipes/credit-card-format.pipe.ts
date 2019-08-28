import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'creditCardFormat' })
export class CreditCardFormatPipe implements PipeTransform {
    transform(val, args) {      
        let newStr = '';

        for (var i: number = 0; i < (Math.floor(val.length / 4) - 1); i++) {
            newStr = newStr + val.substr(i * 4, 4) + '-';
        }
        return newStr + val.substr(i * 4);
    }
}
