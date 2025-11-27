'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, setToken, setUser, clearAuth, getToken, getUser, getCountry, setCountry } from '@/lib/api';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  selectedCountry: string | null;
  login: (email: string, password: string, country: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changeCountry: (country: string) => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getUser();
      const storedCountry = getCountry();

      if (storedCountry) {
        setSelectedCountry(storedCountry);
      }

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
            setSelectedCountry(null);
          }
        } catch (error) {
          clearAuth();
          setUserState(null);
          setSelectedCountry(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, country: string) => {
    try {
      console.log('🔐 Login attempt:', { email, country });
      const response = await authApi.login(email, password, country);
      console.log('✅ Login response:', response);

      if (response.success && response.data) {
        // Store everything first
        setToken(response.data.access_token);
        setUser(response.data.user);
        setCountry(country);
        
        // Update state
        setUserState(response.data.user);
        setSelectedCountry(country);
        
        console.log('✅ User state updated:', response.data.user);
        console.log('✅ Country set to:', country);
        
        toast.success('Login successful!');
        
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          console.log('🔄 Navigating to /profile');
          setLoading(false);
          router.push('/profile');
        }, 100);
      } else {
        console.error('❌ Login failed:', response);
        toast.error('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      // Sanitize error message to prevent XSS
      const errorMessage = 'Login failed. Please check your credentials and country access.';
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
      setSelectedCountry(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      clearAuth();
      setUserState(null);
      setSelectedCountry(null);
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

  const changeCountry = async (country: string) => {
    if (!user?.allowed_countries?.includes(country.toUpperCase())) {
      toast.error('You do not have access to this country');
      return;
    }
    setCountry(country);
    setSelectedCountry(country);
    toast.success(`Switched to ${country}`);
    // Optionally refresh user data after country change
    await refreshUser();
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
    selectedCountry,
    login,
    logout,
    refreshUser,
    changeCountry,
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
