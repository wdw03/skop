import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button mat-icon-button (click)="toggleSidebar.emit()" class="menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
        <h1 class="page-title">Employee Management System</h1>
      </div>
      <div class="navbar-right">
        <div class="user-menu" [matMenuTriggerFor]="userMenu">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ authService.currentUser?.username }}</span>
            <span class="user-role">{{ authService.currentUser?.role }}</span>
          </div>
          <mat-icon>expand_more</mat-icon>
        </div>
        <mat-menu #userMenu="matMenu" xPosition="before">
          <button mat-menu-item (click)="goToProfile()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="onLogout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: 64px;
      background: #fff;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      z-index: 100;
    }
    .navbar-left { display: flex; align-items: center; gap: 12px; }
    .menu-btn { color: #555; }
    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }
    .navbar-right { display: flex; align-items: center; }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .user-menu:hover { background: #f5f5f5; }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5c6bc0, #3949ab);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name { font-size: 13px; font-weight: 600; color: #333; }
    .user-role { font-size: 11px; color: #888; }
    .user-menu mat-icon { color: #888; font-size: 18px; width: 18px; height: 18px; }
    @media (max-width: 768px) {
      .page-title { display: none; }
      .user-info { display: none; }
      .navbar { padding: 0 12px; }
    }
  `]
})
export class NavbarComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public authService: AuthService, private router: Router) {}

  get userInitials(): string {
    const name = this.authService.currentUser?.username || '';
    return name.substring(0, 2).toUpperCase();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
