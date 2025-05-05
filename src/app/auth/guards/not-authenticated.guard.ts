import { AuthService } from '@auth/services/auth.service';
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('Not authenticaded Guard')

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticaded = await firstValueFrom( authService.checkStatus() )
  console.log({isAuthenticaded})

  if(isAuthenticaded) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
}
