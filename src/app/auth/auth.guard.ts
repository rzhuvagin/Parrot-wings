import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../core/store/state/app.state';
import { selectUserData } from '../core/store/selectors/user.selector';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private _store: Store<IAppState>,
    private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
  boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this._store.pipe(
      select(selectUserData),
      map(user => !!user ? true : this._router.createUrlTree(['login']))
    );
  }
}
