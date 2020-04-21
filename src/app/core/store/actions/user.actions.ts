import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { UserRegistrationModel } from 'src/app/auth/registration/user-registration.model';
import { AuthorizedUserModel } from 'src/app/auth/authorized-user.model';

export enum EUserActions {
  RegisterUserRequest = 'USER/RegisterUser_Request',
  RegisterUserSuccess = 'USER/RegisterUser_Success',
  RegisterUserFail = 'USER/RegisterUser_Fail',

  LoginUserRequest = 'USER/LoginUser_Request',
  LoginUserSuccess = 'USER/LoginUser_Success',
  LoginUserFail = 'USER/LoginUser_Fail',

  ClearAuthError = 'USER/ClearAuthError',
  UpdateUserData = 'USER/UpdateUserData',
  UpdateUserBalance = 'USER/UpdateUserBalance',
}

export class RegisterUserRequest implements Action {
  public readonly type = EUserActions.RegisterUserRequest;
  constructor(public payload: UserRegistrationModel) {}
}

export class RegisterUserSuccess implements Action {
  public readonly type = EUserActions.RegisterUserSuccess;
}

export class RegisterUserFail implements Action {
  public readonly type = EUserActions.RegisterUserFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class LoginUserRequest implements Action {
  public readonly type = EUserActions.LoginUserRequest;
  constructor(public payload: UserRegistrationModel) {}
}

export class LoginUserSuccess implements Action {
  public readonly type = EUserActions.LoginUserSuccess;
}

export class LoginUserFail implements Action {
  public readonly type = EUserActions.LoginUserFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class ClearAuthError implements Action {
  public readonly type = EUserActions.ClearAuthError;
}

export class UpdateUserData implements Action {
  public readonly type = EUserActions.UpdateUserData;
  constructor(public payload: AuthorizedUserModel) {}
}

export class UpdateUserBalance implements Action {
  public readonly type = EUserActions.UpdateUserBalance;
  constructor(public payload: number) {}
}

export type UserActions =
  | RegisterUserRequest
  | RegisterUserSuccess
  | RegisterUserFail
  | LoginUserRequest
  | LoginUserSuccess
  | LoginUserFail
  | ClearAuthError
  | UpdateUserData
  | UpdateUserBalance;
