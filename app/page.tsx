'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // DISABLED FOR UI PREVIEW - Just redirect to profile
    router.push('/profile');
    
    // Uncomment below when connecting to real backend:
    // if (!loading) {
    //   if (isAuthenticated) {
    //     router.push('/profile');
    //   } else {
    //     router.push('/login');
    //   }
    // }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
