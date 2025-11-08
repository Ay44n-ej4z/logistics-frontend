'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  useCreateModeOfTransportMutation, 
  useUpdateModeOfTransportMutation, 
  useSearchModesOfTransportQuery 
} from '@/store/api/masterDataApi';
import { createModeOfTransportSchema, CreateModeOfTransportFormData, TransportMode } from '@/lib/validations';
import { ModeOfTransportSearchParams, ModeOfTransport } from '@/types';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createModeOfTransportColumns } from '@/components/master-data/columns/modeOfTransportColumns';
import { useToast } from '@/hooks/useToast';

export default function ModeOfTransportPage() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingMode, setEditingMode] = useState<ModeOfTransport | null>(null);
  const [searchParamsState, setSearchParamsState] = useState<ModeOfTransportSearchParams>({
    page: 1,
    page_size: 25,
    sort_by: 'sort_order',
    sort_dir: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const [createMode] = useCreateModeOfTransportMutation();
  const [updateMode] = useUpdateModeOfTransportMutation();
  const { data: modesData, isLoading: isLoadingModes, error: modesError } = useSearchModesOfTransportQuery(searchParamsState);

  // Log any errors
  useEffect(() => {
    if (modesError) {
      console.error('Mode of Transport API Error:', modesError);
    }
    if (modesData) {
      console.log('Modes Data Received:', modesData);
    }
  }, [modesError, modesData]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateModeOfTransportFormData>({
    resolver: zodResolver(createModeOfTransportSchema),
    defaultValues: {
      sort_order: 0,
      is_active: true,
    },
  });

  // Auto-open form if create=true query parameter is present
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);

  const onSubmit = async (data: CreateModeOfTransportFormData) => {
    try {
      if (editingMode) {
        await updateMode({ id: editingMode.id, data }).unwrap();
        toast.success('Mode of transport updated successfully!');
      } else {
        await createMode(data).unwrap();
        toast.success('Mode of transport created successfully!');
      }
      reset();
      setShowForm(false);
      setEditingMode(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editingMode ? 'update' : 'create'} mode of transport`);
    }
  };

  const handleEdit = useCallback((mode: ModeOfTransport) => {
    setEditingMode(mode);
    setValue('name', mode.name);
    setValue('code', mode.code);
    setValue('mode', mode.mode);
    setValue('description', mode.description || '');
    setValue('sort_order', mode.sort_order);
    setValue('is_active', mode.is_active);
    setShowForm(true);
  }, [setValue]);

  const handleToggleStatus = useCallback(async (id: number, currentStatus: boolean, name: string) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} "${name}"?`)) {
      return;
    }
    try {
      await updateMode({ id, data: { is_active: !currentStatus } }).unwrap();
      toast.success(`Mode of transport "${name}" ${action}d successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} mode of transport "${name}"`);
    }
  }, [updateMode, toast]);

  const handleCancelEdit = () => {
    setEditingMode(null);
    setShowForm(false);
    reset({
      sort_order: 0,
      is_active: true,
    });
  };

  const modes = useMemo(() => modesData?.data || [], [modesData]);
  const pagination = useMemo(() => ({
    total: modesData?.total || 0,
    page: modesData?.page || 1,
    limit: modesData?.page_size || 25,
    totalPages: modesData?.total_pages || 0,
  }), [modesData]);
  
  const columns = useMemo(() => createModeOfTransportColumns({ 
    onEdit: handleEdit, 
    onToggleStatus: handleToggleStatus 
  }), [handleEdit, handleToggleStatus]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchParamsState(prev => ({
      ...prev,
      name: value || undefined,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setSearchParamsState(prev => ({ ...prev, page }));
  };

  // Handle sorting
  const handleSort = (sortBy: string) => {
    setSearchParamsState(prev => ({
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
          <h1 className="text-2xl font-bold text-gray-900">Mode of Transport</h1>
          <p className="text-gray-600 mt-1">Manage transport modes and their settings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingMode(null);
            reset({
              sort_order: 0,
              is_active: true,
            });
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
          Add Mode
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingMode ? 'Edit Mode of Transport' : 'Add New Mode of Transport'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  {...register('name')}
                  className="input-field"
                  placeholder="e.g., Air Transport"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  {...register('code')}
                  className="input-field uppercase"
                  placeholder="e.g., AIR"
                  maxLength={20}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Mode *
                </label>
                <select
                  {...register('mode')}
                  className="input-field"
                >
                  <option value="">Select mode...</option>
                  <option value={TransportMode.AIR}>Air</option>
                  <option value={TransportMode.SEA}>Sea</option>
                  <option value={TransportMode.ROAD}>Road</option>
                  <option value={TransportMode.RAIL}>Rail</option>
                  <option value={TransportMode.COURIER}>Courier</option>
                  <option value={TransportMode.MULTIMODAL}>Multimodal</option>
                </select>
                {errors.mode && (
                  <p className="mt-1 text-sm text-red-600">{errors.mode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  {...register('sort_order', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
                {errors.sort_order && (
                  <p className="mt-1 text-sm text-red-600">{errors.sort_order.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="input-field"
                  placeholder="Enter description..."
                  rows={3}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
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
                disabled={isLoadingModes}
                className="btn-primary disabled:opacity-50"
              >
                {editingMode ? 'Update Mode' : 'Create Mode'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Modes List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Modes of Transport</h3>
        </div>
        
        <MasterDataTable
          data={modes}
          columns={columns}
          isLoading={isLoadingModes}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search modes..."
          total={pagination.total}
          page={pagination.page}
          pageSize={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          currentSort={searchParamsState.sort_by}
          currentSortDir={searchParamsState.sort_dir}
        />
      </div>
    </div>
  );
}