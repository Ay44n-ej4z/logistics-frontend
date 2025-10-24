'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCommodityByIdQuery, useUpdateCommodityMutation } from '@/store/api/masterDataApi';
import { createCommoditySchema, CreateCommodityFormData } from '@/lib/validations';
import Link from 'next/link';

export default function EditCommodityPage() {
  const params = useParams();
  const router = useRouter();
  const commodityId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: commodityResponse, isLoading } = useGetCommodityByIdQuery(commodityId);
  const [updateCommodity] = useUpdateCommodityMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommodityFormData>({
    resolver: zodResolver(createCommoditySchema),
  });

  useEffect(() => {
    if (commodityResponse?.data) {
      reset({
        commodity_name: commodityResponse.data.commodity_name,
        commodity_code: commodityResponse.data.commodity_code,
        category: commodityResponse.data.category || '',
      });
    }
  }, [commodityResponse, reset]);

  const onSubmit = async (data: CreateCommodityFormData) => {
    try {
      setIsSubmitting(true);
      await updateCommodity({ id: commodityId, data }).unwrap();
      router.push('/dashboard/commodities');
    } catch (error) {
      console.error('Error updating commodity:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Commodity</h1>
          <p className="text-gray-600 mt-1">Update commodity information</p>
        </div>
        <Link
          href="/dashboard/commodities"
          className="btn-secondary flex items-center"
        >
          <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
          Back to Commodities
        </Link>
      </div>

      {/* Edit Commodity Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Commodity Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity Name *
              </label>
              <input
                {...register('commodity_name')}
                className="input-field"
                placeholder="Enter commodity name"
              />
              {errors.commodity_name && (
                <p className="mt-1 text-sm text-red-600">{errors.commodity_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity Code *
              </label>
              <input
                {...register('commodity_code')}
                className="input-field"
                placeholder="e.g., ELEC"
              />
              {errors.commodity_code && (
                <p className="mt-1 text-sm text-red-600">{errors.commodity_code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                {...register('category')}
                className="input-field"
                placeholder="e.g., Electronics"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/dashboard/commodities"
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
                  Update Commodity
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

