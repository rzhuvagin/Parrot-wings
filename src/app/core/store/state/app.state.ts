import { RouterReducerState } from '@ngrx/router-store';

import { ITransactionsState, initialTransactionsState } from './transactions.state';
import { IUserState, initialUserState } from './user.state';

export interface IAppState {
  router?: RouterReducerState;
  transactions: ITransactionsState;
  user: IUserState;
}

export const initialAppState: IAppState = {
  transactions: initialTransactionsState,
  user: initialUserState,
};

export function getInitialState(): IAppState {
  return initialAppState;
}
