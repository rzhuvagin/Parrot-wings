import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { TransactionsService } from 'src/app/transactions/transactions.service';
import { TransactionModel } from 'src/app/transactions/transaction.model';
import { UpdateUserBalance } from '../actions/user.actions';
import { GetTransactionsRequest, ETransactionsActions, GetTransactionsSuccess, CreateTransactionRequest, CreateTransactionSuccess, CreateTransactionFail } from '../actions/transactions.actions';

@Injectable()
export class TransactionsEffects {
  @Effect()
  getTransactions$ = this._actions$.pipe(
    ofType<GetTransactionsRequest>(ETransactionsActions.GetTransactionsRequest),
    switchMap(() => this._transactionsService.getTransactionList$()),
    switchMap((transactions: TransactionModel[]) => {
      return of(new GetTransactionsSuccess(transactions));
    })
  );

  @Effect()
  createTransaction$ = this._actions$.pipe(
    ofType<CreateTransactionRequest>(ETransactionsActions.CreateTransactionRequest),
    switchMap((createTransactionAction) => this._transactionsService.createTransaction$(createTransactionAction.payload)),
    switchMap((trx) => {
      return of(new CreateTransactionSuccess(trx.trans_token));
    }),
    catchError((error: HttpErrorResponse) => of(new CreateTransactionFail(error)))
  );

  @Effect()
  createTransactionSuccess$ = this._actions$.pipe(
    ofType<CreateTransactionSuccess>(ETransactionsActions.CreateTransactionSuccess),
    switchMap((createTransactionSuccessAction) => {
      return of(new UpdateUserBalance(+createTransactionSuccessAction.payload.balance));
    }),
    tap(() => {
      this._router.navigate(['/']);
    }),
    catchError((error: HttpErrorResponse) => of(new CreateTransactionFail(error)))
  );

  constructor(
    private _actions$: Actions,
    private _router: Router,
    private _transactionsService: TransactionsService,
  ) {}
}
