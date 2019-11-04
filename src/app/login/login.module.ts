import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { ToasterModule, ValidateCookieService } from '../shared/services/index';
import { PopoverModule } from '../shared/components/popover/popover.module';


import { LoginRouting } from './login.routes';

import { LoginHomeComponent } from './login-home/login-home.component'
import { LoginComponent } from './login-home/login.component'
import { ChangePasswordComponent } from './reset-password/change-password.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { RequestPasswordChangeComponent } from './reset-password/request-password-change.component'
import { ReCaptchaModule } from 'angular2-recaptcha';


import { EqualValidatorDirective } from '../shared/components/directives/equal-validator.directive';
import { UserContextService } from '../site/account/services/index';

import { PageLoadingModule } from '../shared/components/page-loading/page-loading.module';
import {
  AuthenticationService,
} from '../shared/services/index';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRouting,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ToasterModule,
    ReCaptchaModule,
    PopoverModule,
    PageLoadingModule,
    ClipboardModule
  ],
  declarations: [
    LoginHomeComponent,
    LoginComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    RequestPasswordChangeComponent,
    EqualValidatorDirective
  ],
  providers: [
    ValidateCookieService,
    UserContextService,
    LoginComponent,
    AuthenticationService,
  ]
})

export class LoginModule {

}
