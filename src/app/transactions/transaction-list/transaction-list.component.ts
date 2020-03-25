import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';

import { TransactionsService } from '../transactions.service';
import { TransactionModel } from '../transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  private _transactionListSuscription: Subscription;
  dataSource: TransactionModel[]; // Observable<TransactionModel[]>;
  displayedColumns = ['id', 'date', 'username', 'amount', 'balance'];

  constructor(
    private _router: Router,
    private _transactionsService: TransactionsService,
  ) { }

  ngOnInit() {
    this._transactionsService
      .getTransactionList$()
      .subscribe(list => this.dataSource = list);
  }

  ngAfterViewInit() {
    this._transactionListSuscription = this.sort.sortChange.subscribe((sort: Sort) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      this.dataSource.sort((trA, trB) => {
        switch (sort.active) {
          case 'id':
          case 'amount':
          case 'balance':
            return +trA[sort.active] > +trB[sort.active]
              ? 1 * direction
              : -1 * direction;
          case 'date':
            return new Date(trA[sort.active]) > new Date(trB[sort.active])
              ? 1 * direction
              : -1 * direction;
          default:
            return trA[sort.active] > trB[sort.active]
              ? 1 * direction
              : -1 * direction;
        }
      });
      this.dataSource = this.dataSource.slice();
    });
  }

  onRepeat(transaction: TransactionModel) {
    this._router.navigate([
      'transactions',
      'send',
      {
        recipient: transaction.username,
        amount: Math.abs(+transaction.amount)
      }
    ]);
  }

  ngOnDestroy() {
    this._transactionListSuscription.unsubscribe();
  }
}
