import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'transactions'},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
