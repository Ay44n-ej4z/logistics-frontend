'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePartyMutation } from '@/store/api/masterDataApi';
import { PartyType } from '@/types';

// Quick add schema - simplified version with only required fields
const quickAddPartySchema = z.object({
  name: z.string().min(2, 'Party name must be at least 2 characters'),
  short_name: z.string().optional(),
  party_types: z.array(z.string()).min(1, 'At least one party type is required'),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  billing_address: z.string().optional(),
  corporate_address: z.string().optional(),
});

type QuickAddPartyFormData = z.infer<typeof quickAddPartySchema>;

interface QuickAddPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (partyId: string) => void;
  defaultTypes?: string[];
}

export default function QuickAddPartyModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTypes = [],
}: QuickAddPartyModalProps) {
  const [createParty, { isLoading }] = useCreatePartyMutation();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(defaultTypes);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuickAddPartyFormData>({
    resolver: zodResolver(quickAddPartySchema),
    defaultValues: {
      party_types: defaultTypes,
    },
  });

  // Update selected types when defaultTypes change
  useEffect(() => {
    setSelectedTypes(defaultTypes);
    setValue('party_types', defaultTypes);
  }, [defaultTypes, setValue]);

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setValue('party_types', newTypes);
  };

  const onSubmit = async (data: QuickAddPartyFormData) => {
    try {
      const result = await createParty({
        ...data,
        party_types: selectedTypes,
        credit_limit: 0,
        credit_days: 0,
        tds_rate: 0,
        tds_applicable: false,
      }).unwrap();

      // Extract party_id from the response
      const partyId = result?.data?.party_id;
      
      if (partyId && onSuccess) {
        onSuccess(partyId);
      }

      // Reset form and close
      reset();
      setSelectedTypes(defaultTypes);
      onClose();
    } catch (error) {
      console.error('Error creating party:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedTypes(defaultTypes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Add Party</h2>
            <p className="text-sm text-gray-600 mt-1">Add a new party quickly during job creation</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party Name *
              </label>
              <input
                {...register('name')}
                className="input-field"
                placeholder="Enter party name"
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Name
              </label>
              <input
                {...register('short_name')}
                className="input-field"
                placeholder="e.g., ABC Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                {...register('contact_person')}
                className="input-field"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                {...register('phone')}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
              </label>
              <textarea
                {...register('billing_address')}
                className="input-field"
                rows={2}
                placeholder="Enter billing address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Corporate Address
              </label>
              <textarea
                {...register('corporate_address')}
                className="input-field"
                rows={2}
                placeholder="Enter corporate address"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedTypes.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4 mr-2" />
                  Add Party
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
