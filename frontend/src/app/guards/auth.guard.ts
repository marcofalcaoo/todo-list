import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log('Auth Guard - isAuthenticated:', isAuth);
  console.log('Auth Guard - token:', authService.token);

  if (isAuth) {
    return true;
  }

  // Not authenticated, redirect to login
  console.log('Auth Guard - Redirecting to login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
