import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { RoleService } from '../../../core/services/role.service';
import { Department, Role } from '../../../core/models/employee.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, LoadingSpinnerComponent
  ],
  template: `
    <div class="page-header">
      <div>
        <h2>{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h2>
        <p>{{ isEdit ? 'Update employee information' : 'Create a new employee record' }}</p>
      </div>
      <a mat-stroked-button routerLink="/employees"><mat-icon>arrow_back</mat-icon> Back</a>
    </div>

    <app-loading-spinner [loading]="pageLoading" message="Loading..."></app-loading-spinner>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!pageLoading">
      <!-- Personal Information -->
      <mat-card class="section-card">
        <h3><mat-icon>person</mat-icon> Personal Information</h3>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>First Name *</mat-label>
            <input matInput formControlName="firstName">
            <mat-error *ngIf="form.get('firstName')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name *</mat-label>
            <input matInput formControlName="lastName">
            <mat-error *ngIf="form.get('lastName')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email *</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-error *ngIf="form.get('email')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth">
            <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
            <mat-datepicker #dobPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option [value]="0">Male</mat-option>
              <mat-option [value]="1">Female</mat-option>
              <mat-option [value]="2">Other</mat-option>
              <mat-option [value]="3">Prefer Not to Say</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Address -->
      <mat-card class="section-card">
        <h3><mat-icon>location_on</mat-icon> Address</h3>
        <div class="form-grid">
          <mat-form-field appearance="outline" class="full-span">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>City</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>State</mat-label>
            <input matInput formControlName="state">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Postal Code</mat-label>
            <input matInput formControlName="postalCode">
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Employment Information -->
      <mat-card class="section-card">
        <h3><mat-icon>work</mat-icon> Employment Information</h3>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Employee Code *</mat-label>
            <input matInput formControlName="employeeCode">
            <mat-error *ngIf="form.get('employeeCode')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department *</mat-label>
            <mat-select formControlName="departmentId">
              <mat-option *ngFor="let dept of departments" [value]="dept.id">{{ dept.name }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('departmentId')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role *</mat-label>
            <mat-select formControlName="roleId">
              <mat-option *ngFor="let role of roles" [value]="role.id">{{ role.name }}</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('roleId')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date of Joining *</mat-label>
            <input matInput [matDatepicker]="joinPicker" formControlName="dateOfJoining">
            <mat-datepicker-toggle matSuffix [for]="joinPicker"></mat-datepicker-toggle>
            <mat-datepicker #joinPicker></mat-datepicker>
            <mat-error *ngIf="form.get('dateOfJoining')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Salary *</mat-label>
            <input matInput formControlName="salary" type="number">
            <mat-error *ngIf="form.get('salary')?.hasError('required')">Required</mat-error>
            <mat-error *ngIf="form.get('salary')?.hasError('min')">Must be 0 or greater</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Employment Type</mat-label>
            <mat-select formControlName="employmentType">
              <mat-option [value]="0">Full Time</mat-option>
              <mat-option [value]="1">Part Time</mat-option>
              <mat-option [value]="2">Contract</mat-option>
              <mat-option [value]="3">Intern</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="0">Active</mat-option>
              <mat-option [value]="1">Inactive</mat-option>
              <mat-option [value]="2">On Leave</mat-option>
              <mat-option [value]="3">Terminated</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-span">
            <mat-label>Profile Image URL</mat-label>
            <input matInput formControlName="profileImageUrl">
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Actions -->
      <div class="form-actions">
        <a mat-stroked-button routerLink="/employees">Cancel</a>
        <button mat-flat-button color="primary" type="submit"
                [disabled]="form.invalid || submitting" class="submit-btn">
          <mat-spinner *ngIf="submitting" diameter="20"></mat-spinner>
          <span *ngIf="!submitting">{{ isEdit ? 'Update Employee' : 'Create Employee' }}</span>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }

    .section-card {
      padding: 24px !important; margin-bottom: 20px;
      border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    }
    .section-card h3 {
      display: flex; align-items: center; gap: 8px;
      margin: 0 0 20px; font-size: 16px; font-weight: 600; color: #333;
    }
    .section-card h3 mat-icon { color: #5c6bc0; }

    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 16px;
    }
    .full-span { grid-column: span 3; }

    .form-actions {
      display: flex; justify-content: flex-end; gap: 12px;
      margin-top: 8px; padding-bottom: 24px;
    }
    .submit-btn { min-width: 180px; height: 44px; border-radius: 10px !important; }

    @media (max-width: 900px) {
      .form-grid { grid-template-columns: 1fr 1fr; }
      .full-span { grid-column: span 2; }
    }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-span { grid-column: span 1; }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  employeeId: number | null = null;
  departments: Department[] = [];
  roles: Role[] = [];
  submitting = false;
  pageLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.departmentService.getAll().subscribe(d => this.departments = d);
    this.roleService.getAll().subscribe(r => this.roles = r);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeId = +id;
      this.loadEmployee();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: [null],
      gender: [0],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      departmentId: [null, Validators.required],
      roleId: [null, Validators.required],
      designation: [''],
      dateOfJoining: [null, Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      employmentType: [0],
      status: [0],
      profileImageUrl: ['']
    });
  }

  private loadEmployee(): void {
    this.pageLoading = true;
    this.employeeService.getById(this.employeeId!).subscribe({
      next: (emp) => {
        const genderMap: Record<string, number> = { 'Male': 0, 'Female': 1, 'Other': 2, 'PreferNotToSay': 3 };
        const typeMap: Record<string, number> = { 'FullTime': 0, 'PartTime': 1, 'Contract': 2, 'Intern': 3 };
        const statusMap: Record<string, number> = { 'Active': 0, 'Inactive': 1, 'OnLeave': 2, 'Terminated': 3 };

        this.form.patchValue({
          employeeCode: emp.employeeCode,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null,
          gender: genderMap[emp.gender] ?? 0,
          address: emp.address,
          city: emp.city,
          state: emp.state,
          postalCode: emp.postalCode,
          departmentId: emp.departmentId,
          roleId: emp.roleId,
          designation: emp.designation,
          dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining) : null,
          salary: emp.salary,
          employmentType: typeMap[emp.employmentType] ?? 0,
          status: statusMap[emp.status] ?? 0,
          profileImageUrl: emp.profileImageUrl
        });
        this.pageLoading = false;
      },
      error: () => {
        this.pageLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const value = { ...this.form.value };
    if (value.dateOfBirth instanceof Date) {
      value.dateOfBirth = value.dateOfBirth.toISOString();
    }
    if (value.dateOfJoining instanceof Date) {
      value.dateOfJoining = value.dateOfJoining.toISOString();
    }

    const action = this.isEdit
      ? this.employeeService.update(this.employeeId!, value)
      : this.employeeService.create(value);

    action.subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open(
          this.isEdit ? 'Employee updated successfully' : 'Employee created successfully',
          'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }
        );
        this.router.navigate(['/employees']);
      },
      error: () => { this.submitting = false; }
    });
  }
}
