export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roleId: number;
  employeeId?: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  roleId: number;
  employeeId?: number;
  isActive: boolean;
}
