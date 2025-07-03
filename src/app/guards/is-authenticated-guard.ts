import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { from, map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  return authState(auth).pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          return router.createUrlTree(['/login']);
        }
      })
    );
};
