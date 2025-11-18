import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  role: 'student' | 'admin' | 'instructor';
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // backend base URL
  private readonly apiBase = 'http://localhost:8085/api';

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('name', res.name);
        })
      );
  }

  logout() {
    // clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');

    // hard-force navigation to /login
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }
}
