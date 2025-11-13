'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Icon } from '@iconify/react';

const getModeIcon = (mode: string) => {
  switch (mode?.toLowerCase()) {
    case 'air':
      return 'mdi:airplane';
    case 'fcl_sea':
      return 'mdi:ferry';
    case 'lcl_sea':
      return 'mdi:ship-wheel';
    case 'truck':
      return 'mdi:truck';
    case 'train':
      return 'mdi:train';
    default:
      return 'mdi:help-circle';
  }
};

const getModeBadgeColor = (mode: string) => {
  switch (mode?.toLowerCase()) {
    case 'air':
      return 'bg-sky-100 text-sky-800';
    case 'fcl_sea':
      return 'bg-blue-100 text-blue-800';
    case 'lcl_sea':
      return 'bg-cyan-100 text-cyan-800';
    case 'truck':
      return 'bg-orange-100 text-orange-800';
    case 'train':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const createJobsColumns = (router: AppRouterInstance): ColumnDef<unknown>[] => [
  {
    accessorKey: 'job_number',
    header: 'Job Number',
    size: 120,
    cell: ({ row }) => {
      const jobNumber = row.getValue('job_number') as string;
      return (
        <div className="font-medium text-blue-600 truncate">
          {jobNumber}
        </div>
      );
    },
  },
  {
    accessorKey: 'job_type',
    header: 'Type',
    size: 80,
    cell: ({ row }) => {
      const jobType = row.getValue('job_type') as string;
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
          {jobType}
        </span>
      );
    },
  },
  {
    accessorKey: 'mode_of_transport',
    header: 'Mode',
    size: 100,
    cell: ({ row }) => {
      const modeOfTransport = (row.original as any).mode_of_transport;
      const mode = modeOfTransport?.mode || '';
      const name = modeOfTransport?.name || 'N/A';
      const code = modeOfTransport?.code || '';
      
      return (
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getModeBadgeColor(mode)}`}>
            <Icon icon={getModeIcon(mode)} className="w-3.5 h-3.5 mr-1" />
            {code}
          </span>
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
    accessorKey: 'carrier',
    header: 'Carrier',
    size: 120,
    cell: ({ row }) => {
      const carrier = (row.original as any).carrier;
      return (
        <div className="text-sm truncate" title={carrier?.carrier_name || 'N/A'}>
          {carrier?.carrier_name || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'origin_port',
    header: 'Origin',
    size: 120,
    cell: ({ row }) => {
      const originPort = (row.original as any).origin_port;
      const portText = originPort ? `${originPort.port_name} (${originPort.port_code})` : 'N/A';
      return (
        <div className="text-sm truncate" title={portText}>
          {portText}
        </div>
      );
    },
  },
  {
    accessorKey: 'destination_port',
    header: 'Destination',
    size: 120,
    cell: ({ row }) => {
      const destinationPort = (row.original as any).destination_port;
      const portText = destinationPort ? `${destinationPort.port_name} (${destinationPort.port_code})` : 'N/A';
      return (
        <div className="text-sm truncate" title={portText}>
          {portText}
        </div>
      );
    },
  },
  {
    accessorKey: 'job_date',
    header: 'Date',
    size: 100,
    cell: ({ row }) => {
      const jobDate = row.getValue('job_date') as string;
      return (
        <div className="text-sm">
          {new Date(jobDate).toLocaleDateString()}
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
        'open': 'bg-blue-100 text-blue-800',
        'invoiced': 'bg-indigo-100 text-indigo-800',
        'closed': 'bg-gray-100 text-gray-800',
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
    accessorKey: 'master_awbs',
    header: 'Master',
    size: 80,
    cell: ({ row }) => {
      const masterAwbs = (row.original as any).master_awbs || [];
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {masterAwbs.length}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'house_awbs',
    header: 'House',
    size: 80,
    cell: ({ row }) => {
      const houseAwbs = (row.original as any).house_awbs || [];
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {houseAwbs.length}
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
      const job = row.original as any;
      
      return (
        <div className="flex items-center space-x-1">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => router.push(`/dashboard/jobs/${job.job_id}`)}
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            onClick={() => router.push(`/dashboard/jobs/${job.job_id}/edit`)}
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            onClick={() => {
              if (confirm(`Are you sure you want to delete job ${job.job_number}?`)) {
                console.log('Delete job:', job.job_id);
                // TODO: Implement delete functionality
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
