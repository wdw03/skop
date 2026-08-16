export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
  designation?: string;
  dateOfJoining: string;
  salary: number;
  employmentType: string;
  status: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeList {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentName: string;
  designation?: string;
  dateOfJoining: string;
  status: string;
  employmentType: string;
  profileImageUrl?: string;
}

export interface CreateEmployee {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  departmentId: number;
  roleId: number;
  designation?: string;
  dateOfJoining: string;
  salary: number;
  employmentType: number;
  status: number;
  profileImageUrl?: string;
}

export interface UpdateEmployee extends CreateEmployee {}

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartment {
  name: string;
  description?: string;
  managerId?: number;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRole {
  name: string;
  description?: string;
}
