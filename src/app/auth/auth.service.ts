import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserLoginModel } from './login/user-login.model';
import { UserRegistrationModel } from './registration/user-registration.model';
import { AuthorizedUserModel } from './authorized-user.model';
import { HttpClient } from '@angular/common/http';
import { UserInfoModel } from './user-info.model';
import { Router } from '@angular/router';

interface AuthRequest {
  id_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    ) {}

  user$: BehaviorSubject<AuthorizedUserModel> = new BehaviorSubject(null);

  register$(user: UserRegistrationModel) {
    const request$ = this._http.post<AuthRequest>('/users', user)
    .pipe(
      tap(res => this.handleUserAuthorize(res.id_token))
    );
    return request$;
  }

  login$(user: UserLoginModel) {
    const request$ = this._http
      .post<AuthRequest>('/sessions/create', user)
      .pipe(
        tap(res => this.handleUserAuthorize(res.id_token))
      );
    return request$;
  }

  userInfo$(): Observable<UserInfoModel> {
    const request$ = this._http.get<any>(
      '/api/protected/user-info'
    );
    return request$.pipe(map(res => res.user_info_token));
  }

  autoLogin() {
    const loadedUser: AuthorizedUserModel = JSON.parse(sessionStorage.getItem('userData'));
    if (!loadedUser) {
      return;
    }
    this.user$.next(loadedUser);
  }

  logout() {
    this.user$.next(null);
    sessionStorage.removeItem('userData');
    this._router.navigate(['/login']);
  }

  private handleUserAuthorize(token: string) {
    const currentUser = new AuthorizedUserModel('', '', token);
    this.user$.next(currentUser);
    this.userInfo$().subscribe(user => {
      currentUser.username = user.name;
      currentUser.email = user.email;
      this.user$.next(currentUser);
      sessionStorage.setItem('userData', JSON.stringify(currentUser));
    });
  }
}
