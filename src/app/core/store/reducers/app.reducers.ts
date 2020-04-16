import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { routerReducer } from '@ngrx/router-store';
import { transactionsReducers } from './transactions.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  router: routerReducer,
  transactions: transactionsReducers,
}
