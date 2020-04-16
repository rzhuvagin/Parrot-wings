import { Action } from '@ngrx/store';
import { TransactionModel } from 'src/app/transactions/transaction.model';

export enum ETransactionsActions {
  GetTransactions = '[Transactions] Get Transactions',
  GetTransactionsSuccess = '[Transactions] Get Transactions Success',
}

export class GetTransactions implements Action {
  public readonly type = ETransactionsActions.GetTransactions;
}

export class GetTransactionsSuccess implements Action {
  public readonly type = ETransactionsActions.GetTransactionsSuccess;
  constructor(public payload: TransactionModel[]) {}
}

export type TransactionsActions =
  | GetTransactions
  | GetTransactionsSuccess;
