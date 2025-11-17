import { z } from 'zod';
import { CarrierType, PortOrAirportType, PartyType, TransportMode } from '@/types';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
});

// Master Data Schemas
export const createCountrySchema = z.object({
  country_name: z.string().min(2, 'Country name must be at least 2 characters'),
  country_code: z.string().length(3, 'Country code must be exactly 3 characters'),
  capital: z.string().optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
});

export const createCitySchema = z.object({
  city_name: z.string().min(2, 'City name must be at least 2 characters'),
  city_code: z.string().min(2, 'City code must be at least 2 characters'),
  country_id: z.string().min(1, 'Country is required'),
});

export const createPortAirportSchema = z.object({
  port_name: z.string().min(2, 'Name must be at least 2 characters'),
  port_code: z.string().min(2, 'Code must be at least 2 characters'),
  type: z.nativeEnum(PortOrAirportType, {
    errorMap: () => ({ message: 'Type must be either PORT or AIRPORT' }),
  }),
  city_id: z.string().min(1, 'City is required'),
});

export const createCarrierSchema = z.object({
  carrier_name: z.string().min(2, 'Carrier name must be at least 2 characters'),
  carrier_code: z.string().min(2, 'Carrier code must be at least 2 characters'),
  type: z.nativeEnum(CarrierType, {
    errorMap: () => ({ message: 'Invalid carrier type' }),
  }),
  contact_person: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const createCommoditySchema = z.object({
  commodity_name: z.string().min(2, 'Commodity name must be at least 2 characters'),
  commodity_code: z.string().min(2, 'Commodity code must be at least 2 characters'),
  category: z.string().optional(),
});

export const createPartySchema = z.object({
  name: z.string().min(2, 'Party name must be at least 2 characters'),
  short_name: z.string().optional(),
  party_types: z.array(z.string()).min(1, 'At least one party type is required'),
  billing_address: z.string().optional(),
  corporate_address: z.string().optional(),
  credit_limit: z.number().min(0, 'Credit limit must be non-negative').optional(),
  credit_days: z.number().min(0, 'Credit days must be non-negative').optional(),
  tds_rate: z.number().min(0).max(100, 'TDS rate must be between 0 and 100').optional(),
  tds_applicable: z.boolean().optional(),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export const createModeOfTransportSchema = z.object({
  name: z.string().min(2, 'Mode name must be at least 2 characters'),
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must not exceed 20 characters')
    .transform(val => val.toUpperCase()),
  mode: z.nativeEnum(TransportMode, {
    errorMap: () => ({ message: 'Invalid transport mode' }),
  }),
  description: z.string().optional(),
  sort_order: z.number().min(0, 'Sort order must be non-negative').optional(),
  is_active: z.boolean().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateCountryFormData = z.infer<typeof createCountrySchema>;
export type CreateCityFormData = z.infer<typeof createCitySchema>;
export type CreatePortAirportFormData = z.infer<typeof createPortAirportSchema>;
export type CreateCarrierFormData = z.infer<typeof createCarrierSchema>;
export type CreateCommodityFormData = z.infer<typeof createCommoditySchema>;
export type CreatePartyFormData = z.infer<typeof createPartySchema>;
export type CreateModeOfTransportFormData = z.infer<typeof createModeOfTransportSchema>;

// Re-export types from main types file
export { CarrierType, PortOrAirportType, PartyType, TransportMode } from '@/types';
