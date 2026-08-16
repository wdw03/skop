import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <mat-icon class="icon">search_off</mat-icon>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a mat-flat-button color="primary" routerLink="/dashboard" class="home-btn">
        <mat-icon>home</mat-icon> Go to Dashboard
      </a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 60vh; text-align: center; padding: 24px;
    }
    .icon { font-size: 80px; width: 80px; height: 80px; color: #ccc; margin-bottom: 16px; }
    h1 { font-size: 72px; font-weight: 800; color: #1a1a2e; margin: 0; line-height: 1; }
    h2 { font-size: 24px; color: #555; margin: 8px 0 12px; }
    p { color: #888; margin: 0 0 24px; }
    .home-btn { border-radius: 10px !important; gap: 6px; }
  `]
})
export class NotFoundComponent {}
