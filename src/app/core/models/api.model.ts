export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: number;
  roleId?: number;
  status?: string;
  employmentType?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  totalDepartments: number;
  employeesJoinedThisMonth: number;
  employeesByDepartment: { department: string; count: number }[];
  employeesByEmploymentType: { type: string; count: number }[];
  employeesByStatus: { status: string; count: number }[];
  recentEmployees: RecentEmployee[];
}

export interface RecentEmployee {
  id: number;
  fullName: string;
  email: string;
  department: string;
  designation?: string;
  dateOfJoining: string;
  status: string;
  profileImageUrl?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
}
