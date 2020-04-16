import { RouterReducerState } from '@ngrx/router-store';
import { ITransactionsState, initialTransactionsState } from './transactions.state';

export interface IAppState {
  router?: RouterReducerState;
  transactions: ITransactionsState;
}

export const initialAppState: IAppState = {
  transactions: initialTransactionsState,
}

export function getInitialState(): IAppState {
  return initialAppState;
}
