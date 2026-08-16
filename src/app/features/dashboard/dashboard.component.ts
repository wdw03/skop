import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/api.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule,
    MatTableModule, BaseChartDirective, LoadingSpinnerComponent, StatusBadgeComponent
  ],
  template: `
    <div class="dashboard" *ngIf="!loading; else loadingTpl">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's an overview of your organization.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon blue"><mat-icon>people</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.totalEmployees }}</span>
            <span class="stat-label">Total Employees</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon green"><mat-icon>check_circle</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.activeEmployees }}</span>
            <span class="stat-label">Active Employees</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon purple"><mat-icon>business</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.totalDepartments }}</span>
            <span class="stat-label">Departments</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon orange"><mat-icon>event_busy</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.onLeaveEmployees }}</span>
            <span class="stat-label">On Leave</span>
          </div>
        </mat-card>
      </div>

      <!-- Charts Row -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <h3>Employees by Department</h3>
          <canvas *ngIf="deptChartData" baseChart
                  [data]="deptChartData" [type]="'doughnut'"
                  [options]="doughnutOptions">
          </canvas>
        </mat-card>
        <mat-card class="chart-card">
          <h3>Employment Type Distribution</h3>
          <canvas *ngIf="typeChartData" baseChart
                  [data]="typeChartData" [type]="'bar'"
                  [options]="barOptions">
          </canvas>
        </mat-card>
      </div>

      <!-- Quick Actions & Recent -->
      <div class="bottom-grid">
        <mat-card class="quick-actions-card">
          <h3>Quick Actions</h3>
          <div class="actions-list">
            <a mat-stroked-button routerLink="/employees/add" color="primary">
              <mat-icon>person_add</mat-icon> Add Employee
            </a>
            <a mat-stroked-button routerLink="/departments">
              <mat-icon>business</mat-icon> Manage Departments
            </a>
            <a mat-stroked-button routerLink="/employees">
              <mat-icon>people</mat-icon> View Employees
            </a>
          </div>
          <div class="stats-summary">
            <div class="summary-item">
              <span class="summary-label">Joined This Month</span>
              <span class="summary-value">{{ stats?.employeesJoinedThisMonth }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Inactive</span>
              <span class="summary-value">{{ stats?.inactiveEmployees }}</span>
            </div>
          </div>
        </mat-card>

        <mat-card class="recent-card">
          <h3>Recent Employees</h3>
          <div class="recent-list">
            <div class="recent-item" *ngFor="let emp of stats?.recentEmployees">
              <div class="recent-avatar">{{ emp.fullName.charAt(0) }}</div>
              <div class="recent-info">
                <span class="recent-name">{{ emp.fullName }}</span>
                <span class="recent-dept">{{ emp.department }} · {{ emp.designation }}</span>
              </div>
              <app-status-badge [status]="emp.status"></app-status-badge>
            </div>
            <div class="empty" *ngIf="!stats?.recentEmployees?.length">
              No recent employees
            </div>
          </div>
        </mat-card>
      </div>
    </div>

    <ng-template #loadingTpl>
      <app-loading-spinner [loading]="true" message="Loading dashboard..."></app-loading-spinner>
    </ng-template>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h2 { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .page-header p { margin: 0; color: #888; font-size: 14px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px !important;
      border-radius: 14px !important;
      border: none !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    }
    .stat-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon mat-icon { color: #fff; font-size: 26px; width: 26px; height: 26px; }
    .stat-icon.blue { background: linear-gradient(135deg, #5c6bc0, #3949ab); }
    .stat-icon.green { background: linear-gradient(135deg, #66bb6a, #43a047); }
    .stat-icon.purple { background: linear-gradient(135deg, #ab47bc, #8e24aa); }
    .stat-icon.orange { background: linear-gradient(135deg, #ffa726, #ef6c00); }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1a1a2e; line-height: 1; }
    .stat-label { font-size: 13px; color: #888; margin-top: 4px; }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .chart-card {
      padding: 24px !important;
      border-radius: 14px !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    }
    .chart-card h3 { margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #333; }

    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 20px;
    }
    .quick-actions-card, .recent-card {
      padding: 24px !important;
      border-radius: 14px !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
    }
    .quick-actions-card h3, .recent-card h3 { margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #333; }
    .actions-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .actions-list a { justify-content: flex-start; gap: 8px; }
    .stats-summary { display: flex; flex-direction: column; gap: 12px; }
    .summary-item { display: flex; justify-content: space-between; }
    .summary-label { color: #888; font-size: 13px; }
    .summary-value { font-weight: 600; color: #333; }

    .recent-list { display: flex; flex-direction: column; gap: 12px; }
    .recent-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .recent-item:last-child { border-bottom: none; }
    .recent-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #5c6bc0, #3949ab);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 16px; flex-shrink: 0;
    }
    .recent-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .recent-name { font-size: 14px; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .recent-dept { font-size: 12px; color: #888; }
    .empty { text-align: center; padding: 24px; color: #999; }

    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
      .bottom-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  deptChartData: ChartData<'doughnut'> | null = null;
  typeChartData: ChartData<'bar'> | null = null;

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  private chartColors = ['#5c6bc0', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#8d6e63'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.buildCharts();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private buildCharts(): void {
    if (!this.stats) return;

    this.deptChartData = {
      labels: this.stats.employeesByDepartment.map(d => d.department),
      datasets: [{
        data: this.stats.employeesByDepartment.map(d => d.count),
        backgroundColor: this.chartColors
      }]
    };

    this.typeChartData = {
      labels: this.stats.employeesByEmploymentType.map(t => t.type),
      datasets: [{
        data: this.stats.employeesByEmploymentType.map(t => t.count),
        backgroundColor: this.chartColors,
        borderRadius: 6
      }]
    };
  }
}
