import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { IAppState } from '../state/app.state';
import { GetTransactionsRequest, ETransactionsActions, GetTransactionsSuccess, CreateTransactionRequest, CreateTransactionSuccess, CreateTransactionFail } from '../actions/transactions.actions';
import { TransactionsService } from 'src/app/transactions/transactions.service';
import { switchMap, catchError } from 'rxjs/operators';
import { TransactionModel } from 'src/app/transactions/transaction.model';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
    switchMap(() => {
      return of(new CreateTransactionSuccess());
    }),
    catchError((error: HttpErrorResponse) => of(new CreateTransactionFail(error)))
  );

  constructor(
    private _actions$: Actions,
    private _store$: Store<IAppState>,
    private _transactionsService: TransactionsService,
  ) {}
}
