'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePartyMutation } from '@/store/api/masterDataApi';
import { createPartySchema, CreatePartyFormData } from '@/lib/validations';
import Link from 'next/link';

export default function CreatePartyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createParty = useCreatePartyMutation()[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePartyFormData>({
    resolver: zodResolver(createPartySchema),
  });

  const onSubmit = async (data: CreatePartyFormData) => {
    try {
      setIsSubmitting(true);
      await createParty(data).unwrap();
      reset();
      // Redirect to parties list
      router.push('/dashboard/parties');
    } catch (error) {
      console.error('Error creating party:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Party</h1>
          <p className="text-gray-600 mt-1">Add a new party to the system</p>
        </div>
        <Link
          href="/dashboard/parties"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Parties
        </Link>
      </div>

      {/* Create Party Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Party Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party Name *
              </label>
              <input
                {...register('name')}
                className="input-field"
                placeholder="Enter party name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name *
              </label>
              <input
                {...register('short_name')}
                className="input-field"
                placeholder="e.g., ABC Corp"
              />
              {errors.short_name && (
                <p className="mt-1 text-sm text-red-600">{errors.short_name.message}</p>
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
                <option value="">Select party type</option>
                <option value="SHIPPER">Shipper</option>
                <option value="CONSIGNEE">Consignee</option>
                <option value="NOTIFY_PARTY">Notify Party</option>
                <option value="AGENT">Agent</option>
                <option value="BROKER">Broker</option>
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
                {...register('contact_person')}
                className="input-field"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email')}
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
                {...register('phone')}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <textarea
                {...register('billing_address')}
                className="input-field"
                rows={3}
                placeholder="Enter billing address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Corporate Address
              </label>
              <textarea
                {...register('corporate_address')}
                className="input-field"
                rows={3}
                placeholder="Enter corporate address"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/parties"
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
                  Create Party
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
