import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from './baseApi';

export interface HouseAwb {
  house_id: string;
  house_number: string;
  job_id: string;
  job?: {
    job_id: string;
    job_number: string;
    job_type: string;
    job_date: string;
    status: string;
  };
  shipper_id: string;
  shipper?: {
    party_id: string;
    name: string;
    short_name: string;
  };
  consignee_id: string;
  consignee?: {
    party_id: string;
    name: string;
    short_name: string;
  };
  master_id?: string;
  master_awb?: {
    master_id: string;
    master_number: string;
  };
  issue_date: string;
  status: 'draft' | 'issued' | 'cancelled';
  is_active: boolean;
  items?: Item[];
}

export interface Item {
  item_id: number;
  commodity_id: number;
  commodity?: {
    commodity_id: number;
    commodity_name: string;
    commodity_code: string;
  };
  house_awb_id: number;
  description: string;
  quantity: string;
  unit: string;
  volume?: string;
  weight?: string;
  package_count?: number;
  package_type?: string;
  value?: string;
  currency?: string;
  is_active: boolean;
}

export interface CreateHouseAwbRequest {
  job_id: string;
  house_number: string;
  shipper_id: string;
  consignee_id: string;
  issue_date: string;
  status?: 'draft' | 'issued' | 'cancelled';
  master_id?: string;
  items: {
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
  }[];
}

export interface HouseAwbSearchParams {
  house_id?: string;  // UUID
  house_number?: string;
  job_id?: string;  // UUID
  shipper_id?: string;  // UUID
  consignee_id?: string;  // UUID
  master_id?: string;  // UUID
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

const baseQuery = createBaseQueryWithReauth(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
);

export const houseAwbsApi = createApi({
  reducerPath: 'houseAwbsApi',
  baseQuery,
  tagTypes: ['HouseAwb'],
  endpoints: (builder) => ({
    getHouseAwbs: builder.query<ApiResponse<PaginatedResponse<HouseAwb>>, HouseAwbSearchParams>({
      query: (params) => ({
        url: '/master/house-awbs',
        params,
      }),
      providesTags: ['HouseAwb'],
    }),
    searchHouseAwbs: builder.query<ApiResponse<PaginatedResponse<HouseAwb>>, HouseAwbSearchParams>({
      query: (params) => ({
        url: '/master/house-awbs/search',
        params,
      }),
      providesTags: ['HouseAwb'],
    }),
    getHouseAwbById: builder.query<ApiResponse<HouseAwb>, string>({
      query: (id) => `/master/house-awbs/${id}`,
      providesTags: (result, error, id) => [{ type: 'HouseAwb', id }],
    }),
    createHouseAwb: builder.mutation<ApiResponse<HouseAwb>, CreateHouseAwbRequest>({
      query: (data) => ({
        url: '/master/house-awbs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HouseAwb'],
    }),
    updateHouseAwb: builder.mutation<ApiResponse<HouseAwb>, { id: string; data: Partial<CreateHouseAwbRequest> }>({
      query: ({ id, data }) => ({
        url: `/master/house-awbs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'HouseAwb', id }, 'HouseAwb'],
    }),
    deleteHouseAwb: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/house-awbs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HouseAwb'],
    }),
  }),
});

export const {
  useGetHouseAwbsQuery,
  useSearchHouseAwbsQuery,
  useGetHouseAwbByIdQuery,
  useCreateHouseAwbMutation,
  useUpdateHouseAwbMutation,
  useDeleteHouseAwbMutation,
} = houseAwbsApi;

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  limit: number;
  total_pages: number;
  totalPages: number;
}
