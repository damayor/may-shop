import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '@products/interfaces/user.interface';
import { environment } from '../../../environments/environment.development';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);


  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),

  })

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() == 'checking') return 'checking';

    if(this._user()) {
      return 'authenticated'
    }

    return 'not-authenticated'
  })


  user = computed(() => this._user())
  token = computed(this._token)
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false)



  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password,
    }).pipe(
      map( resp => this.handleAuthSuccess(resp)   ),
      catchError((error: any) =>  this.handleAuthError(error))
    )
  }


  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName,
    }).pipe(
      map( resp => this.handleAuthSuccess(resp)   ),
      catchError((error: any) =>  this.handleAuthError(error))
    )
  }


  checkStatus():Observable<boolean> {

    console.log('checkStatus called')
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // },
    }).pipe(
      map( resp =>   this.handleAuthSuccess(resp)   ),
      catchError((error: any) => this.handleAuthError(error) )
    )

  }


  logout() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    localStorage.removeItem('token');

  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user)
    this._authStatus.set('authenticated');
    this._token.set(resp.token)

    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(error: any){
    this.logout();
    return of(false)
  }
}
