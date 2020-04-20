import { Action } from '@ngrx/store';
import { TransactionModel } from 'src/app/transactions/transaction.model';
import { TransactionCreateModel } from 'src/app/transactions/create-transaction/transaction-create.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum ETransactionsActions {
  GetTransactionsRequest = 'TRANSACTIONS/GetTransactions_Request',
  GetTransactionsSuccess = 'TRANSACTIONS/GetTransactions_Success',
  GetTransactionsFail = 'TRANSACTIONS/GetTransactions_Fail',

  CreateTransactionRequest = 'TRANSACTIONS/CreateTransactions_Request',
  CreateTransactionSuccess= 'TRANSACTIONS/CreateTransactions_Success',
  CreateTransactionFail = 'TRANSACTIONS/CreateTransactions_Fail',

  ClearTransactionsCreatingError = 'TRANSACTIONS/ClearTransactionsCreatingError',
}

export class GetTransactionsRequest implements Action {
  public readonly type = ETransactionsActions.GetTransactionsRequest;
}

export class GetTransactionsSuccess implements Action {
  public readonly type = ETransactionsActions.GetTransactionsSuccess;
  constructor(public payload: TransactionModel[]) {}
}

export class GetTransactionsFail implements Action {
  public readonly type = ETransactionsActions.GetTransactionsFail;
}

export class CreateTransactionRequest implements Action {
  public readonly type = ETransactionsActions.CreateTransactionRequest;
  constructor(public payload: TransactionCreateModel) {}
}

export class CreateTransactionSuccess implements Action {
  public readonly type = ETransactionsActions.CreateTransactionSuccess;
}

export class CreateTransactionFail implements Action {
  public readonly type = ETransactionsActions.CreateTransactionFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class ClearTransactionsCreatingError implements Action {
  public readonly type = ETransactionsActions.ClearTransactionsCreatingError;
}

export type TransactionsActions =
  | GetTransactionsRequest
  | GetTransactionsSuccess
  | GetTransactionsFail
  | CreateTransactionRequest
  | CreateTransactionSuccess
  | CreateTransactionFail
  | ClearTransactionsCreatingError;
