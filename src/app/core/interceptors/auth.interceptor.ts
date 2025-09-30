import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Adicionar token a todas as requisições exceto as de auth
    if (this.shouldAddToken(request)) {
      const token = this.authService.getAccessToken();
      if (token) {
        request = this.addToken(request, token);
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.isLoggedIn()) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private shouldAddToken(request: HttpRequest<unknown>): boolean {
    // Não adicionar token para endpoints de auth (exceto logout)
    const authUrls = ['auth/login', 'auth/register', 'auth/refresh'];
    return !authUrls.some(url => request.url.includes(url));
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      const currentToken = this.authService.getAccessToken();

      if (refreshToken && currentToken) {
        return this.authService.refreshToken({ token: currentToken, refreshToken }).pipe(
          switchMap((authResponse: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(authResponse.token);
            
            // Repetir a requisição original com o novo token
            return next.handle(this.addToken(request, authResponse.token));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout().subscribe();
            return throwError(() => error);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token)))
    );
  }
}