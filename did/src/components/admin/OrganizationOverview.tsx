'use client';

import { motion } from 'framer-motion';
import { Organization } from '@/types/admin';

interface OrganizationOverviewProps {
  organization: Organization;
}

export default function OrganizationOverview({ organization }: OrganizationOverviewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 font-medium text-2xl">
                {organization.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  organization.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">마지막 로그인: {organization.lastLogin}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">{organization.totalPasses}</p>
              <p className="text-sm text-gray-500">전체 패스</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">{organization.totalUsers}</p>
              <p className="text-sm text-gray-500">전체 사용자</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-800">{organization.totalLocations}</p>
              <p className="text-sm text-gray-500">승인된 위치</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 