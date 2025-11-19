import { Role, Permission } from './auth';

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  country: string;
  active: boolean; // User activation status
  roles: Role[];
  permissions: Permission[];
  groups?: any[]; // Groups the user belongs to
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  country: string;
  roles?: number[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  user_type?: string;
  country?: string;
  roles?: number[];
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RoleListResponse {
  success: boolean;
  data: Role[];
}

export interface PermissionListResponse {
  success: boolean;
  data: Permission[];
}
