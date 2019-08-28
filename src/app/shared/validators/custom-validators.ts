import { NG_VALIDATORS, FormArray, FormControl, FormGroup, Validator, ValidationErrors } from '@angular/forms';


export class CustomValidators {

  static validMoney(c: FormControl) {
    const isValidMoney = /^\d+(?:\.\d{0,2})$/.test(c.value);
    const message = {
      'validMoney': {
        'message': 'The Entered Amount must be a number'
      }
    };

    return isValidMoney ? null : message;
  }


  static validTransfer(c: FormControl, b: FormControl) {
    const isValidTransfer = c.value < b.value;
    const message = {
      'validTransfer': {
        'message': 'Entered Transfer amount will result in a negative balance'
      }
    };
    return isValidTransfer ? null : message;
  }

}
