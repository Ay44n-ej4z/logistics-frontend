'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const activities = [
  {
    id: '1',
    action: 'Job J-24018 created',
    user: 'ops',
    timestamp: '10:21',
    description: 'New job created for shipment',
  },
  {
    id: '2',
    action: 'MAWB MA-552193 issued',
    user: 'ops',
    timestamp: '10:35',
    description: 'Master Air Waybill issued',
  },
  {
    id: '3',
    action: 'Invoice INV-24019 confirmed',
    user: 'accounts',
    timestamp: '11:10',
    description: 'Invoice confirmed and sent',
  },
  {
    id: '4',
    action: 'Cost center CC-992 updated',
    user: 'finance',
    timestamp: '11:50',
    description: 'Cost center information updated',
  },
];

export default function ActivityTimeline() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
        <Icon icon="mdi:chart-line" className="w-5 h-5 text-primary-600" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon icon="mdi:circle" className="w-3 h-3 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">by {activity.user}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
