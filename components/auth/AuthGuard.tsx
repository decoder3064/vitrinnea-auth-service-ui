'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('🛡️ AuthGuard check:', { loading, isAuthenticated, pathname, user: user?.email });
    
    // Don't do anything while still loading
    if (loading) {
      setIsChecking(true);
      return;
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      console.log('🔒 Not authenticated, redirecting to /login');
      router.replace('/login');
      setIsChecking(false);
      return;
    }

    // If authenticated and on login page, redirect to profile
    if (isAuthenticated && pathname === '/login') {
      console.log('✅ Already authenticated on login page, redirecting to /profile');
      router.replace('/profile');
      setIsChecking(false);
      return;
    }

    // Check role-based access for admin routes
    if (isAuthenticated && pathname.startsWith('/admin')) {
      const hasAdminRole = user?.roles?.some(role => {
        const roleName = typeof role === 'string' ? role : role.name;
        return ['super_admin', 'admin_sv', 'admin_gt'].includes(roleName);
      });

      if (!hasAdminRole) {
        console.log('⛔ No admin role, redirecting to /profile');
        router.replace('/profile');
        setIsChecking(false);
        return;
      }
    }

    console.log('✅ AuthGuard passed, rendering page');
    setIsChecking(false);
  }, [loading, isAuthenticated, user, pathname, router]);

  // Show loading state while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
