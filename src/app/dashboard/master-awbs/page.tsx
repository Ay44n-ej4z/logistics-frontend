'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createMasterAwbsColumns } from '@/components/master-data/columns/masterAwbsColumns';
import { useGetMasterAwbsQuery, useDeleteMasterAwbMutation } from '@/store/api/masterAwbsApi';
import { useToast } from '@/hooks/useToast';

export default function MasterAwbsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Master AWBs data
  const { data: masterAwbsResponse, isLoading, error } = useGetMasterAwbsQuery({
    page: currentPage,
    page_size: 25,
  });

  const [deleteMasterAwb] = useDeleteMasterAwbMutation();

  // API returns: { success: true, message: "...", data: [...] }
  // The data property is directly the array of Master AWBs
  const masterAwbs = useMemo(() => {
    if (error || !masterAwbsResponse) return [];
    return Array.isArray(masterAwbsResponse.data) ? masterAwbsResponse.data : [];
  }, [masterAwbsResponse, error]);

  // Since the API doesn't return pagination meta, calculate from the array length
  const pagination = useMemo(() => {
    const total = masterAwbs.length;
    return {
      total: total,
      page: currentPage,
      limit: 25,
      totalPages: Math.ceil(total / 25),
    };
  }, [masterAwbs.length, currentPage]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Master AWB "${name}"?\n\nThis action cannot be undone. If this Master AWB has associated House AWBs, you must delete them first.`)) {
      return;
    }
    try {
      await deleteMasterAwb(id).unwrap();
      toast.success(`Master AWB "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete Master AWB "${name}"`);
    }
  }, [deleteMasterAwb, toast]);

  const columns = useMemo(() => createMasterAwbsColumns({ router, onDelete: handleDelete }), [router, handleDelete]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master AWBs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Master Air Waybills for consolidated shipments
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/master-awbs/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Master AWB
        </button>
      </div>

      {/* Master AWBs Table */}
      <div className="card">
        <MasterDataTable
          data={masterAwbs}
          columns={columns}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search master AWBs by number, job, or carrier..."
          total={pagination.total}
          page={pagination.page}
          pageSize={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
