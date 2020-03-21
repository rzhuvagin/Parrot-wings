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
    const request = this.apiService.post<any>('users', user);
    return request;
  }

  getToken(): string {
    return this.token;
  }
}
