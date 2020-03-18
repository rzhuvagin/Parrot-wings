import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatCardModule,
  ],
  exports: [
  ]
})
export class AuthModule { }
