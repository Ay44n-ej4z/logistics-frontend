'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface CreateColumnsOptions {
  router: AppRouterInstance;
  onDelete?: (id: string, name: string) => void;
}

export const createHouseAwbsColumns = (options: CreateColumnsOptions | AppRouterInstance): ColumnDef<unknown>[] => {
  // Support both old signature (just router) and new signature (options object)
  const router = 'push' in options ? options : options.router;
  const onDelete = 'push' in options ? undefined : options.onDelete;

  return [
  {
    accessorKey: 'house_number',
    header: 'House AWB Number',
    size: 150,
    cell: ({ row }) => {
      const houseNumber = row.getValue('house_number') as string;
      return (
        <div className="font-medium text-blue-600 truncate">
          {houseNumber}
        </div>
      );
    },
  },
  {
    accessorKey: 'job',
    header: 'Job Number',
    size: 120,
    cell: ({ row }) => {
      const job = (row.original as any).job;
      return (
        <div className="text-sm truncate" title={job?.job_number || 'N/A'}>
          {job?.job_number || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'shipper',
    header: 'Shipper',
    size: 150,
    cell: ({ row }) => {
      const shipper = (row.original as any).shipper;
      return (
        <div className="text-sm truncate" title={shipper?.name || 'N/A'}>
          {shipper?.name || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'consignee',
    header: 'Consignee',
    size: 150,
    cell: ({ row }) => {
      const consignee = (row.original as any).consignee;
      return (
        <div className="text-sm truncate" title={consignee?.name || 'N/A'}>
          {consignee?.name || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'master_awb',
    header: 'Master AWB',
    size: 120,
    cell: ({ row }) => {
      const masterAwb = (row.original as any).master_awb;
      return (
        <div className="text-sm truncate" title={masterAwb?.master_number || 'N/A'}>
          {masterAwb?.master_number || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'issue_date',
    header: 'Issue Date',
    size: 100,
    cell: ({ row }) => {
      const issueDate = row.getValue('issue_date') as string;
      return (
        <div className="text-sm">
          {new Date(issueDate).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        'draft': 'bg-gray-100 text-gray-800',
        'issued': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
      };
      
      return (
        <span 
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'items',
    header: 'Items',
    size: 80,
    cell: ({ row }) => {
      const items = (row.original as any).items || [];
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {items.length}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 120,
    cell: ({ row }) => {
      const houseAwb = row.original as any;
      
      return (
        <div className="flex items-center space-x-1">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwb.house_id}`)}
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwb.house_id}/edit`)}
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            onClick={() => {
              if (onDelete) {
                onDelete(houseAwb.house_id, houseAwb.house_number);
              } else if (confirm(`Are you sure you want to delete House AWB ${houseAwb.house_number}?`)) {
                console.log('Delete house AWB:', houseAwb.house_id);
                alert('Delete functionality: Please pass onDelete callback to columns');
              }
            }}
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];
};
