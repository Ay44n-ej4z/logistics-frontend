import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from './baseApi';
import { ApiResponse, PaginationParams, PaginatedResponse } from '@/types';

export interface Job {
  job_id: string;  // UUID
  job_number: string;
  job_type: 'export' | 'import';
  shipper_id: string;  // UUID
  consignee_id: string;  // UUID
  notify_party_id?: string;  // UUID
  carrier_id: string;  // UUID
  origin_port_id: string;  // UUID
  destination_port_id: string;  // UUID
  loading_port_id?: string;  // UUID
  discharge_port_id?: string;  // UUID
  sales_person_id?: string;  // UUID
  job_date: string;
  status: 'open' | 'invoiced' | 'closed';
  gross_weight?: number;
  chargeable_weight?: number;
  package_count?: number;
  eta?: string;
  etd?: string;
  created_date: string;
  closed_date?: string;
  is_active: boolean;
  // Related entities (populated by backend)
  shipper?: any;
  consignee?: any;
  notify_party?: any;
  carrier?: any;
  origin_port?: any;
  destination_port?: any;
  loading_port?: any;
  discharge_port?: any;
  sales_person?: any;
}

export interface CreateJobRequest {
  job_number: string;
  job_type: 'export' | 'import';
  shipper_id: string;  // UUID
  consignee_id: string;  // UUID
  notify_party_id?: string;  // UUID
  carrier_id: string;  // UUID
  origin_port_id: string;  // UUID
  destination_port_id: string;  // UUID
  loading_port_id?: string;  // UUID
  discharge_port_id?: string;  // UUID
  sales_person_id?: string;  // UUID
  job_date: string;
  status?: 'open' | 'invoiced' | 'closed';
  gross_weight?: number;
  chargeable_weight?: number;
  package_count?: number;
  eta?: string;
  etd?: string;
}

export interface UpdateJobRequest {
  job_number?: string;
  job_type?: 'export' | 'import';
  shipper_id?: string;  // UUID
  consignee_id?: string;  // UUID
  notify_party_id?: string;  // UUID
  carrier_id?: string;  // UUID
  origin_port_id?: string;  // UUID
  destination_port_id?: string;  // UUID
  loading_port_id?: string;  // UUID
  discharge_port_id?: string;  // UUID
  sales_person_id?: string;  // UUID
  job_date?: string;
  status?: 'open' | 'invoiced' | 'closed';
  gross_weight?: number;
  chargeable_weight?: number;
  package_count?: number;
  eta?: string;
  etd?: string;
}

const baseQuery = createBaseQueryWithReauth(
  process.env.NEXT_PUBLIC_API_URL as string
);

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery,
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getJobs: builder.query<ApiResponse<Job[]>, PaginationParams>({
      query: (params) => ({
        url: '/master/jobs',
        params,
      }),
      providesTags: ['Job'],
    }),
    getJobById: builder.query<ApiResponse<Job>, string>({
      query: (id) => `/master/jobs/${id}`,
      providesTags: ['Job'],
    }),
    createJob: builder.mutation<ApiResponse<Job>, CreateJobRequest>({
      query: (jobData) => ({
        url: '/master/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation<ApiResponse<Job>, { id: string; data: UpdateJobRequest }>({
      query: ({ id, data }) => ({
        url: `/master/jobs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
    updateJobStatus: builder.mutation<ApiResponse<Job>, { id: string; status: Job['status'] }>({
      query: ({ id, status }) => ({
        url: `/master/jobs/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Job'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
} = jobsApi;
