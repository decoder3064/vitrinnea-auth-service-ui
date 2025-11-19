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
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUserState(storedUser);
        // Verify token is still valid
        try {
          const response = await authApi.me();
          if (response.success && response.data) {
            setUserState(response.data);
            setUser(response.data);
          } else {
            clearAuth();
            setUserState(null);
          }
        } catch (error) {
          clearAuth();
          setUserState(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        setToken(response.data.access_token);
        setUser(response.data.user);
        setUserState(response.data.user);
        setLoading(false);
        toast.success('Login successful!');
        window.location.href = '/profile';
      } else {
        toast.error('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (error: unknown) {
      // Sanitize error message to prevent XSS
      const errorMessage = 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      setUserState(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      clearAuth();
      setUserState(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        setUserState(response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return user.roles.some(r => {
      const roleName = typeof r === 'string' ? r : r.name;
      return roles.includes(roleName);
    });
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user || !user.permissions) return false;
    
    const permissions = Array.isArray(permission) ? permission : [permission];
    return user.permissions.some(p => {
      const permName = typeof p === 'string' ? p : p.name;
      return permissions.includes(permName);
    });
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
