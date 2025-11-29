'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useGetHouseAwbByIdQuery } from '@/store/api/houseAwbsApi';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export default function HouseAwbDetailPage() {
  const params = useParams();
  const router = useRouter();
  const houseAwbId = params.id as string;
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const toast = useToast();

  // Fetch House AWB details (including items)
  const { data: houseAwbResponse, isLoading, error } = useGetHouseAwbByIdQuery(houseAwbId);
  const houseAwb = houseAwbResponse?.data;

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${apiUrl}/master/house-awbs/${houseAwbId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `house-awb-${houseAwb?.house_number || 'download'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreviewPdf = () => {
    setShowPdfPreview(true);
  };

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
            onClick={handlePreviewPdf}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview PDF
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwbId}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit House AWB
          </button>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPdfPreview(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">House AWB PDF Preview</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => setShowPdfPreview(false)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/master/house-awbs/${houseAwbId}/pdf`}
                    className="w-full h-[600px] border rounded"
                    title="PDF Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

