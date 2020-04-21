import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, race, timer } from 'rxjs';
import { exhaustMap, catchError, map, debounceTime, distinctUntilChanged, delay, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { TransactionsService } from '../transactions.service';
import { IAppState } from 'src/app/core/store/state/app.state';
import { CreateTransactionRequest, ClearTransactionsCreatingError } from 'src/app/core/store/actions/transactions.actions';
import { selectTransactionCreatingError } from 'src/app/core/store/selectors/transactions.selector';
import { selectUserBalance, selectUserData } from 'src/app/core/store/selectors/user.selector';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit, AfterViewInit {
  transactionForm: FormGroup;
  errorMessage$ = this._store.pipe(select(selectTransactionCreatingError));
  balance$ = this._store.pipe(select(selectUserBalance));
  userData$ = this._store.pipe(select(selectUserData));
  filteredRecipients$: Observable<string>;

  constructor(
    private _route: ActivatedRoute,
    private _transactionsService: TransactionsService,
    private _store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.transactionForm = new FormGroup({
      recipient: new FormControl(
        null,
        [Validators.required],
        [this.recipientExistingAsyncValidator(), this.isItselfAsyncValidator()]
      ),
      amount: new FormControl(
        null,
        [Validators.required, this.greaterZeroValidator.bind(this)],
        this.maxAmountAsyncValidator()
      ),
    });

    this.filteredRecipients$ = this.transactionForm.controls.recipient.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      exhaustMap(val =>
        this._transactionsService.getRecipients$(val).pipe(
          map(resList =>
            resList
              .map(res => res.name)
              .filter(
                (resName, i, list) =>
                  list.indexOf(resName) === i
              )
          ),
          // Подпорка для сломанного эндпоинта, который возвращает 401
          catchError(() => [])
        )
      )
    );
  }

  ngAfterViewInit() {
    this._route.params.pipe(delay(100)).subscribe((params: Params) => {
      if (Object.keys(params).length) {
        this.transactionForm.controls.recipient.setValue(params?.recipient);
        this.transactionForm.controls.amount.setValue(params?.amount);
        this.transactionForm.markAllAsTouched(); // чтобы подсветить невалидные поля
      }
    });
  }

  private _recipientIsExist$(val: string): Observable<boolean> {
    return this._transactionsService.getRecipients$(val).pipe(
      map(resList => resList.length > 0 && !!resList.find(res => res.name === val))
    );
  }

  /**
   * Проверяет, что пользователь существует
   */
  recipientExistingAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      race(
        timer(500),
        control.valueChanges.pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
      ).pipe(
        take(1),
        exhaustMap(() => this._recipientIsExist$(control.value)),
        map(isExist => isExist ? null : {userIsNotExist: true})
      );

  }

  /**
   * Проверяет, что пользователь не пытается отправить PW себе
   */
  isItselfAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.userData$.pipe(
        take(1),
        map(user => control.value === user?.username ? {isItselfError: true} : null)
      )
  }

  /**
   * Проверяет, что сумма не больше баланса
   */
  maxAmountAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.balance$.pipe(
        take(1),
        map(balance => +control.value > balance ? {amountIsBiggerBalance: true} : null)
      );
  }

  /**
   * Проверяет, что сумма строго больше нуля
   * Стандартный валидатор выполняет нестрогое сравнение
   */
  greaterZeroValidator(control: AbstractControl) {
    return +control.value <= 0 ? {zeroAmount: true} : null;
  }

  submit() {
    if (this.transactionForm.invalid) {
      return;
    }
    this._store.dispatch(new ClearTransactionsCreatingError());

    this._store.dispatch(new CreateTransactionRequest({
      recipient: this.transactionForm.value.recipient,
      amount: this.transactionForm.value.amount
    }));
  }
}
