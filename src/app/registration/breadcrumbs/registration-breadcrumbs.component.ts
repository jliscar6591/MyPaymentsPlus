import { Component, Input } from '@angular/core';
import { Router } from '@angular/router'
import { RegistrationBreadcrumbsService } from '../../registration/services/registration-breadcrumbs.service'

@Component({
  selector: 'registration-breadcrumbs',
  templateUrl: './registration-breadcrumbs.component.html',
  styleUrls: ['./registration-breadcrumbs.component.css']
})

export class RegistrationBreadcrumbsComponent {

  constructor(
    private router: Router,
    public registrationBreadcrumbsService: RegistrationBreadcrumbsService
  ) {
  }

  ngOnInit() {
  }
}
