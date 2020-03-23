import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService } from '../transactions.service';
import { Observable, of } from 'rxjs';
import { exhaustMap, catchError, map } from 'rxjs/operators';

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
        this.recipientExistingAsyncValidator()
      ),
      amount: new FormControl(
        null,
        [Validators.required, Validators.pattern(/[0-9]*/)]
      ),
    });

    this.transactionForm.controls.recipient.statusChanges.subscribe(() => console.log(this.transactionForm));

    this.filteredRecipients$ = this.transactionForm.controls.recipient.valueChanges.pipe(
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

  private _recipientIsExist(val: string) {
    return this._transactionsService.getRecipients$(val).pipe(
      map(resList => resList.length > 0 && resList.find(res => res.name === val))
    );
  }

  recipientExistingAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this._recipientIsExist(control.value).pipe(
        map(isExist => isExist ? null : {userIsNotExist: true})
      );
  }

  submit() {

  }

  ngOnDestroy() {
  }
}
