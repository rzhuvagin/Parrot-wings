import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IAppState } from 'src/app/core/store/state/app.state';
import { RegisterUserRequest, ClearAuthError } from 'src/app/core/store/actions/user.actions';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  errorMessage: string;
  hidePassword = true;

  constructor(
    private _store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      username: new FormControl(
        null,
        Validators.required
      ),
      password: new FormControl(
        null,
        [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9A-z]/)]
      ),
      email: new FormControl(
        null,
        [Validators.required, Validators.email]
      ),
    });
  }

  ngOnDestroy() {

  }

  submit() {
    this._store.dispatch(new ClearAuthError());
    const user = this.registrationForm.value;
    this._store.dispatch(new RegisterUserRequest(user));
  }
}
