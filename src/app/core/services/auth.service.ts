import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { LoginResponse } from '../models/api.models';

const TOKEN_KEY = 'admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  login(username: string, password: string) {
    return this.api.post<LoginResponse>('/auth/login', { username, password });
  }

  saveToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
