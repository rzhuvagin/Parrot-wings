import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Recipient {
  id: string;
  name: string;
}

@Injectable({providedIn: 'root'})
export class TransactionsService {
  constructor(
    private _http: HttpClient,
  ) { }

  getRecipients$(filter: string) {
    const request$ = this._http.post<Recipient[]>(
      '/api/protected/users/list',
      {filter}
    )
    return request$;
  }
}
