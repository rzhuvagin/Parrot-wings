import { initialTransactionsState, ITransactionsState } from '../state/transactions.state';
import { TransactionsActions, ETransactionsActions } from '../actions/transactions.actions';

export const transactionsReducers = (
  state = initialTransactionsState,
  action: TransactionsActions
): ITransactionsState => {
  switch (action.type) {
    case ETransactionsActions.GetTransactionsSuccess:
      return {
        ...state,
        transactionList: action.payload
      };
    case ETransactionsActions.CreateTransactionFail:
      return {
        ...state,
        creatingError: action.payload.error
      };
    case ETransactionsActions.ClearTransactionsCreatingError:
      return {
        ...state,
        creatingError: initialTransactionsState.creatingError
      };
    default:
      return state;
  }
};
