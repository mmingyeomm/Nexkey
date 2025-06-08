'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ServiceIntroduction = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 네비게이션 바 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
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
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {[
                  { name: '서비스 소개', path: '/service-info' },
                  { name: '솔루션', path: '/solution' },
                  { name: '요금제', path: '/pricing' },
                  { name: '고객사례', path: '/case-study' },
                  { name: '지원', path: '/support' }
                ].map((item) => (
                  <Link 
                    key={item.name}
                    href={item.path}
                    className={`text-gray-700 hover:text-blue-800 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      item.name === '서비스 소개' ? 'text-blue-800 border-b-2 border-blue-800' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link 
                  href="/admin"
                  className="text-blue-800 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  관리자
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/user" 
                className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                사용자 앱
              </Link>
              <Link 
                href="/en" 
                className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                ENG
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {/* 히어로 섹션 */}
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                서비스 소개
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                모바일 ID와 OpenDID 기반의 차세대 접근 관리 플랫폼
              </p>
            </motion.div>
          </div>
        </div>

        {/* 서비스 개요 */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                하나의 앱으로 모든 접근 관리
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                OpenDID 기반의 탈중앙화 신원 인증으로 직원증, 학생증, 콘서트 티켓 등 
                모든 접근 패스를 하나의 모바일 앱에서 안전하게 관리하세요. 
                조직은 중앙에서 패스를 발급하고 관리하며, 사용자는 모바일 앱 하나로 
                모든 접근 권한을 편리하게 사용할 수 있습니다.
              </p>
            </motion.div>
          </div>
        </div>

        {/* 주요 기능 */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                핵심 기능
              </h2>
              <p className="text-xl text-gray-600">
                강력하고 안전한 접근 관리를 위한 필수 기능들
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "통합 패스 관리",
                  description: "직원증, 학생증, 이벤트 티켓 등 모든 접근 패스를 하나의 앱에서 관리",
                  features: ["다양한 패스 유형 지원", "실시간 발급 및 취소", "유효기간 자동 관리", "패스 상태 모니터링"]
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "OpenDID 보안",
                  description: "탈중앙화 신원 인증으로 최고 수준의 보안과 개인정보 보호 제공",
                  features: ["블록체인 기반 인증", "개인정보 자기주권", "위변조 방지", "프라이버시 보호"]
                },
                {
                  icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z",
                  title: "QR/바코드 스캔",
                  description: "기존 출입 통제 장비와 호환되는 QR 코드 및 바코드 인증",
                  features: ["기존 장비 호환", "빠른 스캔 인증", "오프라인 지원", "다중 포맷 지원"]
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 text-center">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 사용 사례 */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                다양한 분야에서 활용
              </h2>
              <p className="text-xl text-gray-600">
                교육기관부터 기업, 이벤트까지 모든 접근 관리 시나리오를 지원합니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                  title: "기업 출입 관리",
                  description: "직원증 기반 사무실 및 연구시설 접근 제어",
                  details: [
                    "사무실 출입 통제",
                    "연구시설 보안 관리",
                    "회의실 예약 및 접근",
                    "주차장 이용 관리",
                    "근태 관리 연동"
                  ]
                },
                {
                  icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
                  title: "교육기관",
                  description: "학생증으로 도서관, 강의실, 기숙사 출입 관리",
                  details: [
                    "도서관 출입 및 대출",
                    "강의실 접근 제어",
                    "기숙사 출입 관리",
                    "실험실 안전 관리",
                    "캠퍼스 시설 이용"
                  ]
                },
                {
                  icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
                  title: "이벤트 티켓",
                  description: "콘서트, 전시회 등 이벤트 입장권 디지털화",
                  details: [
                    "콘서트 입장 관리",
                    "전시회 티켓팅",
                    "스포츠 경기 입장",
                    "컨퍼런스 참가증",
                    "VIP 구역 접근"
                  ]
                },
                {
                  icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
                  title: "무인 매장",
                  description: "무인 편의점, 셀프 서비스 매장 인증 및 결제",
                  details: [
                    "무인 편의점 출입",
                    "셀프 서비스 인증",
                    "자동 결제 연동",
                    "재고 관리 연계",
                    "고객 분석 데이터"
                  ]
                }
              ].map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg p-8"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={useCase.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 mb-4">{useCase.description}</p>
                      <ul className="space-y-2">
                        {useCase.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 관리자 기능 */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  강력한 관리자 도구
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  조직의 모든 접근 권한을 중앙에서 효율적으로 관리하고 
                  실시간으로 모니터링할 수 있습니다.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: "패스 발급 및 관리",
                      description: "발급 기관, 접근 위치, 유효기간을 세밀하게 설정"
                    },
                    {
                      title: "권한 제어",
                      description: "패스 양도 및 거래 가능 여부를 조직 정책에 맞게 관리"
                    },
                    {
                      title: "실시간 모니터링",
                      description: "사용자별 패스 보유 현황과 접근 로그를 실시간 추적"
                    },
                    {
                      title: "일괄 관리",
                      description: "권한 및 유효기간을 대량으로 업데이트하여 운영 효율성 극대화"
                    },
                    {
                      title: "분석 및 리포트",
                      description: "접근 패턴 분석과 상세한 사용 통계 제공"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8"
                >
                  <Link 
                    href="/admin/login" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    관리자 대시보드 체험하기 →
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">패스 관리 대시보드</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">1,234</div>
                        <div className="text-sm text-gray-500">발급된 패스</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">987</div>
                        <div className="text-sm text-gray-500">활성 사용자</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">5,678</div>
                        <div className="text-sm text-gray-500">이번 달 스캔</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-medium mb-4">최근 활동</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">직원증 #1234 발급 완료</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">학생증 접근 권한 업데이트</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">콘서트 티켓 1,000장 일괄 발급</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium mb-4">접근 통계</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">성공률</span>
                        <span className="text-sm font-medium text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">평균 응답시간</span>
                        <span className="text-sm font-medium text-blue-600">0.3초</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">일일 평균 스캔</span>
                        <span className="text-sm font-medium text-purple-600">189회</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                지금 시작하세요
              </h2>
              <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                모바일 ID 기반 접근 관리로 조직의 보안을 강화하고 
                사용자 편의성을 극대화하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/admin/login" 
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                  >
                    무료 체험 시작
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                  >
                    문의하기
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceIntroduction; 