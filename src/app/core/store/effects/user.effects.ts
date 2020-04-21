import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { IAppState } from '../state/app.state';
import { AuthService } from 'src/app/auth/auth.service';
import { EUserActions, RegisterUserRequest, RegisterUserSuccess, RegisterUserFail, LoginUserRequest, LoginUserSuccess } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  @Effect()
  createUser$ = this._actions$.pipe(
    ofType<RegisterUserRequest>(EUserActions.RegisterUserRequest),
    switchMap(registerUserAction => this._authService.register$(registerUserAction.payload)),
    switchMap(() => {
      return of(new RegisterUserSuccess());
    }),
    catchError((error: HttpErrorResponse) => of(new RegisterUserFail(error)))
  );

  @Effect({ dispatch: false })
  createUserSuccess$ = this._actions$.pipe(
    ofType<RegisterUserSuccess>(EUserActions.RegisterUserSuccess),
    tap(() => {
      this._router.navigate(['/']);
    })
  );

  @Effect()
  loginUser$ = this._actions$.pipe(
    ofType<LoginUserRequest>(EUserActions.LoginUserRequest),
    switchMap(loginUserAction => this._authService.login$(loginUserAction.payload)),
    switchMap(() => {
      return of(new LoginUserSuccess());
    }),
    catchError((error: HttpErrorResponse) => of(new RegisterUserFail(error)))
  );

  @Effect({ dispatch: false })
  loginUserSuccess$ = this._actions$.pipe(
    ofType<LoginUserSuccess>(EUserActions.LoginUserSuccess),
    tap(() => {
      this._router.navigate(['/']);
    })
  );

  constructor(
    private _actions$: Actions,
    private _store$: Store<IAppState>,
    private _router: Router,
    private _authService: AuthService,
  ) {}
}
