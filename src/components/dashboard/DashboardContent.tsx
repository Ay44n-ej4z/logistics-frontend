'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import MetricsCards from './MetricsCards';
import ActivityTimeline from './ActivityTimeline';
import RoleWidgets from './RoleWidgets';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Modern, minimal logistics & freight forwarding workspace
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>

        {/* Role Widgets */}
        <div>
          <RoleWidgets />
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <Icon icon="mdi:lightning-bolt" className="w-5 h-5 text-primary-600" />
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <Icon icon="mdi:plus" className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Create New Job</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <Icon icon="mdi:file-document-plus" className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Generate AWB</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <Icon icon="mdi:receipt" className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Create Invoice</span>
              </div>
            </button>
          </div>
        </div>

        {/* Customer Tracking */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Tracking</h3>
            <Icon icon="mdi:account-search" className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-center py-8">
            <Icon icon="mdi:chart-line" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tracking data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
