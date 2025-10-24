'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCityMutation, useGetCountriesQuery } from '@/store/api/masterDataApi';
import { createCitySchema, CreateCityFormData } from '@/lib/validations';
import Link from 'next/link';

export default function CreateCityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCity = useCreateCityMutation()[0];
  const { data: countriesData } = useGetCountriesQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCityFormData>({
    resolver: zodResolver(createCitySchema),
  });

  const onSubmit = async (data: CreateCityFormData) => {
    try {
      setIsSubmitting(true);
      await createCity(data).unwrap();
      reset();
      // Redirect to cities list
      router.push('/dashboard/cities');
    } catch (error) {
      console.error('Error creating city:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = Array.isArray(countriesData?.data) ? countriesData.data : countriesData?.data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New City</h1>
          <p className="text-gray-600 mt-1">Add a new city to the system</p>
        </div>
        <Link
          href="/dashboard/cities"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Cities
        </Link>
      </div>

      {/* Create City Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">City Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Name *
              </label>
              <input
                {...register('city_name')}
                className="input-field"
                placeholder="Enter city name"
              />
              {errors.city_name && (
                <p className="mt-1 text-sm text-red-600">{errors.city_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Code *
              </label>
              <input
                {...register('city_code')}
                className="input-field"
                placeholder="e.g., NYC"
              />
              {errors.city_code && (
                <p className="mt-1 text-sm text-red-600">{errors.city_code.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                {...register('country_id')}
                className="input-field"
              >
                <option value="">Select a country</option>
                {countries.map((country: any) => (
                  <option key={country.country_id} value={country.country_id}>
                    {country.country_name} ({country.country_code})
                  </option>
                ))}
              </select>
              {errors.country_id && (
                <p className="mt-1 text-sm text-red-600">{errors.country_id.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/cities"
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
                  Create City
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
