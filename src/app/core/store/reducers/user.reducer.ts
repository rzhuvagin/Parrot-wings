import { initialUserState, IUserState } from '../state/user.state';
import { UserActions, EUserActions } from '../actions/user.actions';

export const userReducers = (
  state = initialUserState,
  action: UserActions
): IUserState => {
  switch (action.type) {
    case EUserActions.RegisterUserFail:
    case EUserActions.LoginUserFail:
      return {
        ...state,
        authError: action.payload.error
      };
    case EUserActions.ClearAuthError:
      return {
        ...state,
        authError: initialUserState.authError
      };
    case EUserActions.UpdateUserData:
      return {
        ...state,
        userData: action.payload
      };
    case EUserActions.UpdateUserBalance:
      return {
        ...state,
        balance: action.payload
      };
    default:
      return state;
  }
};
