import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, map, exhaustMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class BalanceService {
  balance: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private _authService: AuthService) {
    _authService.user$
      .pipe(
        distinctUntilChanged(),
        exhaustMap(user =>
          !!user ? _authService.userInfo$().pipe(map(userInfo => userInfo.balance)) : of(0)
        )
      )
      .subscribe(balance => this.balance.next(balance));
  }

  updateBalance(balance) {
    this.balance.next(balance);
  }
}
