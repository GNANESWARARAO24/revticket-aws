import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, @Inject(Router) private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
      return true;
    }
    return true; // Allow access to user routes even when not authenticated
  }
}