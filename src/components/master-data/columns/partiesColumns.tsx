'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { Party } from '@/types';

interface CreateColumnsOptions {
  onEdit?: (party: Party) => void;
  onDelete?: (id: string, name: string) => void;
}

export const createPartiesColumns = (options?: CreateColumnsOptions): ColumnDef<Party>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium text-gray-900">
          {row.getValue('name')}
        </div>
        {row.original.short_name && (
          <div className="text-sm text-gray-500">
            {row.original.short_name}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
        {row.getValue('type')}
      </span>
    ),
  },
  {
    accessorKey: 'contact_person',
    header: 'Contact',
    cell: ({ row }) => (
      <div>
        <div className="text-sm text-gray-900">
          {row.getValue('contact_person') || '-'}
        </div>
        <div className="text-sm text-gray-500">
          {row.original.email || row.original.phone || '-'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'credit_limit',
    header: 'Credit Limit',
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {row.getValue('credit_limit') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const party = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => options?.onEdit?.(party)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => options?.onDelete?.(party.party_id, party.name)}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];

export const partiesColumns = createPartiesColumns();
