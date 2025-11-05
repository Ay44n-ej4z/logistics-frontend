'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetJobByIdQuery, useGetJobsQuery } from '@/store/api/jobsApi';
import { useCreateHouseAwbMutation } from '@/store/api/houseAwbsApi';
import { 
  useGetPartiesQuery, 
  useSearchPartiesQuery,
  useGetCommoditiesQuery,
  useSearchCommoditiesQuery
} from '@/store/api/masterDataApi';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';
import { generateAutoNumber } from '@/lib/generateNumber';

// House AWB Schema

const houseAwbSchema = z.object({
  house_number: z.string().min(1, 'House AWB number is required'),
  job_id: z.string().min(1, 'Job is required'),
  master_id: z.string().optional(),
  shipper_id: z.string().min(1, 'Shipper is required'),
  consignee_id: z.string().min(1, 'Consignee is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  status: z.enum(['draft', 'issued', 'cancelled']).optional(),
  items: z.array(z.object({
    commodity_id: z.string().min(1, 'Commodity is required'),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
    unit: z.string().min(1, 'Unit is required'),
    volume: z.number().optional(),
    weight: z.number().optional(),
    package_count: z.number().optional(),
    package_type: z.string().optional(),
    value: z.number().optional(),
    currency: z.string().optional(),
  })).min(1, 'At least one item is required'),
});

type HouseAwbFormData = z.infer<typeof houseAwbSchema>;

export default function CreateHouseAwbPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromUrl || '');

  // API hooks
  const [createHouseAwb] = useCreateHouseAwbMutation();

  // Search hooks for dropdowns
  const partiesSearch = useSearchableDropdown();
  const commoditiesSearch = useSearchableDropdown();

  // Fetch all jobs for dropdown
  const { data: jobsResponse } = useGetJobsQuery({
    page: 1,
    limit: 100,
  });

  // Fetch selected job data
  const { data: jobResponse, isLoading: jobLoading, error: jobError } = useGetJobByIdQuery(selectedJobId || '', {
    skip: !selectedJobId
  });

  // Fetch initial data for dropdowns
  const { data: partiesResponse } = useGetPartiesQuery({ page: 1, limit: 50 });
  const { data: commoditiesResponse } = useGetCommoditiesQuery({ page: 1, limit: 50 });

  // Search queries
  const { data: searchPartiesResponse, isLoading: partiesLoading } = useSearchPartiesQuery(
    { name: partiesSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !partiesSearch.debouncedQuery }
  );
  const { data: searchCommoditiesResponse, isLoading: commoditiesLoading } = useSearchCommoditiesQuery(
    { commodity_name: commoditiesSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !commoditiesSearch.debouncedQuery }
  );

  // Combine initial and search results
  const parties = (partiesSearch.debouncedQuery 
    ? searchPartiesResponse?.data || []
    : partiesResponse?.data.data || []) as any[];
  const commodities = (commoditiesSearch.debouncedQuery 
    ? searchCommoditiesResponse?.data || []
    : commoditiesResponse?.data.data || []) as any[];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<HouseAwbFormData>({
    resolver: zodResolver(houseAwbSchema),
    defaultValues: {
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      items: [{
        commodity_id: '',
        description: '',
        quantity: 1,
        unit: 'PCS',
        volume: 0,
        weight: 0,
        package_count: 1,
        package_type: '',
        value: 0,
        currency: 'USD',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch form values
  const shipperId = watch('shipper_id');
  const consigneeId = watch('consignee_id');

  // Auto-generate house AWB number on component mount
  useEffect(() => {
    const autoNumber = generateAutoNumber();
    setValue('house_number', autoNumber);
  }, [setValue]);

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
    console.log('House AWB Create Page - Debug Info:');
    console.log('jobId from URL:', jobIdFromUrl);
    console.log('selectedJobId:', selectedJobId);
    console.log('jobResponse:', jobResponse);
    console.log('jobLoading:', jobLoading);
    console.log('jobError:', jobError);
  }, [jobIdFromUrl, selectedJobId, jobResponse, jobLoading, jobError]);

  const onSubmit = async (data: HouseAwbFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Creating House AWB:', data);
      
      // Convert form data to API format
      const apiData = {
        job_id: data.job_id,
        house_number: data.house_number,
        shipper_id: data.shipper_id,
        consignee_id: data.consignee_id,
        issue_date: data.issue_date,
        status: data.status || 'draft',
        master_id: data.master_id || undefined,
        items: data.items.map(item => ({
          commodity_id: item.commodity_id,
          description: item.description,
          quantity: item.quantity.toString(),
          unit: item.unit,
          volume: item.volume ? item.volume.toString() : undefined,
          weight: item.weight ? item.weight.toString() : undefined,
          package_count: item.package_count || undefined,
          package_type: item.package_type || undefined,
          value: item.value ? item.value.toString() : undefined,
          currency: item.currency || undefined,
        }))
      };
      
      console.log('API payload:', apiData);
      const result = await createHouseAwb(apiData).unwrap();
      console.log('House AWB created successfully:', result);
      
      router.push('/dashboard/house-awbs');
    } catch (error) {
      console.error('Error creating house AWB:', error);
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({
      commodity_id: '',
      description: '',
      quantity: 1,
      unit: 'PCS',
      volume: 0,
      weight: 0,
      package_count: 1,
      package_type: '',
      value: 0,
      currency: 'USD',
    });
  };

  // Prepare jobs list for dropdown
  const jobs = useMemo(() => {
    const response = jobsResponse?.data;
    if (!response) return [];
    // Handle both array and nested data structure
    return Array.isArray(response) ? response : (response as any)?.data || [];
  }, [jobsResponse]);

  const job = jobResponse?.data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <Icon icon="mdi:arrow-left" className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Create House AWB</h1>
        <p className="text-gray-600 mt-1">Create a new House Air Waybill for the selected job</p>
      </div>

      {/* Job Selection / Information Card */}
      {!selectedJobId ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-yellow-50 border-yellow-200"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Select a Job</h3>
            <p className="text-sm text-yellow-700">Please select a job to create a House AWB for.</p>
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
          className="card bg-blue-50 border-blue-200"
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
            <div>
              <label className="text-sm font-medium text-blue-700">Origin</label>
              <p className="text-sm text-blue-900">
                {job.origin_port ? `${job.origin_port.port_name} (${job.origin_port.port_code})` : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Destination</label>
              <p className="text-sm text-blue-900">
                {job.destination_port ? `${job.destination_port.port_name} (${job.destination_port.port_code})` : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Job Date</label>
              <p className="text-sm text-blue-900">
                {new Date(job.job_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Status</label>
              <p className="text-sm text-blue-900 capitalize">{job.status}</p>
            </div>
          </div>
        </motion.div>
      ) : jobLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading job details...</span>
          </div>
        </motion.div>
      ) : null}

      {/* House AWB Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">House AWB Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House AWB Number *
                </label>
                <input
                  {...register('house_number')}
                  type="text"
                  className="input-field"
                  placeholder="Enter house AWB number"
                />
                {errors.house_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.house_number.message}</p>
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

              {/* Mode of Transport removed */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipper *
                </label>
                <SearchableDropdown
                  options={parties.map((party: any) => ({ id: party.party_id, name: party.name }))}
                  value={shipperId || ''}
                  onChange={(value) => setValue('shipper_id', value || '')}
                  placeholder="Select shipper"
                  searchPlaceholder="Search shippers..."
                  onSearch={partiesSearch.handleSearch}
                  loading={partiesLoading}
                  error={errors.shipper_id?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consignee *
                </label>
                <SearchableDropdown
                  options={parties.map((party: any) => ({ id: party.party_id, name: party.name }))}
                  value={consigneeId}
                  onChange={(value) => setValue('consignee_id', value || '')}
                  placeholder="Select consignee"
                  searchPlaceholder="Search consignees..."
                  onSearch={partiesSearch.handleSearch}
                  loading={partiesLoading}
                  error={errors.consignee_id?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select {...register('status')} className="input-field">
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commodity *
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description *
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Quantity *
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Unit *
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Weight (kg)
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Volume (m³)
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Pkg Count
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Pkg Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Value
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Currency
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field, index) => (
                    <tr key={field.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <select
                          {...register(`items.${index}.commodity_id`)}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          {commodities.map((commodity: any) => (
                            <option key={commodity.commodity_id} value={commodity.commodity_id}>
                              {commodity.commodity_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          {...register(`items.${index}.description`)}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Description"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          {...register(`items.${index}.unit`)}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="pcs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.weight`, { valueAsNumber: true })}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.volume`, { valueAsNumber: true })}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          {...register(`items.${index}.package_count`, { valueAsNumber: true })}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          {...register(`items.${index}.package_type`)}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Box"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.value`, { valueAsNumber: true })}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          {...register(`items.${index}.currency`)}
                          className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="inline-flex items-center p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Remove item"
                          >
                            <Icon icon="mdi:delete" className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
                'Create House AWB'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
