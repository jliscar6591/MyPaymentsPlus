import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable()
export class SiteGuard implements CanActivate, CanActivateChild {

	constructor(
		private router: Router		
	) { }

	canActivate() {
		return true;
	}

	canActivateChild(destination: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		
		var canRedirect: boolean;
		if (state.url === '/notfound') {
			return true;
		}

		if (state.url === '/welcome') {
			return true;
		}	
		return canRedirect;
	}
    
}