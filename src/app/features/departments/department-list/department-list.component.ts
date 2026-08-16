import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { DepartmentService } from '../../../core/services/department.service';
import { AuthService } from '../../../core/services/auth.service';
import { Department } from '../../../core/models/employee.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    LoadingSpinnerComponent, EmptyStateComponent
  ],
  template: `
    <div class="page-header">
      <div>
        <h2>Departments</h2>
        <p>Manage organizational departments</p>
      </div>
      <button mat-flat-button color="primary" (click)="openForm()" *ngIf="authService.canManageDepartments()" class="add-btn">
        <mat-icon>add</mat-icon> Add Department
      </button>
    </div>

    <app-loading-spinner [loading]="loading" message="Loading departments..."></app-loading-spinner>

    <!-- Form Card -->
    <mat-card class="form-card" *ngIf="showForm">
      <h3>{{ editingId ? 'Edit Department' : 'Add Department' }}</h3>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Name *</mat-label>
            <input matInput formControlName="name">
            <mat-error *ngIf="form.get('name')?.hasError('required')">Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="desc-field">
            <mat-label>Description</mat-label>
            <input matInput formControlName="description">
          </mat-form-field>
        </div>
        <div class="form-actions">
          <button mat-stroked-button type="button" (click)="cancelForm()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || submitting">
            {{ editingId ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </mat-card>

    <mat-card class="table-card" *ngIf="!loading">
      <div *ngIf="departments.length > 0; else emptyTpl">
        <table mat-table [dataSource]="departments">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let d"><strong>{{ d.name }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let d">{{ d.description || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="employeeCount">
            <th mat-header-cell *matHeaderCellDef>Employees</th>
            <td mat-cell *matCellDef="let d">{{ d.employeeCount }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button (click)="onEdit(d)" *ngIf="authService.canManageDepartments()"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="onDelete(d)" *ngIf="authService.isAdmin"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <ng-template #emptyTpl>
        <app-empty-state icon="business" title="No departments" message="Add your first department."></app-empty-state>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }
    .add-btn { border-radius: 10px !important; gap: 6px; }
    .form-card { padding: 24px !important; margin-bottom: 20px; border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; }
    .form-card h3 { margin: 0 0 16px; font-weight: 600; }
    .form-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .desc-field { flex: 2; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .table-card { border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; overflow: hidden; }
    table { width: 100%; }
    th.mat-mdc-header-cell { font-weight: 600; color: #555; }
  `]
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  submitting = false;
  form!: FormGroup;
  displayedColumns = ['name', 'description', 'employeeCount', 'actions'];

  constructor(
    private departmentService: DepartmentService,
    public authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (d) => { this.departments = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void { this.showForm = true; this.editingId = null; this.form.reset(); }
  cancelForm(): void { this.showForm = false; this.editingId = null; this.form.reset(); }

  onEdit(dept: Department): void {
    this.showForm = true;
    this.editingId = dept.id;
    this.form.patchValue({ name: dept.name, description: dept.description });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const action = this.editingId
      ? this.departmentService.update(this.editingId, this.form.value)
      : this.departmentService.create(this.form.value);

    action.subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open(this.editingId ? 'Department updated' : 'Department created', 'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
        this.cancelForm();
        this.load();
      },
      error: () => { this.submitting = false; }
    });
  }

  onDelete(dept: Department): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Department', message: `Delete "${dept.name}"? This cannot be undone.`, confirmText: 'Delete', color: 'warn' }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.delete(dept.id).subscribe({
          next: () => { this.snackBar.open('Department deleted', 'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }); this.load(); }
        });
      }
    });
  }
}
