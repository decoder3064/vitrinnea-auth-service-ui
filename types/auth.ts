// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  country: string;
  roles: Role[];
  permissions: Permission[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    role_id: number;
    model_type: string;
  };
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
  };
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 
  | 'super_admin'
  | 'admin_sv'
  | 'admin_gt'
  | 'warehouse_manager_sv'
  | 'warehouse_manager_gt'
  | 'operations'
  | 'employee';
