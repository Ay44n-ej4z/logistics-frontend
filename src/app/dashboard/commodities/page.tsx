'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCommodityMutation, useUpdateCommodityMutation, useDeleteCommodityMutation, useSearchCommoditiesQuery } from '@/store/api/masterDataApi';
import { createCommoditySchema, CreateCommodityFormData } from '@/lib/validations';
import { CommoditySearchParams, Commodity } from '@/types';
import { useToast } from '@/hooks/useToast';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createCommoditiesColumns } from '@/components/master-data/columns/commoditiesColumns';

export default function CommoditiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);
  const [searchParams, setSearchParams] = useState<CommoditySearchParams>({
    page: 1,
    page_size: 25,
    sort_by: 'commodity_name',
    sort_dir: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const [createCommodity] = useCreateCommodityMutation();
  const [updateCommodity] = useUpdateCommodityMutation();
  const [deleteCommodity] = useDeleteCommodityMutation();
  const { data: commoditiesData, isLoading: isLoadingCommodities } = useSearchCommoditiesQuery(searchParams);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateCommodityFormData>({
    resolver: zodResolver(createCommoditySchema),
  });

  const onSubmit = async (data: CreateCommodityFormData) => {
    try {
      if (editingCommodity) {
        await updateCommodity({ id: editingCommodity.commodity_id, data }).unwrap();
        toast.success('Commodity updated successfully!');
      } else {
        await createCommodity(data).unwrap();
        toast.success('Commodity created successfully!');
      }
      reset();
      setShowForm(false);
      setEditingCommodity(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editingCommodity ? 'update' : 'create'} commodity`);
    }
  };

  const handleEdit = useCallback((commodity: Commodity) => {
    setEditingCommodity(commodity);
    setValue('commodity_name', commodity.commodity_name);
    setValue('commodity_code', commodity.commodity_code);
    setValue('category', commodity.category || '');
    setShowForm(true);
  }, [setValue]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete commodity "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    try {
      await deleteCommodity(id).unwrap();
      toast.success(`Commodity "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete commodity "${name}"`);
    }
  }, [deleteCommodity, toast]);

  const handleCancelEdit = () => {
    setEditingCommodity(null);
    setShowForm(false);
    reset();
  };

  const commodities = useMemo(() => commoditiesData?.data || [], [commoditiesData]);
  const pagination = useMemo(() => commoditiesData?.data || { total: 0, page: 1, limit: 25, totalPages: 0 }, [commoditiesData]);
  const columns = useMemo(() => createCommoditiesColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchParams(prev => ({
      ...prev,
      commodity_name: value || undefined,
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
          <h1 className="text-2xl font-bold text-gray-900">Commodities</h1>
          <p className="text-gray-600 mt-1">Manage commodities and goods</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingCommodity(null);
            reset();
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
          Add Commodity
        </motion.button>
      </div>

      {/* Add Commodity Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCommodity ? 'Edit Commodity' : 'Add New Commodity'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commodity Code *
                </label>
                <input
                  {...register('commodity_code')}
                  className="input-field"
                  placeholder="e.g., ELECTRONICS"
                />
                {errors.commodity_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.commodity_code.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  {...register('category')}
                  className="input-field"
                  placeholder="e.g., Electronics, Textiles, Food"
                />
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
                disabled={isLoadingCommodities}
                className="btn-primary disabled:opacity-50"
              >
                {editingCommodity ? 'Update Commodity' : 'Create Commodity'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Commodities List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Commodities</h3>
        </div>
        
        <MasterDataTable
          data={commodities}
          columns={columns}
          isLoading={isLoadingCommodities}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search commodities..."
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
