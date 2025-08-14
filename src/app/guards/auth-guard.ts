import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userProfile$.pipe(
    take(1),
    map(user => !!user), // Map to a boolean: true if user exists, false otherwise
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        console.log('Access denied - User not logged in');
        router.navigate(['/login']); // Redirect to login if not authenticated
      }
    })
  );
};