import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private _authService: AuthService,
  ) { }

  private _subscriptions: Subscription[] = [];

  username: string;

  ngOnInit() {
    this._subscriptions.push(this._authService.user$.subscribe(user => this.username = !!user ? user.username : null));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
