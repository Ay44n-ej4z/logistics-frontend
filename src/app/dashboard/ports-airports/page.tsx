'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useSearchPortsAirportsQuery, useDeletePortAirportMutation } from '@/store/api/masterDataApi';
import { PortAirportSearchParams } from '@/types';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createPortsAirportsColumns } from '@/components/master-data/columns/portsAirportsColumns';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function PortsAirportsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchParams, setSearchParams] = useState<PortAirportSearchParams>({
    page: 1,
    page_size: 25,
    sort_by: 'port_name',
    sort_dir: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: portsAirportsData, isLoading: isLoadingPortsAirports, error } = useSearchPortsAirportsQuery(searchParams);
  const [deletePortAirport] = useDeletePortAirportMutation();

  const handleEdit = useCallback((portAirport: any) => {
    router.push(`/dashboard/ports-airports/${portAirport.port_id}/edit`);
  }, [router]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete port/airport "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    try {
      await deletePortAirport(id).unwrap();
      toast.success(`Port/Airport "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete port/airport "${name}"`);
    }
  }, [deletePortAirport, toast]);

  const portsAirports = useMemo(() => portsAirportsData?.data || [], [portsAirportsData]);
  const pagination = useMemo(() => portsAirportsData?.data || { total: 0, page: 1, limit: 25, totalPages: 0 }, [portsAirportsData]);
  const columns = useMemo(() => createPortsAirportsColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchParams(prev => ({
      ...prev,
      port_name: value || undefined,
      page: 1, // Reset to first page when searching
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // Handle sorting
  const handleSort = (sortBy: string) => {
    setSearchParams(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_dir: prev.sort_by === sortBy && prev.sort_dir === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ports/Airports</h1>
          <p className="text-gray-600 mt-1">Manage ports and airports</p>
        </div>
        <Link
          href="/dashboard/ports-airports/create"
          className="btn-primary flex items-center"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
          Add Port/Airport
        </Link>
      </div>

      {/* Ports/Airports List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Ports/Airports</h3>
        </div>
        
        <MasterDataTable
          data={portsAirports}
          columns={columns}
          isLoading={isLoadingPortsAirports}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search ports/airports..."
          total={pagination.total}
          page={pagination.page}
          pageSize={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={searchParams.sort_by}
          currentSortDir={searchParams.sort_dir}
        />
      </div>
    </div>
  );
}
