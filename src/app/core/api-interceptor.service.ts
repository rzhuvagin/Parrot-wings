import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.startsWith('/')) {
      const modifiedReq = req.clone({
        url: environment.apiBaseUrl + req.url
      });
      return next.handle(modifiedReq);
    } else {
      return next.handle(req);
    }
  }
}
