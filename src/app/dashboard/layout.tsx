'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import Header from '@/components/layout/Header';
import NavigationBar from '@/components/layout/NavigationBar';
import DashboardContent from '@/components/dashboard/DashboardContent';

import type { ReactElement } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard Layout - Auth state:', { isAuthenticated, user, isLoading });
  }, [isAuthenticated, user, isLoading]);

  // Fetch user profile if token exists but no user data
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && !user && !isLoading) {
        console.log('Fetching user profile...');
        try {
          const { authApi } = await import('@/store/api/authApi');
          await dispatch(authApi.endpoints.getProfile.initiate());
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, user, isLoading, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />
      
      {/* Navigation Bar */}
      {user && <NavigationBar userRole={user.role} />}
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
