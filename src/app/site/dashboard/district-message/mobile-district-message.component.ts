import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DistrictMessageComponent } from './district-message.component';

@Component({
    moduleId: module.id,
    selector: 'mobile-district-message',
    templateUrl: './mobile-district-message.component.html',
    styleUrls:['../dashboard-home.component.less']
})

export class MobileDistrictMessageComponent {
  public showMessage: boolean = false;
  toggleMessage() {
    this.showMessage = true;
  }
}
