'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePartyMutation, useUpdatePartyMutation, useDeletePartyMutation, useSearchPartiesQuery } from '@/store/api/masterDataApi';
import { createPartySchema, CreatePartyFormData, PartyType } from '@/lib/validations';
import { PartySearchParams, Party } from '@/types';
import { useToast } from '@/hooks/useToast';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createPartiesColumns } from '@/components/master-data/columns/partiesColumns';

export default function PartiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<PartySearchParams>({
    page: 1,
    page_size: 25,
    sort_by: 'name',
    sort_dir: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const [createParty] = useCreatePartyMutation();
  const [updateParty] = useUpdatePartyMutation();
  const [deleteParty] = useDeletePartyMutation();
  const { data: partiesData, isLoading: isLoadingParties } = useSearchPartiesQuery(searchParams);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePartyFormData>({
    resolver: zodResolver(createPartySchema),
  });

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setValue('party_types', newTypes);
  };

  const onSubmit = async (data: CreatePartyFormData) => {
    try {
      const submitData = { ...data, party_types: selectedTypes };
      if (editingParty) {
        await updateParty({ id: editingParty.party_id, data: submitData }).unwrap();
        toast.success('Party updated successfully!');
      } else {
        await createParty(submitData).unwrap();
        toast.success('Party created successfully!');
      }
      reset();
      setSelectedTypes([]);
      setShowForm(false);
      setEditingParty(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editingParty ? 'update' : 'create'} party`);
    }
  };

  const handleEdit = useCallback((party: Party) => {
    setEditingParty(party);
    setSelectedTypes(party.party_types || []);
    setValue('name', party.name);
    setValue('short_name', party.short_name || '');
    setValue('party_types', party.party_types || []);
    setValue('contact_person', party.contact_person || '');
    setValue('email', party.email || '');
    setValue('phone', party.phone || '');
    setValue('billing_address', party.billing_address || '');
    setValue('corporate_address', party.corporate_address || '');
    if (party.credit_limit) {
      setValue('credit_limit', parseFloat(party.credit_limit));
    }
    setShowForm(true);
  }, [setValue]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete party "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    try {
      await deleteParty(id).unwrap();
      toast.success(`Party "${name}" deleted successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete party "${name}"`);
    }
  }, [deleteParty, toast]);

  const handleCancelEdit = () => {
    setEditingParty(null);
    setSelectedTypes([]);
    setShowForm(false);
    reset();
  };

  const parties = useMemo(() => partiesData?.data || [], [partiesData]);
  const pagination = useMemo(() => partiesData?.data || { total: 0, page: 1, limit: 25, totalPages: 0 }, [partiesData]);
  const columns = useMemo(() => createPartiesColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSearchParams(prev => ({
      ...prev,
      name: value || undefined,
      page: 1, // Reset to first page when searching
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
          <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
          <p className="text-gray-600 mt-1">Manage parties and contacts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingParty(null);
            setSelectedTypes([]);
            reset();
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
          Add Party
        </motion.button>
      </div>

      {/* Add Party Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingParty ? 'Edit Party' : 'Add New Party'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Name
                </label>
                <input
                  {...register('short_name')}
                  className="input-field"
                  placeholder="Enter short name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  {...register('contact_person')}
                  className="input-field"
                  placeholder="Enter contact person"
                />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address
                </label>
                <textarea
                  {...register('billing_address')}
                  className="input-field"
                  rows={3}
                  placeholder="Enter billing address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit
                </label>
                <input
                  {...register('credit_limit', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Days
                </label>
                <input
                  {...register('credit_days', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TDS Rate (%)
                </label>
                <input
                  {...register('tds_rate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('tds_applicable')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                TDS Applicable
              </label>
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
                disabled={isLoadingParties}
                className="btn-primary disabled:opacity-50"
              >
                {editingParty ? 'Update Party' : 'Create Party'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Parties List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Parties</h3>
        </div>
        
        <MasterDataTable
          data={parties}
          columns={columns}
          isLoading={isLoadingParties}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search parties..."
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
