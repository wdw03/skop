import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RefreshTokenRequest, User } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  private loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const request: RefreshTokenRequest = {
      token: this.getToken() || '',
      refreshToken: this.getRefreshToken() || ''
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get userRole(): string {
    return this.currentUser?.role || '';
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole);
  }

  get isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  get isHR(): boolean {
    return this.userRole === 'HR';
  }

  get isManager(): boolean {
    return this.userRole === 'Manager';
  }

  get isEmployee(): boolean {
    return this.userRole === 'Employee';
  }

  canManageEmployees(): boolean {
    return this.hasRole('Admin', 'HR');
  }

  canViewEmployees(): boolean {
    return this.hasRole('Admin', 'HR', 'Manager');
  }

  canManageDepartments(): boolean {
    return this.hasRole('Admin', 'HR');
  }

  canManageRoles(): boolean {
    return this.hasRole('Admin');
  }

  canViewDashboard(): boolean {
    return this.hasRole('Admin', 'HR', 'Manager');
  }
}
