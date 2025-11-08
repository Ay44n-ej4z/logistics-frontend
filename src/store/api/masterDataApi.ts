import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from './baseApi';
import {
  Country,
  City,
  PortAirport,
  Carrier,
  Commodity,
  Party,
  ModeOfTransport,
  CreateCountryDto,
  CreateCityDto,
  CreatePortAirportDto,
  CreateCarrierDto,
  CreateCommodityDto,
  CreatePartyDto,
  CreateModeOfTransportDto,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  CountrySearchParams,
  CitySearchParams,
  PortAirportSearchParams,
  CarrierSearchParams,
  CommoditySearchParams,
  PartySearchParams,
  ModeOfTransportSearchParams,
} from '@/types';

const baseQuery = createBaseQueryWithReauth(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
);

export const masterDataApi = createApi({
  reducerPath: 'masterDataApi',
  baseQuery,
  tagTypes: ['Country', 'City', 'PortAirport', 'Carrier', 'Commodity', 'Party', 'ModeOfTransport'],
  endpoints: (builder) => ({
    // Countries
    getCountries: builder.query<ApiResponse<PaginatedResponse<Country>>, PaginationParams>({
      query: (params) => ({
        url: '/master/countries',
        params,
      }),
      providesTags: ['Country'],
    }),
    searchCountries: builder.query<ApiResponse<PaginatedResponse<Country>>, CountrySearchParams>({
      query: (params) => ({
        url: '/master/countries/search',
        params,
      }),
      providesTags: ['Country'],
    }),
    getCountryById: builder.query<ApiResponse<Country>, string>({
      query: (id) => `/master/countries/${id}`,
      providesTags: ['Country'],
    }),
    createCountry: builder.mutation<ApiResponse<Country>, CreateCountryDto>({
      query: (data) => ({
        url: '/master/countries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Country'],
    }),
    updateCountry: builder.mutation<ApiResponse<Country>, { id: string; data: Partial<CreateCountryDto> }>({
      query: ({ id, data }) => ({
        url: `/master/countries/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Country'],
    }),
    deleteCountry: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/countries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country'],
    }),

    // Cities
    getCities: builder.query<ApiResponse<PaginatedResponse<City>>, PaginationParams>({
      query: (params) => ({
        url: '/master/cities',
        params,
      }),
      providesTags: ['City'],
    }),
    searchCities: builder.query<ApiResponse<PaginatedResponse<City>>, CitySearchParams>({
      query: (params) => ({
        url: '/master/cities/search',
        params,
      }),
      providesTags: ['City'],
    }),
    getCityById: builder.query<ApiResponse<City>, string>({
      query: (id) => `/master/cities/${id}`,
      providesTags: ['City'],
    }),
    createCity: builder.mutation<ApiResponse<City>, CreateCityDto>({
      query: (data) => ({
        url: '/master/cities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['City'],
    }),
    updateCity: builder.mutation<ApiResponse<City>, { id: string; data: Partial<CreateCityDto> }>({
      query: ({ id, data }) => ({
        url: `/master/cities/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['City'],
    }),
    deleteCity: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['City'],
    }),

    // Ports/Airports
    getPortsAirports: builder.query<ApiResponse<PaginatedResponse<PortAirport>>, PaginationParams>({
      query: (params) => ({
        url: '/master/ports-airports',
        params,
      }),
      providesTags: ['PortAirport'],
    }),
    searchPortsAirports: builder.query<ApiResponse<PaginatedResponse<PortAirport>>, PortAirportSearchParams>({
      query: (params) => ({
        url: '/master/ports-airports/search',
        params,
      }),
      providesTags: ['PortAirport'],
    }),
    getPortAirportById: builder.query<ApiResponse<PortAirport>, string>({
      query: (id) => `/master/ports-airports/${id}`,
      providesTags: ['PortAirport'],
    }),
    createPortAirport: builder.mutation<ApiResponse<PortAirport>, CreatePortAirportDto>({
      query: (data) => ({
        url: '/master/ports-airports',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PortAirport'],
    }),
    updatePortAirport: builder.mutation<ApiResponse<PortAirport>, { id: string; data: Partial<CreatePortAirportDto> }>({
      query: ({ id, data }) => ({
        url: `/master/ports-airports/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PortAirport'],
    }),
    deletePortAirport: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/ports-airports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PortAirport'],
    }),

    // Carriers
    getCarriers: builder.query<ApiResponse<PaginatedResponse<Carrier>>, PaginationParams>({
      query: (params) => ({
        url: '/master/carriers',
        params,
      }),
      providesTags: ['Carrier'],
    }),
    searchCarriers: builder.query<ApiResponse<PaginatedResponse<Carrier>>, CarrierSearchParams>({
      query: (params) => ({
        url: '/master/carriers/search',
        params,
      }),
      providesTags: ['Carrier'],
    }),
    getCarrierById: builder.query<ApiResponse<Carrier>, string>({
      query: (id) => `/master/carriers/${id}`,
      providesTags: ['Carrier'],
    }),
    createCarrier: builder.mutation<ApiResponse<Carrier>, CreateCarrierDto>({
      query: (data) => ({
        url: '/master/carriers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Carrier'],
    }),
    updateCarrier: builder.mutation<ApiResponse<Carrier>, { id: string; data: Partial<CreateCarrierDto> }>({
      query: ({ id, data }) => ({
        url: `/master/carriers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Carrier'],
    }),
    deleteCarrier: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/carriers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carrier'],
    }),

    // Commodities
    getCommodities: builder.query<ApiResponse<PaginatedResponse<Commodity>>, PaginationParams>({
      query: (params) => ({
        url: '/master/commodities',
        params,
      }),
      providesTags: ['Commodity'],
    }),
    searchCommodities: builder.query<ApiResponse<PaginatedResponse<Commodity>>, CommoditySearchParams>({
      query: (params) => ({
        url: '/master/commodities/search',
        params,
      }),
      providesTags: ['Commodity'],
    }),
    getCommodityById: builder.query<ApiResponse<Commodity>, string>({
      query: (id) => `/master/commodities/${id}`,
      providesTags: ['Commodity'],
    }),
    createCommodity: builder.mutation<ApiResponse<Commodity>, CreateCommodityDto>({
      query: (data) => ({
        url: '/master/commodities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Commodity'],
    }),
    updateCommodity: builder.mutation<ApiResponse<Commodity>, { id: string; data: Partial<CreateCommodityDto> }>({
      query: ({ id, data }) => ({
        url: `/master/commodities/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Commodity'],
    }),
    deleteCommodity: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/commodities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Commodity'],
    }),

    // Parties
    getParties: builder.query<ApiResponse<PaginatedResponse<Party>>, PaginationParams>({
      query: (params) => ({
        url: '/master/parties',
        params,
      }),
      providesTags: ['Party'],
    }),
    searchParties: builder.query<ApiResponse<PaginatedResponse<Party>>, PartySearchParams>({
      query: (params) => ({
        url: '/master/parties/search',
        params,
      }),
      providesTags: ['Party'],
    }),
    getPartyById: builder.query<ApiResponse<Party>, string>({
      query: (id) => `/master/parties/${id}`,
      providesTags: ['Party'],
    }),
    createParty: builder.mutation<ApiResponse<Party>, CreatePartyDto>({
      query: (data) => ({
        url: '/master/parties',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Party'],
    }),
    updateParty: builder.mutation<ApiResponse<Party>, { id: string; data: Partial<CreatePartyDto> }>({
      query: ({ id, data }) => ({
        url: `/master/parties/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Party'],
    }),
    deleteParty: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/master/parties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Party'],
    }),

    // Mode of Transport
    getModesOfTransport: builder.query<ApiResponse<ModeOfTransport[]>, void>({
      query: () => '/master/mode-of-transport',
      providesTags: ['ModeOfTransport'],
    }),
    searchModesOfTransport: builder.query<any, ModeOfTransportSearchParams>({
      query: (params) => ({
        url: '/master/mode-of-transport/search',
        params,
      }),
      transformResponse: (response: any) => {
        console.log('Raw API Response:', response);
        return response;
      },
      providesTags: ['ModeOfTransport'],
    }),
    getModeOfTransportById: builder.query<ApiResponse<ModeOfTransport>, number>({
      query: (id) => `/master/mode-of-transport/${id}`,
      providesTags: ['ModeOfTransport'],
    }),
    createModeOfTransport: builder.mutation<ApiResponse<ModeOfTransport>, CreateModeOfTransportDto>({
      query: (data) => ({
        url: '/master/mode-of-transport',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ModeOfTransport'],
    }),
    updateModeOfTransport: builder.mutation<ApiResponse<ModeOfTransport>, { id: number; data: Partial<CreateModeOfTransportDto> }>({
      query: ({ id, data }) => ({
        url: `/master/mode-of-transport/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ModeOfTransport'],
    }),
  }),
});

export const {
  // Countries
  useGetCountriesQuery,
  useSearchCountriesQuery,
  useGetCountryByIdQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  
  // Cities
  useGetCitiesQuery,
  useSearchCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  
  // Ports/Airports
  useGetPortsAirportsQuery,
  useSearchPortsAirportsQuery,
  useGetPortAirportByIdQuery,
  useCreatePortAirportMutation,
  useUpdatePortAirportMutation,
  useDeletePortAirportMutation,
  
  // Carriers
  useGetCarriersQuery,
  useSearchCarriersQuery,
  useGetCarrierByIdQuery,
  useCreateCarrierMutation,
  useUpdateCarrierMutation,
  useDeleteCarrierMutation,
  
  // Commodities
  useGetCommoditiesQuery,
  useSearchCommoditiesQuery,
  useGetCommodityByIdQuery,
  useCreateCommodityMutation,
  useUpdateCommodityMutation,
  useDeleteCommodityMutation,
  
  // Parties
  useGetPartiesQuery,
  useSearchPartiesQuery,
  useGetPartyByIdQuery,
  useCreatePartyMutation,
  useUpdatePartyMutation,
  useDeletePartyMutation,

  // Mode of Transport
  useGetModesOfTransportQuery,
  useSearchModesOfTransportQuery,
  useGetModeOfTransportByIdQuery,
  useCreateModeOfTransportMutation,
  useUpdateModeOfTransportMutation,
} = masterDataApi;
