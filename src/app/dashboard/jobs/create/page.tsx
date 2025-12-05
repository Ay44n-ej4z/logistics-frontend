'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  useSearchPortsAirportsQuery,
  useGetModesOfTransportQuery,
  useSearchModesOfTransportQuery
} from '@/store/api/masterDataApi';
import { useGetUsersQuery } from '@/store/api/authApi';
import { CarrierType, PortOrAirportType, TransportMode } from '@/types';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import QuickAddPartyModal from '@/components/common/QuickAddPartyModal';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';

const jobSchema = z.object({
  job_number: z.string().optional(),
  job_type: z.enum(['export', 'import', 'domestic']),
  mode_of_transport_id: z.number().min(1, 'Mode of transport is required'),
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
  gross_weight: z.number().refine((val) => {
    if (val === undefined || val === null) return true;
    const decimalPlaces = (val.toString().split('.')[1] || '').length;
    return decimalPlaces <= 3;
  }, { message: 'Maximum 3 decimal places allowed' }).optional(),
  chargeable_weight: z.number().refine((val) => {
    if (val === undefined || val === null) return true;
    const decimalPlaces = (val.toString().split('.')[1] || '').length;
    return decimalPlaces <= 3;
  }, { message: 'Maximum 3 decimal places allowed' }).optional(),
  package_count: z.number().optional(),
  eta: z.string().optional(),
  etd: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const [createJob, { isLoading }] = useCreateJobMutation();
  
  // Modal state
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [partyModalDefaultTypes, setPartyModalDefaultTypes] = useState<string[]>([]);
  const [partyModalCallback, setPartyModalCallback] = useState<((id: string) => void) | null>(null);

  // Search hooks for each dropdown
  const partiesSearch = useSearchableDropdown();
  const carriersSearch = useSearchableDropdown();
  const portsSearch = useSearchableDropdown();
  const usersSearch = useSearchableDropdown();
  const modesSearch = useSearchableDropdown();

  // Fetch initial data for dropdowns
  const { data: partiesResponse } = useGetPartiesQuery({ page: 1, limit: 50 });
  const { data: carriersResponse } = useGetCarriersQuery({ page: 1, limit: 50 });
  const { data: portsResponse } = useGetPortsAirportsQuery({ page: 1, limit: 50 });
  const { data: usersResponse } = useGetUsersQuery({ page: 1, limit: 50, is_sales_person: true });
  const { data: modesResponse } = useGetModesOfTransportQuery({ page: 1, limit: 50 });

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
  const { data: searchModesResponse, isLoading: modesLoading } = useSearchModesOfTransportQuery(
    { name: modesSearch.debouncedQuery, page: 1, page_size: 50 },
    { skip: !modesSearch.debouncedQuery }
  );

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
  const modes = (modesSearch.debouncedQuery 
    ? searchModesResponse?.data.data || []
    : modesResponse?.data || []);

  // Initialize form FIRST before using watch values
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

  // Watch form values for controlled components
  const shipperId = watch('shipper_id');
  const consigneeId = watch('consignee_id');
  const notifyPartyId = watch('notify_party_id');
  const carrierId = watch('carrier_id');
  const modeOfTransportId = watch('mode_of_transport_id');
  const originPortId = watch('origin_port_id');
  const destinationPortId = watch('destination_port_id');
  const loadingPortId = watch('loading_port_id');
  const dischargePortId = watch('discharge_port_id');

  // Get selected mode details
  const selectedMode = modes.find((m: any) => m.id === modeOfTransportId);
  const selectedModeType = selectedMode?.mode;

  // Filter carriers based on transport mode
  const filteredCarriers = useMemo(() => {
    if (!selectedModeType) return carriers;
    
    if (selectedModeType === TransportMode.AIR) {
      // Show only airlines when mode is AIR
      return carriers.filter((carrier: any) => carrier.type === CarrierType.AIRLINE);
    } else if (selectedModeType === TransportMode.FCL_SEA || selectedModeType === TransportMode.LCL_SEA) {
      // Show only shipping lines when mode is SEA
      return carriers.filter((carrier: any) => carrier.type === CarrierType.SHIPPING);
    }
    
    // For TRUCK/TRAIN, show all carriers
    return carriers;
  }, [carriers, selectedModeType]);

  // Filter ports based on transport mode
  const filteredPorts = useMemo(() => {
    if (!selectedModeType) return ports;
    
    if (selectedModeType === TransportMode.AIR) {
      // Show only airports when mode is AIR
      return ports.filter((port: any) => port.type === PortOrAirportType.AIRPORT);
    } else if (selectedModeType === TransportMode.FCL_SEA || selectedModeType === TransportMode.LCL_SEA) {
      // Show only seaports when mode is SEA
      return ports.filter((port: any) => port.type === PortOrAirportType.PORT);
    }
    
    // For TRUCK/TRAIN, show all ports/airports
    return ports;
  }, [ports, selectedModeType]);

  // Job type options for custom dropdown
  const jobTypeOptions = [
    { id: 'export', name: 'Export' },
    { id: 'import', name: 'Import' },
    { id: 'domestic', name: 'Domestic' }
  ];

  // Status options for custom dropdown
  const statusOptions = [
    { id: 'open', name: 'Open' },
    { id: 'invoiced', name: 'Invoiced' },
    { id: 'closed', name: 'Closed' }
  ];

  // Set current date on component mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setValue('job_date', formattedDate);
  }, [setValue]);

  // Handle "SAME AS CONSIGNEE" - auto-fill notify party when consignee changes
  useEffect(() => {
    if (consigneeId && !notifyPartyId) {
      setValue('notify_party_id', consigneeId);
    }
  }, [consigneeId, notifyPartyId, setValue]);

  // Helper functions for quick add party
  const openPartyModal = (defaultTypes: string[], callback: (id: string) => void) => {
    setPartyModalDefaultTypes(defaultTypes);
    setPartyModalCallback(() => callback);
    setIsPartyModalOpen(true);
  };

  const handlePartyModalSuccess = (partyId: string) => {
    if (partyModalCallback) {
      partyModalCallback(partyId);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log('Raw form data:', data);
      
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (key === 'job_number') {
          return acc;
        }
        
        if (value === '' || value === null || value === undefined) {
          return acc;
        }
        
        if ((key === 'eta' || key === 'etd' || key === 'job_date') && typeof value === 'string') {
          acc[key] = new Date(value).toISOString();
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as any);
      
      console.log('Cleaned data being sent:', cleanedData);
      
      const result = await createJob(cleanedData).unwrap();
      console.log('Job creation result:', result);
      
      let jobId = null;
      
      if (result?.success && result?.data?.job_id) {
        jobId = result.data.job_id;
      } else if (result?.data?.job_id) {
        jobId = result.data.job_id;
      }

      console.log('Job ID from response:', jobId);
      
      if (jobId) {
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
        alert('Job created successfully, but could not redirect to AWB creation. Please go to House AWBs page to create manually.');
        router.push('/dashboard/jobs');
      }
    } catch (error: any) {
      console.error('Error creating job:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.data?.message,
        errors: error?.data?.errors
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mb-6 px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          ← Back to Jobs
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
          <p className="mt-1 text-gray-600">Add a new logistics job to the system</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-100">
          {/* Basic Information */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
              <p className="text-sm text-gray-600">Core details about this job</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Auto-generated Job Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Number
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm font-medium">Auto-generated</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                      AUTO
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Unique identifier will be automatically assigned</p>
                </div>
              </div>

              {/* Job Type - IDENTICAL STYLING */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    {...register('job_type')} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-400"
                  >
                    <option value="" className="text-gray-500">Select job type</option>
                    <option value="export" className="text-gray-900">Export</option>
                    <option value="import" className="text-gray-900">Import</option>
                    <option value="domestic" className="text-gray-900">Domestic</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.job_type && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.job_type.message}
                  </p>
                )}
              </div>

              {/* Mode of Transport - NOW IDENTICAL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode of Transport <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  options={modes.map((mode: any) => ({
                    id: String(mode.id),
                    name: `${mode.name} (${mode.code})`,
                    code: mode.code
                  }))}
                  value={modeOfTransportId ? String(modeOfTransportId) : ''}
                  onChange={(value) => {
                    setValue('mode_of_transport_id', value ? Number(value) : 0);
                  }}
                  placeholder="Select mode of transport"
                  searchPlaceholder="Search modes..."
                  onSearch={modesSearch.handleSearch}
                  loading={modesLoading}
                  error={errors.mode_of_transport_id?.message}
                />
              </div>

              {/* Status - IDENTICAL STYLING */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-400"
                  >
                    <option value="open" className="text-gray-900">Open</option>
                    <option value="invoiced" className="text-gray-900">Invoiced</option>
                    <option value="closed" className="text-gray-900">Closed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Job Date - CONSISTENT STYLING */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('job_date')}
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400 cursor-pointer appearance-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.job_date && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.job_date.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Parties</h3>
              <p className="text-sm text-gray-600">Shipper, consignee, and other involved parties</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipper <span className="text-red-500">*</span>
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
                  onAddNew={() => openPartyModal(['shipper'], (id) => setValue('shipper_id', id))}
                  addNewLabel="Add New Shipper"
                />
              </div>

              {/* Consignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consignee <span className="text-red-500">*</span>
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
                  onAddNew={() => openPartyModal(['consignee'], (id) => setValue('consignee_id', id))}
                  addNewLabel="Add New Consignee"
                />
              </div>

              {/* Notify Party */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notify Party
                  </label>
                  <span className="text-xs text-gray-500">Defaults to consignee</span>
                </div>
                <SearchableDropdown
                  options={parties.map((party: any) => ({ id: party.party_id, name: party.name }))}
                  value={notifyPartyId || ''}
                  onChange={(value) => setValue('notify_party_id', value)}
                  placeholder="Select notify party (optional)"
                  searchPlaceholder="Search notify parties..."
                  onSearch={partiesSearch.handleSearch}
                  loading={partiesLoading}
                  onAddNew={() => openPartyModal(['notify_party'], (id) => setValue('notify_party_id', id))}
                  addNewLabel="Add New Notify Party"
                />
              </div>

              {/* Sales Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Person
                </label>
                <SearchableDropdown
                  options={users.map((user: any) => ({ 
                    id: user.id, 
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email
                  }))}
                  value={watch('sales_person_id') || ''}
                  onChange={(value) => setValue('sales_person_id', value?.toString() || '')}
                  placeholder="Select sales person (optional)"
                  searchPlaceholder="Search sales persons..."
                  onSearch={usersSearch.handleSearch}
                  loading={false}
                  showEmail={true}
                />
              </div>
            </div>
          </div>

          {/* Logistics Details */}
 <div className="p-8">
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Logistics Details</h3>
    <p className="text-sm text-gray-600">Carrier and port information</p>
  </div>

  <div className="space-y-6">
    {/* First Row: Carrier only - spans full width */}
    <div className="max-w-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Carrier <span className="text-red-500">*</span>
      </label>
      <SearchableDropdown
        options={filteredCarriers.map((carrier: any) => ({ 
          id: carrier.carrier_id, 
          name: `${carrier.carrier_name}`,
          code: carrier.carrier_code
        }))}
        value={carrierId}
        onChange={(value) => setValue('carrier_id', value || '')}
        placeholder="Select carrier"
        searchPlaceholder="Search carriers..."
        onSearch={carriersSearch.handleSearch}
        loading={carriersLoading}
        error={errors.carrier_id?.message}
        showCode={true}
      />
    </div>

    {/* Second and Third Rows: Ports in 2 columns */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column for 2nd and 3rd rows */}
      <div className="space-y-6">
        {/* 2nd Row: Origin Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origin <span className="text-red-500">*</span>
          </label>
          <SearchableDropdown
            options={filteredPorts.map((port: any) => ({ 
              id: port.port_id, 
              name: `${port.port_name}`,
              code: port.port_code,
              type: port.type
            }))}
            value={originPortId}
            onChange={(value) => setValue('origin_port_id', value || '')}
            placeholder="Select origin"
            searchPlaceholder="Search origin ports..."
            onSearch={portsSearch.handleSearch}
            loading={portsLoading}
            error={errors.origin_port_id?.message}
            showCode={true}
            showType={true}
          />
        </div>

        {/* 3rd Row: Destination Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination <span className="text-red-500">*</span>
          </label>
          <SearchableDropdown
            options={filteredPorts.map((port: any) => ({ 
              id: port.port_id, 
              name: `${port.port_name}`,
              code: port.port_code,
              type: port.type
            }))}
            value={destinationPortId}
            onChange={(value) => setValue('destination_port_id', value || '')}
            placeholder="Select destination"
            searchPlaceholder="Search destination ports..."
            onSearch={portsSearch.handleSearch}
            loading={portsLoading}
            error={errors.destination_port_id?.message}
            showCode={true}
            showType={true}
          />
        </div>
      </div>

      {/* Right Column for 2nd and 3rd rows */}
      <div className="space-y-6">
        {/* 2nd Row: Loading Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loading Port
          </label>
          <SearchableDropdown
            options={filteredPorts.map((port: any) => ({ 
              id: port.port_id, 
              name: `${port.port_name}`,
              code: port.port_code,
              type: port.type
            }))}
            value={loadingPortId || ''}
            onChange={(value) => setValue('loading_port_id', value)}
            placeholder="Select loading port (optional)"
            searchPlaceholder="Search loading ports..."
            onSearch={portsSearch.handleSearch}
            loading={portsLoading}
            showCode={true}
            showType={true}
          />
        </div>

        {/* 3rd Row: Discharge Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discharge Port
          </label>
          <SearchableDropdown
            options={filteredPorts.map((port: any) => ({ 
              id: port.port_id, 
              name: `${port.port_name}`,
              code: port.port_code,
              type: port.type
            }))}
            value={dischargePortId || ''}
            onChange={(value) => setValue('discharge_port_id', value)}
            placeholder="Select discharge port (optional)"
            searchPlaceholder="Search discharge ports..."
            onSearch={portsSearch.handleSearch}
            loading={portsLoading}
            showCode={true}
            showType={true}
          />
        </div>
      </div>
    </div>
  </div>
</div>
          {/* Weight & Package Information */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight & Package Information</h3>
              <p className="text-sm text-gray-600">Cargo details and measurements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gross Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Weight (kg)
                </label>
                <div className="relative">
                  <input
                    {...register('gross_weight', { valueAsNumber: true })}
                    type="number"
                    step="0.001"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400"
                    placeholder="0.000"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    kg
                  </span>
                </div>
                {errors.gross_weight && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.gross_weight.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Maximum 3 decimal places</p>
              </div>

              {/* Chargeable Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chargeable Weight (kg)
                </label>
                <div className="relative">
                  <input
                    {...register('chargeable_weight', { valueAsNumber: true })}
                    type="number"
                    step="0.001"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400"
                    placeholder="0.000"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    kg
                  </span>
                </div>
                {errors.chargeable_weight && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.chargeable_weight.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Maximum 3 decimal places</p>
              </div>

              {/* Package Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Count
                </label>
                <input
                  {...register('package_count', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Dates</h3>
              <p className="text-sm text-gray-600">Estimated times of departure and arrival</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ETD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ETD (Estimated Time of Departure)
                </label>
                <div className="relative">
                  <input
                    {...register('etd')}
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400"
                  />
                </div>
              </div>

              {/* ETA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ETA (Estimated Time of Arrival)
                </label>
                <div className="relative">
                  <input
                    {...register('eta')}
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AWB Type Selection */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AWB Type Selection</h3>
              <p className="text-sm text-gray-600">Choose the type of Air Waybill to create</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h4 className="text-base font-semibold text-blue-800 mb-4">Choose AWB Type</h4>
              <p className="text-sm text-blue-700 mb-6">
                After creating the job, you can choose to create either a House AWB (for direct shipments) 
                or a Master AWB (for consolidated shipments).
              </p>
              
              <div className="space-y-4">
                <label className="flex items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group hover:shadow-sm">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="radio"
                      name="awbType"
                      value="house"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">House AWB</span>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Direct Shipment
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Create a House Air Waybill for direct, point-to-point shipments
                    </p>
                  </div>
                </label>

                <label className="flex items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group hover:shadow-sm">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="radio"
                      name="awbType"
                      value="master"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">Master AWB</span>
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        Consolidated
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Create a Master Air Waybill for consolidated shipments with multiple house AWBs
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Creating Job...
                  </span>
                ) : (
                  'Create Job'
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Quick Add Party Modal */}
      <QuickAddPartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        onSuccess={handlePartyModalSuccess}
        defaultTypes={partyModalDefaultTypes}
      />
    </div>
  );
}