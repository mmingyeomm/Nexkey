'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AccessPass, AuthorizedLocation } from '@/types/admin';

interface PassManagementProps {
  existingPasses: AccessPass[];
  onPassDetail: (passId: string) => void;
}

export default function PassManagement({ existingPasses, onPassDetail }: PassManagementProps) {
  const [passName, setPassName] = useState('');
  const [passDescription, setPassDescription] = useState('');
  const [issuingBody, setIssuingBody] = useState('');
  const [passType, setPassType] = useState<AccessPass['passType']>('custom');
  const [authorizedLocations, setAuthorizedLocations] = useState<AuthorizedLocation[]>([]);
  const [validityStart, setValidityStart] = useState('');
  const [validityEnd, setValidityEnd] = useState('');
  const [isTransferable, setIsTransferable] = useState(false);
  const [isTradable, setIsTradable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement pass creation logic with OpenDID integration
    console.log('Creating new access pass:', { 
      passName, 
      passDescription, 
      issuingBody,
      passType,
      authorizedLocations,
      validityStart,
      validityEnd,
      isTransferable,
      isTradable
    });
  };

  const addAuthorizedLocation = () => {
    const newLocation: AuthorizedLocation = {
      id: Date.now().toString(),
      name: '',
      address: '',
      accessType: 'entry',
      deviceIds: []
    };
    setAuthorizedLocations([...authorizedLocations, newLocation]);
  };

  const updateAuthorizedLocation = (index: number, field: keyof AuthorizedLocation, value: any) => {
    const updated = [...authorizedLocations];
    updated[index] = { ...updated[index], [field]: value };
    setAuthorizedLocations(updated);
  };

  const removeAuthorizedLocation = (index: number) => {
    setAuthorizedLocations(authorizedLocations.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create New Pass Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">새 패스 유형 생성</h2>
            <p className="mt-1 text-sm text-gray-500">새로운 액세스 패스 유형 정의</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreatePass} className="space-y-6">
              <div>
                <label htmlFor="passName" className="block text-sm font-medium text-gray-700">
                  패스 이름
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="passName"
                    value={passName}
                    onChange={(e) => setPassName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    placeholder="패스 이름 입력"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="passType" className="block text-sm font-medium text-gray-700">
                  패스 유형
                </label>
                <div className="mt-1">
                  <select
                    id="passType"
                    value={passType}
                    onChange={(e) => setPassType(e.target.value as AccessPass['passType'])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    required
                  >
                    <option value="employee_badge">직원 출입증</option>
                    <option value="student_id">학생증</option>
                    <option value="event_ticket">이벤트 티켓</option>
                    <option value="retail_access">매장 출입</option>
                    <option value="custom">사용자 정의</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="passDescription" className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <div className="mt-1">
                  <textarea
                    id="passDescription"
                    value={passDescription}
                    onChange={(e) => setPassDescription(e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    placeholder="패스 설명 입력"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="issuingBody" className="block text-sm font-medium text-gray-700">
                  발급 기관
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="issuingBody"
                    value={issuingBody}
                    onChange={(e) => setIssuingBody(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    placeholder="발급 기관 입력"
                    required
                  />
                </div>
              </div>

              {/* Authorized Locations */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    승인된 위치
                  </label>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addAuthorizedLocation}
                    className="px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    위치 추가
                  </motion.button>
                </div>
                <div className="mt-2 space-y-3">
                  {authorizedLocations.map((location, index) => (
                    <div key={location.id} className="border border-gray-200 rounded-md p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="위치 이름"
                          value={location.name}
                          onChange={(e) => updateAuthorizedLocation(index, 'name', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="주소"
                          value={location.address}
                          onChange={(e) => updateAuthorizedLocation(index, 'address', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm"
                        />
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <select
                          value={location.accessType}
                          onChange={(e) => updateAuthorizedLocation(index, 'accessType', e.target.value)}
                          className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm"
                        >
                          <option value="entry">출입</option>
                          <option value="payment">결제</option>
                          <option value="both">출입+결제</option>
                        </select>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => removeAuthorizedLocation(index)}
                          className="px-2 py-1 text-sm text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                        >
                          삭제
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  유효 기간
                </label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={validityStart}
                    onChange={(e) => setValidityStart(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    required
                  />
                  <input
                    type="date"
                    value={validityEnd}
                    onChange={(e) => setValidityEnd(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="transferable"
                    checked={isTransferable}
                    onChange={(e) => setIsTransferable(e.target.checked)}
                    className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                  />
                  <label htmlFor="transferable" className="ml-2 block text-sm text-gray-700">
                    양도 가능
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tradable"
                    checked={isTradable}
                    onChange={(e) => setIsTradable(e.target.checked)}
                    className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                  />
                  <label htmlFor="tradable" className="ml-2 block text-sm text-gray-700">
                    거래 가능
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-all duration-200"
                >
                  패스 생성
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Existing Passes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">기존 패스 유형</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="패스 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm transition-colors duration-200"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {existingPasses.map((pass) => (
              <div key={pass.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{pass.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        pass.passType === 'employee_badge' ? 'bg-blue-100 text-blue-800' :
                        pass.passType === 'student_id' ? 'bg-green-100 text-green-800' :
                        pass.passType === 'event_ticket' ? 'bg-purple-100 text-purple-800' :
                        pass.passType === 'retail_access' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pass.passType === 'employee_badge' ? '직원 출입증' :
                         pass.passType === 'student_id' ? '학생증' :
                         pass.passType === 'event_ticket' ? '이벤트 티켓' :
                         pass.passType === 'retail_access' ? '매장 출입' : '사용자 정의'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{pass.description}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">발급 기관:</span> {pass.issuingBody}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">승인된 위치:</span> {pass.authorizedLocations.map(loc => loc.name).join(', ')}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">유효 기간:</span> {pass.validityPeriod.start} ~ {pass.validityPeriod.end}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="font-medium">특징:</span> 
                      {pass.transferable ? ' 양도 가능' : ''}
                      {pass.tradable ? ' 거래 가능' : ''}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>생성일: {pass.createdAt}</span>
                      <span>발급: {pass.totalIssued}</span>
                      <span>활성: {pass.activeCount}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onPassDetail(pass.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-all duration-200"
                    >
                      상세 관리
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 