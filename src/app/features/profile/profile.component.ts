import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="page-header">
      <h2>My Profile</h2>
      <p>View your profile information</p>
    </div>

    <app-loading-spinner [loading]="loading" message="Loading profile..."></app-loading-spinner>

    <div class="profile-container" *ngIf="!loading">
      <mat-card class="profile-card" *ngIf="employee">
        <div class="profile-top">
          <div class="avatar">{{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}</div>
          <h3>{{ employee.fullName }}</h3>
          <p>{{ employee.designation || employee.departmentName }}</p>
          <app-status-badge [status]="employee.status"></app-status-badge>
        </div>
        <mat-divider></mat-divider>
        <div class="profile-details">
          <div class="detail-section">
            <h4><mat-icon>person</mat-icon> Personal</h4>
            <div class="detail-grid">
              <div class="detail-item"><label>Email</label><span>{{ employee.email }}</span></div>
              <div class="detail-item"><label>Phone</label><span>{{ employee.phone || '-' }}</span></div>
              <div class="detail-item"><label>Gender</label><span>{{ employee.gender }}</span></div>
              <div class="detail-item"><label>Date of Birth</label><span>{{ employee.dateOfBirth ? (employee.dateOfBirth | date:'mediumDate') : '-' }}</span></div>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="detail-section">
            <h4><mat-icon>work</mat-icon> Employment</h4>
            <div class="detail-grid">
              <div class="detail-item"><label>Employee Code</label><span>{{ employee.employeeCode }}</span></div>
              <div class="detail-item"><label>Department</label><span>{{ employee.departmentName }}</span></div>
              <div class="detail-item"><label>Role</label><span>{{ employee.roleName }}</span></div>
              <div class="detail-item"><label>Joined</label><span>{{ employee.dateOfJoining | date:'mediumDate' }}</span></div>
              <div class="detail-item"><label>Type</label><app-status-badge [status]="employee.employmentType"></app-status-badge></div>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="detail-section">
            <h4><mat-icon>location_on</mat-icon> Address</h4>
            <div class="detail-grid">
              <div class="detail-item full"><label>Address</label><span>{{ getFullAddress() }}</span></div>
            </div>
          </div>
        </div>
      </mat-card>

      <mat-card class="info-card" *ngIf="!employee">
        <div class="no-profile">
          <mat-icon>person_off</mat-icon>
          <h3>No employee profile linked</h3>
          <p>Your account is not linked to an employee record. Contact your administrator.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }
    .profile-container { max-width: 700px; }
    .profile-card { border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; padding: 0 !important; overflow: hidden; }
    .profile-top { text-align: center; padding: 32px 24px 20px; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; background: linear-gradient(135deg, #5c6bc0, #3949ab); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; }
    .profile-top h3 { margin: 0 0 4px; font-size: 22px; font-weight: 600; }
    .profile-top p { margin: 0 0 12px; color: #888; }
    .profile-details { padding: 8px 24px 24px; }
    .detail-section { padding: 16px 0; }
    .detail-section h4 { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; font-weight: 600; color: #333; }
    .detail-section h4 mat-icon { color: #5c6bc0; font-size: 20px; width: 20px; height: 20px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .detail-item { display: flex; flex-direction: column; gap: 2px; }
    .detail-item.full { grid-column: span 2; }
    .detail-item label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-item span { font-size: 14px; color: #333; }
    .info-card { border-radius: 14px !important; padding: 24px !important; }
    .no-profile { text-align: center; padding: 32px; }
    .no-profile mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
    .no-profile h3 { margin: 16px 0 8px; color: #555; }
    .no-profile p { color: #888; }
    @media (max-width: 600px) { .detail-grid { grid-template-columns: 1fr; } .detail-item.full { grid-column: span 1; } }
  `]
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;

  constructor(private authService: AuthService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    const employeeId = this.authService.currentUser?.employeeId;
    if (employeeId) {
      this.employeeService.getById(employeeId).subscribe({
        next: (emp) => { this.employee = emp; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  getFullAddress(): string {
    if (!this.employee) return '-';
    const parts = [this.employee.address, this.employee.city, this.employee.state, this.employee.postalCode].filter(p => !!p);
    return parts.length > 0 ? parts.join(', ') : '-';
  }
}
