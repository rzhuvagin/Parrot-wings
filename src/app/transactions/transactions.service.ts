import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipientModel } from './recipient.model';
import { TransactionCreateModel } from './create-transaction/transaction-create.model';
import { TransactionCreateSuccessModel } from './create-transaction/transaction-create-success.model';
import { TransactionListSuccessModel } from './transaction-list/transaction-list-success.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TransactionsService {
  constructor(
    private _http: HttpClient,
  ) { }

  getRecipients$(filter: string) {
    const request$ = this._http.post<RecipientModel[]>(
      '/api/protected/users/list',
      {filter}
    );
    return request$;
  }

  createTransaction$(newTransaction: TransactionCreateModel) {
    const request$ = this._http.post<TransactionCreateSuccessModel>(
      '/api/protected/transactions',
      {
        name: newTransaction.recipient,
        amount: newTransaction.amount
      }
    );
    return request$;
  }

  getTransactionList$() {
    const request$ = this._http.get<TransactionListSuccessModel>(
      '/api/protected/transactions',
    );
    return request$.pipe(map(res => res.trans_token));
  }
}
