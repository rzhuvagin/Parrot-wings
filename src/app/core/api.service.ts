import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private _http: HttpClient,
    private _snackBar: MatSnackBar
    ) { }

  post$<T>(
    url: string,
    body: object,
    showResult: boolean = false
  ) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('Authorization');
    if (token) {
      headers.append('authentication', `bearer ${token}`);
    }
    const request$ = this._http.post<T>(
      environment.apiBaseUrl + url,
      body,
      {
        headers,
      }
    )
    if (!showResult) {
      return request$;
    }
    return request$.pipe(
      tap(
        (res: any) => this._snackBar.open(
          'Success',
          null,
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'snack-success',
            duration: 3000
          }
        ),
        (error: HttpErrorResponse) => this._snackBar.open(
          error.error,
          null,
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'snack-fail',
            duration: 3000
          }
        ),
      )
    );
  }
}
