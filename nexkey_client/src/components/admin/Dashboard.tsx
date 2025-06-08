'use client';

import React from 'react';
import { AccessPass, PassHolder, Activity, Analytics, TabType } from '@/types/admin';

interface DashboardProps {
  existingPasses: AccessPass[];
  passHolders: PassHolder[];
  activities: Activity[];
  analytics: Analytics;
  setActiveTab: (tab: TabType) => void;
}

const Dashboard = ({ 
  existingPasses, 
  passHolders, 
  activities, 
  analytics, 
  setActiveTab 
}: DashboardProps) => {
  return React.createElement('div', {
    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  }, [
    React.createElement('div', {
      key: 'stats1',
      className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
      React.createElement('h3', {
        key: 'title1',
        className: 'text-lg font-medium text-gray-900'
      }, '전체 패스 유형'),
      React.createElement('p', {
        key: 'value1',
        className: 'mt-2 text-3xl font-bold text-blue-800'
      }, existingPasses.length),
      React.createElement('p', {
        key: 'desc1',
        className: 'mt-1 text-sm text-gray-500'
      }, `총 ${existingPasses.reduce((sum, pass) => sum + pass.totalIssued, 0)}개 발급`)
    ]),
    React.createElement('div', {
      key: 'stats2',
      className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'
    }, [
      React.createElement('h3', {
        key: 'title2',
        className: 'text-lg font-medium text-gray-900'
      }, '활성 패스'),
      React.createElement('p', {
        key: 'value2',
        className: 'mt-2 text-3xl font-bold text-green-800'
      }, passHolders.filter(holder => holder.status === 'active').length),
      React.createElement('p', {
        key: 'desc2',
        className: 'mt-1 text-sm text-gray-500'
      }, `${Math.round((passHolders.filter(holder => holder.status === 'active').length / passHolders.length) * 100)}% 활성화율`)
    ])
  ]);
}

export default Dashboard; 