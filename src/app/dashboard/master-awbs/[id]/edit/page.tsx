'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useGetMasterAwbByIdQuery, useUpdateMasterAwbMutation } from '@/store/api/masterAwbsApi';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import { useGetCarriersQuery, useSearchCommoditiesQuery } from '@/store/api/masterDataApi';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/useToast';

interface ItemFormData {
  commodity_id: string;
  description: string;
  quantity: string;
  unit: string;
  volume?: string;
  weight?: string;
  package_count?: number;
  package_type?: string;
  value?: string;
  currency?: string;
}

interface MasterAwbFormData {
  master_number: string;
  job_id: string;
  carrier_id: string;
  issue_date: string;
  status: 'draft' | 'issued' | 'cancelled';
  items: ItemFormData[];
}

export default function EditMasterAwbPage() {
  const params = useParams();
  const router = useRouter();
  const masterAwbId = params.id as string;
  const toast = useToast();

  // Fetch Master AWB data
  const { data: masterAwbResponse, isLoading: isLoadingMasterAwb } = useGetMasterAwbByIdQuery(masterAwbId);
  const masterAwb = masterAwbResponse?.data;

  // Fetch jobs for selection
  const { data: jobsResponse, isLoading: isLoadingJobs } = useGetJobsQuery({});
  const jobs = useMemo(() => (jobsResponse?.data as any)?.data || jobsResponse?.data || [], [jobsResponse]);

  // Fetch carriers for selection
  const { data: carriersResponse, isLoading: isLoadingCarriers } = useGetCarriersQuery({});
  const carriers = useMemo(() => (carriersResponse?.data as any)?.data || carriersResponse?.data || [], [carriersResponse]);

  // Fetch commodities for dropdown
  const { data: commoditiesResponse } = useSearchCommoditiesQuery({});
  const commodities = commoditiesResponse?.data.data || [];

  const [updateMasterAwb, { isLoading: isUpdating }] = useUpdateMasterAwbMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MasterAwbFormData>({
    defaultValues: {
      master_number: '',
      job_id: '',
      carrier_id: '',
      issue_date: '',
      status: 'draft',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (masterAwb) {
      setValue('master_number', masterAwb.master_number);
      setValue('job_id', masterAwb.job_id);
      setValue('carrier_id', masterAwb.carrier_id);
      setValue('issue_date', masterAwb.issue_date.split('T')[0]);
      setValue('status', masterAwb.status);
      
      // Load existing items
      if (masterAwb.items && masterAwb.items.length > 0) {
        setValue('items', masterAwb.items.map((item: any) => ({
          commodity_id: item.commodity_id.toString(),
          description: item.description,
          quantity: item.quantity.toString(),
          unit: item.unit,
          volume: item.volume?.toString() || '',
          weight: item.weight?.toString() || '',
          package_count: item.package_count || undefined,
          package_type: item.package_type || '',
          value: item.value?.toString() || '',
          currency: item.currency || '',
        })));
      }
    }
  }, [masterAwb, setValue]);

  const onSubmit = async (data: MasterAwbFormData) => {
    try {
      await updateMasterAwb({
        id: masterAwbId,
        data: {
          master_number: data.master_number,
          job_id: data.job_id,
          carrier_id: data.carrier_id,
          issue_date: data.issue_date,
          status: data.status,
          items: data.items?.map(item => ({
            commodity_id: item.commodity_id,
            description: item.description,
            quantity: Number(item.quantity),
            unit: item.unit,
            volume: item.volume ? Number(item.volume) : undefined,
            weight: item.weight ? Number(item.weight) : undefined,
            package_count: item.package_count || undefined,
            package_type: item.package_type || undefined,
            value: item.value ? Number(item.value) : undefined,
            currency: item.currency || undefined,
          })),
        },
      }).unwrap();

      toast.success('Master AWB updated successfully!');
      router.push(`/dashboard/master-awbs/${masterAwbId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update Master AWB');
    }
  };

  const addItem = () => {
    append({
      commodity_id: '',
      description: '',
      quantity: '',
      unit: 'pcs',
      volume: '',
      weight: '',
      package_count: undefined,
      package_type: '',
      value: '',
      currency: 'USD',
    });
  };

  if (isLoadingMasterAwb || isLoadingJobs || isLoadingCarriers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!masterAwb) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load Master AWB details</p>
        <button
          onClick={() => router.push('/dashboard/master-awbs')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Master AWBs
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <button type="button" onClick={() => router.push('/dashboard/jobs')} className="hover:text-blue-600">
          Jobs
        </button>
        <span>/</span>
        {masterAwb.job && (
          <>
            <button type="button" onClick={() => router.push(`/dashboard/jobs/${masterAwb.job_id}`)} className="hover:text-blue-600">
              {masterAwb.job.job_number}
            </button>
            <span>/</span>
          </>
        )}
        <button type="button" onClick={() => router.push('/dashboard/master-awbs')} className="hover:text-blue-600">
          Master AWBs
        </button>
        <span>/</span>
        <button type="button" onClick={() => router.push(`/dashboard/master-awbs/${masterAwbId}`)} className="hover:text-blue-600">
          {masterAwb.master_number}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/master-awbs/${masterAwbId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Master AWB</h1>
            <p className="text-sm text-gray-500 mt-1">{masterAwb.master_number}</p>
          </div>
        </div>
      </div>

      {/* Master AWB Information Card */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Master AWB Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="master_number" className="block text-sm font-medium text-gray-700">
              Master AWB Number *
            </label>
            <input
              type="text"
              id="master_number"
              {...register('master_number', { required: 'Master AWB number is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.master_number && (
              <p className="mt-1 text-sm text-red-600">{errors.master_number.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="job_id" className="block text-sm font-medium text-gray-700">
              Job *
            </label>
            <select
              id="job_id"
              {...register('job_id', { required: 'Job is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Job</option>
              {jobs.map((job: any) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.job_number} - {job.job_type}
                </option>
              ))}
            </select>
            {errors.job_id && (
              <p className="mt-1 text-sm text-red-600">{errors.job_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="carrier_id" className="block text-sm font-medium text-gray-700">
              Carrier *
            </label>
            <select
              id="carrier_id"
              {...register('carrier_id', { required: 'Carrier is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Carrier</option>
              {carriers.map((carrier: any) => (
                <option key={carrier.carrier_id} value={carrier.carrier_id}>
                  {carrier.carrier_name} ({carrier.carrier_code})
                </option>
              ))}
            </select>
            {errors.carrier_id && (
              <p className="mt-1 text-sm text-red-600">{errors.carrier_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">
              Issue Date *
            </label>
            <input
              type="date"
              id="issue_date"
              {...register('issue_date', { required: 'Issue date is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.issue_date && (
              <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

      {/* Items */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            <p className="text-sm text-gray-500 mt-1">Add or modify items for this Master AWB</p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No items added yet</p>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Item
            </button>
          </div>
        ) : (
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
                        {...register(`items.${index}.commodity_id`, {
                          required: 'Commodity is required',
                        })}
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
                        {...register(`items.${index}.description`, {
                          required: 'Description is required',
                        })}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        {...register(`items.${index}.quantity`, {
                          required: 'Quantity is required',
                        })}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        {...register(`items.${index}.unit`, {
                          required: 'Unit is required',
                        })}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="pcs"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        {...register(`items.${index}.weight`)}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        {...register(`items.${index}.volume`)}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        {...register(`items.${index}.package_count`)}
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
                        type="text"
                        {...register(`items.${index}.value`)}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        {...register(`items.${index}.currency`)}
                        className="block w-full text-sm rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="USD"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex items-center p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/master-awbs/${masterAwbId}`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          {isUpdating ? 'Updating...' : 'Update Master AWB'}
        </button>
      </div>
    </form>
  );
}

