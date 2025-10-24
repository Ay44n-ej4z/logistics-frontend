'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { Commodity } from '@/types';

interface CreateColumnsOptions {
  onEdit?: (commodity: Commodity) => void;
  onDelete?: (id: string, name: string) => void;
}

export const createCommoditiesColumns = (options?: CreateColumnsOptions): ColumnDef<Commodity>[] => [
  {
    accessorKey: 'commodity_name',
    header: 'Commodity',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Icon icon="mdi:package-variant" className="w-5 h-5 text-gray-400 mr-3" />
        <div className="text-sm font-medium text-gray-900">
          {row.getValue('commodity_name')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'commodity_code',
    header: 'Code',
    cell: ({ row }) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {row.getValue('commodity_code')}
      </span>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {row.getValue('category') || '-'}
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
      const commodity = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => options?.onEdit?.(commodity)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => options?.onDelete?.(commodity.commodity_id, commodity.commodity_name)}
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

export const commoditiesColumns = createCommoditiesColumns();
