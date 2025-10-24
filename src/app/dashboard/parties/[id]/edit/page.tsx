'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetPartyByIdQuery, useUpdatePartyMutation } from '@/store/api/masterDataApi';
import { createPartySchema, CreatePartyFormData } from '@/lib/validations';
import Link from 'next/link';

export default function EditPartyPage() {
  const params = useParams();
  const router = useRouter();
  const partyId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: partyResponse, isLoading } = useGetPartyByIdQuery(partyId);
  const [updateParty] = useUpdatePartyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePartyFormData>({
    resolver: zodResolver(createPartySchema),
  });

  useEffect(() => {
    if (partyResponse?.data) {
      reset({
        name: partyResponse.data.name,
        short_name: partyResponse.data.short_name,
        type: partyResponse.data.type,
        contact_person: partyResponse.data.contact_person || '',
        email: partyResponse.data.email || '',
        phone: partyResponse.data.phone || '',
        billing_address: partyResponse.data.billing_address || '',
      });
    }
  }, [partyResponse, reset]);

  const onSubmit = async (data: CreatePartyFormData) => {
    try {
      setIsSubmitting(true);
      await updateParty({ id: partyId, data }).unwrap();
      router.push('/dashboard/parties');
    } catch (error) {
      console.error('Error updating party:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Party</h1>
          <p className="text-gray-600 mt-1">Update party information</p>
        </div>
        <Link
          href="/dashboard/parties"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Parties
        </Link>
      </div>

      {/* Edit Party Form */}
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
                  Updating...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                  Update Party
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

