import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { LoginResponse } from '../models/api.models';

const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expires_at';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  login(username: string, password: string) {
    return this.api.post<LoginResponse>('/auth/login', { username, password });
  }

  saveToken(token: string, expiresAt: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
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
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getValidToken();
  }

  private isExpired(): boolean {
    if (typeof localStorage === 'undefined') {
      return true;
    }

    const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiresAt) {
      return true;
    }

    const expiry = Date.parse(expiresAt);
    return Number.isNaN(expiry) || expiry <= Date.now();
  }

  getValidToken(): string | null {
    const token = this.getToken();
    if (!token || this.isExpired()) {
      this.clearToken();
      return null;
    }
    return token;
  }
}
