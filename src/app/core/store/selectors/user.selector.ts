import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { IUserState } from '../state/user.state';

const selectUser = (state: IAppState) => state.user;

export const selectUserData = createSelector(
  selectUser,
  (state: IUserState) => state.userData
);

export const selectUserBalance = createSelector(
  selectUser,
  (state: IUserState) => state.balance
);

export const selectUserToken = createSelector(
  selectUser,
  (state: IUserState) => !!state.userData ? state.userData.token : null
);
