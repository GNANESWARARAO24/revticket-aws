import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    if (!this.authService.isAdmin()) {
      // Redirect to user home if not admin
      this.router.navigate(['/user/home']);
      return false;
    }
    
    return true;
  }
}