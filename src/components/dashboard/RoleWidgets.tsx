'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const widgets = [
  {
    name: 'Open Jobs',
    progress: 64,
    total: 128,
  },
  {
    name: 'Pending AWBs',
    progress: 40,
    total: 36,
  },
  {
    name: 'Cost Center Margin',
    progress: 72,
    total: 100,
  },
];

export default function RoleWidgets() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Role Widgets</h3>
        <Icon icon="mdi:chart-box" className="w-5 h-5 text-primary-600" />
      </div>

      <div className="space-y-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{widget.name}</span>
              <span className="text-sm text-gray-500">{widget.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widget.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="bg-primary-600 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
