import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    try {
      if (this.authService.isAuthenticated()) {
        const allowedRoles = route.data['roles'] as string[];
        const loggedInUser = this.authService.getLoggedInUser();
  
        if (allowedRoles && loggedInUser && allowedRoles.includes(loggedInUser['rank'])) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error in canActivate:', error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}
