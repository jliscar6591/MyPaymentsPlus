import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';


//Local
import {LoginHomeComponent} from './login/login-home/login-home.component'
import {LoginComponent} from './login/login-home/login.component'
import { RegistrationFormComponent } from './registration/registration-form.component'

import { SiteGuard } from './site-guard.service';


const routes: Routes = [
	{

    path: '',		
		canActivateChild: [SiteGuard],
		children: [
			{
				path: 'home',
				component: LoginHomeComponent
			},
			{
				path: 'register',
				component: RegistrationFormComponent
			},
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'notfound',
				component: PageNotFoundComponent				
			},
			{
				path: '**',
				redirectTo: '/welcome'
			}
		]
	}
];

export const appRoutingProviders: any[] = [

];

// - Updated Export
export const routing = RouterModule.forRoot(routes);
