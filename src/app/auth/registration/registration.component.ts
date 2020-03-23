import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy{
  registrationForm: FormGroup;
  errorMessage: string;
  hidePassword = true;

  constructor(
    private _authService: AuthService,
    private _router: Router,
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
    this.errorMessage = '';
    const user = this.registrationForm.value;
    this._authService.register$(user).subscribe(
      response => {
        this._router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    );
  }
}
