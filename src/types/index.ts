// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Search Parameters for Master Data
export interface CountrySearchParams {
  country_id?: number;
  country_name?: string;
  country_code?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface CitySearchParams {
  city_id?: number;
  city_name?: string;
  city_code?: string;
  country_id?: number;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface PortAirportSearchParams {
  port_id?: number;
  port_name?: string;
  port_code?: string;
  type?: PortOrAirportType;
  city_id?: number;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface CarrierSearchParams {
  carrier_id?: number;
  carrier_name?: string;
  carrier_code?: string;
  type?: CarrierType;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface CommoditySearchParams {
  commodity_id?: number;
  commodity_name?: string;
  commodity_code?: string;
  category?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface PartySearchParams {
  party_id?: number;
  name?: string;
  short_name?: string;
  type?: PartyType;
  contact_person?: string;
  email?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface ModeOfTransportSearchParams {
  id?: number;
  name?: string;
  code?: string;
  mode?: TransportMode;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATIONS = 'operations',
  ACCOUNTS = 'accounts',
  FINANCE = 'finance',
  MANAGEMENT = 'management',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Key Descriptions for Role Widgets
export enum KeyDescription {
  OPEN_JOBS = 'Open Jobs',
  PENDING_AWBS = 'Pending AWBs',
  COST_CENTER_MARGIN = 'Cost Center Margin',
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Master Data Types
export interface Country {
  country_id: string;
  country_name: string;
  country_code: string;
  capital?: string;
  currency?: string;
  language?: string;
  is_active: boolean;
  created_date: string;
}

export interface City {
  city_id: string;
  city_name: string;
  city_code: string;
  country_id: number;
  country?: Country;
  is_active: boolean;
}

export interface PortAirport {
  port_id: string;
  port_name: string;
  port_code: string;
  type: PortOrAirportType;
  city_id: number;
  city?: City;
  is_active: boolean;
}

export interface Carrier {
  carrier_id: string;
  carrier_name: string;
  carrier_code: string;
  type: CarrierType;
  is_active: boolean;
}

export interface Commodity {
  commodity_id: string;
  commodity_name: string;
  commodity_code: string;
  category?: string;
  is_active: boolean;
}

export interface Party {
  party_id: string;
  name: string;
  short_name?: string;
  type: PartyType;
  billing_address?: string;
  corporate_address?: string;
  credit_limit: string;
  credit_days: number;
  tds_rate: string;
  tds_applicable: boolean;
  contact_person?: string;
  phone?: string;
  email?: string;
  created_date: string;
  is_active: boolean;
}

export interface ModeOfTransport {
  id: number;
  name: string;
  code: string;
  mode: TransportMode;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Enums
export enum PartyType {
  CONSIGNEE = 'consignee',
  SHIPPER = 'shipper',
  CARRIER = 'carrier',
  VENDOR = 'vendor',
}

export enum CarrierType {
  AIRLINE = 'airline',
  SHIPPING = 'shipping',
}

export enum PortOrAirportType {
  PORT = 'port',
  AIRPORT = 'airport',
}

export enum TransportMode {
  AIR = 'air',
  FCL_SEA = 'fcl_sea',
  LCL_SEA = 'lcl_sea',
  TRUCK = 'truck',
  TRAIN = 'train',
}

export enum JobType {
  EXPORT = 'export',
  IMPORT = 'import',
  DOMESTIC = 'domestic',
}

// Create DTOs
export interface CreateCountryDto {
  country_name: string;
  country_code: string;
  capital?: string;
  currency?: string;
  language?: string;
}

export interface CreateCityDto {
  city_name: string;
  city_code: string;
  country_id: string;
}

export interface CreatePortAirportDto {
  port_name: string;
  port_code: string;
  type: PortOrAirportType;
  city_id: string;
}

export interface CreateCarrierDto {
  carrier_name: string;
  carrier_code: string;
  type: CarrierType;
}

export interface CreateCommodityDto {
  commodity_name: string;
  commodity_code: string;
  category?: string;
}

export interface CreatePartyDto {
  name: string;
  short_name?: string;
  type: PartyType;
  billing_address?: string;
  corporate_address?: string;
  credit_limit?: number;
  credit_days?: number;
  tds_rate?: number;
  tds_applicable?: boolean;
  contact_person?: string;
  phone?: string;
  email?: string;
}

export interface CreateModeOfTransportDto {
  name: string;
  code: string;
  mode: TransportMode;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Dashboard Types
export interface DashboardMetrics {
  openJobs: number;
  openJobsThisWeek: number;
  pendingAWBs: number;
  pendingAWBsToday: number;
  invoices: string;
  invoicesIncrease: string;
  profitMargin: string;
  profitMarginIncrease: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  description: string;
}

export interface RoleWidget {
  name: string;
  progress: number;
  total: number;
}
