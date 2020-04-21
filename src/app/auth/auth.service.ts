import { Injectable } from '@angular/core';
import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';

import { UserLoginModel } from './login/user-login.model';
import { UserRegistrationModel } from './registration/user-registration.model';
import { AuthorizedUserModel } from './authorized-user.model';
import { UserInfoModel } from './user-info.model';
import { IAppState } from '../core/store/state/app.state';
import { UpdateUserData, UpdateUserBalance } from '../core/store/actions/user.actions';
import { selectUserToken } from '../core/store/selectors/user.selector';

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
    private _store: Store<IAppState>,
    ) {}

  private _logoutTimer: any;

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

  async autoLogin() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData || !(await this.getExpirationJWTTime(userData?.token))) {
      return;
    }
    this._store.dispatch(new UpdateUserData(new AuthorizedUserModel(userData.email, userData.username, userData.token)));
    this.userInfo$().subscribe(user => {
      this._store.dispatch(new UpdateUserBalance(user.balance));
    });
    this.autoLogout();
  }

  async autoLogout() {
    this._logoutTimer = setTimeout(
      () => this.logout(),
      await this.getExpirationJWTTime()
    );
  }

  logout() {
    this._store.dispatch(new UpdateUserData(null));
    sessionStorage.removeItem('userData');
    clearTimeout(this._logoutTimer);
    this._router.navigate(['/login']);
  }

  private handleUserAuthorize(token: string) {
    let currentUser = new AuthorizedUserModel('', '', token);
    this._store.dispatch(new UpdateUserData(currentUser));
    this.userInfo$().subscribe(user => {
      currentUser = new AuthorizedUserModel(user.email, user.name, token);
      this._store.dispatch(new UpdateUserData(currentUser));
      this._store.dispatch(new UpdateUserBalance(user.balance));
      this.autoLogout();
      sessionStorage.setItem('userData', JSON.stringify(currentUser));
    });
  }

  public async getExpirationJWTTime(token?: string): Promise<number> {
    if (!token) {
      token = await this._store.pipe(
        select(selectUserToken),
        take(1)
      ).toPromise();
    }
    const expDate = jwt_decode(token).exp;
    const expTime = !!expDate ? expDate * 1000 - Date.now() : null;
    return !!expTime && expTime > 0 ? expTime : null;
  }
}
