//Cool approach that uses an inline approach to define the parameters
//for the comparison elements definition. 
//We have implemented the form model pattern that applies validation
//within the typescript file along with the form definition
//and the rest of the validation. 
import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true }
    ]
})
export class EqualValidatorDirective implements Validator {
    constructor( @Attribute('validateEqual') public validateEqual: string) {

    }

    validate(c: AbstractControl): { [key: string]: boolean } {
        // self value
        let v = c.value;

        // control value
        let e = c.root.get(this.validateEqual);

        // value not equal
        if (e && v !== e.value) {
            return {
                validateEqual: false
            }
        }

        return null;
    }
}