//import { Pipe, PipeTransform } from '@angular/core';
//import { CurrencyPipe } from '@angular/common';
//const _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
/////^(\d+)?\.?((\d+)(-(\d+))?)?$/
//function isNumeric(value: any): boolean {
//  return !isNaN(value - parseFloat(value));
//}
//@Pipe({
//  name: 'formatmoney'
//})
//export class FormatmoneyPipe implements PipeTransform {
//  constructor(private _currencyPipe: CurrencyPipe) { }
//  transform(value: any, currencyCode: string, symbolDisplay: boolean, digits: string): any {
//    value = typeof value === 'string' && isNumeric(value) ? +value : value;
//    if (typeof value === 'number' || _NUMBER_FORMAT_REGEXP.test(value)) {
//       return this._currencyPipe.transform(value, currencyCode, symbolDisplay, digits);
//    } else {
//    return value;
//    }
//  }
//}
//transform(value: any, currencyCode: string = 'USD', symbolDisplay: boolean = false): any {
//  return null;
//}
//# sourceMappingURL=formatmoney.pipe.js.map