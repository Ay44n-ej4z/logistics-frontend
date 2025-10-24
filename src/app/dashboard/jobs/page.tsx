'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createJobsColumns } from '@/components/master-data/columns/jobsColumns';

export default function JobsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs data
  const { data: jobsResponse, isLoading, error } = useGetJobsQuery({
    page: currentPage,
    limit: 25,
    search: searchTerm || undefined
  });

  console.log(jobsResponse);  

  const jobs = useMemo(() => jobsResponse?.data || [], [jobsResponse]);
  const pagination = useMemo(() => ({
    total: jobs.length,
    page: currentPage,
    limit: 25,
    totalPages: Math.ceil(jobs.length / 25)
  }), [jobs.length, currentPage]);

  const columns = useMemo(() => createJobsColumns(router), [router]);

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
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your freight forwarding jobs and their hierarchy
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/jobs/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="card">
        <MasterDataTable
          data={jobs}
          columns={columns}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search jobs by number, shipper, or consignee..."
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