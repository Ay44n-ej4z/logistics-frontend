'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCarrierMutation, useUpdateCarrierMutation, useDeleteCarrierMutation, useSearchCarriersQuery } from '@/store/api/masterDataApi';
import { createCarrierSchema, CreateCarrierFormData, CarrierType } from '@/lib/validations';
import { CarrierSearchParams, Carrier } from '@/types';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createCarriersColumns } from '@/components/master-data/columns/carriersColumns';
import { useToast } from '@/hooks/useToast';

export default function CarriersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [searchParams, setSearchParams] = useState<CarrierSearchParams>({
    page: 1,
    page_size: 25,
    sort_by: 'carrier_name',
    sort_dir: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const [createCarrier] = useCreateCarrierMutation();
  const [updateCarrier] = useUpdateCarrierMutation();
  const [deleteCarrier] = useDeleteCarrierMutation();
  const { data: carriersData, isLoading: isLoadingCarriers } = useSearchCarriersQuery(searchParams);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateCarrierFormData>({
    resolver: zodResolver(createCarrierSchema),
  });

  const onSubmit = async (data: CreateCarrierFormData) => {
    try {
      if (editingCarrier) {
        await updateCarrier({ id: editingCarrier.carrier_id, data }).unwrap();
        toast.success('Carrier updated successfully!');
      } else {
        await createCarrier(data).unwrap();
        toast.success('Carrier created successfully!');
      }
      reset();
      setShowForm(false);
      setEditingCarrier(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editingCarrier ? 'update' : 'create'} carrier`);
    }
  };

  const handleEdit = useCallback((carrier: Carrier) => {
    setEditingCarrier(carrier);
    setValue('carrier_name', carrier.carrier_name);
    setValue('carrier_code', carrier.carrier_code);
    setValue('type', carrier.type as any);
    setShowForm(true);
  }, [setValue]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete carrier "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    try {
      await deleteCarrier(id).unwrap();
      toast.success(`Carrier "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete carrier "${name}"`);
    }
  }, [deleteCarrier, toast]);

  const handleCancelEdit = () => {
    setEditingCarrier(null);
    setShowForm(false);
    reset();
  };

  const carriers = useMemo(() => carriersData?.data || [], [carriersData]);
  const pagination = useMemo(() => carriersData?.data || { total: 0, page: 1, limit: 25, totalPages: 0 }, [carriersData]);
  
  const columns = useMemo(() => createCarriersColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchParams(prev => ({
      ...prev,
      carrier_name: value || undefined,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // Handle sorting
  const handleSort = (sortBy: string) => {
    setSearchParams(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_dir: prev.sort_by === sortBy && prev.sort_dir === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carriers</h1>
          <p className="text-gray-600 mt-1">Manage transportation carriers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingCarrier(null);
            reset();
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
          Add Carrier
        </motion.button>
      </div>

      {/* Add Carrier Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCarrier ? 'Edit Carrier' : 'Add New Carrier'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select {...register('type')} className="input-field">
                  <option value="">Select type</option>
                  {Object.values(CarrierType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoadingCarriers}
                className="btn-primary disabled:opacity-50"
              >
                {editingCarrier ? 'Update Carrier' : 'Create Carrier'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Carriers List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Carriers</h3>
        </div>
        
        <MasterDataTable
          data={carriers}
          columns={columns}
          isLoading={isLoadingCarriers}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search carriers..."
          total={pagination.total}
          page={pagination.page}
          pageSize={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={searchParams.sort_by}
          currentSortDir={searchParams.sort_dir}
        />
      </div>
    </div>
  );
}
