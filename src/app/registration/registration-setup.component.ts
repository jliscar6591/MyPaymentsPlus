import { Component } from '@angular/core';
import { RegistrationBreadcrumbsService } from './services/index'
import {
  DistrictLoginDerivedService
} from '../shared/services/index';


@Component({
  selector: 'register-setup',
  templateUrl: './registration-setup.component.html',
  styleUrls: ['./registration-setup.component.css']
})

export class RegistrationSetupComponent {
  public guest: boolean;
  constructor(
    private breadcrumbService: RegistrationBreadcrumbsService,
    private districtLoginDerivedService: DistrictLoginDerivedService)
  { }

  ngOnInit() {
    console.log('RegistrationSetupComponent')
    this.breadcrumbService.breadcrumbUpdated.subscribe(
      (isGuest) => {
        this.guest = this.breadcrumbService.getGuestState();
      }
    )
    this.districtLoginDerivedService.deriveDistrict();
  }

}
