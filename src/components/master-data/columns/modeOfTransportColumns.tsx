'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Icon } from '@iconify/react';
import { ModeOfTransport, TransportMode } from '@/types';

interface CreateColumnsOptions {
  onEdit?: (mode: ModeOfTransport) => void;
  onToggleStatus?: (id: number, currentStatus: boolean, name: string) => void;
}

const getModeIcon = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.AIR:
      return 'mdi:airplane';
    case TransportMode.FCL_SEA:
      return 'mdi:ferry';
    case TransportMode.LCL_SEA:
      return 'mdi:ship-wheel';
    case TransportMode.TRUCK:
      return 'mdi:truck';
    case TransportMode.TRAIN:
      return 'mdi:train';
    default:
      return 'mdi:swap-horizontal';
  }
};

const getModeBadgeColor = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.AIR:
      return 'bg-sky-100 text-sky-800';
    case TransportMode.FCL_SEA:
      return 'bg-blue-100 text-blue-800';
    case TransportMode.LCL_SEA:
      return 'bg-cyan-100 text-cyan-800';
    case TransportMode.TRUCK:
      return 'bg-orange-100 text-orange-800';
    case TransportMode.TRAIN:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const createModeOfTransportColumns = (options?: CreateColumnsOptions): ColumnDef<ModeOfTransport>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Icon 
          icon={getModeIcon(row.original.mode)} 
          className="w-5 h-5 text-gray-400 mr-3" 
        />
        <div className="text-sm font-medium text-gray-900">
          {row.getValue('name')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {row.getValue('code')}
      </span>
    ),
  },
  {
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ row }) => {
      const mode = row.getValue('mode') as TransportMode;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getModeBadgeColor(mode)}`}>
          {mode.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 max-w-xs truncate">
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'sort_order',
    header: 'Order',
    cell: ({ row }) => (
      <div className="text-sm text-gray-900 text-center">
        {row.getValue('sort_order')}
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
      const mode = row.original;
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => options?.onEdit?.(mode)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => options?.onToggleStatus?.(mode.id, mode.is_active, mode.name)}
            className={`p-1 rounded ${
              mode.is_active 
                ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
            }`}
            title={mode.is_active ? 'Deactivate' : 'Activate'}
          >
            <Icon 
              icon={mode.is_active ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline'} 
              className="w-5 h-5" 
            />
          </button>
        </div>
      );
    },
  },
];