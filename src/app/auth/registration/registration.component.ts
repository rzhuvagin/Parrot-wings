import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy{
  registrationForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      username: new FormControl(
        null,
        Validators.required
      ),
      password: new FormControl(
        null,
        [Validators.required, Validators.pattern(/[0-9A-Z]/)]
      ),
      email: new FormControl(
        null,
        [Validators.required, Validators.email]
      ),
    });
    this.registrationForm.statusChanges.subscribe( status => console.log(this.registrationForm))
  }

  ngOnDestroy() {

  }
}
