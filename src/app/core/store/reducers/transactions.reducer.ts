import { initialTransactionsState, ITransactionsState } from '../state/transactions.state';
import { TransactionsActions, ETransactionsActions } from '../actions/transactions.actions';

export const transactionsReducers = (
  state = initialTransactionsState,
  action: TransactionsActions
): ITransactionsState {
  switch (action.type) {
    case ETransactionsActions.GetTransactionsSuccess:
      return {
        ...state,
        transactions: action.payload
      };
    default:
      return state;
  }
};
