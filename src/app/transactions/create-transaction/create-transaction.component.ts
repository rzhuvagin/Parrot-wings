import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, catchError, map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit, OnDestroy {
  transactionForm: FormGroup;
  errorMessage: string;
  filteredRecipients$: Observable<string>;

  constructor(
    private _router: Router,
    private _transactionsService: TransactionsService,
  ) { }

  ngOnInit() {
    this.transactionForm = new FormGroup({
      recipient: new FormControl(
        null,
        [Validators.required],
        // this.recipientExistingAsyncValidator()
      ),
      amount: new FormControl(
        null,
        [Validators.required, Validators.pattern(/[0-9]*/)]
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

    this.transactionForm.controls.recipient.valueChanges.pipe(
      tap(() => this.transactionForm.controls.recipient.setErrors({userIsNotExist: false})),
      debounceTime(500),
      distinctUntilChanged(),
      exhaustMap(val => this._recipientIsExist$(val))
    ).subscribe((isExist: boolean) => {
      if (!isExist) {
        this.transactionForm.controls.recipient.setErrors({userIsNotExist: true});
      } else {
        this.transactionForm.controls.recipient.setErrors(null);
      }
    });
  }

  private _recipientIsExist$(val: string): Observable<boolean> {
    return this._transactionsService.getRecipients$(val).pipe(
      map(resList => resList.length > 0 && !!resList.find(res => res.name === val))
    );
  }

  recipientExistingAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this._recipientIsExist$(control.value).pipe(
        map(isExist => isExist ? null : {userIsNotExist: true})
      );
  }

  submit() {
    if (this.transactionForm.invalid) {
      return;
    }
    this.errorMessage = '';
    this._transactionsService.createTransaction$(this.transactionForm.value).subscribe(
      res => console.log(res),
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    )
  }

  ngOnDestroy() {
  }
}
