import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, race, timer } from 'rxjs';
import { exhaustMap, catchError, map, debounceTime, distinctUntilChanged, delay, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionsService } from '../transactions.service';
import { BalanceService } from 'src/app/core/balance.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit, AfterViewInit {
  transactionForm: FormGroup;
  errorMessage: string;
  filteredRecipients$: Observable<string>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _transactionsService: TransactionsService,
    private _authService: AuthService,
    private _balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.transactionForm = new FormGroup({
      recipient: new FormControl(
        null,
        [Validators.required, this.isItselfValidator.bind(this)],
        this.recipientExistingAsyncValidator()
      ),
      amount: new FormControl(
        null,
        [Validators.required, this.greaterZeroValidator.bind(this), this.maxAmountValidator.bind(this)]
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
          catchError(error => [])
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
  isItselfValidator(control: AbstractControl) {
    return control.value === this._authService.user$.value?.username ? {isItselfError: true} : null;
  }

  /**
   * Проверяет, что сумма не больше баланса
   */
  maxAmountValidator(control: AbstractControl) {
    return +control.value > this._balanceService.balance.value ? {amountIsBiggerBalance: true} : null;
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
    this.errorMessage = '';
    this._transactionsService.createTransaction$(this.transactionForm.value).subscribe(
      res => {
        this._balanceService.updateBalance(+res.trans_token.balance);
        this._router.navigate(['transactions']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    );
  }
}
