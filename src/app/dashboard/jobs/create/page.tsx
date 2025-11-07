'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateJobMutation } from '@/store/api/jobsApi';
import { 
  useGetPartiesQuery, 
  useSearchPartiesQuery,
  useGetCarriersQuery, 
  useSearchCarriersQuery,
  useGetPortsAirportsQuery,
  useSearchPortsAirportsQuery
} from '@/store/api/masterDataApi';
import { useGetUsersQuery } from '@/store/api/authApi';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';
import { generateAutoNumber } from '@/lib/generateNumber';


const jobSchema = z.object({
  job_number: z.string().min(1, 'Job number is required'),
  job_type: z.enum(['export', 'import']),
  shipper_id: z.string().min(1, 'Shipper is required'),
  consignee_id: z.string().min(1, 'Consignee is required'),
  notify_party_id: z.string().optional(),
  carrier_id: z.string().min(1, 'Carrier is required'),
  origin_port_id: z.string().min(1, 'Origin port is required'),
  destination_port_id: z.string().min(1, 'Destination port is required'),
  loading_port_id: z.string().optional(),
  discharge_port_id: z.string().optional(),
  sales_person_id: z.string().optional(),
  job_date: z.string().min(1, 'Job date is required'),
  status: z.enum(['open', 'invoiced', 'closed']).optional(),
  gross_weight: z.number().optional(),
  chargeable_weight: z.number().optional(),
  package_count: z.number().optional(),
  eta: z.string().optional(),
  etd: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const [createJob, { isLoading }] = useCreateJobMutation();

  // Search hooks for each dropdown
  const partiesSearch = useSearchableDropdown();
  const carriersSearch = useSearchableDropdown();
  const portsSearch = useSearchableDropdown();
  const usersSearch = useSearchableDropdown();

  // Fetch initial data for dropdowns
  const { data: partiesResponse } = useGetPartiesQuery({ page: 1, limit: 50 });
  const { data: carriersResponse } = useGetCarriersQuery({ page: 1, limit: 50 });
  const { data: portsResponse } = useGetPortsAirportsQuery({ page: 1, limit: 50 });
  const { data: usersResponse } = useGetUsersQuery({ page: 1, limit: 50 });

  // Search queries
  const { data: searchPartiesResponse, isLoading: partiesLoading } = useSearchPartiesQuery(
    { name: partiesSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !partiesSearch.debouncedQuery }
  );
  const { data: searchCarriersResponse, isLoading: carriersLoading } = useSearchCarriersQuery(
    { carrier_name: carriersSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !carriersSearch.debouncedQuery }
  );
  const { data: searchPortsResponse, isLoading: portsLoading } = useSearchPortsAirportsQuery(
    { port_name: portsSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !portsSearch.debouncedQuery }
  );
console.log(898989, searchPartiesResponse)
console.log(898989, searchCarriersResponse)
console.log(898989, searchPortsResponse)
console.log(898989, usersResponse)

console.log(898989, partiesResponse)
console.log(898989, carriersResponse)
console.log(898989, portsResponse)
  // Combine initial and search results
  const parties = (partiesSearch.debouncedQuery 
    ? searchPartiesResponse?.data.data || []
    : partiesResponse?.data.data || []);
  const carriers = (carriersSearch.debouncedQuery 
    ? searchCarriersResponse?.data.data || []
    : carriersResponse?.data.data || []);
  const ports = (portsSearch.debouncedQuery 
    ? searchPortsResponse?.data.data || []
    : portsResponse?.data.data || []);
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : usersResponse?.data?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: 'open',
    },
  });

  // Auto-generate job number on component mount
  useEffect(() => {
    const autoNumber = generateAutoNumber();
    setValue('job_number', autoNumber);
  }, [setValue]);

  // Watch form values for controlled components
  const shipperId = watch('shipper_id');
  const consigneeId = watch('consignee_id');
  const notifyPartyId = watch('notify_party_id');
  const carrierId = watch('carrier_id');
  const originPortId = watch('origin_port_id');
  const destinationPortId = watch('destination_port_id');
  const loadingPortId = watch('loading_port_id');
  const dischargePortId = watch('discharge_port_id');

  const onSubmit = async (data: any) => {
    try {
      console.log('Submitting job data:', data);
      const result = await createJob(data).unwrap();
      console.log('Job creation result:', result);
      
      // The API now returns { success: true, data: job, message: '...' }
      let jobId = null;
      
      if (result?.success && result?.data?.job_id) {
        jobId = result.data.job_id;
      } 
      // Fallback for old response format
      else if (result?.data?.job_id) {
        jobId = result.data.job_id;
      }

      
      console.log('Job ID from response:', jobId);
      console.log('Full result structure:', JSON.stringify(result, null, 2));
      
      if (jobId) {
        // Get the selected AWB type
        const awbType = (document.querySelector('input[name="awbType"]:checked') as HTMLInputElement)?.value;
        console.log('Selected AWB type:', awbType);
        
        if (awbType === 'house') {
          console.log('Redirecting to House AWB create page...');
          router.push(`/dashboard/house-awbs/create?jobId=${jobId}`);
        } else if (awbType === 'master') {
          console.log('Redirecting to Master AWB create page...');
          router.push(`/dashboard/master-awbs/create?jobId=${jobId}`);
        } else {
          console.log('No AWB type selected, redirecting to jobs list...');
          router.push('/dashboard/jobs');
        }
      } else {
        console.error('No job ID found in response. Full result:', result);
        // For now, redirect to jobs list and show a message
        alert('Job created successfully, but could not redirect to AWB creation. Please go to House AWBs page to create manually.');
        router.push('/dashboard/jobs');
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <Icon icon="mdi:arrow-left" className="mr-1" />
          Back to Jobs
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Job</h1>
        <p className="text-gray-600 mt-1">Add a new logistics job to the system</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number *
                </label>
                <input
                  {...register('job_number')}
                  type="text"
                  className="input-field"
                  placeholder="Enter job number"
                />
                {errors.job_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.job_number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select {...register('job_type')} className="input-field">
                  <option value="">Select job type</option>
                  <option value="export">Export</option>
                  <option value="import">Import</option>
                </select>
                {errors.job_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.job_type.message}</p>
                )}
              </div>

              {/* Mode of Transport removed */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Date *
                </label>
                <input
                  {...register('job_date')}
                  type="date"
                  className="input-field"
                />
                {errors.job_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.job_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select {...register('status')} className="input-field">
                  <option value="open">Open</option>
                  <option value="invoiced">Invoiced</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipper *
                </label>
                <SearchableDropdown
                  options={parties.map((party: any) => ({ id: party.party_id, name: party.name }))}
                  value={shipperId}
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
                  Notify Party
                </label>
                <SearchableDropdown
                  options={parties.map((party: any) => ({ id: party.party_id, name: party.name }))}
                  value={notifyPartyId || ''}
                  onChange={(value) => setValue('notify_party_id', value)}
                  placeholder="Select notify party (optional)"
                  searchPlaceholder="Search notify parties..."
                  onSearch={partiesSearch.handleSearch}
                  loading={partiesLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Person
                </label>
                <SearchableDropdown
                  options={users.map((user: any) => ({ 
                    id: user.id, 
                    name: `${user.firstName} ${user.lastName} (${user.email})` 
                  }))}
                  value={watch('sales_person_id') || ''}
                  onChange={(value) => setValue('sales_person_id', value?.toString() || '')}
                  placeholder="Select sales person (optional)"
                  searchPlaceholder="Search users..."
                  onSearch={usersSearch.handleSearch}
                  loading={false}
                />
              </div>
            </div>
          </div>

          {/* Logistics Details */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logistics Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Origin Port *
                </label>
                <SearchableDropdown
                  options={ports.map((port: any) => ({ 
                    id: port.port_id, 
                    name: `${port.port_name} (${port.port_code})` 
                  }))}
                  value={originPortId}
                  onChange={(value) => setValue('origin_port_id', value || '')}
                  placeholder="Select origin port"
                  searchPlaceholder="Search origin ports..."
                  onSearch={portsSearch.handleSearch}
                  loading={portsLoading}
                  error={errors.origin_port_id?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Port *
                </label>
                <SearchableDropdown
                  options={ports.map((port: any) => ({ 
                    id: port.port_id, 
                    name: `${port.port_name} (${port.port_code})` 
                  }))}
                  value={destinationPortId}
                  onChange={(value) => setValue('destination_port_id', value || '')}
                  placeholder="Select destination port"
                  searchPlaceholder="Search destination ports..."
                  onSearch={portsSearch.handleSearch}
                  loading={portsLoading}
                  error={errors.destination_port_id?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loading Port
                </label>
                <SearchableDropdown
                  options={ports.map((port: any) => ({ 
                    id: port.port_id, 
                    name: `${port.port_name} (${port.port_code})` 
                  }))}
                  value={loadingPortId || ''}
                  onChange={(value) => setValue('loading_port_id', value)}
                  placeholder="Select loading port (optional)"
                  searchPlaceholder="Search loading ports..."
                  onSearch={portsSearch.handleSearch}
                  loading={portsLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discharge Port
                </label>
                <SearchableDropdown
                  options={ports.map((port: any) => ({ 
                    id: port.port_id, 
                    name: `${port.port_name} (${port.port_code})` 
                  }))}
                  value={dischargePortId || ''}
                  onChange={(value) => setValue('discharge_port_id', value)}
                  placeholder="Select discharge port (optional)"
                  searchPlaceholder="Search discharge ports..."
                  onSearch={portsSearch.handleSearch}
                  loading={portsLoading}
                />
              </div>
            </div>
          </div>

          {/* Weight & Package Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weight & Package Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Weight (kg)
                </label>
                <input
                  {...register('gross_weight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chargeable Weight (kg)
                </label>
                <input
                  {...register('chargeable_weight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Count
                </label>
                <input
                  {...register('package_count', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ETD (Estimated Time of Departure)
                </label>
                <input
                  {...register('etd')}
                  type="datetime-local"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ETA (Estimated Time of Arrival)
                </label>
                <input
                  {...register('eta')}
                  type="datetime-local"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* AWB Type Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AWB Type Selection</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <Icon icon="mdi:information" className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Choose AWB Type</h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    After creating the job, you can choose to create either a House AWB (for direct shipments) 
                    or a Master AWB (for consolidated shipments).
                  </p>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="awbType"
                        value="house"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <span className="font-medium">House AWB</span> - Direct shipment
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="awbType"
                        value="master"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <span className="font-medium">Master AWB</span> - Consolidated shipment
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
