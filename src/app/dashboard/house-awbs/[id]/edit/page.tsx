'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { 
  useGetHouseAwbByIdQuery, 
  useUpdateHouseAwbMutation 
} from '@/store/api/houseAwbsApi';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import { useSearchCommoditiesQuery } from '@/store/api/masterDataApi';
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

interface HouseAwbFormData {
  house_number: string;
  job_id: string;
  shipper_id: string;
  consignee_id: string;
  master_id?: string;
  issue_date: string;
  status: 'draft' | 'issued' | 'cancelled';
  items: ItemFormData[];
}

export default function EditHouseAwbPage() {
  const params = useParams();
  const router = useRouter();
  const houseAwbId = params.id as string;
  const toast = useToast();

  // Fetch House AWB data
  const { data: houseAwbResponse, isLoading: isLoadingHouseAwb } = useGetHouseAwbByIdQuery(houseAwbId);
  const houseAwb = houseAwbResponse?.data;

  // Fetch commodities for dropdown
  const { data: commoditiesResponse } = useSearchCommoditiesQuery({});
  const commodities = commoditiesResponse?.data.data || [];

  // Update mutation
  const [updateHouseAwb, { isLoading: isUpdating }] = useUpdateHouseAwbMutation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HouseAwbFormData>({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Load data into form when House AWB is fetched
  useEffect(() => {
    if (houseAwb) {
      setValue('house_number', houseAwb.house_number);
      setValue('job_id', houseAwb.job_id);
      setValue('shipper_id', houseAwb.shipper_id);
      setValue('consignee_id', houseAwb.consignee_id);
      setValue('master_id', houseAwb.master_id || '');
      setValue('issue_date', houseAwb.issue_date.split('T')[0]);
      setValue('status', houseAwb.status);
      
      // Load existing items
      if (houseAwb.items && houseAwb.items.length > 0) {
        setValue('items', houseAwb.items.map((item: any) => ({
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
  }, [houseAwb, setValue]);

  const onSubmit = async (data: HouseAwbFormData) => {
    try {
      await updateHouseAwb({
        id: houseAwbId,
        data: {
          ...data,
          items: data.items.map(item => ({
            ...item,
            commodity_id: item.commodity_id,
            quantity: item.quantity,
            volume: item.volume || undefined,
            weight: item.weight || undefined,
            value: item.value || undefined,
          })),
        },
      }).unwrap();

      toast.success('House AWB updated successfully!');
      router.push(`/dashboard/house-awbs/${houseAwbId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update House AWB');
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

  if (isLoadingHouseAwb) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!houseAwb) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">House AWB not found</p>
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
          onClick={() => router.push('/dashboard/house-awbs')}
          className="hover:text-blue-600"
        >
          House AWBs
        </button>
        <span>/</span>
        <button
          onClick={() => router.push(`/dashboard/house-awbs/${houseAwbId}`)}
          className="hover:text-blue-600"
        >
          {houseAwb.house_number}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwbId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit House AWB</h1>
            <p className="text-sm text-gray-500 mt-1">{houseAwb.house_number}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                House AWB Number *
              </label>
              <input
                type="text"
                {...register('house_number', { required: 'House AWB number is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled
              />
              {errors.house_number && (
                <p className="mt-1 text-sm text-red-600">{errors.house_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issue Date *
              </label>
              <input
                type="date"
                {...register('issue_date', { required: 'Issue date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.issue_date && (
                <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card">
          <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              <p className="text-sm text-gray-500 mt-1">Add or modify items for this House AWB</p>
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
            onClick={() => router.push(`/dashboard/house-awbs/${houseAwbId}`)}
            className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update House AWB'}
          </button>
        </div>
      </form>
    </div>
  );
}

