import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee } from '../../../core/models/employee.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, StatusBadgeComponent, LoadingSpinnerComponent
  ],
  template: `
    <app-loading-spinner [loading]="loading" message="Loading employee..."></app-loading-spinner>

    <div *ngIf="!loading && employee">
      <div class="page-header">
        <div>
          <h2>Employee Details</h2>
          <p>{{ employee.fullName }} — {{ employee.employeeCode }}</p>
        </div>
        <div class="header-actions">
          <a mat-stroked-button routerLink="/employees"><mat-icon>arrow_back</mat-icon> Back</a>
          <a mat-flat-button color="primary" [routerLink]="['/employees', employee.id, 'edit']"
             *ngIf="authService.canManageEmployees()">
            <mat-icon>edit</mat-icon> Edit
          </a>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Profile Card -->
        <mat-card class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar">{{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}</div>
            <h3>{{ employee.fullName }}</h3>
            <p>{{ employee.designation || 'No designation' }}</p>
            <app-status-badge [status]="employee.status"></app-status-badge>
          </div>
          <mat-divider></mat-divider>
          <div class="profile-meta">
            <div class="meta-item"><mat-icon>badge</mat-icon><span>{{ employee.employeeCode }}</span></div>
            <div class="meta-item"><mat-icon>email</mat-icon><span>{{ employee.email }}</span></div>
            <div class="meta-item" *ngIf="employee.phone"><mat-icon>phone</mat-icon><span>{{ employee.phone }}</span></div>
            <div class="meta-item"><mat-icon>business</mat-icon><span>{{ employee.departmentName }}</span></div>
          </div>
        </mat-card>

        <!-- Details Cards -->
        <div class="detail-cards">
          <mat-card class="info-card">
            <h3><mat-icon>person</mat-icon> Personal Information</h3>
            <div class="info-grid">
              <div class="info-item"><label>Full Name</label><span>{{ employee.fullName }}</span></div>
              <div class="info-item"><label>Email</label><span>{{ employee.email }}</span></div>
              <div class="info-item"><label>Phone</label><span>{{ employee.phone || '-' }}</span></div>
              <div class="info-item"><label>Date of Birth</label><span>{{ employee.dateOfBirth ? (employee.dateOfBirth | date:'mediumDate') : '-' }}</span></div>
              <div class="info-item"><label>Gender</label><span>{{ employee.gender }}</span></div>
            </div>
          </mat-card>

          <mat-card class="info-card">
            <h3><mat-icon>location_on</mat-icon> Address</h3>
            <div class="info-grid">
              <div class="info-item"><label>Address</label><span>{{ employee.address || '-' }}</span></div>
              <div class="info-item"><label>City</label><span>{{ employee.city || '-' }}</span></div>
              <div class="info-item"><label>State</label><span>{{ employee.state || '-' }}</span></div>
              <div class="info-item"><label>Postal Code</label><span>{{ employee.postalCode || '-' }}</span></div>
            </div>
          </mat-card>

          <mat-card class="info-card">
            <h3><mat-icon>work</mat-icon> Employment Information</h3>
            <div class="info-grid">
              <div class="info-item"><label>Department</label><span>{{ employee.departmentName }}</span></div>
              <div class="info-item"><label>Role</label><span>{{ employee.roleName }}</span></div>
              <div class="info-item"><label>Designation</label><span>{{ employee.designation || '-' }}</span></div>
              <div class="info-item"><label>Date of Joining</label><span>{{ employee.dateOfJoining | date:'mediumDate' }}</span></div>
              <div class="info-item"><label>Salary</label><span>₹{{ employee.salary | number }}</span></div>
              <div class="info-item"><label>Employment Type</label><app-status-badge [status]="employee.employmentType"></app-status-badge></div>
              <div class="info-item"><label>Status</label><app-status-badge [status]="employee.status"></app-status-badge></div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }
    .header-actions { display: flex; gap: 8px; }

    .detail-grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }

    .profile-card { border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; padding: 0 !important; overflow: hidden; }
    .profile-header { text-align: center; padding: 32px 24px 20px; }
    .profile-avatar {
      width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px;
      background: linear-gradient(135deg, #5c6bc0, #3949ab);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 700;
    }
    .profile-header h3 { margin: 0 0 4px; font-size: 20px; font-weight: 600; color: #333; }
    .profile-header p { margin: 0 0 12px; color: #888; font-size: 14px; }
    .profile-meta { padding: 20px 24px; }
    .meta-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; color: #555; font-size: 14px; }
    .meta-item mat-icon { color: #5c6bc0; font-size: 20px; width: 20px; height: 20px; }

    .detail-cards { display: flex; flex-direction: column; gap: 20px; }
    .info-card { padding: 24px !important; border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
    .info-card h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #333; }
    .info-card h3 mat-icon { color: #5c6bc0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item label { font-size: 12px; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-item span { font-size: 14px; color: #333; font-weight: 500; }

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getById(+id).subscribe({
        next: (emp) => { this.employee = emp; this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/employees']); }
      });
    }
  }
}
