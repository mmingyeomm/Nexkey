'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Organization } from '@/types/admin';

interface NavigationProps {
  organization: Organization;
}

export default function Navigation({ organization }: NavigationProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/NexKey_logo.png"
                  alt="NexKey"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            {/* Subscription Status */}
            <div className="hidden md:flex items-center space-x-3 border-r border-gray-200 pr-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">{organization.subscriptionTier.toUpperCase()}</span>
                <span className="text-[10px] text-gray-500">
                  {organization.monthlyUsage.toLocaleString()} / {organization.usageLimit.toLocaleString()} 사용량
                </span>
              </div>
            </div>
            {/* Organization Profile */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-medium text-xs">
                    {organization.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900 truncate max-w-[200px]">{organization.name}</span>
                <span className="text-[10px] text-gray-500">{organization.role}</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:block">로그아웃</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
} 