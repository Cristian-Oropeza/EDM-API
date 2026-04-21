export interface User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  createdAt: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
  createdAt: string;
}

export interface Log {
  id: number;
  status_code: number;
  timestamp: string;
  path: string;
  error: string;
  error_code: string;
  session_id: number | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  id: number;
  name: string;
  lastName: string;
  username: string;
  role: string;
  createdAt: string;
  iat?: number;
  exp?: number;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  lastName: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  username?: string;
  password?: string;
}

export interface CreateTaskDto {
  name: string;
  description: string;
  priority: boolean;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  priority?: boolean;
}

export interface LogFilters {
  startDate?: string;
  endDate?: string;
  session_id?: number;
  error_code?: string;
}