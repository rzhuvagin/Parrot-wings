import { Injectable } from '@angular/core';
import { UserModel } from './user.model';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) { }

  private token: string;

  register(user: UserModel) {
    // const request = this.http.post(
    //   `http://193.124.114.46:3001` + `/users`,
    //   user
    // )
    // return request;
    this.apiService.post<any>('users', user).subscribe(
      response => localStorage.setItem('Authorization', 'Bearer ' + response['id_token'])
    );
  }

  getToken(): string {
    return this.token;
  }
}
