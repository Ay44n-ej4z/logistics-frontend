'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useGetMasterAwbByIdQuery, useUpdateMasterAwbMutation } from '@/store/api/masterAwbsApi';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import { useGetCarriersQuery } from '@/store/api/masterDataApi';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/useToast';

interface MasterAwbFormData {
  master_number: string;
  job_id: string;
  carrier_id: string;
  issue_date: string;
  status: 'draft' | 'issued' | 'cancelled';
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

  const [updateMasterAwb] = useUpdateMasterAwbMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MasterAwbFormData>({
    defaultValues: {
      master_number: '',
      job_id: '',
      carrier_id: '',
      issue_date: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (masterAwb) {
      reset({
        master_number: masterAwb.master_number,
        job_id: masterAwb.job_id,
        carrier_id: masterAwb.carrier_id,
        issue_date: masterAwb.issue_date.split('T')[0], // Format date for input
        status: masterAwb.status,
      });
    }
  }, [masterAwb, reset]);

  const onSubmit = async (data: MasterAwbFormData) => {
    try {
      await updateMasterAwb({
        id: masterAwbId,
        data,
      }).unwrap();

      toast.success('Master AWB updated successfully!');
      router.push(`/dashboard/master-awbs/${masterAwbId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update Master AWB');
    }
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Update Master AWB
        </button>
      </div>
    </form>
  );
}

