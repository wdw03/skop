import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeList, Department } from '../../../core/models/employee.model';
import { QueryParams } from '../../../core/models/api.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, MatCardModule, MatTableModule,
    MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatTooltipModule,
    StatusBadgeComponent, LoadingSpinnerComponent, EmptyStateComponent
  ],
  template: `
    <div class="page-header">
      <div>
        <h2>Employees</h2>
        <p>Manage your organization's employees</p>
      </div>
      <a mat-flat-button color="primary" routerLink="/employees/add"
         *ngIf="authService.canManageEmployees()" class="add-btn">
        <mat-icon>person_add</mat-icon> Add Employee
      </a>
    </div>

    <mat-card class="filter-card">
      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search employees</mat-label>
          <input matInput [(ngModel)]="searchText" (keyup.enter)="onSearch()" placeholder="Name, email, code...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select [(ngModel)]="selectedDepartment" (selectionChange)="onFilterChange()">
            <mat-option [value]="null">All Departments</mat-option>
            <mat-option *ngFor="let dept of departments" [value]="dept.id">{{ dept.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="onFilterChange()">
            <mat-option [value]="''">All Status</mat-option>
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
            <mat-option value="OnLeave">On Leave</mat-option>
            <mat-option value="Terminated">Terminated</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select [(ngModel)]="selectedType" (selectionChange)="onFilterChange()">
            <mat-option [value]="''">All Types</mat-option>
            <mat-option value="FullTime">Full Time</mat-option>
            <mat-option value="PartTime">Part Time</mat-option>
            <mat-option value="Contract">Contract</mat-option>
            <mat-option value="Intern">Intern</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-card>

    <mat-card class="table-card" *ngIf="!loading">
      <div class="table-container" *ngIf="employees.length > 0; else emptyTpl">
        <table mat-table [dataSource]="employees" matSort (matSortChange)="onSort($event)">
          <ng-container matColumnDef="employee">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="firstName">Employee</th>
            <td mat-cell *matCellDef="let e">
              <div class="employee-cell">
                <div class="emp-avatar">{{ e.firstName?.charAt(0) }}{{ e.lastName?.charAt(0) }}</div>
                <div>
                  <div class="emp-name">{{ e.fullName }}</div>
                  <div class="emp-email">{{ e.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="employeeCode">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="employeeCode">Code</th>
            <td mat-cell *matCellDef="let e">{{ e.employeeCode }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="department">Department</th>
            <td mat-cell *matCellDef="let e">{{ e.departmentName }}</td>
          </ng-container>

          <ng-container matColumnDef="designation">
            <th mat-header-cell *matHeaderCellDef>Designation</th>
            <td mat-cell *matCellDef="let e">{{ e.designation || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="dateOfJoining">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="dateOfJoining">Joined</th>
            <td mat-cell *matCellDef="let e">{{ e.dateOfJoining | date:'mediumDate' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let e"><app-status-badge [status]="e.status"></app-status-badge></td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let e">
              <a mat-icon-button [routerLink]="['/employees', e.id]" matTooltip="View">
                <mat-icon>visibility</mat-icon>
              </a>
              <a mat-icon-button [routerLink]="['/employees', e.id, 'edit']" matTooltip="Edit"
                 *ngIf="authService.canManageEmployees()">
                <mat-icon>edit</mat-icon>
              </a>
              <button mat-icon-button (click)="onDelete(e)" matTooltip="Delete" color="warn"
                      *ngIf="authService.isAdmin">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageIndex]="page - 1"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>

      <ng-template #emptyTpl>
        <app-empty-state icon="people" title="No employees found"
          message="Try adjusting your filters or add a new employee.">
        </app-empty-state>
      </ng-template>
    </mat-card>

    <app-loading-spinner [loading]="loading" message="Loading employees..."></app-loading-spinner>
  `,
  styles: [`
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }
    .add-btn { border-radius: 10px !important; gap: 6px; }

    .filter-card {
      padding: 16px 20px !important; margin-bottom: 20px;
      border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    }
    .filters {
      display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
    }
    .search-field { flex: 1; min-width: 240px; }
    .filters mat-form-field { min-width: 150px; }

    .table-card {
      border-radius: 14px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
      overflow: hidden;
    }
    .table-container { overflow-x: auto; }
    table { width: 100%; }
    th.mat-mdc-header-cell { font-weight: 600; color: #555; font-size: 13px; }
    td.mat-mdc-cell { font-size: 13px; }

    .employee-cell { display: flex; align-items: center; gap: 12px; }
    .emp-avatar {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #5c6bc0, #3949ab);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 13px;
    }
    .emp-name { font-weight: 500; color: #333; }
    .emp-email { font-size: 12px; color: #888; }

    @media (max-width: 768px) {
      .filters { flex-direction: column; }
      .filters mat-form-field, .search-field { width: 100%; min-width: unset; }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeList[] = [];
  departments: Department[] = [];
  loading = true;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  searchText = '';
  selectedDepartment: number | null = null;
  selectedStatus = '';
  selectedType = '';
  sortBy = '';
  sortOrder = 'asc';

  displayedColumns = ['employee', 'employeeCode', 'department', 'designation', 'dateOfJoining', 'status', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(d => this.departments = d);
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    const params: QueryParams = {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchText || undefined,
      departmentId: this.selectedDepartment || undefined,
      status: this.selectedStatus || undefined,
      employmentType: this.selectedType || undefined,
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder
    };

    this.employeeService.getAll(params).subscribe({
      next: (result) => {
        this.employees = result.items;
        this.totalItems = result.totalItems;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadEmployees();
  }

  onSort(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction || 'asc';
    this.loadEmployees();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onDelete(employee: EmployeeList): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.delete(employee.id).subscribe({
          next: () => {
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 3000, horizontalPosition: 'end', verticalPosition: 'top'
            });
            this.loadEmployees();
          }
        });
      }
    });
  }
}
