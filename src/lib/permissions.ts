import { UserRole } from '@/types';

export interface Permission {
  module: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'jobs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'master-awbs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'house-awbs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'quick-actions', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'items', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'cost-centers', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'invoices', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'approvals', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'lists', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'transactions', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'reconcile', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'track', actions: ['read'] },
    { module: 'parties', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'countries', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'cities', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'ports-airports', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'carriers', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'commodities', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'settings', actions: ['read', 'update'] },
  ],
  [UserRole.OPERATIONS]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'jobs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'master-awbs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'house-awbs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'quick-actions', actions: ['read', 'create', 'update'] },
    { module: 'items', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'cost-centers', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'parties', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'countries', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'cities', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'ports-airports', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'carriers', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'commodities', actions: ['read', 'create', 'update', 'delete'] },
  ],
  [UserRole.ACCOUNTS]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'invoices', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'approvals', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'lists', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'jobs', actions: ['read'] },
    { module: 'parties', actions: ['read', 'create', 'update'] },
  ],
  [UserRole.FINANCE]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'transactions', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'reconcile', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'invoices', actions: ['read', 'update'] },
    { module: 'jobs', actions: ['read'] },
    { module: 'cost-centers', actions: ['read', 'create', 'update', 'delete'] },
  ],
  [UserRole.MANAGEMENT]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'jobs', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'invoices', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'approvals', actions: ['read', 'create', 'update', 'delete'] },
    { module: 'transactions', actions: ['read', 'create', 'update'] },
    { module: 'users', actions: ['read', 'create', 'update'] },
    { module: 'reports', actions: ['read', 'create'] },
  ],
  [UserRole.CUSTOMER]: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'track', actions: ['read'] },
    { module: 'invoices', actions: ['read'] },
    { module: 'jobs', actions: ['read'] },
  ],
};

export const hasPermission = (userRole: UserRole, module: string, action: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  const modulePermission = permissions.find(p => p.module === module);
  return modulePermission?.actions.includes(action) || false;
};

export const canAccessModule = (userRole: UserRole, module: string): boolean => {
  return hasPermission(userRole, module, 'read');
};

export const canCreate = (userRole: UserRole, module: string): boolean => {
  return hasPermission(userRole, module, 'create');
};

export const canUpdate = (userRole: UserRole, module: string): boolean => {
  return hasPermission(userRole, module, 'update');
};

export const canDelete = (userRole: UserRole, module: string): boolean => {
  return hasPermission(userRole, module, 'delete');
};
