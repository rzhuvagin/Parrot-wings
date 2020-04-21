import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../core/store/state/app.state';
import { selectUserData } from '../core/store/selectors/user.selector';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private _store: Store<IAppState>,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this._store.pipe(
      select(selectUserData),
      take(1),
      exhaustMap( user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders({'Authorization': 'Bearer ' + user.token})
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
