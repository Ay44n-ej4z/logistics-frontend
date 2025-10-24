'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useGetHouseAwbByIdQuery } from '@/store/api/houseAwbsApi';

export default function HouseAwbDetailPage() {
  const params = useParams();
  const router = useRouter();
  const houseAwbId = params.id as string;

  // Fetch House AWB details (including items)
  const { data: houseAwbResponse, isLoading, error } = useGetHouseAwbByIdQuery(houseAwbId);
  const houseAwb = houseAwbResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !houseAwb) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load House AWB details</p>
        <button
          onClick={() => router.push('/dashboard/house-awbs')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to House AWBs
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
        {houseAwb.job && (
          <>
            <button
              onClick={() => router.push(`/dashboard/jobs/${houseAwb.job_id}`)}
              className="hover:text-blue-600"
            >
              {houseAwb.job.job_number}
            </button>
            <span>/</span>
          </>
        )}
        {houseAwb.master_awb && (
          <>
            <button
              onClick={() => router.push(`/dashboard/master-awbs/${houseAwb.master_id}`)}
              className="hover:text-blue-600"
            >
              {houseAwb.master_awb.master_number}
            </button>
            <span>/</span>
          </>
        )}
        <button
          onClick={() => router.push('/dashboard/house-awbs')}
          className="hover:text-blue-600"
        >
          House AWBs
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{houseAwb.house_number}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (houseAwb.master_id) {
                router.push(`/dashboard/master-awbs/${houseAwb.master_id}`);
              } else if (houseAwb.job_id) {
                router.push(`/dashboard/jobs/${houseAwb.job_id}`);
              } else {
                router.push('/dashboard/house-awbs');
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">House AWB Details</h1>
            <p className="text-sm text-gray-500 mt-1">{houseAwb.house_number}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwbId}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit House AWB
          </button>
        </div>
      </div>

      {/* House AWB Information Card */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">House AWB Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">House AWB Number</label>
            <p className="mt-1 text-sm text-gray-900">{houseAwb.house_number}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              houseAwb.status === 'issued' ? 'bg-green-100 text-green-800' :
              houseAwb.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {houseAwb.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Issue Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(houseAwb.issue_date).toLocaleDateString()}
            </p>
          </div>
          {houseAwb.job && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Job</label>
              <button
                onClick={() => router.push(`/dashboard/jobs/${houseAwb.job_id}`)}
                className="mt-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {houseAwb.job.job_number}
              </button>
            </div>
          )}
          {houseAwb.master_awb && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Master AWB</label>
              <button
                onClick={() => router.push(`/dashboard/master-awbs/${houseAwb.master_id}`)}
                className="mt-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {houseAwb.master_awb.master_number}
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500">Shipper</label>
            <p className="mt-1 text-sm text-gray-900">
              {houseAwb.shipper?.name || houseAwb.shipper?.short_name || `ID: ${houseAwb.shipper_id}`}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Consignee</label>
            <p className="mt-1 text-sm text-gray-900">
              {houseAwb.consignee?.name || houseAwb.consignee?.short_name || `ID: ${houseAwb.consignee_id}`}
            </p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>
          <p className="text-sm text-gray-500 mt-1">
            All items associated with this House AWB
          </p>
        </div>

        {!houseAwb.items || houseAwb.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found for this House AWB</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Commodity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Package Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Package Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {houseAwb.items.map((item: any, index: number) => (
                    <tr key={item.item_id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.commodity?.commodity_name || item.commodity?.commodity_code || `ID: ${item.commodity_id}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={item.description}>
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.weight ? `${item.weight} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.volume ? `${item.volume} m³` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.package_count || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.package_type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.value && item.currency ? `${item.currency} ${item.value}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {houseAwb.items && houseAwb.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Items</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{houseAwb.items.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Weight</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {houseAwb.items.reduce((sum: number, item: any) => 
                    sum + (parseFloat(item.weight) || 0), 0
                  ).toFixed(2)} kg
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Volume</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {houseAwb.items.reduce((sum: number, item: any) => 
                    sum + (parseFloat(item.volume) || 0), 0
                  ).toFixed(2)} m³
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Packages</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {houseAwb.items.reduce((sum: number, item: any) => 
                    sum + (parseInt(item.package_count) || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

