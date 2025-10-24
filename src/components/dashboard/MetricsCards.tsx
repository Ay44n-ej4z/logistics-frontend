'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const metrics = [
  {
    title: 'Open Jobs',
    value: '128',
    subtitle: '12 this week',
    icon: 'mdi:briefcase',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Pending AWBs',
    value: '36',
    subtitle: '8 today',
    icon: 'mdi:airplane',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Invoices',
    value: '$84k',
    subtitle: '+$12k',
    icon: 'mdi:file-document',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Profit Margin',
    value: '22%',
    subtitle: '+2% MoM',
    icon: 'mdi:currency-usd',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.subtitle}</p>
            </div>
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <Icon icon={metric.icon} className={`w-6 h-6 ${metric.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
