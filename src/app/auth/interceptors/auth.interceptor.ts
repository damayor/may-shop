import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { Observable, tap } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).token();

  console.log({authToken});
  const newReq = req.clone({
    headers: req.headers.append('Authorization',  `Bearer ${authToken}`),
  });
  return next(newReq);
}
