import { IAppState } from "../state/app.state";
import { createSelector } from '@ngrx/store';
import { ITransactionsState } from '../state/transactions.state';

const selectTransactions = (state: IAppState) => state.transactions;

export const selectTransactionList = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.transactions
);
