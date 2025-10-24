'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePortAirportMutation, useGetCitiesQuery } from '@/store/api/masterDataApi';
import { createPortAirportSchema, CreatePortAirportFormData } from '@/lib/validations';
import Link from 'next/link';

export default function CreatePortAirportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPortAirport = useCreatePortAirportMutation()[0];
  const { data: citiesData } = useGetCitiesQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePortAirportFormData>({
    resolver: zodResolver(createPortAirportSchema),
  });

  const onSubmit = async (data: CreatePortAirportFormData) => {
    try {
      setIsSubmitting(true);
      await createPortAirport(data).unwrap();
      reset();
      // Redirect to ports-airports list
      router.push('/dashboard/ports-airports');
    } catch (error) {
      console.error('Error creating port/airport:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cities = Array.isArray(citiesData?.data) ? citiesData.data : citiesData?.data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Port/Airport</h1>
          <p className="text-gray-600 mt-1">Add a new port or airport to the system</p>
        </div>
        <Link
          href="/dashboard/ports-airports"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Ports/Airports
        </Link>
      </div>

      {/* Create Port/Airport Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Port/Airport Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port/Airport Name *
              </label>
              <input
                {...register('port_name')}
                className="input-field"
                placeholder="Enter port or airport name"
              />
              {errors.port_name && (
                <p className="mt-1 text-sm text-red-600">{errors.port_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port/Airport Code *
              </label>
              <input
                {...register('port_code')}
                className="input-field"
                placeholder="e.g., JFK"
              />
              {errors.port_code && (
                <p className="mt-1 text-sm text-red-600">{errors.port_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                {...register('type')}
                className="input-field"
              >
                <option value="">Select type</option>
                <option value="port">Port</option>
                <option value="airport">Airport</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                {...register('city_id')}
                className="input-field"
              >
                <option value="">Select a city</option>
                {cities.map((city: any) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name} ({city.city_code})
                  </option>
                ))}
              </select>
              {errors.city_id && (
                <p className="mt-1 text-sm text-red-600">{errors.city_id.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/ports-airports"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                  Create Port/Airport
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
