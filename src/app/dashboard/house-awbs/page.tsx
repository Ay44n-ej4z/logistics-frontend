'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createHouseAwbsColumns } from '@/components/master-data/columns/houseAwbsColumns';
import { useGetHouseAwbsQuery, useDeleteHouseAwbMutation } from '@/store/api/houseAwbsApi';
import { useToast } from '@/hooks/useToast';

export default function HouseAwbsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch House AWBs data
  const { data: houseAwbsResponse, isLoading, error } = useGetHouseAwbsQuery({
    page: currentPage,
    limit: 25,
    search: searchTerm || undefined,
  });

  // Delete mutation
  const [deleteHouseAwb] = useDeleteHouseAwbMutation();

  // API returns: { success: true, message: "...", data: {...} }
  // The data.data property contains the array of House AWBs
  const houseAwbs = useMemo(() => {
    if (error || !houseAwbsResponse) return [];
    return Array.isArray(houseAwbsResponse.data.data) ? houseAwbsResponse.data.data : [];
  }, [houseAwbsResponse, error]);

  // Since the API doesn't return pagination meta, calculate from the array length
  const pagination = useMemo(() => {
    const total = houseAwbs.length;
    return {
      total: total,
      page: currentPage,
      limit: 25,
      totalPages: Math.ceil(total / 25),
    };
  }, [houseAwbs.length, currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete House AWB "${name}"?\n\nThis action cannot be undone and will also delete all associated items.`)) {
      return;
    }

    try {
      await deleteHouseAwb(id).unwrap();
      toast.success(`House AWB "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete House AWB "${name}"`);
    }
  }, [deleteHouseAwb, toast]);

  const columns = useMemo(() => createHouseAwbsColumns({ router, onDelete: handleDelete }), [router, handleDelete]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">House AWBs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage House Air Waybills and their items
          </p>
        </div>
        <div className="flex space-x-3">
          {/* <button
            onClick={() => router.push('/dashboard/house-awbs/create?jobId=1')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Test Create (Job ID: 1)
          </button> */}
          <button
            onClick={() => router.push('/dashboard/house-awbs/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create House AWB
          </button>
        </div>
      </div>

      {/* House AWBs Table */}
      <div className="card">
        <MasterDataTable
          data={houseAwbs}
          columns={columns}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search house AWBs by number, shipper, or consignee..."
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
