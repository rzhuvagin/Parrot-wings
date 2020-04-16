import { TransactionModel } from 'src/app/transactions/transaction.model';

export interface ITransactionsState {
  transactions: TransactionModel[];
}

export const initialTransactionsState: ITransactionsState = {
  transactions: []
};
