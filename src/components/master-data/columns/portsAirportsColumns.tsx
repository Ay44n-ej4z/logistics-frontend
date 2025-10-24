'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { PortAirport } from '@/types';

interface CreateColumnsOptions {
  onEdit?: (portAirport: PortAirport) => void;
  onDelete?: (id: string, name: string) => void;
}

export const createPortsAirportsColumns = (options?: CreateColumnsOptions): ColumnDef<PortAirport>[] => [
  {
    accessorKey: 'port_name',
    header: 'Port/Airport',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Icon 
          icon={row.original.type === 'airport' ? 'mdi:airplane' : 'mdi:ship-wheel'} 
          className="w-5 h-5 text-gray-400 mr-3" 
        />
        <div className="text-sm font-medium text-gray-900">
          {row.getValue('port_name')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'port_code',
    header: 'Code',
    cell: ({ row }) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {row.getValue('port_code')}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        row.getValue('type') === 'airport' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {row.getValue('type')}
      </span>
    ),
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => (
      <div className="text-sm text-gray-900">
        {row.original.city?.city_name || '-'}
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
      const portAirport = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => options?.onEdit?.(portAirport)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => options?.onDelete?.(portAirport.port_id, portAirport.port_name)}
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

export const portsAirportsColumns = createPortsAirportsColumns();
