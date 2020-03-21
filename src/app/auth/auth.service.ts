import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { UserLoginModel } from './user-login.model';
import { UserRegistrationModel } from './user-registration.model';

interface AuthorizedUser {
  username: string;
  email: string;
  loggedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _apiService: ApiService) { }

  user$: BehaviorSubject<AuthorizedUser> = new BehaviorSubject(null);

  register$(user: UserRegistrationModel) {
    const request$ = this._apiService.post$<any>('/users', user).pipe(
      tap(res => {
        this.user$.next({
          username: user.username,
          email: user.email,
          loggedAt: new Date()
        });
        this.handleUserAuthorize(res['id_token']);
      })
    );
    return request$;
  }

  login$(user: UserLoginModel) {
    const request$ = this._apiService.post$<any>('/sessions/create', user).pipe(
      tap(res => this.handleUserAuthorize(res['id_token']))
    );
    return request$;
  }

  private handleUserAuthorize(token: string) {
    localStorage.setItem('Authorization', 'Bearer ' + token);
  }
}
