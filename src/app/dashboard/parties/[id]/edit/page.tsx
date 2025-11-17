'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetPartyByIdQuery, useUpdatePartyMutation } from '@/store/api/masterDataApi';
import { createPartySchema, CreatePartyFormData } from '@/lib/validations';
import { PartyType } from '@/types';
import Link from 'next/link';

export default function EditPartyPage() {
  const params = useParams();
  const router = useRouter();
  const partyId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { data: partyResponse, isLoading } = useGetPartyByIdQuery(partyId);
  const [updateParty] = useUpdatePartyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePartyFormData>({
    resolver: zodResolver(createPartySchema),
  });

  useEffect(() => {
    if (partyResponse?.data) {
      const party = partyResponse.data;
      setSelectedTypes(party.party_types || []);
      reset({
        name: party.name,
        short_name: party.short_name,
        party_types: party.party_types || [],
        contact_person: party.contact_person || '',
        email: party.email || '',
        phone: party.phone || '',
        billing_address: party.billing_address || '',
        corporate_address: party.corporate_address || '',
      });
    }
  }, [partyResponse, reset]);

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setValue('party_types', newTypes);
  };

  const onSubmit = async (data: CreatePartyFormData) => {
    try {
      setIsSubmitting(true);
      await updateParty({ id: partyId, data: { ...data, party_types: selectedTypes } }).unwrap();
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
          {/* Party Types - Multi-select checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Party Types * <span className="text-xs text-gray-500">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(PartyType).map((type) => {
                const typeLabels: Record<string, string> = {
                  [PartyType.SHIPPER]: 'Shipper',
                  [PartyType.CONSIGNEE]: 'Consignee',
                  [PartyType.NOTIFY_PARTY]: 'Notify Party',
                  [PartyType.LOCAL_CLIENT]: 'Local Client',
                  [PartyType.OVERSEAS_CLIENT]: 'Overseas Client',
                  [PartyType.VENDOR]: 'Vendor',
                };

                return (
                  <label
                    key={type}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTypes.includes(type)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">{typeLabels[type]}</span>
                  </label>
                );
              })}
            </div>
            {errors.party_types && (
              <p className="mt-1 text-sm text-red-600">{errors.party_types.message}</p>
            )}
          </div>

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

