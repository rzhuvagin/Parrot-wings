import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    ) { }

  post<T>(
    url: string,
    body: object
  ) {
    const headers = new HttpHeaders();
    const token = localStorage.getItem('Authorization');
    if (token) {
      headers.append('authentication', `bearer ${token}`);
    }
    const request = this.http.post<T>(
      `${environment.apiBaseUrl}/${url}`,
      body,
      {
        headers,
      }
    )
    return request;
  }
}
