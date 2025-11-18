'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, setToken, setUser, clearAuth, getToken, getUser } from '@/lib/api';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // MOCK DATA - Remove this when connecting to real backend
  const [user, setUserState] = useState<User | null>({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@vitrinnea.com',
    user_type: 'admin',
    country: 'SV',
    roles: [
      { id: 1, name: 'super_admin', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, name: 'admin_sv', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    permissions: [
      { id: 1, name: 'view-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 2, name: 'create-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 3, name: 'edit-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 4, name: 'delete-users', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 5, name: 'manage-roles', guard_name: 'api', created_at: '2024-01-01', updated_at: '2024-01-01' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    // DISABLED FOR UI PREVIEW - Uncomment when connecting to real backend
    // const initAuth = async () => {
    //   const token = getToken();
    //   const storedUser = getUser();

    //   if (token && storedUser) {
    //     setUserState(storedUser);
    //     // Verify token is still valid
    //     try {
    //       const response = await authApi.me();
    //       if (response.success) {
    //         setUserState(response.data);
    //         setUser(response.data);
    //       } else {
    //         clearAuth();
    //         setUserState(null);
    //       }
    //     } catch (error) {
    //       clearAuth();
    //       setUserState(null);
    //     }
    //   }
    //   setLoading(false);
    // };

    // initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // MOCK LOGIN - Replace with real API call to backend
    // TODO: Connect to POST /auth/login endpoint
    toast.success('Login successful! (Mock)');
    router.push('/profile');
    
    // Uncomment below when connecting to real backend:
    // try {
    //   setLoading(true);
    //   const response = await authApi.login(email, password);

    //   if (response.success && response.data) {
    //     setToken(response.data.access_token);
    //     setUser(response.data.user);
    //     setUserState(response.data.user);
    //     toast.success('Login successful!');
    //     router.push('/profile');
    //   } else {
    //     toast.error('Login failed. Please try again.');
    //   }
    // } catch (error: any) {
    //   const errorMessage = error.message || 'Login failed. Please check your credentials.';
    //   toast.error(errorMessage);
    //   throw error;
    // } finally {
    //   setLoading(false);
    // }
  };

  const logout = async () => {
    // MOCK LOGOUT - Replace with real API call to backend
    // TODO: Connect to POST /auth/logout endpoint
    toast.success('Logged out successfully! (Mock)');
    router.push('/login');
    
    // Uncomment below when connecting to real backend:
    // try {
    //   await authApi.logout();
    //   clearAuth();
    //   setUserState(null);
    //   toast.success('Logged out successfully');
    //   router.push('/login');
    // } catch (error) {
    //   clearAuth();
    //   setUserState(null);
    //   router.push('/login');
    // }
  };

  const refreshUser = async () => {
    // MOCK REFRESH - Replace with real API call to backend
    // TODO: Connect to GET /auth/me endpoint
    console.log('Mock: User refresh called');
    
    // Uncomment below when connecting to real backend:
    // try {
    //   const response = await authApi.me();
    //   if (response.success) {
    //     setUserState(response.data);
    //     setUser(response.data);
    //   }
    // } catch (error) {
    //   console.error('Failed to refresh user:', error);
    // }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return user.roles.some(r => roles.includes(r.name));
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;
    
    const permissions = Array.isArray(permission) ? permission : [permission];
    return user.permissions.some(p => permissions.includes(p.name));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
