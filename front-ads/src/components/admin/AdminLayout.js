'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/services/authService';
import AdminSidebar from './AdminSidebar';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push('/auth/login');
          return;
        }

        // Get current user info
        const currentUser = await getCurrentUser();
        
        // Check if user is admin or superadmin
        if (!currentUser || (currentUser.role !== 'superadmin')) {
          router.push('/dashboard');
          return;
        }
        
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/auth/login');
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
}