import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { UserLoginModel } from './login/user-login.model';
import { UserRegistrationModel } from './registration/user-registration.model';
import { AuthorizedUserModel } from './authorized-user.model';
import { UserInfoModel } from './user-info.model';

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

  private _logoutTimer: any;
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
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData || !this.getExpirationJWTTime(userData?._token)) {
      return;
    }
    this.user$.next(new AuthorizedUserModel(userData.email, userData.username, userData._token));
    this.autoLogout();
  }

  autoLogout() {
    this._logoutTimer = setTimeout(
      () => this.logout(),
      this.getExpirationJWTTime()
    );
  }

  logout() {
    this.user$.next(null);
    sessionStorage.removeItem('userData');
    clearTimeout(this._logoutTimer);
    this._router.navigate(['/login']);
  }

  private handleUserAuthorize(token: string) {
    const currentUser = new AuthorizedUserModel('', '', token);
    this.user$.next(currentUser);
    this.userInfo$().subscribe(user => {
      currentUser.username = user.name;
      currentUser.email = user.email;
      this.user$.next(currentUser);
      this.autoLogout();
      sessionStorage.setItem('userData', JSON.stringify(currentUser));
    });
  }

  public getExpirationJWTTime(token?: string): number {
    if (!token) {
      if (!!this.user$.value) {
        token = this.user$.value.token;
      } else {
        return null;
      }
    }
    const expDate = jwt_decode(token).exp;
    const expTime = !!expDate ? expDate * 1000 - Date.now() : null;
    return !!expTime && expTime > 0 ? expTime : null;
  }
}
