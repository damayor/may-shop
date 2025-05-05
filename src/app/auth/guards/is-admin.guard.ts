import { AuthService } from '@auth/services/auth.service';
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('Is Admin Guard')

  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom( authService.checkStatus() );
  const user = authService.user()

  if(!user?.roles.includes('admin') /*&& !user?.roles.includes('super')*/) {
    return false;
  }

  console.log('si es admin, puedes entrar')

  return true;
}
