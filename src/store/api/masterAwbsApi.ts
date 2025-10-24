import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from './baseApi';
import { ApiResponse, PaginatedResponse } from '@/types';

export interface MasterAwb {
  master_id: string;
  master_number: string;
  job_id: string;
  job?: {
    job_id: string;
    job_number: string;
    job_type: string;
    job_date: string;
    status: string;
  };
  carrier_id: string;
  carrier?: {
    carrier_id: string;
    name: string;
    code: string;
  };
  issue_date: string;
  status: 'draft' | 'issued' | 'cancelled';
  is_active: boolean;
}

export interface CreateMasterAwbRequest {
  master_number: string;
  job_id: string;  // UUID
  carrier_id: string;  // UUID
  issue_date: string;
  status?: 'draft' | 'issued' | 'cancelled';
}

export interface MasterAwbSearchParams {
  master_id?: string;
  job_id?: string;
  carrier_id?: string;
  status?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

const baseQuery = createBaseQueryWithReauth(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
);

export const masterAwbsApi = createApi({
  reducerPath: 'masterAwbsApi',
  baseQuery,
  tagTypes: ['MasterAwb'],
  endpoints: (builder) => ({
    getMasterAwbs: builder.query<ApiResponse<PaginatedResponse<MasterAwb>>, MasterAwbSearchParams>({
      query: (params) => ({
        url: '/master/master-awbs',
        params,
      }),
      providesTags: ['MasterAwb'],
    }),
    searchMasterAwbs: builder.query<ApiResponse<PaginatedResponse<MasterAwb>>, MasterAwbSearchParams>({
      query: (params) => ({
        url: '/master/master-awbs/search',
        params,
      }),
      providesTags: ['MasterAwb'],
    }),
    getMasterAwbById: builder.query<ApiResponse<MasterAwb>, string>({
      query: (id) => `/master/master-awbs/${id}`,
      providesTags: (result, error, id) => [{ type: 'MasterAwb', id }],
    }),
    createMasterAwb: builder.mutation<ApiResponse<MasterAwb>, CreateMasterAwbRequest>({
      query: (data) => ({
        url: '/master/master-awbs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MasterAwb'],
    }),
    updateMasterAwb: builder.mutation<ApiResponse<MasterAwb>, { id: string; data: Partial<CreateMasterAwbRequest> }>({
      query: ({ id, data }) => ({
        url: `/master/master-awbs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MasterAwb', id }, 'MasterAwb'],
    }),
    deleteMasterAwb: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/master-awbs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MasterAwb', id }, 'MasterAwb'],
    }),
  }),
});

export const {
  useGetMasterAwbsQuery,
  useSearchMasterAwbsQuery,
  useGetMasterAwbByIdQuery,
  useCreateMasterAwbMutation,
  useUpdateMasterAwbMutation,
  useDeleteMasterAwbMutation,
} = masterAwbsApi;
