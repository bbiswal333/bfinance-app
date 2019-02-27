import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  data: any;
  constructor(private router: Router,private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.authService.isLoggedIn()){
        // this.authService.getLoggedInUser().subscribe(data =>{
        //   this.data = data;
        // })
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { redirectUrl: state.url }});
    return false;
  }
}