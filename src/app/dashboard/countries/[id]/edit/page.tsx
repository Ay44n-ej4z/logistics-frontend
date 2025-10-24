'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCountryByIdQuery, useUpdateCountryMutation } from '@/store/api/masterDataApi';
import { createCountrySchema, CreateCountryFormData } from '@/lib/validations';
import Link from 'next/link';

export default function EditCountryPage() {
  const params = useParams();
  const router = useRouter();
  const countryId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: countryResponse, isLoading } = useGetCountryByIdQuery(countryId);
  const [updateCountry] = useUpdateCountryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCountryFormData>({
    resolver: zodResolver(createCountrySchema),
  });

  useEffect(() => {
    if (countryResponse?.data) {
      reset({
        country_name: countryResponse.data.country_name,
        country_code: countryResponse.data.country_code,
        capital: countryResponse.data.capital || '',
        currency: countryResponse.data.currency || '',
        language: countryResponse.data.language || '',
      });
    }
  }, [countryResponse, reset]);

  const onSubmit = async (data: CreateCountryFormData) => {
    try {
      setIsSubmitting(true);
      await updateCountry({ id: countryId, data }).unwrap();
      router.push('/dashboard/countries');
    } catch (error) {
      console.error('Error updating country:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Country</h1>
          <p className="text-gray-600 mt-1">Update country information</p>
        </div>
        <Link
          href="/dashboard/countries"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Countries
        </Link>
      </div>

      {/* Edit Country Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Country Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Name *
              </label>
              <input
                {...register('country_name')}
                className="input-field"
                placeholder="Enter country name"
              />
              {errors.country_name && (
                <p className="mt-1 text-sm text-red-600">{errors.country_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code *
              </label>
              <input
                {...register('country_code')}
                className="input-field"
                placeholder="e.g., USA"
                maxLength={3}
              />
              {errors.country_code && (
                <p className="mt-1 text-sm text-red-600">{errors.country_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital
              </label>
              <input
                {...register('capital')}
                className="input-field"
                placeholder="Enter capital city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <input
                {...register('currency')}
                className="input-field"
                placeholder="e.g., USD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                {...register('language')}
                className="input-field"
                placeholder="e.g., English"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/countries"
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
                  Update Country
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

