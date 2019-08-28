import { Component, Directive, Input, OnChanges, HostListener, Renderer, ElementRef  } from '@angular/core';

@Component({
    selector: "popover-password-validator",
    templateUrl: './popover-password-validator.component.html',
    styleUrls: ['./popover-password-validator.component.css']
})

export class PopoverPasswordValidatorComponent {
    public showPopover: boolean;
    private lengthValid: boolean;
    private containsNumber: boolean;
    private containsLetter: boolean;

    ngOnInit() {
        this.showPopover = false;
    }

    public change(event: Event) {
        var value = event.toString();
        this.lengthValid = (value.length > 6) ? true : false;
        this.containsNumber = (/\d/).test(value) ? true : false;
        this.containsLetter = (/[a-z]/i).test(value) ? true : false;
    }

    public show(event: Event) {
        this.showPopover = true;
    }

    public hide(event: Event) {
        this.showPopover = false;
    }

}
