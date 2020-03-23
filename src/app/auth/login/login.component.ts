import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

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
    private _authService: AuthService,
    private _router: Router,
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
    this.errorMessage = '';
    const user = this.loginForm.value;
    this._authService.login$(user).subscribe(
      response => {
        this._router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    );
  }
}
