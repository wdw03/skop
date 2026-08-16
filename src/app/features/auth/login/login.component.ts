import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule
  ],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-brand">
          <mat-icon class="brand-icon">business</mat-icon>
          <h1>Employee Management</h1>
          <p>Sign in to your account</p>
        </div>

        <mat-card class="login-card">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="error-banner" *ngIf="errorMessage">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password"
                     [type]="hidePassword ? 'password' : 'text'"
                     placeholder="Enter your password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">Minimum 6 characters</mat-error>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a class="forgot-link">Forgot password?</a>
            </div>

            <button mat-flat-button color="primary" class="login-btn" type="submit"
                    [disabled]="loginForm.invalid || loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>
        </mat-card>

        <p class="login-footer">© 2024 Employee Management System</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 24px;
    }
    .login-container {
      width: 100%;
      max-width: 420px;
    }
    .login-brand {
      text-align: center;
      margin-bottom: 32px;
      color: #fff;
    }
    .brand-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #5c6bc0;
      margin-bottom: 12px;
    }
    .login-brand h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .login-brand p {
      margin: 0;
      color: rgba(255,255,255,0.6);
      font-size: 15px;
    }
    .login-card {
      padding: 32px;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
    }
    .full-width { width: 100%; }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
      color: #c53030;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .error-banner mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: -8px 0 16px;
    }
    .forgot-link {
      color: #5c6bc0;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
    }
    .forgot-link:hover { text-decoration: underline; }
    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 10px !important;
      background: linear-gradient(135deg, #5c6bc0, #3949ab) !important;
    }
    .login-btn mat-spinner { margin: 0 auto; }
    .login-footer {
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      margin-top: 24px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        const user = this.authService.currentUser;
        if (user?.role === 'Employee') {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password.';
      }
    });
  }
}
