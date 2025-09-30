import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
  User 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authEndpoint = 'auth';

  constructor(private apiService: ApiService) { }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.authEndpoint}/login`, loginRequest)
      .pipe(
        tap(response => this.setTokens(response))
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.authEndpoint}/register`, registerRequest)
      .pipe(
        tap(response => this.setTokens(response))
      );
  }

  refreshToken(refreshRequest: RefreshTokenRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.authEndpoint}/refresh`, refreshRequest)
      .pipe(
        tap(response => this.setTokens(response))
      );
  }

  logout(): Observable<void> {
    return this.apiService.post<void>(`${this.authEndpoint}/logout`, {})
      .pipe(
        tap(() => this.clearTokens())
      );
  }

  private setTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('tokenExpiry', authResponse.expiresAt.toString());
    localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }

    return new Date(expiry) > new Date();
  }

  // Verifica se o token está prestes a expirar (menos de 5 minutos)
  isTokenExpiringSoon(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;

    const expiryDate = new Date(expiry);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos em milissegundos

    return (expiryDate.getTime() - now.getTime()) < fiveMinutes;
  }
}