'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Icon } from '@iconify/react';

interface CreateColumnsOptions {
  router: AppRouterInstance;
}

export const createModeOfTransportColumns = ({ router }: CreateColumnsOptions): ColumnDef<any>[] => [
  {
    accessorKey: 'mode_name',
    header: 'Mode Name',
    size: 150,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const modeName = row.getValue('mode_name') as string;
      return (
        <div className="font-medium text-gray-900 truncate capitalize">
          {modeName}
        </div>
      );
    },
  },
  {
    accessorKey: 'code',
    header: 'Mode Code',
    size: 120,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const code = row.getValue('code') as string;
      return (
        <div className="text-sm text-gray-600">
          {code}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description / Notes',
    size: 250,
    enableSorting: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div className="text-sm text-gray-600 truncate">
          {description || 'No description'}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Is Active / Status',
    size: 100,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    accessorKey: 'associated_carriers',
    header: 'Associated Carriers',
    size: 200,
    enableSorting: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const carriers = row.getValue('associated_carriers') as string[];
      return (
        <div className="text-xs text-gray-700 truncate">
          {carriers && carriers.length > 0 ? carriers.join(', ') : 'None'}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 120,
    cell: ({ row }) => {
      const id = row.original.mode_id;
      const isActive = row.original.is_active;
      // Only show actions for admin/master data users (add your permission logic here)
      return (
        <div className="flex gap-2">
          <button
            className="icon-btn"
            title="Edit"
            onClick={() => router.push(`/mode-of-transport/edit/${id}`)}
          >
            <Icon icon="mdi:pencil" className="w-4 h-4 text-blue-600" />
          </button>
          <button
            className="icon-btn"
            title={isActive ? 'Disable' : 'Enable'}
            // TODO: Implement enable/disable logic/modal
          >
            <Icon icon={isActive ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'} className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
          </button>
        </div>
      );
    },
  },
];