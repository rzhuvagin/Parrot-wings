import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IAppState } from 'src/app/core/store/state/app.state';
import { ClearAuthError, LoginUserRequest } from 'src/app/core/store/actions/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string;
  hidePassword = true;

  constructor(
    private _store: Store<IAppState>,
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
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
    const user = this.loginForm.value;
    this._store.dispatch(new LoginUserRequest(user));
  }
}
