import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <mat-icon class="logo-icon">business</mat-icon>
          <span class="logo-text">EMS</span>
        </div>
        <div class="logo" *ngIf="collapsed">
          <mat-icon class="logo-icon">business</mat-icon>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ng-container *ngFor="let item of filteredNavItems">
          <a class="nav-item"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
             [matTooltip]="collapsed ? item.label : ''"
             matTooltipPosition="right"
             (click)="closeMobile.emit()">
            <mat-icon>{{ item.icon }}</mat-icon>
            <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
          </a>
        </ng-container>
      </nav>

      <div class="sidebar-footer">
        <a class="nav-item" (click)="onLogout()" [matTooltip]="collapsed ? 'Logout' : ''" matTooltipPosition="right">
          <mat-icon>logout</mat-icon>
          <span class="nav-label" *ngIf="!collapsed">Logout</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      min-width: 260px;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      overflow: hidden;
    }
    .sidebar.collapsed {
      width: 72px;
      min-width: 72px;
    }
    .sidebar-header {
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
    }
    .logo-icon { color: #5c6bc0; font-size: 32px; width: 32px; height: 32px; }
    .logo-text { font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      margin: 2px 0;
      border-radius: 10px;
      color: rgba(255,255,255,0.65);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
    }
    .nav-item.active {
      background: rgba(92, 107, 192, 0.25);
      color: #fff;
      box-shadow: inset 3px 0 0 #5c6bc0;
    }
    .nav-item mat-icon { font-size: 22px; width: 22px; height: 22px; }
    .collapsed .nav-item { justify-content: center; padding: 12px; }
    .nav-label { white-space: nowrap; }
    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -260px;
        top: 0;
        height: 100vh;
        width: 260px;
      }
      .sidebar.mobile-open {
        left: 0;
      }
      .sidebar.collapsed { width: 260px; min-width: 260px; }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['Admin', 'HR', 'Manager'] },
    { label: 'Employees', icon: 'people', route: '/employees', roles: ['Admin', 'HR', 'Manager'] },
    { label: 'Departments', icon: 'business', route: '/departments', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { label: 'Roles', icon: 'admin_panel_settings', route: '/roles', roles: ['Admin'] },
    { label: 'Profile', icon: 'person', route: '/profile', roles: ['Admin', 'HR', 'Manager', 'Employee'] }
  ];

  constructor(private authService: AuthService) {}

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter(item =>
      item.roles.includes(this.authService.userRole)
    );
  }

  onLogout(): void {
    this.authService.logout();
  }
}
