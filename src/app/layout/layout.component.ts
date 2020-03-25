import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { BalanceService } from '../core/balance.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private _authService: AuthService,
    private _balanceService: BalanceService,
    private _router: Router,
  ) { }

  private _userSbscriptions: Subscription;

  balance = this._balanceService.balance;
  username: string;

  ngOnInit() {
    this._userSbscriptions = this._authService.user$.subscribe(user => this.username = !!user ? user.username : null);
  }

  onToSending() {
    this._router.navigate(['transactions', 'send']);
  }

  onToTransactions() {
    this._router.navigate(['transactions']);
  }

  onLogout() {
    this._authService.logout();
  }

  ngOnDestroy() {
    this._userSbscriptions.unsubscribe();
  }
}
