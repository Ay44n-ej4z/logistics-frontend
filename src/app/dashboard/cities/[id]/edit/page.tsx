'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCityByIdQuery, useUpdateCityMutation, useGetCountriesQuery } from '@/store/api/masterDataApi';
import { createCitySchema, CreateCityFormData } from '@/lib/validations';
import Link from 'next/link';

export default function EditCityPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: cityResponse, isLoading } = useGetCityByIdQuery(cityId);
  const { data: countriesData } = useGetCountriesQuery({});
  const [updateCity] = useUpdateCityMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCityFormData>({
    resolver: zodResolver(createCitySchema),
  });

  useEffect(() => {
    if (cityResponse?.data) {
      reset({
        city_name: cityResponse.data.city_name,
        city_code: cityResponse.data.city_code,
        country_id: String(cityResponse.data.country_id),
      });
    }
  }, [cityResponse, reset]);

  const onSubmit = async (data: CreateCityFormData) => {
    try {
      setIsSubmitting(true);
      await updateCity({ id: cityId, data }).unwrap();
      router.push('/dashboard/cities');
    } catch (error) {
      console.error('Error updating city:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = Array.isArray(countriesData?.data) ? countriesData.data : countriesData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit City</h1>
          <p className="text-gray-600 mt-1">Update city information</p>
        </div>
        <Link
          href="/dashboard/cities"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Cities
        </Link>
      </div>

      {/* Edit City Form */}
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
                  Updating...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                  Update City
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

