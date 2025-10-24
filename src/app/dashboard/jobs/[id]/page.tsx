'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useGetJobByIdQuery } from '@/store/api/jobsApi';
import { useSearchMasterAwbsQuery } from '@/store/api/masterAwbsApi';
import { useState } from 'react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch job details
  const { data: jobResponse, isLoading: jobLoading, error: jobError } = useGetJobByIdQuery(jobId);
  const job = jobResponse?.data;

  // Fetch Master AWBs for this job
  const { data: masterAwbsResponse, isLoading: masterAwbsLoading } = useSearchMasterAwbsQuery({
    job_id: jobId,
    page: currentPage,
    page_size: 10,
  });

  const masterAwbs = masterAwbsResponse?.data?.data || [];
  const pagination = masterAwbsResponse?.data || { total: 0, page: 1, page_size: 10, total_pages: 0 };

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load job details</p>
        <button
          onClick={() => router.push('/dashboard/jobs')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <button
          onClick={() => router.push('/dashboard/jobs')}
          className="hover:text-blue-600"
        >
          Jobs
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{job.job_number}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/jobs')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
            <p className="text-sm text-gray-500 mt-1">{job.job_number}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/dashboard/jobs/${jobId}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Job
          </button>
          <button
            onClick={() => router.push(`/dashboard/master-awbs/create?jobId=${jobId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Master AWB
          </button>
        </div>
      </div>

      {/* Job Information Card */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Job Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Job Number</label>
            <p className="mt-1 text-sm text-gray-900">{job.job_number}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Job Type</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">{job.job_type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              job.status === 'open' ? 'bg-green-100 text-green-800' :
              job.status === 'invoiced' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Job Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(job.job_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Shipper</label>
            <p className="mt-1 text-sm text-gray-900">
              {job.shipper?.name || job.shipper?.short_name || `ID: ${job.shipper_id}`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Consignee</label>
            <p className="mt-1 text-sm text-gray-900">
              {job.consignee?.name || job.consignee?.short_name || `ID: ${job.consignee_id}`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Carrier</label>
            <p className="mt-1 text-sm text-gray-900">
              {job.carrier?.carrier_name || `ID: ${job.carrier_id}`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Origin Port</label>
            <p className="mt-1 text-sm text-gray-900">
              {job.origin_port?.port_name || job.origin_port?.port_code || `ID: ${job.origin_port_id}`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Destination Port</label>
            <p className="mt-1 text-sm text-gray-900">
              {job.destination_port?.port_name || job.destination_port?.port_code || `ID: ${job.destination_port_id}`}
            </p>
          </div>
          {job.gross_weight && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Gross Weight</label>
              <p className="mt-1 text-sm text-gray-900">{job.gross_weight} kg</p>
            </div>
          )}
          {job.chargeable_weight && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Chargeable Weight</label>
              <p className="mt-1 text-sm text-gray-900">{job.chargeable_weight} kg</p>
            </div>
          )}
          {job.package_count && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Package Count</label>
              <p className="mt-1 text-sm text-gray-900">{job.package_count}</p>
            </div>
          )}
          {job.eta && (
            <div>
              <label className="block text-sm font-medium text-gray-500">ETA</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(job.eta).toLocaleDateString()}
              </p>
            </div>
          )}
          {job.etd && (
            <div>
              <label className="block text-sm font-medium text-gray-500">ETD</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(job.etd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Master AWBs Section */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Master AWBs</h2>
            <p className="text-sm text-gray-500 mt-1">
              All Master Air Waybills associated with this job
            </p>
          </div>
          <button
            onClick={() => router.push(`/dashboard/master-awbs/create?jobId=${jobId}`)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Master AWB
          </button>
        </div>

        {masterAwbsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : masterAwbs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No Master AWBs found for this job</p>
            <button
              onClick={() => router.push(`/dashboard/master-awbs/create?jobId=${jobId}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First Master AWB
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Master AWB Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {masterAwbs.map((masterAwb: any) => (
                    <tr key={masterAwb.master_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {masterAwb.master_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {masterAwb.carrier?.name || masterAwb.carrier?.code || `ID: ${masterAwb.carrier_id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(masterAwb.issue_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          masterAwb.status === 'issued' ? 'bg-green-100 text-green-800' :
                          masterAwb.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {masterAwb.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/dashboard/master-awbs/${masterAwb.master_id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {masterAwbs.length > 0 && pagination.total > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.total} ({pagination.total} total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.total, currentPage + 1))}
                disabled={currentPage === pagination.total}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

