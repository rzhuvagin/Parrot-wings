import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { TransactionListComponent } from './transactions/transaction-list/transaction-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'transactions'},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', component: TransactionListComponent },
    { path: 'send', component: CreateTransactionComponent }
  ]},
  { path: '**', redirectTo: 'transactions'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
