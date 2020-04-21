import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { ITransactionsState } from '../state/transactions.state';

const selectTransactions = (state: IAppState) => state.transactions;

export const selectTransactionList = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.transactionList
);

export const selectTransactionCreatingError = createSelector(
  selectTransactions,
  (state: ITransactionsState) => state.creatingError
);
