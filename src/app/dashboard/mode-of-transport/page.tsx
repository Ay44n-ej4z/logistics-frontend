'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MasterDataTable from '@/components/master-data/MasterDataTable';
import { createModeOfTransportColumns } from '@/components/master-data/columns';
import { transportModes } from '@/components/common/ModeOfTransportDropdown';

const modesWithDetails = transportModes.map(mode => ({
  mode_id: mode.id,
  mode_name: mode.name,
  code: mode.id.toUpperCase(),
  is_active: true,
  description: `${mode.name} transportation mode`,
  last_modified: new Date().toISOString(),
}));

export default function ModeOfTransportPage() {
  const router = useRouter();

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mode of Transport</h1>
            <p className="text-gray-600 mt-1">
              Manage transport modes and their settings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MasterDataTable
          columns={createModeOfTransportColumns({ router })}
          data={modesWithDetails}
          placeholder="Search transport modes..."
        />
      </motion.div>
    </div>
  );
}