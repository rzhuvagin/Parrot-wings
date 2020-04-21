import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { IAppState } from '../core/store/state/app.state';
import { selectUserBalance, selectUserData } from '../core/store/selectors/user.selector';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<IAppState>,
  ) { }

  private _userSbscriptions: Subscription;

  balance =  this._store.pipe(select(selectUserBalance));
  username: Observable<string>;

  ngOnInit() {
    this.username = this._store.pipe(select(selectUserData), map(userData => !!userData ? userData.username : null));
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
