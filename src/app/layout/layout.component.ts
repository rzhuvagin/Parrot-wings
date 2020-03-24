import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) { }

  private _subscriptions: Subscription[] = [];

  username: string;

  ngOnInit() {
    this._subscriptions.push(this._authService.user$.subscribe(user => this.username = !!user ? user.username : null));
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
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
