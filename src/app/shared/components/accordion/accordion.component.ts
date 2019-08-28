import { Component, Input, AfterViewChecked } from '@angular/core';

@Component({
    selector: 'accordion',
    templateUrl: './accordion.component.html',
})

export class AccordionComponent {
    @Input() heading: string;
    public isOpen: boolean;

    constructor() {
    }

    ngOnInit() {
        this.isOpen = false;
    }

    toggleOpen(event: MouseEvent): void {
        event.preventDefault();
        this.isOpen = !this.isOpen;
    }
  
}
