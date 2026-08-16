import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="layout" [class.sidebar-collapsed]="sidebarCollapsed">
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"
        (closeMobile)="mobileOpen = false"
        [mobileOpen]="mobileOpen">
      </app-sidebar>
      <div class="main-area">
        <app-navbar
          (toggleSidebar)="onToggleSidebar()"
          [sidebarCollapsed]="sidebarCollapsed">
        </app-navbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <div class="mobile-overlay" *ngIf="mobileOpen" (click)="mobileOpen = false"></div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #f0f2f5;
    }
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 998;
    }
    @media (max-width: 768px) {
      .content { padding: 16px; }
      .mobile-overlay { display: block; }
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = false;
  mobileOpen = false;

  onToggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
}
