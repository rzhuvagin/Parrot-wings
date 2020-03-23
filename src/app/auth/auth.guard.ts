import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
  boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this._authService.user$.pipe(
      take(1),
      map(user => !!user ? true : this._router.createUrlTree(['login']))
    );
  }
}
