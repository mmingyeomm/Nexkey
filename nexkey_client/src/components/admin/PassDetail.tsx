'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AccessPass, PassHolder, PassTransaction, TabType } from '@/types/admin';

interface PassDetailProps {
  selectedPassId: string;
  existingPasses: AccessPass[];
  passHolders: PassHolder[];
  passTransactions: PassTransaction[];
  setActiveTab: (tab: TabType) => void;
  onPassStatus: (holderId: string, status: 'active' | 'expired' | 'revoked') => void;
}

export default function PassDetail({ 
  selectedPassId, 
  existingPasses, 
  passHolders, 
  passTransactions, 
  setActiveTab,
  onPassStatus 
}: PassDetailProps) {
  const [txSearchQuery, setTxSearchQuery] = useState('');

  const selectedPass = existingPasses.find(p => p.id === selectedPassId);
  const passHoldersForPass = passHolders.filter(h => h.passId === selectedPassId);
  const passTransactionsForPass = passTransactions.filter(tx => tx.passId === selectedPassId);

  if (!selectedPass) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('pass-management')}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-all duration-200"
            >
              ← 뒤로가기
            </motion.button>
            <h1 className="text-2xl font-bold text-gray-900">{selectedPass.name} 상세 관리</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              selectedPass.passType === 'employee_badge' ? 'bg-blue-100 text-blue-800' :
              selectedPass.passType === 'student_id' ? 'bg-green-100 text-green-800' :
              selectedPass.passType === 'event_ticket' ? 'bg-purple-100 text-purple-800' :
              selectedPass.passType === 'retail_access' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {selectedPass.passType === 'employee_badge' ? '직원 출입증' :
               selectedPass.passType === 'student_id' ? '학생증' :
               selectedPass.passType === 'event_ticket' ? '이벤트 티켓' :
               selectedPass.passType === 'retail_access' ? '매장 출입' : '사용자 정의'}
            </span>
          </div>
        </div>

        {/* Pass Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">총 발급</h3>
            <p className="text-3xl font-bold text-blue-800">{selectedPass.totalIssued}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">활성 사용자</h3>
            <p className="text-3xl font-bold text-green-800">{passHoldersForPass.filter(h => h.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">총 트랜잭션</h3>
            <p className="text-3xl font-bold text-purple-800">{passTransactionsForPass.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">승인된 위치</h3>
            <p className="text-3xl font-bold text-orange-800">{selectedPass.authorizedLocations.length}</p>
          </div>
        </div>

        {/* Pass Holders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">패스 보유자 목록</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지갑 주소</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">발급일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마지막 사용</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {passHoldersForPass.map((holder) => {
                  const holderTx = passTransactionsForPass.find(tx => tx.to === holder.mobileId || tx.from === holder.mobileId);
                  return (
                    <tr key={holder.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{holder.userName}</div>
                        <div className="text-sm text-gray-500">{holder.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {holderTx?.to || '0x' + holder.mobileId.slice(-8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          holder.status === 'active' ? 'bg-green-100 text-green-800' :
                          holder.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                          holder.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {holder.status === 'active' ? '활성' :
                           holder.status === 'expired' ? '만료' :
                           holder.status === 'pending' ? '대기' : '취소'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holder.issuedAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holder.lastUsed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-blue-800 hover:text-blue-900"
                          >
                            수정
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onPassStatus(holder.id, 'revoked')}
                            className="text-red-800 hover:text-red-900"
                          >
                            취소
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Authorized Locations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">승인된 위치</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPass.authorizedLocations.map((location) => (
                <div key={location.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      location.accessType === 'entry' ? 'bg-blue-100 text-blue-800' :
                      location.accessType === 'payment' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {location.accessType === 'entry' ? '출입' :
                       location.accessType === 'payment' ? '결제' : '출입+결제'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">장치:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {location.deviceIds.map(deviceId => (
                        <span key={deviceId} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-mono">
                          {deviceId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">트랜잭션 히스토리</h2>
              <input
                type="text"
                placeholder="TX Hash 또는 주소 검색..."
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-800 focus:ring-blue-800 sm:text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TX Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">블록</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {passTransactionsForPass
                  .filter(tx => !txSearchQuery || 
                    tx.txHash.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                    tx.from.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                    tx.to.toLowerCase().includes(txSearchQuery.toLowerCase())
                  )
                  .sort((a, b) => b.blockNumber - a.blockNumber)
                  .map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{tx.blockNumber.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tx.type === 'mint' ? 'bg-green-100 text-green-800' :
                        tx.type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                        tx.type === 'revoke' ? 'bg-red-100 text-red-800' :
                        tx.type === 'update' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {tx.type === 'mint' ? '발급' :
                         tx.type === 'transfer' ? '양도' :
                         tx.type === 'revoke' ? '취소' :
                         tx.type === 'update' ? '업데이트' : '접근'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {tx.from === '0x0000000000000000000000000000000000000000' ? 'System' : 
                         `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {tx.to === '0x0000000000000000000000000000000000000000' ? 'System' : 
                         `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{tx.gasUsed.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{tx.gasPrice} Gwei</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tx.status === 'success' ? 'bg-green-100 text-green-800' :
                        tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status === 'success' ? '성공' :
                         tx.status === 'failed' ? '실패' : '대기중'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 