import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { PopoverComponent } from './popover.component'
import { PopoverPasswordValidatorComponent } from './popover-password-validator.component'

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PopoverComponent,
        PopoverPasswordValidatorComponent
    ],
    exports: [
        PopoverComponent,
        PopoverPasswordValidatorComponent
    ]
})

export class PopoverModule {

}