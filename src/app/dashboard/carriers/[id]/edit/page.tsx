'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCarrierByIdQuery, useUpdateCarrierMutation } from '@/store/api/masterDataApi';
import { createCarrierSchema, CreateCarrierFormData } from '@/lib/validations';
import Link from 'next/link';

export default function EditCarrierPage() {
  const params = useParams();
  const router = useRouter();
  const carrierId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: carrierResponse, isLoading } = useGetCarrierByIdQuery(carrierId);
  const [updateCarrier] = useUpdateCarrierMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCarrierFormData>({
    resolver: zodResolver(createCarrierSchema),
  });

  useEffect(() => {
    if (carrierResponse?.data) {
      reset({
        carrier_name: carrierResponse.data.carrier_name,
        carrier_code: carrierResponse.data.carrier_code,
        type: carrierResponse.data.type,
      });
    }
  }, [carrierResponse, reset]);

  const onSubmit = async (data: CreateCarrierFormData) => {
    try {
      setIsSubmitting(true);
      await updateCarrier({ id: carrierId, data }).unwrap();
      router.push('/dashboard/carriers');
    } catch (error) {
      console.error('Error updating carrier:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Carrier</h1>
          <p className="text-gray-600 mt-1">Update carrier information</p>
        </div>
        <Link
          href="/dashboard/carriers"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Carriers
        </Link>
      </div>

      {/* Edit Carrier Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Carrier Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier Name *
              </label>
              <input
                {...register('carrier_name')}
                className="input-field"
                placeholder="Enter carrier name"
              />
              {errors.carrier_name && (
                <p className="mt-1 text-sm text-red-600">{errors.carrier_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier Code *
              </label>
              <input
                {...register('carrier_code')}
                className="input-field"
                placeholder="e.g., FEDEX"
              />
              {errors.carrier_code && (
                <p className="mt-1 text-sm text-red-600">{errors.carrier_code.message}</p>
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
                <option value="">Select carrier type</option>
                <option value="AIRLINE">Airline</option>
                <option value="SHIPPING">Shipping</option>
                <option value="TRUCKING">Trucking</option>
                <option value="RAILWAY">Railway</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/carriers"
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
                  Update Carrier
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

