'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetJobByIdQuery, useGetJobsQuery } from '@/store/api/jobsApi';
import { useCreateMasterAwbMutation } from '@/store/api/masterAwbsApi';
import { useGetHouseAwbsQuery } from '@/store/api/houseAwbsApi';
import { 
  useGetCarriersQuery, 
  useSearchCarriersQuery
} from '@/store/api/masterDataApi';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';
import { generateAutoNumber } from '@/lib/generateNumber';

// Master AWB Schema
const masterAwbSchema = z.object({
  master_number: z.string().min(1, 'Master AWB number is required'),
  job_id: z.string().min(1, 'Job is required'),
  carrier_id: z.string().min(1, 'Carrier is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  status: z.enum(['draft', 'issued', 'cancelled']).optional(),
});

type MasterAwbFormData = z.infer<typeof masterAwbSchema>;

export default function CreateMasterAwbPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromUrl || '');
  const [selectedHouseAwbs, setSelectedHouseAwbs] = useState<string[]>([]);

  // API hooks
  const [createMasterAwb] = useCreateMasterAwbMutation();

  // Search hooks for dropdowns
  const carriersSearch = useSearchableDropdown();

  // Fetch all jobs for dropdown
  const { data: jobsResponse } = useGetJobsQuery({
    page: 1,
    limit: 100,
  });

  // Fetch selected job data
  const { data: jobResponse, isLoading: jobLoading, error: jobError } = useGetJobByIdQuery(selectedJobId || '', {
    skip: !selectedJobId
  });

  // Fetch House AWBs for selected job
  const { data: houseAwbsResponse, isLoading: houseAwbsLoading } = useGetHouseAwbsQuery({
    job_id: selectedJobId,
    page: 1,
    limit: 100,
  }, {
    skip: !selectedJobId
  });

  // Fetch initial data for dropdowns
  const { data: carriersResponse } = useGetCarriersQuery({ page: 1, limit: 50 });

  // Search queries
  const { data: searchCarriersResponse, isLoading: carriersLoading } = useSearchCarriersQuery(
    { carrier_name: carriersSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !carriersSearch.debouncedQuery }
  );

  // Combine initial and search results
  const carriers = (carriersSearch.debouncedQuery 
    ? searchCarriersResponse?.data.data || []
    : carriersResponse?.data.data || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MasterAwbFormData>({
    resolver: zodResolver(masterAwbSchema),
    defaultValues: {
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
    },
  });

  // Watch form values
  const carrierId = watch('carrier_id');

  // Auto-generate master AWB number on component mount
  useEffect(() => {
    const autoNumber = generateAutoNumber();
    setValue('master_number', autoNumber);
  }, [setValue]);

  // Prepare jobs list for dropdown
  const jobs = useMemo(() => {
    const response = jobsResponse?.data;
    if (!response) return [];
    return Array.isArray(response) ? response : (response as any)?.data || [];
  }, [jobsResponse]);

  // Prepare house AWBs list (filter out those already linked to a master)
  const availableHouseAwbs = useMemo(() => {
    if (!houseAwbsResponse) return [];
    const data = houseAwbsResponse.data;
    const houseAwbs = Array.isArray(data) ? data : (data as any)?.data || [];
    // Filter out house AWBs that already have a master_id
    return houseAwbs.filter((h: any) => !h.master_id);
  }, [houseAwbsResponse]);

  // Set job_id when job data is loaded
  useEffect(() => {
    if (jobResponse?.data && selectedJobId) {
      setValue('job_id', selectedJobId);
    }
  }, [jobResponse, selectedJobId, setValue]);

  // Set selectedJobId from URL param if present
  useEffect(() => {
    if (jobIdFromUrl) {
      setSelectedJobId(jobIdFromUrl);
    }
  }, [jobIdFromUrl]);

  // Debug logging
  useEffect(() => {
    console.log('selectedJobId:', selectedJobId);
    console.log('jobResponse:', jobResponse);
    console.log('houseAwbsResponse:', houseAwbsResponse);
    console.log('availableHouseAwbs:', availableHouseAwbs);
  }, [selectedJobId, jobResponse, houseAwbsResponse, availableHouseAwbs]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedHouseAwbs(availableHouseAwbs.map((h: any) => h.house_id));
    } else {
      setSelectedHouseAwbs([]);
    }
  };

  const handleSelectHouseAwb = (houseId: string, checked: boolean) => {
    if (checked) {
      setSelectedHouseAwbs([...selectedHouseAwbs, houseId]);
    } else {
      setSelectedHouseAwbs(selectedHouseAwbs.filter(id => id !== houseId));
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log('Creating Master AWB:', data);
      console.log('Selected House AWBs:', selectedHouseAwbs);
      
      // Convert form data to API format
      const apiData = {
        job_id: selectedJobId || '',
        master_number: data.master_number,
        carrier_id: data.carrier_id,
        issue_date: data.issue_date,
        status: data.status || 'draft',
        house_awb_ids: selectedHouseAwbs, // Include selected house AWBs
      };

      const result = await createMasterAwb(apiData).unwrap();
      
      console.log('Master AWB created successfully:', result);
      
      // Redirect to master AWBs list
      router.push('/dashboard/master-awbs');
    } catch (error) {
      console.error('Error creating Master AWB:', error);
      // Handle error (you might want to show a toast notification here)
    } finally {
      setIsSubmitting(false);
    }
  };

  const job = jobResponse?.data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Master AWB</h1>
            <p className="text-gray-600 mt-1">
              Create a new master air waybill and link house AWBs
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-secondary"
          >
            <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </motion.div>

      {/* Job Selection / Information Card */}
      {!selectedJobId ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-yellow-50 border-yellow-200 mb-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Select a Job</h3>
            <p className="text-sm text-yellow-700">Please select a job to create a Master AWB for.</p>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Job *
            </label>
            <SearchableDropdown
              options={jobs.map((j: any) => ({ 
                id: j?.job_id || '', 
                name: `${j?.job_number || 'N/A'} - ${j?.shipper?.name || 'N/A'} → ${j?.consignee?.name || 'N/A'}` 
              }))}
              value={selectedJobId}
              onChange={(value) => {
                setSelectedJobId(value || '');
                if (value) setValue('job_id', value);
              }}
              placeholder="Select a job"
              searchPlaceholder="Search jobs..."
              onSearch={() => {}}
            />
            {errors.job_id && !selectedJobId && (
              <p className="mt-1 text-sm text-red-600">{errors.job_id.message}</p>
            )}
          </div>
        </motion.div>
      ) : job ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-blue-50 border-blue-200 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Job Information</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.job_type?.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  setSelectedJobId('');
                  setValue('job_id', '');
                  setSelectedHouseAwbs([]);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Change Job
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-blue-700">Job Number</label>
              <p className="text-sm text-blue-900 font-medium">{job.job_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Shipper</label>
              <p className="text-sm text-blue-900">{job.shipper?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Consignee</label>
              <p className="text-sm text-blue-900">{job.consignee?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Carrier</label>
              <p className="text-sm text-blue-900">{job.carrier?.carrier_name || 'N/A'}</p>
            </div>
          </div>
        </motion.div>
      ) : jobLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading job details...</span>
          </div>
        </motion.div>
      ) : null}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Master AWB Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Master AWB Number *
                </label>
                <input
                  {...register('master_number')}
                  type="text"
                  className="input-field"
                  placeholder="Enter master AWB number"
                />
                {errors.master_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.master_number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  {...register('issue_date')}
                  type="date"
                  className="input-field"
                />
                {errors.issue_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier *
                </label>
                <SearchableDropdown
                  options={carriers.map((carrier: any) => ({ id: carrier.carrier_id, name: carrier.carrier_name }))}
                  value={carrierId}
                  onChange={(value) => setValue('carrier_id', value ||'')}
                  placeholder="Select carrier"
                  searchPlaceholder="Search carriers..."
                  onSearch={carriersSearch.handleSearch}
                  loading={carriersLoading}
                  error={errors.carrier_id?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* House AWBs Section - Only show if there are available House AWBs */}
          {selectedJobId && !houseAwbsLoading && availableHouseAwbs.length > 0 && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Link House AWBs (Optional)
                {selectedHouseAwbs.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({selectedHouseAwbs.length} selected)
                  </span>
                )}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={availableHouseAwbs.length > 0 && selectedHouseAwbs.length === availableHouseAwbs.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          House AWB Number
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shipper
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consignee
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issue Date
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableHouseAwbs.map((houseAwb: any) => (
                        <tr 
                          key={houseAwb.house_id} 
                          className={`hover:bg-gray-50 cursor-pointer ${selectedHouseAwbs.includes(houseAwb.house_id) ? 'bg-blue-50' : ''}`}
                          onClick={() => handleSelectHouseAwb(houseAwb.house_id, !selectedHouseAwbs.includes(houseAwb.house_id))}
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedHouseAwbs.includes(houseAwb.house_id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectHouseAwb(houseAwb.house_id, e.target.checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {houseAwb.house_number}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            {houseAwb.shipper?.name || 'N/A'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            {houseAwb.consignee?.name || 'N/A'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(houseAwb.issue_date).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              houseAwb.status === 'issued' ? 'bg-green-100 text-green-800' :
                              houseAwb.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {houseAwb.status}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            {houseAwb.items?.length || 0} items
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Master AWB'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}