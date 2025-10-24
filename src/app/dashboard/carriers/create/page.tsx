'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCarrierMutation } from '@/store/api/masterDataApi';
import { createCarrierSchema, CreateCarrierFormData } from '@/lib/validations';
import Link from 'next/link';

export default function CreateCarrierPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCarrier = useCreateCarrierMutation()[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCarrierFormData>({
    resolver: zodResolver(createCarrierSchema),
  });

  const onSubmit = async (data: CreateCarrierFormData) => {
    try {
      setIsSubmitting(true);
      await createCarrier(data).unwrap();
      reset();
      // Redirect to carriers list
      router.push('/dashboard/carriers');
    } catch (error) {
      console.error('Error creating carrier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Carrier</h1>
          <p className="text-gray-600 mt-1">Add a new carrier to the system</p>
        </div>
        <Link
          href="/dashboard/carriers"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Carriers
        </Link>
      </div>

      {/* Create Carrier Form */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                {...register('contact_person' as any)}
                className="input-field"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email' as any)}
                type="email"
                className="input-field"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                {...register('phone' as any)}
                className="input-field"
                placeholder="Enter phone number"
              />
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
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                  Create Carrier
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
