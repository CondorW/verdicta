import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin$.pipe(
    take(1), // Take the first value emitted and complete
    tap(isAdmin => {
      if (!isAdmin) {
        // If not an admin, redirect to the home page
        console.error('Access denied - Admins only');
        router.navigate(['/']);
      }
    })
  );
};