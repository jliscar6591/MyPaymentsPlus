import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Constants } from '../../../app.settings';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
    selector: 'alert-level-selector',
    templateUrl: 'alert-level.component.html',
    styleUrls: ['alert-level.component.less']
})

export class AlertLevelComponent {
    @Input() form: FormGroup;
    @Input() model: any[];
  @Input() index: number;
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  alertLevel = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);

  matcher = new MyErrorStateMatcher();



  
  ngOnInit() {
    }

    update(content){
        this.changed.emit(content);
  }

}   
