'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { UserRole } from '@/types';
import { hasPermission } from '@/lib/permissions';

interface RoleGuardProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
  roles?: UserRole[];
}

export default function RoleGuard({ 
  children, 
  module, 
  action, 
  fallback = null, 
  roles 
}: RoleGuardProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <>{fallback}</>;
  }

  if (!user) {
    console.log('RoleGuard: No user found');
    return <>{fallback}</>;
  }

  // Handle nested user structure
  const userRole = (user as any)?.user?.role || user.role;

  console.log('RoleGuard check:', { module, action, userRole, user });

  // If specific roles are provided, check if user role is in the list
  if (roles && !roles.includes(userRole)) {
    console.log('RoleGuard: User role not in allowed roles', { userRole, roles });
    return <>{fallback}</>;
  }

  // Check permission for the module and action
  if (!hasPermission(userRole, module, action)) {
    console.log('RoleGuard: Permission denied', { userRole, module, action });
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common use cases
export function CanRead({ children, module, fallback }: { children: ReactNode; module: string; fallback?: ReactNode }) {
  return (
    <RoleGuard module={module} action="read" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CanCreate({ children, module, fallback }: { children: ReactNode; module: string; fallback?: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <>{fallback}</>;
  }
  
  // Handle nested user structure
  const userRole = (user as any)?.user?.role || (user as any)?.role;
  
  console.log('CanCreate check:', { module, userRole, user });
  
  // Always allow admin to create users
  if (userRole === UserRole.ADMIN && module === 'users') {
    console.log('CanCreate: Admin access granted for users module');
    return <>{children}</>;
  }
  
  return (
    <RoleGuard module={module} action="create" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CanUpdate({ children, module, fallback }: { children: ReactNode; module: string; fallback?: ReactNode }) {
  return (
    <RoleGuard module={module} action="update" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function CanDelete({ children, module, fallback }: { children: ReactNode; module: string; fallback?: ReactNode }) {
  return (
    <RoleGuard module={module} action="delete" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  // Handle nested user structure
  const userRole = (user as any)?.user?.role || (user as any)?.role;

  if (userRole === UserRole.ADMIN) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
