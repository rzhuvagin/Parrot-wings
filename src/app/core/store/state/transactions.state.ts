import { TransactionModel } from 'src/app/transactions/transaction.model';

export interface ITransactionsState {
  transactionList: TransactionModel[];
  creatingError: string;
}

export const initialTransactionsState: ITransactionsState = {
  transactionList: [],
  creatingError: '',
};
