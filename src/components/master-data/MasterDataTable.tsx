'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

interface MasterDataTableProps<T> {
  data: T[] | { data: T[]; total: number; page: number; limit: number; totalPages: number } | { data: T[]; total: number; page: number; page_size: number; total_pages: number };
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (sortBy: string, sortDir: 'ASC' | 'DESC') => void;
  currentSort?: string;
  currentSortDir?: 'ASC' | 'DESC';
}

export default function MasterDataTable<T>({
  data,
  columns,
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  placeholder = 'Search...',
  total = 0,
  page = 1,
  pageSize = 25,
  totalPages = 1,
  onPageChange,
  onSort,
  currentSort,
  currentSortDir = 'ASC',
}: MasterDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Extract data array and pagination info
  const dataArray = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data || [];
  }, [data]);

  const paginationInfo = useMemo(() => {
    if (Array.isArray(data)) {
      return { total, page, pageSize, totalPages };
    }
    return {
      total: data?.total || total,
      page: data?.page || page,
      pageSize: (data as any)?.page_size || (data as any)?.limit || pageSize,
      totalPages: (data as any)?.total_pages || (data as any)?.totalPages || totalPages,
    };
  }, [data, total, page, pageSize, totalPages]);

  const table = useReactTable({
    data: dataArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: !!onSort,
    manualPagination: !!onPageChange,
    pageCount: paginationInfo.totalPages,
  });

  const handleSort = (columnId: string) => {
    if (onSort) {
      const newSortDir = currentSort === columnId && currentSortDir === 'ASC' ? 'DESC' : 'ASC';
      onSort(columnId, newSortDir);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Icon icon="mdi:loading" className="animate-spin w-8 h-8 text-primary-600 mx-auto" />
        <p className="text-gray-600 mt-2">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {onSearchChange && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {paginationInfo.total} total items
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          handleSort(header.column.id);
                        }
                      }}
                    >
                      <div className="flex items-center whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && currentSort === header.column.id && (
                          <Icon
                            icon={currentSortDir === 'ASC' ? 'mdi:arrow-up' : 'mdi:arrow-down'}
                            className="ml-1 w-3 h-3"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paginationInfo.totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            Showing {((paginationInfo.page - 1) * paginationInfo.pageSize) + 1} to{' '}
            {Math.min(paginationInfo.page * paginationInfo.pageSize, paginationInfo.total)} of{' '}
            {paginationInfo.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(paginationInfo.page - 1)}
              disabled={paginationInfo.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    paginationInfo.page === pageNum
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(paginationInfo.page + 1)}
              disabled={paginationInfo.page === paginationInfo.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
