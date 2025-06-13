'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function UserAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
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
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                홈으로
              </Link>
              <Link 
                href="/en" 
                className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                ENG
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {/* Hero Section with App Preview */}
        <div className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  <span className="block">디지털 신원의</span>
                  <span className="block text-blue-600">새로운 시작</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  NexKey 앱으로 더 스마트하고 안전한<br />
                  디지털 생활을 시작하세요
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a 
                      href="https://apps.apple.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      App Store에서 다운로드
                    </a>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a 
                      href="https://play.google.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-full text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Google Play에서 다운로드
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* App Features with Screenshots */}
        <div className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                주요 기능
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                NexKey 앱의 핵심 기능을 확인하세요
              </p>
            </motion.div>

            <div className="space-y-32">
              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="order-2 lg:order-1"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    디지털 신원 증명
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    블록체인 기반의 안전한 디지털 신원 증명으로<br />
                    신뢰할 수 있는 인증을 경험하세요
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      안전한 블록체인 기반 인증
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      개인정보 보호
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      빠른 인증 프로세스
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="order-1 lg:order-2"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-20 blur-xl"></div>
                    <Image
                      src="/images/image copy 2.png"
                      alt="Digital Identity Verification"
                      width={250}
                      height={500}
                      className="relative rounded-3xl shadow-2xl"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Feature 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-20 blur-xl"></div>
                    <Image
                      src="/images/image copy 3.png"
                      alt="Smart Access Management"
                      width={250}
                      height={500}
                      className="relative rounded-3xl shadow-2xl"
                    />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    스마트 출입 관리
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    모바일로 간편하게 시설 출입을 관리하고<br />
                    접근을 제어하세요
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      QR 코드 기반 출입
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      실시간 출입 기록
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      다중 시설 관리
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Feature 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="order-2 lg:order-1"
                >
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    디지털 결제
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    안전하고 빠른 디지털 결제로<br />
                    편리한 거래를 경험하세요
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      빠른 결제 처리
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      안전한 거래 보장
                    </li>
                    <li className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      거래 내역 관리
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="order-1 lg:order-2"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-20 blur-xl"></div>
                    <Image
                      src="/images/image copy 4.png"
                      alt="Digital Payment"
                      width={250}
                      height={500}
                      className="relative rounded-3xl shadow-2xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="py-24 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-8">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
                NexKey 앱을 다운로드하고 디지털 신원의 미래를 경험하세요
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                  >
                    App Store에서 다운로드
                  </a>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="https://play.google.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                  >
                    Google Play에서 다운로드
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 