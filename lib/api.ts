import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, MeResponse, ApiResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vitrinnea-auth.test/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const newToken = await refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    // Sanitize error messages to prevent information disclosure
    let errorMessage = 'An error occurred';
    if (error.response?.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.response?.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.response?.status === 422) {
      errorMessage = 'Invalid input data';
    } else if (error.response?.status && error.response.status >= 500) {
      errorMessage = 'Server error. Please try again later';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Token management helpers
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Validate token is not empty
      return token.trim() !== '' ? token : null;
    }
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};

export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        // Validate it's an object and has expected properties
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return parsed;
        }
      } catch (error) {
        // Invalid JSON, clear storage
        localStorage.removeItem('user');
      }
    }
  }
  return null;
};

// Transform backend user response to frontend format
const transformUser = (user: any): any => {
  return {
    ...user,
    roles: Array.isArray(user.roles)
      ? user.roles.map((role: any) => 
          typeof role === 'string' 
            ? { id: 0, name: role, guard_name: 'api', created_at: '', updated_at: '' }
            : role
        )
      : [],
    permissions: Array.isArray(user.permissions)
      ? user.permissions.map((permission: any) => 
          typeof permission === 'string'
            ? { id: 0, name: permission, guard_name: 'api', created_at: '', updated_at: '' }
            : permission
        )
      : [],
  };
};

// Auth API methods
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    // Backend returns: { success: true, access_token, token_type, expires_in, user }
    // Transform to match frontend AuthResponse type
    if (response.data.success && response.data.user) {
      return {
        success: true,
        data: {
          access_token: response.data.access_token,
          token_type: response.data.token_type || 'bearer',
          expires_in: response.data.expires_in || 3600,
          user: transformUser(response.data.user)
        }
      } as AuthResponse;
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    clearAuth();
  },

  me: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    // Backend returns: { success: true, user: {...} }
    // Transform to match frontend MeResponse type
    if (response.data.success && response.data.user) {
      return {
        success: true,
        data: transformUser(response.data.user)
      } as MeResponse;
    }
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh');
    // Backend returns: { success: true, access_token, token_type, expires_in, user }
    if (response.data.success && response.data.user) {
      return {
        success: true,
        data: {
          access_token: response.data.access_token,
          token_type: response.data.token_type || 'bearer',
          expires_in: response.data.expires_in || 3600,
          user: transformUser(response.data.user)
        }
      } as AuthResponse;
    }
    return response.data;
  },

  verify: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/verify');
    return response.data;
  },
};

// Refresh token helper
const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await authApi.refresh();
    if (response.success && response.data?.access_token) {
      setToken(response.data.access_token);
      setUser(response.data.user);
      return response.data.access_token;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// User API methods (for admin)
export const userApi = {
  getAll: async (filters?: { country?: string; active?: boolean; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.active !== undefined) params.append('active', filters.active ? '1' : '0');
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
    const response = await api.get(url);
    // Backend returns: { success: true, data: { current_page, data: [...], total, ... } }
    // Extract the users array from the pagination wrapper
    if (response.data.success && response.data.data && response.data.data.data) {
      return {
        success: true,
        data: response.data.data.data, // Extract users array from pagination
        pagination: {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
        }
      };
    }
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  activate: async (id: number) => {
    const response = await api.post(`/admin/users/${id}/activate`);
    return response.data;
  },

  assignGroups: async (userId: number, groupIds: number[]) => {
    const response = await api.post(`/admin/users/${userId}/groups`, { groups: groupIds });
    return response.data;
  },

  resetPassword: async (userId: number) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`);
    return response.data;
  },
};

// Group API methods (for admin)
export const groupApi = {
  getAll: async () => {
    const response = await api.get('/admin/groups');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/groups/${id}`);
    return response.data;
  },

  create: async (data: { name: string; display_name: string; description?: string; active?: boolean }) => {
    const response = await api.post('/admin/groups', data);
    return response.data;
  },

  update: async (id: number, data: { display_name?: string; description?: string; active?: boolean }) => {
    const response = await api.put(`/admin/groups/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/groups/${id}`);
    return response.data;
  },

  assignPermissions: async (groupId: number, permissionIds: number[]) => {
    const response = await api.post(`/admin/groups/${groupId}/permissions`, { permissions: permissionIds });
    return response.data;
  },
};

// Keep roleApi for backward compatibility (maps to groups)
export const roleApi = groupApi;

// Permission API methods
// Note: Backend doesn't expose a permissions endpoint
// Permissions are managed through groups/roles
export const permissionApi = {
  getAll: async () => {
    // Return empty array since backend doesn't have this endpoint
    // Permissions are tied to roles/groups and returned with user data
    return {
      success: true,
      data: []
    };
  },
};

export default api;
