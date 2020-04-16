import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { IAppState } from '../state/app.state';
import { GetTransactions, ETransactionsActions, GetTransactionsSuccess } from '../actions/transactions.actions';
import { TransactionsService } from 'src/app/transactions/transactions.service';
import { switchMap } from 'rxjs/operators';
import { TransactionModel } from 'src/app/transactions/transaction.model';
import { of } from 'rxjs';

Injectable()
export class TransactionsEffects {
  @Effect()
  getTransactions$ = this._actions$.pipe(
    ofType<GetTransactions>(ETransactionsActions.GetTransactions),
    switchMap(() => this._transactionsService.getTransactionList$()),
    switchMap((transactions: TransactionModel[]) => {
      return of(new GetTransactionsSuccess(transactions));
    })
  );

  constructor(
    private _actions$: Actions,
    private _store$: Store<IAppState>,
    private _transactionsService: TransactionsService,
  ) {}
}
