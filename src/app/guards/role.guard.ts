import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'] as Role;
    
    return this.authService.currentUser.pipe(
      take(1),
      map(user => {
        if (user && user.role === requiredRole) {
          return true;
        } else {
          // Redirect to appropriate page based on user's role or login
          if (user) {
            // User is logged in but doesn't have the right role
            switch (user.role) {
              case Role.USER:
                this.router.navigate(['/user/profile']);
                break;
              case Role.CLIENT:
                this.router.navigate(['/client/dashboard']);
                break;
              case Role.ADMIN:
                this.router.navigate(['/admin/dashboard']);
                break;
              default:
                this.router.navigate(['/login']);
            }
          } else {
            this.router.navigate(['/login']);
          }
          return false;
        }
      })
    );
  }
}

// Create a factory function that returns a proper CanActivateFn
export function roleGuard(role: Role): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    console.log(`Role guard checking for role: ${role}`);
    
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.initialized$.pipe(
      take(1),
      switchMap(() => authService.currentUser),
      take(1),
      map(user => {
        if (user && user.role === role) {
          console.log(`User ${user.email} has required role ${role}`);
          return true;
        } else {
          console.log(`User does not have required role ${role}. Current user:`, user);
          // Redirect to appropriate page based on user's role or login
          if (user) {
            // User is logged in but doesn't have the right role
            switch (user.role) {
              case Role.USER:
                router.navigate(['/user/profile']);
                break;
              case Role.CLIENT:
                router.navigate(['/client/dashboard']);
                break;
              case Role.ADMIN:
                router.navigate(['/admin/dashboard']);
                break;
              default:
                router.navigate(['/login']);
            }
          } else {
            router.navigate(['/login']);
          }
          return false;
        }
      })
    );
  };
}