'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // DISABLED FOR UI PREVIEW - Uncomment when connecting to real backend
    // if (!loading) {
    //   // If not authenticated, redirect to login
    //   if (!isAuthenticated) {
    //     router.push('/login');
    //     return;
    //   }

    //   // If allowedRoles is specified, check if user has required role
    //   if (allowedRoles && allowedRoles.length > 0) {
    //     const hasRequiredRole = user?.roles?.some(role => 
    //       allowedRoles.includes(role.name)
    //     );

    //     if (!hasRequiredRole) {
    //       router.push('/profile'); // Redirect to profile if no access
    //     }
    //   }
    // }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  // DISABLED FOR UI PREVIEW - Just render children directly
  return <>{children}</>;
  
  // Uncomment below when connecting to real backend:
  // // Show loading state
  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  //         <p className="mt-4 text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // Don't render children until auth is confirmed
  // if (!isAuthenticated) {
  //   return null;
  // }

  // // Check role access
  // if (allowedRoles && allowedRoles.length > 0) {
  //   const hasRequiredRole = user?.roles?.some(role => 
  //     allowedRoles.includes(role.name)
  //   );

  //   if (!hasRequiredRole) {
  //     return (
  //       <div className="flex min-h-screen items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
  //           <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  // return <>{children}</>;
}
